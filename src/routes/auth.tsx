import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BrandMark, DemoBadge, LangToggle } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { homeForRole } from "@/lib/auth";
import { DEMO_PASSWORD, ensureDemoUsers } from "@/lib/demo.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login — MAA Setu maternal health prototype" },
      {
        name: "description",
        content:
          "Sign in to the MAA Setu prototype as a pregnant woman, doctor or hospital admin using the sample credentials.",
      },
      { property: "og:title", content: "Login — MAA Setu" },
      { property: "og:description", content: "Sample logins for the MAA Setu maternal health prototype." },
    ],
  }),
  component: AuthPage,
});

const demoAccounts = [
  { email: "patient@maasetu.demo", roleKey: "patient", name: "Sita Devi · MHID UP-GB-2026-00001" },
  { email: "doctor1@maasetu.demo", roleKey: "doctor", name: "Dr. Ananya Sharma (Doctor 1)" },
  { email: "doctor2@maasetu.demo", roleKey: "doctor", name: "Dr. Neha Verma (Doctor 2)" },
  { email: "admin@maasetu.demo", roleKey: "admin", name: "MAA Setu Hospital Admin" },
];

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const provision = useServerFn(ensureDemoUsers);
  const [email, setEmail] = useState("patient@maasetu.demo");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    provision()
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, [provision]);

  const signIn = async (mail: string, pass: string) => {
    setBusy(true);
    try {
      if (!ready) await provision().catch(() => undefined);
      const { error } = await supabase.auth.signInWithPassword({ email: mail, password: pass });
      if (error) throw error;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", mail)
        .maybeSingle();
      toast.success(t("signIn"));
      navigate({ to: homeForRole(profile?.role) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen soft-gradient">
      <header className="mx-auto flex max-w-6xl items-center px-4 py-4">
        <BrandMark />
        <div className="ml-auto">
          <LangToggle compact />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 lg:grid-cols-2">
        <div className="card-soft p-6">
          <h1 className="text-2xl font-bold">{t("login")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("heroSub")}</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void signIn(email, password);
            }}
          >
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-12 text-base"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-12 text-base"
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full text-base" disabled={busy}>
              {busy ? t("loading") : t("signIn")}
            </Button>
          </form>

          <Button asChild variant="ghost" className="mt-3 w-full">
            <Link to="/">← {t("brand")}</Link>
          </Button>
        </div>

        <div className="card-soft p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold">{t("demoCreds")}</h2>
            <DemoBadge label={t("demoMode")} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Password for every account: <span className="font-mono font-semibold">{DEMO_PASSWORD}</span>
          </p>
          <div className="mt-4 space-y-3">
            {demoAccounts.map((a) => (
              <div key={a.email} className="rounded-2xl border border-border p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {t(a.roleKey)}
                </div>
                <div className="mt-1 font-mono text-sm font-semibold">{a.email}</div>
                <div className="text-sm text-muted-foreground">{a.name}</div>
                <Button
                  size="sm"
                  className="mt-3"
                  disabled={busy}
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(DEMO_PASSWORD);
                    void signIn(a.email, DEMO_PASSWORD);
                  }}
                >
                  {t("loginAs")} {t(a.roleKey)}
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            These are sample credentials for prototype evaluation. Hospitals and
            doctors in this prototype are fictional and not certified providers.
          </p>
        </div>
      </div>
    </div>
  );
}
