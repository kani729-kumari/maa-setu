export type RecordType =
  | "checkup"
  | "ultrasound"
  | "blood_test"
  | "urine_test"
  | "blood_pressure"
  | "blood_sugar"
  | "vaccination"
  | "prescription"
  | "doctor_notes"
  | "previous_history"
  | "delivery";

export const recordTypes: { value: RecordType; en: string; hi: string; icon: string }[] = [
  { value: "checkup", en: "Check-up", hi: "जाँच", icon: "🩺" },
  { value: "ultrasound", en: "Ultrasound", hi: "अल्ट्रासाउंड", icon: "🖼️" },
  { value: "blood_test", en: "Blood test", hi: "रक्त जाँच", icon: "🩸" },
  { value: "urine_test", en: "Urine test", hi: "मूत्र जाँच", icon: "🧪" },
  { value: "blood_pressure", en: "Blood pressure", hi: "रक्तचाप", icon: "💓" },
  { value: "blood_sugar", en: "Blood sugar", hi: "रक्त शर्करा", icon: "🍬" },
  { value: "vaccination", en: "Vaccination", hi: "टीकाकरण", icon: "💉" },
  { value: "prescription", en: "Prescription", hi: "दवा पर्ची", icon: "💊" },
  { value: "doctor_notes", en: "Doctor notes", hi: "डॉक्टर टिप्पणी", icon: "📝" },
  { value: "previous_history", en: "Previous pregnancy history", hi: "पिछला गर्भ इतिहास", icon: "📚" },
  { value: "delivery", en: "Delivery record", hi: "प्रसव रिकॉर्ड", icon: "👶" },
];

export function recordMeta(type: string) {
  return (
    recordTypes.find((r) => r.value === type) ?? {
      value: type as RecordType,
      en: type,
      hi: type,
      icon: "📄",
    }
  );
}

