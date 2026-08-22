import { BadgeCheck, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import type { MedicalRecord } from "@/lib/data";
import { formatDate, recordMeta } from "@/lib/maasetu";

function Vitals({ vitals }: { vitals: Record<string, unknown> | null }) {
  const entries = Object.entries(vitals ?? {});
  if (!entries.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {entries.map(([k, v]) => (
        <span
          key={k}
          className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
        >
          {k.replaceAll("_", " ")}: {String(v)}
        </span>
      ))}
    </div>
  );
}

export function Timeline({ records }: { records: MedicalRecord[] }) {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<MedicalRecord | null>(null);

  const months = useMemo(() => {
    const map = new Map<number, MedicalRecord[]>();
    for (const r of records) {
      const m = r.pregnancy_month ?? 0;
      map.set(m, [...(map.get(m) ?? []), r]);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [records]);

  if (!records.length) {
    return <p className="text-muted-foreground">{t("noRecords")}</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 brand-gradient opacity-30" aria-hidden />
      <div className="space-y-8">
        {months.map(([month, items]) => {
          const providers = [...new Set(items.map((i) => i.provider_name).filter(Boolean))];
          return (
            <div key={month} className="relative pl-14">
              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full brand-gradient text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)]">
                {month || "—"}
              </div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold">
                  {t("month")} {month}
                </h3>
                {providers.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((r) => {
                  const meta = recordMeta(r.record_type);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setActive(r)}
                      className="card-lift card-lift-hover group p-4 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{meta.icon}</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                          {lang === "hi" ? meta.hi : meta.en}
                        </span>
                        {r.verified && (
                          <BadgeCheck className="ml-auto h-4 w-4 text-success" title={t("verified")} />
                        )}
                      </div>
                      <div className="mt-2 font-semibold leading-snug">{r.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatDate(r.recorded_at, lang)} · {t("week")} {r.pregnancy_week ?? "—"} ·{" "}
                        {r.hospital_name}
                      </div>
                      <Vitals vitals={r.vitals} />
                      <span className="mt-2 inline-flex items-center text-xs font-semibold text-primary">
                        {lang === "hi" ? "विवरण देखें" : "View details"}
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{recordMeta(active.record_type).icon}</span> {active.title}
                </DialogTitle>
                <DialogDescription>
                  {formatDate(active.recorded_at, lang)} · {t("month")} {active.pregnancy_month} ·{" "}
                  {t("week")} {active.pregnancy_week}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>{active.summary}</p>
                <Vitals vitals={active.vitals} />
                <div className="rounded-xl bg-secondary/60 p-3">
                  <div className="text-xs font-semibold text-muted-foreground">{t("provider")}</div>
                  <div className="font-medium">
                    {active.provider_name} · {active.hospital_name}
                  </div>
                </div>
                {active.notes && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t("notes")}</div>
                    <p>{active.notes}</p>
                  </div>
                )}
                {active.recommendations && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      {t("recommendations")}
                    </div>
                    <p>{active.recommendations}</p>
                  </div>
                )}
                {active.attachment_url && (
                  <a
                    href={active.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block font-semibold text-primary underline"
                  >
                    {lang === "hi" ? "संलग्न दस्तावेज़" : "Attached document"}
                  </a>
                )}
                {active.verified && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-semibold text-success">
                    <BadgeCheck className="h-4 w-4" /> {t("verified")}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
