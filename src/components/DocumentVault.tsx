import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

type DocRow = {
  id: string;
  file_name: string;
  file_path: string | null;
  category: string;
  ocr_status: string;
  uploaded_by: string | null;
  created_at: string;
};

const categories = [
  { value: "ultrasound", en: "Ultrasound", hi: "अल्ट्रासाउंड" },
  { value: "lab_report", en: "Lab report", hi: "लैब रिपोर्ट" },
  { value: "prescription", en: "Prescription", hi: "पर्चा" },
  { value: "discharge", en: "Discharge summary", hi: "डिस्चार्ज सारांश" },
  { value: "other", en: "Other", hi: "अन्य" },
];

export function DocumentVault({
  patientId,
  uploaderName,
  canUpload = true,
}: {
  patientId: string;
  uploaderName: string;
  canUpload?: boolean;
}) {
  const { t, lang } = useI18n();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("ultrasound");

  const docsQ = useQuery({
    queryKey: ["documents", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DocRow[];
    },
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const safe = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${patientId}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage
        .from("medical-documents")
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { error } = await supabase.from("documents").insert({
        patient_id: patientId,
        file_name: file.name,
        file_path: path,
        category,
        ocr_status: "pending",
        uploaded_by: uploaderName,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(lang === "hi" ? "दस्तावेज़ अपलोड हुआ" : "Document uploaded");
      if (fileRef.current) fileRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["documents", patientId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function openDoc(d: DocRow) {
    if (!d.file_path) {
      toast.info(lang === "hi" ? "डेमो दस्तावेज़ — फ़ाइल संलग्न नहीं" : "Demo document — no file attached");
      return;
    }
    const { data, error } = await supabase.storage
      .from("medical-documents")
      .createSignedUrl(d.file_path, 120);
    if (error || !data) {
      toast.error(error?.message ?? "Could not open file");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  return (
    <SectionCard title={t("documents")} icon={<FileText className="h-5 w-5 text-primary" />}>
      {canUpload && (
        <div className="mb-4 grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)_auto] sm:items-end">
          <div>
            <Label>{lang === "hi" ? "श्रेणी" : "Category"}</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {lang === "hi" ? c.hi : c.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>{lang === "hi" ? "फ़ाइल चुनें" : "Choose file"}</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm"
            />
          </div>
          <Button
            disabled={upload.isPending}
            onClick={() => {
              const f = fileRef.current?.files?.[0];
              if (!f) {
                toast.error(lang === "hi" ? "पहले फ़ाइल चुनें" : "Pick a file first");
                return;
              }
              upload.mutate(f);
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            {lang === "hi" ? "अपलोड" : "Upload"}
          </Button>
        </div>
      )}

      <ul className="space-y-2 text-sm">
        {(docsQ.data ?? []).map((d) => (
          <li
            key={d.id}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3"
          >
            <span className="text-lg">📄</span>
            <span className="font-semibold">{d.file_name}</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{d.category}</span>
            <span className="text-xs text-muted-foreground">{d.uploaded_by ?? ""}</span>
            <Button size="sm" variant="ghost" className="ml-auto" onClick={() => openDoc(d)}>
              <Download className="mr-1 h-4 w-4" />
              {lang === "hi" ? "खोलें" : "Open"}
            </Button>
          </li>
        ))}
        {(docsQ.data ?? []).length === 0 && (
          <li className="text-sm text-muted-foreground">
            {lang === "hi" ? "अभी कोई दस्तावेज़ नहीं" : "No documents yet"}
          </li>
        )}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">{t("ocrNote")}</p>
    </SectionCard>
  );
}
