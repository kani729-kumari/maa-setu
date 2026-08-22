import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, DemoBadge, SectionCard } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Guided demo journey — MAA Setu prototype walkthrough" },
      {
        name: "description",
        content:
          "Step-by-step walkthrough of the MAA Setu prototype: register a mother, generate her MHID, request consent and follow her verified pregnancy record across hospitals.",
      },
      { property: "og:title", content: "Demo journey — MAA Setu" },
      {
        property: "og:description",
        content: "Try every MAA Setu role in five minutes with seeded demo data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoJourney,
});

const accounts = [
  { role: "Patient (Sita Devi)", email: "patient@maasetu.demo", to: "/patient" as const },
  { role: "Doctor (Dr. Ananya Sharma)", email: "doctor1@maasetu.demo", to: "/doctor" as const },
  { role: "Second doctor (Dr. Neha Verma)", email: "doctor2@maasetu.demo", to: "/doctor" as const },
  { role: "Government / Admin", email: "admin@maasetu.demo", to: "/admin" as const },
];

const steps: { en: string; hi: string }[] = [
  {
    en: "Sign in as Dr. Ananya Sharma and search MHID UP-GB-2026-00001 to open Sita Devi's file.",
    hi: "डॉ. अनन्या शर्मा के रूप में साइन इन करें और एमएचआईडी UP-GB-2026-00001 खोजें।",
  },
  {
    en: "Add a new check-up record with BP and haemoglobin — the AI-assisted risk score updates instantly.",
    hi: "रक्तचाप और हीमोग्लोबिन के साथ नई जाँच जोड़ें — जोखिम स्कोर तुरंत बदल जाता है।",
  },
  {
    en: "Sign in as Dr. Neha Verma (a new hospital) and search the same MHID — records stay locked until consent.",
    hi: "डॉ. नेहा वर्मा (नया अस्पताल) के रूप में वही एमएचआईडी खोजें — सहमति तक रिकॉर्ड बंद रहते हैं।",
  },
  {
    en: "Request consent, then sign in as Sita Devi and approve it from the Consent tab.",
    hi: "सहमति माँगें, फिर सीता देवी के रूप में साइन इन करके सहमति दें।",
  },
  {
    en: "Return to the doctor view — the full nine-month verified timeline is now visible, and the access log records the visit.",
    hi: "डॉक्टर व्यू पर लौटें — पूरी नौ महीने की सत्यापित समयरेखा दिखती है और पहुँच लॉग दर्ज होता है।",
  },
  {
    en: "Finish on the government dashboard for district-level risk, ANC coverage and scheme benefit tracking.",
    hi: "सरकारी डैशबोर्ड पर ज़िला स्तर का जोखिम, एएनसी कवरेज और योजना लाभ देखें।",
  },
];

function DemoJourney() {
  const { t, lang } = useI18n();

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold brand-text">{t("demoJourney")}</h1>
        <DemoBadge />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <SectionCard title={lang === "hi" ? "पाँच मिनट की यात्रा" : "The five-minute journey"}>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-border bg-muted/30 p-3">
                <span className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{lang === "hi" ? s.hi : s.en}</p>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-5">
            <Link to="/auth">{t("getStarted")}</Link>
          </Button>
        </SectionCard>

        <SectionCard title={t("demoCreds")}>
          <p className="mb-3 text-sm text-muted-foreground">
            {lang === "hi"
              ? "सभी डेमो खातों का पासवर्ड: maasetu123"
              : "Password for every demo account: maasetu123"}
          </p>
          <ul className="space-y-2">
            {accounts.map((a) => (
              <li key={a.email} className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm">
                <div className="font-semibold">{a.role}</div>
                <div className="font-mono text-xs text-muted-foreground">{a.email}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/patient">{t("dashboard")}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/doctor">{t("provider")}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin">{t("govDashboard")}</Link>
            </Button>
          </div>
        </SectionCard>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">{t("riskDisclaimer")}</p>
    </AppShell>
  );
}
