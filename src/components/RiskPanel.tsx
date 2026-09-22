import { AlertTriangle, Activity } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import type { MedicalRecord, Patient } from "@/lib/data";
import { assessRisk, riskBadge } from "@/lib/maasetu";
import { cn } from "@/lib/utils";

export function RiskPanel({
  patient,
  records,
  symptoms = [],
}: {
  patient: Patient;
  records: MedicalRecord[];
  symptoms?: string[];
}) {
  const { t } = useI18n();
  const result = assessRisk(patient, records, symptoms);
  const levelLabel = t(result.level);

  return (
    <div className="card-soft p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">{t("riskAssessment")}</h2>
        <span
          className={cn(
            "ml-auto rounded-full border px-3 py-1 text-sm font-bold",
            riskBadge[result.level],
          )}
        >
          {t("riskLevel")}: {levelLabel}
        </span>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full brand-gradient transition-all"
          style={{ width: `${Math.max(result.score, 6)}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Prototype score: {result.score}/100 · engine: prototype-rule-engine-v1
      </div>

      <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {t("riskBreakdown")}
      </h3>
      <ul className="mt-2 space-y-2">
        {result.factors.map((f) => (
          <li
            key={f.factor}
            className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm"
          >
            <span className="font-medium">{f.factor}</span>
            <span className="ml-auto text-xs text-muted-foreground">+{f.weight}</span>
          </li>
        ))}
      </ul>

      {result.level !== "low" && (
        <div className="mt-4 flex gap-2 rounded-xl border border-warning/40 bg-warning/15 p-3 text-sm font-medium text-warning-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            {t("attention")} — {result.factors[0]?.factor}. {t("seekCare")}
          </span>
        </div>
      )}

      <p className="mt-3 text-xs italic text-muted-foreground">{t("riskDisclaimer")}</p>
    </div>
  );
}
