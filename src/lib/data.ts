import { supabase } from "@/integrations/supabase/client";

export type Patient = {
  id: string;
  mhid: string;
  profile_id: string | null;
  full_name: string;
  age: number;
  village: string | null;
  district: string | null;
  state: string | null;
  blood_group: string | null;
  pregnancy_number: number;
  lmp: string | null;
  edd: string | null;
  status: string;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  registered_at: string;
  hospital_id: string | null;
};

export type MedicalRecord = {
  id: string;
  patient_id: string;
  record_type: string;
  title: string;
  summary: string | null;
  pregnancy_month: number | null;
  pregnancy_week: number | null;
  recorded_at: string;
  provider_name: string | null;
  hospital_name: string | null;
  vitals: Record<string, unknown> | null;
  notes: string | null;
  recommendations: string | null;
  attachment_url: string | null;
  verified: boolean;
};

export type Consent = {
  id: string;
  patient_id: string;
  provider_id: string | null;
  provider_name: string;
  status: "pending" | "granted" | "denied" | "revoked";
  purpose: string | null;
  requested_at: string;
  decided_at: string | null;
};

export async function fetchPatientByMhid(mhid: string) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .ilike("mhid", mhid.trim())
    .maybeSingle();
  if (error) throw error;
  return (data as Patient | null) ?? null;
}

export async function fetchPatientForProfile(profileId: string) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (error) throw error;
  return (data as Patient | null) ?? null;
}

export async function fetchRecords(patientId: string) {
  const { data, error } = await supabase
    .from("medical_records")
    .select("*")
    .eq("patient_id", patientId)
    .order("recorded_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MedicalRecord[];
}

export async function fetchTable<T>(table: string, patientId: string, orderBy?: string) {
  let q = supabase.from(table).select("*").eq("patient_id", patientId);
  if (orderBy) q = q.order(orderBy, { ascending: true });
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function logAccess(
  patientId: string,
  providerName: string,
  action: string,
  reason?: string,
) {
  await supabase
    .from("access_logs")
    .insert({ patient_id: patientId, provider_name: providerName, action, reason: reason ?? null });
}
