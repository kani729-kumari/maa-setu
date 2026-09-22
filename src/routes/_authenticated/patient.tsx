import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ExternalLink, FileWarning, PhoneCall } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, DemoBadge, SectionCard } from "@/components/brand";
import { DocumentVault } from "@/components/DocumentVault";
import { MhidCard } from "@/components/MhidCard";
import { RiskPanel } from "@/components/RiskPanel";
import { Timeline } from "@/components/Timeline";
import { WombGreeting } from "@/components/WombGreeting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/auth";
import {
  fetchPatientForProfile,
  fetchRecords,
  fetchTable,
  type Consent,
  type Patient,
} from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/maasetu";

export const Route = createFileRoute("/_authenticated/patient")({
  head: () => ({
    meta: [
      { title: "My maternal health — MAA Setu patient dashboard" },
      {
        name: "description",
        content:
          "View your Maternal Health ID, pregnancy timeline, verified records, reminders and consent settings.",
      },
      { property: "og:title", content: "Patient dashboard — MAA Setu" },
      { property: "og:description", content: "MHID, pregnancy timeline and consent control for mothers." },
    ],
  }),
  component: PatientDashboard,
});

type Row = Record<string, string | number | boolean | null>;

function statusChip(status: string) {
  if (status === "completed" || status === "received" || status === "granted")
    return "bg-success/12 text-success border-success/30";
  if (status === "attention" || status === "not_received" || status === "denied" || status === "revoked")
    return "bg-destructive/12 text-destructive border-destructive/30";
  return "bg-warning/20 text-warning-foreground border-warning/40";
}

