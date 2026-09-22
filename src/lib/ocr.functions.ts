import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Prototype OCR: downloads a stored medical document and asks the AI model to
 * transcribe/extract its key clinical fields. Images are read directly by the
 * vision model; PDFs fall back to a filename-based summary note.
 */
export const extractDocumentOcr = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ documentId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: doc, error } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("id", data.documentId)
      .single();
    if (error || !doc) throw new Error("Document not found");
    if (!doc.file_path) throw new Error("This document has no file attached");

    await supabaseAdmin
      .from("documents")
      .update({ ocr_status: "processing" })
      .eq("id", doc.id);

    const finish = async (status: string, text: string | null) => {
      await supabaseAdmin
        .from("documents")
        .update({ ocr_status: status, ocr_text: text })
        .eq("id", doc.id);
      return { status, text };
    };

    const isImage = /\.(png|jpe?g|webp|gif|bmp)$/i.test(doc.file_name ?? "");
    if (!isImage) {
      return finish(
        "done",
        `Prototype note: AI text extraction currently supports scanned image files (JPG/PNG). ` +
          `"${doc.file_name}" is a PDF or other format — convert a page to an image and re-upload to try the extraction.`,
      );
    }

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("medical-documents")
      .createSignedUrl(doc.file_path, 300);
    if (signErr || !signed) return finish("failed", null);

    const fileRes = await fetch(signed.signedUrl);
    if (!fileRes.ok) return finish("failed", null);
    const buf = Buffer.from(await fileRes.arrayBuffer());
    const mime = fileRes.headers.get("content-type") ?? "image/jpeg";
    const dataUri = `data:${mime};base64,${buf.toString("base64")}`;

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return finish("failed", null);

    try {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    "You are an OCR assistant for a maternal-health records app in India. " +
                    "Read this medical document image. Output: (1) document type, " +
                    "(2) key extracted fields as short 'Label: value' lines (patient name, dates, " +
                    "blood pressure, haemoglobin, weight, findings, medicines, next visit), " +
                    "(3) a 2-line plain-language summary a rural patient could understand. " +
                    "If text is unreadable, say so. Keep it under 200 words.",
                },
                { type: "image_url", image_url: { url: dataUri } },
              ],
            },
          ],
        }),
      });
      if (!aiRes.ok) return finish("failed", null);
      const json = (await aiRes.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = json.choices?.[0]?.message?.content?.trim();
      if (!text) return finish("failed", null);
      return finish("done", text);
    } catch {
      return finish("failed", null);
    }
  });