export function formatDate(input: string | null | undefined, lang: "en" | "hi" = "en") {
  if (!input) return "—";
  return new Date(input).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Prototype MHID generator: STATE-DISTRICT-YEAR-SEQUENCE */
export function buildMhid(seq: number, state = "UP", district = "GB", year = new Date().getFullYear()) {
  return `${state}-${district}-${year}-${String(seq).padStart(5, "0")}`;
}

export type RiskFactor = { factor: string; weight: number };
export type RiskResult = {
  level: "low" | "moderate" | "high";
  score: number;
  factors: RiskFactor[];
};

type VitalsRecord = {
  recorded_at: string;
  pregnancy_week: number | null;
  vitals: Record<string, unknown> | null;
};

/**
 * Prototype rule-based risk-scoring engine (NOT a clinically validated model).
 * Kept as a pure function so a validated ML model / API can replace it later
 * behind the same input/output contract.
 */
export function assessRisk(
  patient: { age: number; pregnancy_number: number; edd?: string | null },
  records: VitalsRecord[],
  symptoms: string[] = [],
): RiskResult {
  const factors: RiskFactor[] = [];
  let score = 0;

  const add = (factor: string, weight: number) => {
    factors.push({ factor, weight });
    score += weight;
  };

  if (patient.age < 18) add("Age below 18 years", 20);
  else if (patient.age > 35) add("Age above 35 years", 15);

  if (patient.pregnancy_number === 1) add("First pregnancy", 6);
  if (patient.pregnancy_number >= 4) add("Fourth or later pregnancy", 12);

  const sorted = [...records].sort(
    (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
  );

  const bpRecord = sorted.find((r) => typeof r.vitals?.["bp"] === "string");
  const bpString = bpRecord?.vitals?.["bp"] as string | undefined;
  if (bpString) {
    const [sys, dia] = bpString.split("/").map((n) => Number(n.trim()));
    if (sys >= 140 || dia >= 90) add(`Elevated blood pressure (${bpString})`, 25);
    else if (sys >= 130 || dia >= 85) add(`Borderline blood pressure (${bpString})`, 12);
    else if (sys < 90) add(`Low blood pressure (${bpString})`, 10);
  } else {
    add("No blood pressure reading recorded", 8);
  }

  const hbRecord = sorted.find((r) => typeof r.vitals?.["hb"] === "number");
  const hb = hbRecord?.vitals?.["hb"] as number | undefined;
  if (typeof hb === "number") {
    if (hb < 8) add(`Severe anaemia (Hb ${hb} g/dL)`, 28);
    else if (hb < 11) add(`Anaemia (Hb ${hb} g/dL)`, 16);
    else if (hb < 12) add(`Haemoglobin below 12 g/dL (${hb})`, 10);
  } else {
    add("No haemoglobin value recorded", 8);
  }

  const sugarRecord = sorted.find((r) => typeof r.vitals?.["rbs"] === "number");
  const rbs = sugarRecord?.vitals?.["rbs"] as number | undefined;
  if (typeof rbs === "number") {
    if (rbs >= 140) add(`Raised blood sugar (${rbs} mg/dL)`, 22);
    else if (rbs >= 120) add(`Borderline blood sugar (${rbs} mg/dL)`, 10);
  }

  const gestWeeks = sorted.find((r) => r.pregnancy_week)?.pregnancy_week ?? null;
  if (gestWeeks && gestWeeks >= 37) add(`Gestational age ${gestWeeks} weeks (term)`, 5);

  for (const s of symptoms) add(`Reported symptom: ${s}`, 18);

  const level = score >= 45 ? "high" : score >= 22 ? "moderate" : "low";
  return { level, score: Math.min(score, 100), factors };
}

export const riskBadge = {
  low: "bg-success/12 text-success border-success/30",
  moderate: "bg-warning/20 text-warning-foreground border-warning/40",
  high: "bg-destructive/12 text-destructive border-destructive/30",
} as const;

export const featureList = [
  { key: "mhidF", en: "Unique Maternal Health ID", hi: "अद्वितीय मातृ स्वास्थ्य पहचान संख्या", icon: "🆔", core: true },
  { key: "recF", en: "Digital Medical Records", hi: "डिजिटल चिकित्सा रिकॉर्ड", icon: "🗂️", core: true },
  { key: "connF", en: "Healthcare Connection", hi: "स्वास्थ्य सेवा संपर्क", icon: "🌉", core: true },
  { key: "riskF", en: "High-Risk Pregnancy Alerts", hi: "उच्च जोखिम गर्भावस्था चेतावनी", icon: "🚨" },
  { key: "trendF", en: "Pregnancy Risk Trend", hi: "गर्भावस्था जोखिम रुझान", icon: "📈" },
  { key: "emerF", en: "Emergency Support", hi: "आपातकालीन सहायता", icon: "🆘" },
  { key: "ruralF", en: "Rural-Friendly Design", hi: "ग्रामीण-अनुकूल डिज़ाइन", icon: "🌾" },
  { key: "famF", en: "Family / Guardian Access", hi: "परिवार / अभिभावक पहुँच", icon: "👨‍👩‍👧" },
  { key: "hwF", en: "Healthcare Worker Data Entry", hi: "स्वास्थ्य कार्यकर्ता डेटा प्रविष्टि", icon: "✍️" },
  { key: "gapF", en: "Care Gap Tracker", hi: "देखभाल अंतर ट्रैकर", icon: "✅" },
  { key: "nowF", en: "\u201cWhat Do I Do Now?\u201d", hi: "\u201cअब मुझे क्या करना है?\u201d", icon: "🧭" },
  { key: "remF", en: "Smart Reminders", hi: "स्मार्ट अनुस्मारक", icon: "⏰" },
  { key: "vaultF", en: "Secure Document Vault + OCR", hi: "सुरक्षित दस्तावेज़ तिजोरी + ओसीआर", icon: "🔐" },
  { key: "govF", en: "Government Dashboard", hi: "सरकारी डैशबोर्ड", icon: "📊" },
  { key: "schemeF", en: "Scheme Benefit Tracker", hi: "योजना लाभ ट्रैकर", icon: "🏛️" },
  { key: "facF", en: "Nearby Facility Finder", hi: "नज़दीकी सुविधा खोज", icon: "📍" },
  { key: "postF", en: "Postpartum & Newborn Care", hi: "प्रसवोत्तर एवं नवजात देखभाल", icon: "👶" },
];
