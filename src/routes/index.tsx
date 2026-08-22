import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

import { BrandMark, DemoBadge, LangToggle, MaaSetuLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { featureList } from "@/lib/maasetu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAA Setu — One Maternal Health ID, one pregnancy journey" },
      {
        name: "description",
        content:
          "MAA Setu is a bilingual maternal healthcare prototype: unique Maternal Health ID, verified digital medical records, consent-based sharing and continuity of care.",
      },
      { property: "og:title", content: "MAA Setu — One Maternal Health ID" },
      {
        property: "og:description",
        content:
          "Connect pregnant women, healthcare providers and verified maternal health records with a single Maternal Health ID.",
      },
    ],
  }),
  component: Landing,
});

function FlowStep({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-xl shadow-[var(--shadow-soft)]">
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

function Landing() {
  const { t, lang } = useI18n();
  const core = featureList.filter((f) => f.core);
  const rest = featureList.filter((f) => !f.core);

  return (
    <div className="min-h-screen soft-gradient">
      <header className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
        <BrandMark />
        <div className="ml-auto flex items-center gap-2">
          <LangToggle compact />
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link to="/auth">{t("providerLogin")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/auth">{t("getStarted")}</Link>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-8 pt-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold tracking-wide text-destructive">
              {t("demoMode")}
            </span>
            <DemoBadge />
          </div>
          <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl">
            <span className="brand-text">{t("brand")}</span>
          </h1>
          <p className="mt-3 text-2xl font-semibold text-violet">{t("tagline")}</p>
          <p className="mt-4 text-xl font-semibold">{t("heroSub")}</p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t("heroBody")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="text-base">
              <Link to="/auth">
                {t("getStarted")} <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link to="/auth">{t("providerLogin")}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-base">
              <a href="#how">{t("howItWorks")}</a>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> Consent-based access
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-primary" /> Verified records
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-violet" /> EN | हिंदी
            </span>
          </div>
        </div>

        <div className="card-soft relative overflow-hidden p-6">
          <div className="brand-gradient absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20" />
          <div className="flex items-center gap-3">
            <MaaSetuLogo className="h-12 w-12" />
            <div>
              <div className="text-xs text-muted-foreground">{t("mhid")}</div>
              <div className="font-mono text-2xl font-bold brand-text">UP-GB-2026-00001</div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { icon: "🤰", label: lang === "hi" ? "गर्भवती महिला" : "Pregnant woman" },
              { icon: "🆔", label: t("mhid") },
              { icon: "🗂️", label: t("records") },
              { icon: "🩺", label: t("provider") },
              { icon: "🌉", label: lang === "hi" ? "देखभाल की निरंतरता" : "Continuity of care" },
            ].map((s, i, arr) => (
              <div key={s.label}>
                <FlowStep icon={s.icon} label={s.label} />
                {i < arr.length - 1 && (
                  <div className="ml-6 h-4 w-0.5 brand-gradient opacity-40" aria-hidden />
                )}
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-xl bg-secondary/70 p-3 text-sm text-secondary-foreground">
            {lang === "hi"
              ? "एक ही पहचान संख्या से पूरा गर्भावस्था इतिहास, डॉक्टर बदलने पर भी।"
              : "One ID carries the complete pregnancy history — even when the doctor or hospital changes."}
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-3xl font-bold">{t("howItWorks")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            {
              n: 1,
              en: "Hospital registers the pregnant woman and creates her MHID",
              hi: "अस्पताल गर्भवती महिला का पंजीकरण करता है और एमएचआईडी बनाता है",
            },
            {
              n: 2,
              en: "Every check-up is uploaded by the doctor as a verified record",
              hi: "हर जाँच डॉक्टर द्वारा सत्यापित रिकॉर्ड के रूप में अपलोड होती है",
            },
            {
              n: 3,
              en: "New doctor searches the MHID and requests patient consent",
              hi: "नया डॉक्टर एमएचआईडी खोजता है और मरीज़ से सहमति माँगता है",
            },
            {
              n: 4,
              en: "After consent, verified history is available and care continues",
              hi: "सहमति के बाद सत्यापित इतिहास उपलब्ध होता है और देखभाल जारी रहती है",
            },
          ].map((s) => (
            <div key={s.n} className="card-lift card-lift-hover p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full brand-gradient font-bold text-primary-foreground">
                {s.n}
              </div>
              <p className="mt-3 font-medium leading-snug">{lang === "hi" ? s.hi : s.en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-3xl font-bold">{t("features")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {core.map((f) => (
            <div
              key={f.key}
              className="card-lift card-lift-hover brand-gradient p-6 text-primary-foreground"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 text-xl font-bold">{lang === "hi" ? f.hi : f.en}</h3>
              <p className="mt-1 text-sm opacity-90">
                {lang === "hi" ? "मुख्य नवाचार" : "Core innovation"}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((f) => (
            <div key={f.key} className="card-lift card-lift-hover p-4">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-2 font-semibold leading-snug">{lang === "hi" ? f.hi : f.en}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="card-soft flex flex-wrap items-center gap-4 p-6">
          <div>
            <h2 className="text-2xl font-bold">{t("demoJourney")}</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {lang === "hi"
                ? "सीता देवी की पूरी 9 महीने की डेमो यात्रा देखें — एमएचआईडी, रिकॉर्ड, डॉक्टर बदलना, सहमति और जोखिम आकलन।"
                : "Walk through Sita Devi's complete 9-month demo journey — MHID, records, change of doctor, consent and risk assessment."}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              MAA Setu Community Hospital · Gautam Buddha Nagar, Uttar Pradesh · Prototype Partner
              Hospital — Demonstration Only
            </p>
          </div>
          <Button asChild size="lg" className="ml-auto">
            <Link to="/auth">
              {t("demoJourney")} <ArrowRight className="ml-1.5 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        {t("brand")} · {t("tagline")} · {t("demoData")} — fictional hospitals and doctors are for
        demonstration only and are not certified providers.
      </footer>
    </div>
  );
}