function PatientDashboard() {
  const { t, lang } = useI18n();
  const { data: profile } = useProfile();
  const qc = useQueryClient();

  const patientQ = useQuery({
    queryKey: ["my-patient", profile?.id],
    enabled: !!profile?.id,
    queryFn: () => fetchPatientForProfile(profile!.id),
  });
  const patient = patientQ.data as Patient | null | undefined;

  const recordsQ = useQuery({
    queryKey: ["records", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchRecords(patient!.id),
  });
  const consentsQ = useQuery({
    queryKey: ["consents", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Consent>("consents", patient!.id, "requested_at"),
  });
  const remindersQ = useQuery({
    queryKey: ["reminders", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("reminders", patient!.id, "due_date"),
  });
  const gapsQ = useQuery({
    queryKey: ["care_gaps", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("care_gaps", patient!.id),
  });
  const alertsQ = useQuery({
    queryKey: ["alerts", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("alerts", patient!.id),
  });
  const logsQ = useQuery({
    queryKey: ["access_logs", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("access_logs", patient!.id, "created_at"),
  });
  const familyQ = useQuery({
    queryKey: ["family_members", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("family_members", patient!.id),
  });
  const schemesQ = useQuery({
    queryKey: ["scheme_benefits", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("scheme_benefits", patient!.id),
  });
  const vaxQ = useQuery({
    queryKey: ["vaccinations", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("vaccinations", patient!.id),
  });
  const apptQ = useQuery({
    queryKey: ["appointments", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("appointments", patient!.id, "scheduled_at"),
  });
  const docsQ = useQuery({
    queryKey: ["documents", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Row>("documents", patient!.id, "created_at"),
  });
  const facilitiesQ = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("facilities").select("*").order("distance_km");
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const decide = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Consent["status"] }) => {
      const { error } = await supabase
        .from("consents")
        .update({ status, decided_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      const consent = consentsQ.data?.find((c) => c.id === id);
      if (patient && consent) {
        await supabase.from("access_logs").insert({
          patient_id: patient.id,
          provider_name: consent.provider_name,
          action: `Consent ${status} by patient`,
          reason: consent.purpose,
        });
      }
    },
    onSuccess: () => {
      toast.success(t("consentGranted"));
      void qc.invalidateQueries({ queryKey: ["consents"] });
      void qc.invalidateQueries({ queryKey: ["access_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [fam, setFam] = useState({ full_name: "", relationship: "", phone: "" });
  const addFamily = useMutation({
    mutationFn: async () => {
      if (!patient) return;
      const { error } = await supabase.from("family_members").insert({ ...fam, patient_id: patient.id });
      if (error) throw error;
    },
    onSuccess: () => {
      setFam({ full_name: "", relationship: "", phone: "" });
      void qc.invalidateQueries({ queryKey: ["family_members"] });
      toast.success(t("save"));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [guide, setGuide] = useState({ month: "9", symptom: "none" });

  if (patientQ.isLoading) {
    return (
      <AppShell>
        <p className="text-muted-foreground">{t("loading")}</p>
      </AppShell>
    );
  }
  if (!patient) {
    return (
      <AppShell>
        <SectionCard title={t("mhid")}>
          <p className="text-muted-foreground">
            {lang === "hi"
              ? "आपके खाते से कोई मरीज़ रिकॉर्ड जुड़ा नहीं है। कृपया स्वास्थ्य केंद्र पर पंजीकरण कराएँ।"
              : "No patient record is linked to this account yet. Please register at a healthcare facility."}
          </p>
        </SectionCard>
      </AppShell>
    );
  }

  const records = recordsQ.data ?? [];
  const pendingConsents = (consentsQ.data ?? []).filter((c) => c.status === "pending");

  return (
    <AppShell
      nav={
        <Button asChild variant="ghost" size="sm">
          <Link to="/demo">{t("demoJourney")}</Link>
        </Button>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold">
            {lang === "hi" ? "नमस्ते" : "Welcome"}, {patient.full_name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("mhid")}: <span className="font-mono font-semibold">{patient.mhid}</span> ·{" "}
            {patient.village}, {patient.district}, {patient.state}
          </p>
        </div>
        <DemoBadge />
      </div>

      {pendingConsents.length > 0 && (
        <div className="mb-5 rounded-2xl border border-primary/40 bg-primary/8 p-5">
          <h2 className="text-lg font-bold text-primary">{t("consentRequired")}</h2>
          {pendingConsents.map((c) => (
            <div key={c.id} className="mt-3 flex flex-wrap items-center gap-3">
              <p className="max-w-xl font-medium">
                {lang === "hi"
                  ? `${patient.full_name} से ${c.provider_name} को उनके सत्यापित मातृ स्वास्थ्य रिकॉर्ड देखने की अनुमति माँगी गई है।`
                  : `${patient.full_name} has been asked to allow ${c.provider_name} to access her verified maternal health records.`}
              </p>
              <div className="ml-auto flex gap-2">
                <Button onClick={() => decide.mutate({ id: c.id, status: "granted" })}>
                  {t("allowAccess")}
                </Button>
                <Button variant="outline" onClick={() => decide.mutate({ id: c.id, status: "denied" })}>
                  {t("denyAccess")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-card p-1">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="timeline">{t("timeline")}</TabsTrigger>
          <TabsTrigger value="consent">{t("consent")}</TabsTrigger>
          <TabsTrigger value="reminders">{t("reminders")}</TabsTrigger>
          <TabsTrigger value="guidance">{t("whatNow")}</TabsTrigger>
          <TabsTrigger value="emergency">{t("emergency")}</TabsTrigger>
          <TabsTrigger value="more">{t("documents")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5 space-y-5">
          <WombGreeting />
          <div className="grid gap-5 lg:grid-cols-2">
            <MhidCard patient={patient} />
            <div className="space-y-5">
              <RiskPanel patient={patient} records={records} />
              <SectionCard title={t("highRisk")} icon={<AlertTriangle className="h-5 w-5 text-destructive" />}>
                {(alertsQ.data ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noRecords")}</p>
                ) : (
                  <ul className="space-y-2">
                    {(alertsQ.data ?? []).map((a) => (
                      <li
                        key={String(a["id"])}
                        className="rounded-xl border border-destructive/25 bg-destructive/8 p-3 text-sm"
                      >
                        <div className="font-semibold text-destructive">
                          {a["severity"] === "high" ? "🚨" : "⚠️"} {String(a["reason"])}
                        </div>
                        <div className="text-muted-foreground">{String(a["action"] ?? "")}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-5 space-y-5">
          <SectionCard title={t("careGaps")}>
            <ul className="grid gap-2 sm:grid-cols-2">
              {(gapsQ.data ?? []).map((g) => (
                <li
                  key={String(g["id"])}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${statusChip(String(g["status"]))}`}
                >
                  <span>
                    {g["status"] === "completed" ? "✓" : g["status"] === "pending" ? "⚠" : "🚨"}
                  </span>
                  <span className="font-medium">{String(g["item"])}</span>
                  <span className="ml-auto text-xs">{String(g["detail"] ?? "")}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title={t("timeline")} action={<DemoBadge />}>
            {recordsQ.isLoading ? <p>{t("loading")}</p> : <Timeline records={records} />}
          </SectionCard>
        </TabsContent>

        <TabsContent value="consent" className="mt-5 space-y-5">
          <SectionCard title={t("consentRequests")}>
            <div className="space-y-2">
              {(consentsQ.data ?? []).map((c) => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3 text-sm"
                >
                  <div>
                    <div className="font-semibold">{c.provider_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.purpose} · {formatDate(c.requested_at, lang)}
                    </div>
                  </div>
                  <span
                    className={`ml-auto rounded-full border px-3 py-1 text-xs font-semibold ${statusChip(c.status)}`}
                  >
                    {t(c.status)}
                  </span>
                  {c.status === "granted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decide.mutate({ id: c.id, status: "revoked" })}
                    >
                      {t("revoke")}
                    </Button>
                  )}
                  {c.status === "pending" && (
                    <Button size="sm" onClick={() => decide.mutate({ id: c.id, status: "granted" })}>
                      {t("allowAccess")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title={t("accessLog")}>
            <ul className="space-y-2 text-sm">
              {(logsQ.data ?? []).map((l) => (
                <li key={String(l["id"])} className="rounded-xl bg-secondary/60 p-3">
                  <span className="font-semibold">{String(l["provider_name"])}</span> —{" "}
                  {String(l["action"])}
                  <div className="text-xs text-muted-foreground">
                    {formatDate(String(l["created_at"]), lang)} · {String(l["reason"] ?? "")}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="reminders" className="mt-5 space-y-5">
          <SectionCard title={t("reminders")}>
            <ul className="space-y-2">
              {(remindersQ.data ?? []).map((r) => (
                <li
                  key={String(r["id"])}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <span className="text-xl">
                    {r["kind"] === "medication" ? "💊" : r["kind"] === "vaccination" ? "💉" : "📅"}
                  </span>
                  <div>
                    <div className="font-semibold">{String(r["title"])}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(String(r["due_date"]), lang)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              {lang === "hi"
                ? "प्रोटोटाइप में सूचनाएँ ऐप के अंदर दिखाई जाती हैं (एसएमएस नहीं)।"
                : "In this prototype notifications are shown in-app (demo notifications, not real SMS)."}
            </p>
          </SectionCard>
          <SectionCard title={t("appointments")}>
            <ul className="space-y-2 text-sm">
              {(apptQ.data ?? []).map((a) => (
                <li key={String(a["id"])} className="rounded-xl bg-secondary/60 p-3">
                  <span className="font-semibold">{String(a["title"])}</span> ·{" "}
                  {formatDate(String(a["scheduled_at"]), lang)} · {String(a["provider_name"] ?? "")}
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title={t("postpartum")}>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>{lang === "hi" ? "प्रसव के बाद जाँच अनुस्मारक" : "Postpartum check-up reminders"}</li>
              <li>{lang === "hi" ? "नवजात टीकाकरण अनुस्मारक (बीसीजी, ओपीवी)" : "Newborn vaccination reminders (BCG, OPV)"}</li>
              <li>{lang === "hi" ? "माँ के स्वास्थ्य की फ़ॉलो-अप" : "Maternal recovery follow-up"}</li>
              <li>{lang === "hi" ? "नवजात का बुनियादी रिकॉर्ड" : "Newborn basic record"}</li>
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="guidance" className="mt-5">
          <SectionCard title={t("whatNow")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{lang === "hi" ? "गर्भावस्था का महीना" : "Month of pregnancy"}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setGuide((g) => ({ ...g, month: m }))}
                      className={`h-12 w-12 rounded-2xl border text-lg font-bold ${
                        guide.month === m
                          ? "brand-gradient border-transparent text-primary-foreground"
                          : "border-border bg-card"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>{lang === "hi" ? "कोई चेतावनी लक्षण?" : "Any warning symptoms?"}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { v: "none", en: "None", hi: "कोई नहीं" },
                    { v: "bleeding", en: "Bleeding", hi: "रक्तस्राव" },
                    { v: "severe_headache", en: "Severe headache", hi: "तेज़ सिरदर्द" },
                    { v: "swelling", en: "Swelling", hi: "सूजन" },
                    { v: "no_movement", en: "Reduced baby movement", hi: "बच्चे की हलचल कम" },
                  ].map((s) => (
                    <button
                      key={s.v}
                      type="button"
                      onClick={() => setGuide((g) => ({ ...g, symptom: s.v }))}
                      className={`rounded-2xl border px-4 py-3 text-base font-semibold ${
                        guide.symptom === s.v
                          ? "brand-gradient border-transparent text-primary-foreground"
                          : "border-border bg-card"
                      }`}
                    >
                      {lang === "hi" ? s.hi : s.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-card p-5 text-lg font-semibold">
              {guide.symptom !== "none" ? (
                <span className="text-destructive">
                  🚨 {t("seekCare")}
                </span>
              ) : (
                <span>
                  ✅{" "}
                  {lang === "hi"
                    ? `महीना ${guide.month}: आपकी अगली निर्धारित जाँच जल्द है — ${formatDate(String((apptQ.data ?? [])[0]?.["scheduled_at"] ?? ""), lang)}। दवाइयाँ रोज़ लें और एमएचआईडी कार्ड साथ रखें।`
                    : `Month ${guide.month}: your next scheduled check-up is due soon — ${formatDate(String((apptQ.data ?? [])[0]?.["scheduled_at"] ?? ""), lang)}. Keep taking your daily supplements and carry your MHID card.`}
                </span>
              )}
            </div>
            <p className="mt-3 text-xs italic text-muted-foreground">{t("riskDisclaimer")}</p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="emergency" className="mt-5 space-y-5">
          <SectionCard title={t("emergency")} icon={<PhoneCall className="h-5 w-5 text-destructive" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 rounded-2xl bg-destructive p-6 text-2xl font-bold text-destructive-foreground"
              >
                <PhoneCall className="h-7 w-7" /> 108 · {t("callNow")}
              </a>
              <a
                href={`tel:${String(patient.emergency_contact_phone ?? "")}`}
                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-card p-6 text-center"
              >
                <span className="text-sm text-muted-foreground">{t("emergencyContact")}</span>
                <span className="text-xl font-bold">{patient.emergency_contact_name}</span>
                <span className="font-mono">{patient.emergency_contact_phone}</span>
              </a>
            </div>
            <p className="mt-4 rounded-xl bg-warning/15 p-3 text-base font-medium text-warning-foreground">
              {t("seekCare")}
            </p>
          </SectionCard>
          <SectionCard title={t("facilities")}>
            <div className="grid gap-3 sm:grid-cols-2">
              {(facilitiesQ.data ?? []).map((f) => (
                <div key={String(f["id"])} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{String(f["name"])}</span>
                    {f["emergency"] ? (
                      <span className="rounded-full bg-destructive/12 px-2 py-0.5 text-[11px] font-bold text-destructive">
                        24×7
                      </span>
                    ) : null}
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        f["is_open"] ? "bg-success/12 text-success" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {f["is_open"]
                        ? lang === "hi"
                          ? "खुला"
                          : "Open"
                        : lang === "hi"
                          ? "बंद"
                          : "Closed"}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {String(f["type"])} · {String(f["distance_km"])} km · {String(f["contact"])}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {lang === "hi"
                ? "प्रोटोटाइप डेमो स्थान — बाद में वास्तविक मैप/लोकेशन एपीआई जोड़ा जा सकता है।"
                : "Prototype demo locations — real map/location APIs can be connected later."}
            </p>
          </SectionCard>
          <SectionCard title={t("complaintForms")} icon={<FileWarning className="h-5 w-5 text-primary" />}>
            <p className="mb-3 text-sm text-muted-foreground">{t("complaintNote")}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfrMeHW-M0bkjuN--5jU4IiHWlatQCC0Z7KaceMcYVxX3KI9Q/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-3 text-sm font-semibold transition-colors hover:bg-primary/10"
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
                {t("govtComplaint")}
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdsNGs_Brq_o34r3IUs8FAoyjqtFyuIdEpb-GJ8GJqaaH9eCA/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-3 text-sm font-semibold transition-colors hover:bg-primary/10"
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
                {t("hospitalComplaint")}
              </a>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="more" className="mt-5 space-y-5">
          <DocumentVault patientId={patient.id} uploaderName={profile?.full_name ?? "Patient"} />

          <SectionCard title={t("family")}>
            <ul className="mb-4 space-y-2 text-sm">
              {(familyQ.data ?? []).map((f) => (
                <li key={String(f["id"])} className="rounded-xl bg-secondary/60 p-3">
                  <span className="font-semibold">{String(f["full_name"])}</span> ·{" "}
                  {String(f["relationship"])} · {String(f["phone"])} ·{" "}
                  <span className="text-xs text-muted-foreground">
                    {lang === "hi" ? "सीमित पहुँच" : "limited access"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="grid gap-3 sm:grid-cols-4">
              <Input
                placeholder={t("name")}
                value={fam.full_name}
                onChange={(e) => setFam({ ...fam, full_name: e.target.value })}
              />
              <Input
                placeholder={t("relationship")}
                value={fam.relationship}
                onChange={(e) => setFam({ ...fam, relationship: e.target.value })}
              />
              <Input
                placeholder={t("phone")}
                value={fam.phone}
                onChange={(e) => setFam({ ...fam, phone: e.target.value })}
              />
              <Button
                disabled={!fam.full_name || !fam.phone || addFamily.isPending}
                onClick={() => addFamily.mutate()}
              >
                {t("addFamily")}
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {lang === "hi"
                ? "परिवार के सदस्य को पूरा चिकित्सा रिकॉर्ड स्वतः नहीं मिलता — केवल सीमित, सहमति-आधारित जानकारी।"
                : "Family members do not automatically receive the complete medical record — only limited, consent-based information."}
            </p>
          </SectionCard>

          <SectionCard title={t("schemes")}>
            <ul className="grid gap-2 sm:grid-cols-2">
              {(schemesQ.data ?? []).map((s) => (
                <li
                  key={String(s["id"])}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${statusChip(String(s["status"]))}`}
                >
                  <span>
                    {s["status"] === "received" ? "✓" : s["status"] === "pending" ? "⏳" : "❌"}
                  </span>
                  <span className="font-medium">{String(s["scheme"])}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title={t("vaccination")}>
            <ul className="space-y-2 text-sm">
              {(vaxQ.data ?? []).map((v) => (
                <li
                  key={String(v["id"])}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${statusChip(String(v["status"]))}`}
                >
                  💉 <span className="font-medium">{String(v["name"])}</span>
                  <span className="ml-auto text-xs">
                    {v["given_at"] ? formatDate(String(v["given_at"]), lang) : t("pending")}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title={t("profile")}>
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              {[
                [t("name"), patient.full_name],
                [t("age"), `${patient.age}`],
                [t("village"), patient.village ?? "—"],
                [t("district"), patient.district ?? "—"],
                [t("state"), patient.state ?? "—"],
                [t("bloodGroup"), patient.blood_group ?? "—"],
                [t("edd"), formatDate(patient.edd, lang)],
                [t("mhid"), patient.mhid],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-secondary/60 p-3">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
