import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Building2, MapPin, ShieldAlert } from "lucide-react";

import { AppShell, DemoBadge, SectionCard, StatTile } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { assessRisk, formatDate, riskBadge } from "@/lib/maasetu";
import type { MedicalRecord, Patient } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "District maternal health overview — MAA Setu admin" },
      {
        name: "description",
        content:
          "Aggregated prototype view of registered pregnancies, high-risk cases, ANC coverage, scheme benefits and facility readiness.",
      },
      { property: "og:title", content: "Government dashboard — MAA Setu" },
      {
        property: "og:description",
        content: "District-level maternal health analytics for the MAA Setu prototype.",
      },
    ],
  }),
  component: AdminDashboard,
});

type Row = Record<string, string | number | boolean | null>;

function AdminDashboard() {
  const { t, lang } = useI18n();
  const { data: profile } = useProfile();

  const dataQ = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [patients, records, appointments, schemes, facilities, hospitals, staff, alerts] =
        await Promise.all([
          supabase.from("patients").select("*"),
          supabase.from("medical_records").select("*"),
          supabase.from("appointments").select("*"),
          supabase.from("scheme_benefits").select("*"),
          supabase.from("facilities").select("*"),
          supabase.from("hospitals").select("*"),
          supabase.from("profiles").select("*"),
          supabase.from("alerts").select("*"),
        ]);
      return {
        patients: (patients.data ?? []) as unknown as Patient[],
        records: (records.data ?? []) as unknown as MedicalRecord[],
        appointments: (appointments.data ?? []) as unknown as Row[],
        schemes: (schemes.data ?? []) as unknown as Row[],
        facilities: (facilities.data ?? []) as unknown as Row[],
        hospitals: (hospitals.data ?? []) as unknown as Row[],
        staff: (staff.data ?? []) as unknown as Row[],
        alerts: (alerts.data ?? []) as unknown as Row[],
      };
    },
  });

  const d = dataQ.data;
  const patients = d?.patients ?? [];
  const records = d?.records ?? [];

  const riskByPatient = patients.map((p) => ({
    patient: p,
    risk: assessRisk(
      p,
      records
        .filter((r) => r.patient_id === p.id)
        .map((r) => ({
          recorded_at: r.recorded_at,
          pregnancy_week: r.pregnancy_week,
          vitals: (r.vitals ?? {}) as Record<string, unknown>,
        })),
    ),
  }));

  const highRisk = riskByPatient.filter((r) => r.risk.level === "high").length;
  const active = patients.filter((p) => p.status === "active").length;
  const ancDone = records.filter((r) => r.record_type === "checkup").length;
  const missed = (d?.appointments ?? []).filter((a) => a["status"] === "missed").length;

  const nav = (
    <Button asChild variant="ghost" size="sm">
      <Link to="/demo">{t("demoJourney")}</Link>
    </Button>
  );

  return (
    <AppShell nav={nav}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <BarChart3 className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">
          {t("govDashboard")} · {profile?.full_name ?? ""}
        </h1>
        <DemoBadge />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile label={t("totalPregnancies")} value={patients.length} />
        <StatTile label={t("activePregnancies")} value={active} tone="violet" />
        <StatTile label={t("highRiskCases")} value={highRisk} tone="destructive" />
        <StatTile label={t("ancVisits")} value={ancDone} tone="success" />
        <StatTile label={t("missedFollowups")} value={missed} tone="warning" />
        <StatTile label={t("doctors")} value={(d?.staff ?? []).length} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <SectionCard title={t("patients")} icon={<ShieldAlert className="h-5 w-5 text-primary" />}>
          {dataQ.isLoading ? (
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">MHID</th>
                    <th>{t("name")}</th>
                    <th>{t("district")}</th>
                    <th>{t("edd")}</th>
                    <th>{t("riskLevel")}</th>
                  </tr>
                </thead>
                <tbody>
                  {riskByPatient.map(({ patient, risk }) => (
                    <tr key={patient.id} className="border-t border-border/70">
                      <td className="py-2 font-mono text-xs">{patient.mhid}</td>
                      <td className="font-medium">{patient.full_name}</td>
                      <td>{patient.district ?? "—"}</td>
                      <td>{formatDate(patient.edd, lang)}</td>
                      <td>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${riskBadge[risk.level]}`}
                        >
                          {t(risk.level)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard title={t("schemes")} icon={<Building2 className="h-5 w-5 text-primary" />}>
          <ul className="space-y-2 text-sm">
            {(d?.schemes ?? []).map((s) => (
              <li
                key={String(s["id"])}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2"
              >
                <span className="font-semibold">{String(s["scheme"])}</span>
                <span className="text-muted-foreground">{String(s["note"] ?? "")}</span>
                <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-xs font-semibold">
                  {String(s["status"])}
                </span>
              </li>
            ))}
            {(d?.schemes ?? []).length === 0 && (
              <li className="text-muted-foreground">{t("noRecords")}</li>
            )}
          </ul>
        </SectionCard>

        <SectionCard title={t("facilities")} icon={<MapPin className="h-5 w-5 text-primary" />}>
          <ul className="space-y-2 text-sm">
            {(d?.facilities ?? []).map((f) => (
              <li
                key={String(f["id"])}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2"
              >
                <span className="font-semibold">{String(f["name"])}</span>
                <span className="text-muted-foreground">
                  {String(f["type"])} · {String(f["distance_km"] ?? "—")} km
                </span>
                <span className="ml-auto text-xs font-semibold">
                  {f["is_open"] ? "Open" : "Closed"}
                  {f["emergency"] ? " · Emergency" : ""}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={t("hospitals")}>
          <ul className="space-y-2 text-sm">
            {(d?.hospitals ?? []).map((h) => (
              <li key={String(h["id"])} className="rounded-xl border border-border bg-muted/30 px-3 py-2">
                <div className="font-semibold">{String(h["name"])}</div>
                <div className="text-xs text-muted-foreground">
                  {String(h["location"])} · {String(h["status"])}
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title={t("complaintForms")}
          icon={<FileWarning className="h-5 w-5 text-primary" />}
        >
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
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">{t("riskDisclaimer")}</p>
    </AppShell>
  );
}
