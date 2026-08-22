import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Stethoscope, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, DemoBadge, SectionCard, StatTile } from "@/components/brand";
import { MhidCard } from "@/components/MhidCard";
import { RiskPanel } from "@/components/RiskPanel";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/auth";
import {
  fetchPatientByMhid,
  fetchRecords,
  fetchTable,
  logAccess,
  type Consent,
  type Patient,
} from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { buildMhid, formatDate, recordTypes } from "@/lib/maasetu";

export const Route = createFileRoute("/_authenticated/doctor")({
  head: () => ({
    meta: [
      { title: "Provider workspace — MAA Setu doctor dashboard" },
      {
        name: "description",
        content:
          "Search a mother by Maternal Health ID, request consent, view her verified pregnancy history and add new medical records.",
      },
      { property: "og:title", content: "Doctor dashboard — MAA Setu" },
      {
        property: "og:description",
        content: "Consent-based access to a mother's complete verified pregnancy record.",
      },
    ],
  }),
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const { t, lang } = useI18n();
  const { data: profile } = useProfile();
  const qc = useQueryClient();

  const [mhidInput, setMhidInput] = useState("UP-GB-2026-00001");
  const [activeMhid, setActiveMhid] = useState<string | null>(null);

  const patientQ = useQuery({
    queryKey: ["doctor-patient", activeMhid],
    enabled: !!activeMhid,
    queryFn: async () => {
      const p = await fetchPatientByMhid(activeMhid!);
      if (p && profile) {
        await logAccess(p.id, profile.full_name, "searched", "MHID lookup at point of care");
      }
      return p;
    },
  });
  const patient = patientQ.data as Patient | null | undefined;

  const consentsQ = useQuery({
    queryKey: ["doctor-consents", patient?.id],
    enabled: !!patient?.id,
    queryFn: () => fetchTable<Consent>("consents", patient!.id, "requested_at"),
  });

  const myConsent = (consentsQ.data ?? []).find(
    (c) => c.provider_name === profile?.full_name && c.status === "granted",
  );
  const myPending = (consentsQ.data ?? []).find(
    (c) => c.provider_name === profile?.full_name && c.status === "pending",
  );
  const hasAccess = !!myConsent;

  const recordsQ = useQuery({
    queryKey: ["records", patient?.id],
    enabled: !!patient?.id && hasAccess,
    queryFn: async () => {
      const r = await fetchRecords(patient!.id);
      if (profile) await logAccess(patient!.id, profile.full_name, "viewed records", "Consent granted");
      return r;
    },
  });

  const requestConsent = useMutation({
    mutationFn: async () => {
      if (!patient || !profile) return;
      const { error } = await supabase.from("consents").insert({
        patient_id: patient.id,
        provider_id: profile.id,
        provider_name: profile.full_name,
        status: "pending",
        purpose: "Antenatal consultation — view complete pregnancy history",
      });
      if (error) throw error;
      await logAccess(patient.id, profile.full_name, "requested consent", "New provider access request");
    },
    onSuccess: () => {
      toast.success(t("waitingConsent"));
      qc.invalidateQueries({ queryKey: ["doctor-consents", patient?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const nav = (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link to="/demo">{t("demoJourney")}</Link>
      </Button>
    </>
  );

  return (
    <AppShell nav={nav}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Stethoscope className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">
          {t("provider")} · {profile?.full_name ?? ""}
        </h1>
        <DemoBadge />
      </div>

      <Tabs defaultValue="search">
        <TabsList className="flex-wrap">
          <TabsTrigger value="search">{t("searchMhid")}</TabsTrigger>
          <TabsTrigger value="register">{t("registerPatient")}</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-5 space-y-5">
          <SectionCard title={t("searchMhid")} icon={<Search className="h-5 w-5 text-primary" />}>
            <div className="flex flex-wrap gap-3">
              <Input
                value={mhidInput}
                onChange={(e) => setMhidInput(e.target.value)}
                placeholder="UP-GB-2026-00001"
                className="max-w-xs font-mono"
              />
              <Button onClick={() => setActiveMhid(mhidInput.trim())}>{t("search")}</Button>
            </div>
            {activeMhid && patientQ.isFetched && !patient && (
              <p className="mt-3 text-sm text-destructive">No patient found for {activeMhid}</p>
            )}
          </SectionCard>

          {patient && (
            <>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <SectionCard title={patient.full_name}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label={t("age")} value={`${patient.age}`} />
                    <Field label={t("bloodGroup")} value={patient.blood_group ?? "—"} />
                    <Field label={t("village")} value={patient.village ?? "—"} />
                    <Field label={t("district")} value={patient.district ?? "—"} />
                    <Field label={t("edd")} value={formatDate(patient.edd, lang)} />
                    <Field
                      label={t("emergencyContact")}
                      value={`${patient.emergency_contact_name ?? "—"} · ${patient.emergency_contact_phone ?? "—"}`}
                    />
                  </div>
                </SectionCard>
                <MhidCard patient={patient} />
              </div>

              {!hasAccess ? (
                <SectionCard
                  title={t("consentRequired")}
                  icon={<ShieldCheck className="h-5 w-5 text-warning-foreground" />}
                >
                  <p className="text-sm text-muted-foreground">{t("prevRecordsFound")}</p>
                  <Button
                    className="mt-4"
                    disabled={!!myPending || requestConsent.isPending}
                    onClick={() => requestConsent.mutate()}
                  >
                    {myPending ? t("waitingConsent") : t("requestConsent")}
                  </Button>
                </SectionCard>
              ) : (
                <>
                  <p className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
                    {t("consentGranted")}
                  </p>
                  <RiskPanel patient={patient} records={recordsQ.data ?? []} />
                  <SectionCard title={t("timeline")}>
                    <Timeline records={recordsQ.data ?? []} />
                  </SectionCard>
                  <AddRecordForm patientId={patient.id} providerName={profile?.full_name ?? "Provider"} />
                </>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="register" className="mt-5">
          <RegisterPatientForm hospitalId={profile?.hospital_id ?? null} onDone={(m) => {
            setMhidInput(m);
            setActiveMhid(m);
          }} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-3 py-2">
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function AddRecordForm({ patientId, providerName }: { patientId: string; providerName: string }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [type, setType] = useState("checkup");
  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("");
  const [bp, setBp] = useState("");
  const [hb, setHb] = useState("");
  const [notes, setNotes] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      const vitals: Record<string, unknown> = {};
      if (bp) vitals["bp"] = bp;
      if (hb) vitals["hb"] = Number(hb);
      const { error } = await supabase.from("medical_records").insert({
        patient_id: patientId,
        record_type: type,
        title: title || recordTypes.find((r) => r.value === type)!.en,
        pregnancy_week: week ? Number(week) : null,
        pregnancy_month: week ? Math.ceil(Number(week) / 4.34) : null,
        provider_name: providerName,
        vitals,
        notes: notes || null,
        verified: true,
      });
      if (error) throw error;
      await logAccess(patientId, providerName, "added record", type);
    },
    onSuccess: () => {
      toast.success(t("save"));
      setTitle("");
      setBp("");
      setHb("");
      setNotes("");
      qc.invalidateQueries({ queryKey: ["records", patientId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <SectionCard title={t("addRecord")}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Type</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
          >
            {recordTypes.map((r) => (
              <option key={r.value} value={r.value}>
                {r.icon} {r.en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Title</Label>
          <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>{t("week")}</Label>
          <Input className="mt-1" value={week} onChange={(e) => setWeek(e.target.value)} inputMode="numeric" />
        </div>
        <div>
          <Label>BP (e.g. 138/88)</Label>
          <Input className="mt-1" value={bp} onChange={(e) => setBp(e.target.value)} />
        </div>
        <div>
          <Label>Hb (g/dL)</Label>
          <Input className="mt-1" value={hb} onChange={(e) => setHb(e.target.value)} inputMode="decimal" />
        </div>
        <div className="sm:col-span-2">
          <Label>{t("notes")}</Label>
          <Input className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <Button className="mt-4" disabled={save.isPending} onClick={() => save.mutate()}>
        {t("save")}
      </Button>
    </SectionCard>
  );
}

function RegisterPatientForm({
  hospitalId,
  onDone,
}: {
  hospitalId: string | null;
  onDone: (mhid: string) => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    full_name: "",
    age: "24",
    village: "",
    district: "Gautam Buddh Nagar",
    state: "Uttar Pradesh",
    blood_group: "O+",
    pregnancy_number: "1",
    lmp: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const register = useMutation({
    mutationFn: async () => {
      const { count } = await supabase.from("patients").select("id", { count: "exact", head: true });
      const mhid = buildMhid((count ?? 0) + 1);
      const lmp = form.lmp || null;
      const edd = lmp ? new Date(new Date(lmp).getTime() + 280 * 864e5).toISOString().slice(0, 10) : null;
      const { error } = await supabase.from("patients").insert({
        mhid,
        full_name: form.full_name,
        age: Number(form.age),
        village: form.village,
        district: form.district,
        state: form.state,
        blood_group: form.blood_group,
        pregnancy_number: Number(form.pregnancy_number),
        lmp,
        edd,
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_phone: form.emergency_contact_phone,
        hospital_id: hospitalId,
      });
      if (error) throw error;
      return mhid;
    },
    onSuccess: (mhid) => {
      toast.success(`MHID ${mhid}`);
      onDone(mhid);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <SectionCard title={t("registerPatient")} icon={<UserPlus className="h-5 w-5 text-primary" />}>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["full_name", t("name")],
          ["age", t("age")],
          ["village", t("village")],
          ["district", t("district")],
          ["state", t("state")],
          ["blood_group", t("bloodGroup")],
          ["pregnancy_number", "Pregnancy number"],
          ["lmp", "LMP (YYYY-MM-DD)"],
          ["emergency_contact_name", t("emergencyContact")],
          ["emergency_contact_phone", t("phone")],
        ].map(([key, label]) => (
          <div key={key}>
            <Label>{label}</Label>
            <Input
              className="mt-1"
              value={form[key as keyof typeof form]}
              onChange={(e) => set(key!, e.target.value)}
            />
          </div>
        ))}
      </div>
      <Button
        className="mt-4"
        disabled={!form.full_name || register.isPending}
        onClick={() => register.mutate()}
      >
        {t("save")}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">{t("demoData")}</p>
    </SectionCard>
  );
}
