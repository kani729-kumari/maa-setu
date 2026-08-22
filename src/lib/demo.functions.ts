import { createServerFn } from "@tanstack/react-start";

export const DEMO_PASSWORD = "maasetu123";

const DEMO_USERS = [
  { email: "patient@maasetu.demo", name: "Sita Devi", role: "patient" },
  { email: "doctor1@maasetu.demo", name: "Dr. Ananya Sharma", role: "doctor" },
  { email: "doctor2@maasetu.demo", name: "Dr. Neha Verma", role: "doctor" },
  { email: "admin@maasetu.demo", name: "MAA Setu Hospital Admin", role: "admin" },
];

/**
 * Idempotently provisions the four clearly-labelled DEMO accounts used for the
 * prototype walkthrough and links each auth user to its profile row.
 */
export const ensureDemoUsers = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = new Map((list?.users ?? []).map((u) => [u.email ?? "", u.id]));

  for (const demo of DEMO_USERS) {
    let userId = existing.get(demo.email);
    if (!userId) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: demo.email,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: demo.name, role: demo.role, demo: true },
      });
      if (error && !error.message.toLowerCase().includes("already")) {
        console.error("demo user create failed", demo.email, error.message);
        continue;
      }
      userId = data?.user?.id;
    }
    if (userId) {
      await supabaseAdmin
        .from("profiles")
        .update({ user_id: userId })
        .eq("email", demo.email);
    }
  }

  return { ok: true };
});
