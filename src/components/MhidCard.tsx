import { Copy, Printer, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { MaaSetuLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/maasetu";

export type PatientLike = {
  mhid: string;
  full_name: string;
  registered_at: string;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  blood_group: string | null;
};

export function MhidCard({ patient }: { patient: PatientLike }) {
  const { t, lang } = useI18n();
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    // Only the MHID reference is encoded — never medical information.
    QRCode.toDataURL(`MAASETU:MHID:${patient.mhid}`, {
      width: 320,
      margin: 1,
      color: { dark: "#6b1150", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(""));
  }, [patient.mhid]);

  const copy = async () => {
    await navigator.clipboard.writeText(patient.mhid);
    toast.success(t("copied"));
  };

  const share = async () => {
    const text = `${t("brand")} ${t("mhid")}: ${patient.mhid}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: t("brand"), text });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  return (
    <div className="space-y-3">
      <div
        id="mhid-card-print"
        className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-lift)]"
      >
        <div className="brand-gradient flex items-center gap-3 px-5 py-4 text-primary-foreground">
          <MaaSetuLogo className="h-9 w-9" />
          <div>
            <div className="text-lg font-bold">{t("brand")}</div>
            <div className="text-[11px] opacity-90">{t("mhid")}</div>
          </div>
          <span className="ml-auto rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold">
            {t("demoData")}
          </span>
        </div>
        <div className="grid gap-4 bg-card p-5 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">{t("name")}</div>
              <div className="text-xl font-bold">{patient.full_name}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t("mhid")}</div>
              <div className="font-mono text-2xl font-bold tracking-wider brand-text">
                {patient.mhid}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">{t("registeredOn")}</div>
                <div className="font-semibold">{formatDate(patient.registered_at, lang)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("bloodGroup")}</div>
                <div className="font-semibold">{patient.blood_group ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("emergencyContact")}</div>
                <div className="font-semibold">
                  {patient.emergency_contact_name ?? "—"}
                  {patient.emergency_contact_phone ? ` · ${patient.emergency_contact_phone}` : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            {qr ? (
              <img src={qr} alt={`QR code for ${patient.mhid}`} className="h-36 w-36 rounded-xl border border-border" />
            ) : (
              <div className="h-36 w-36 animate-pulse rounded-xl bg-muted" />
            )}
            <span className="text-[10px] text-muted-foreground">MHID reference only</span>
          </div>
        </div>
        <div className="border-t border-border bg-secondary px-5 py-3 text-center text-xs font-medium text-secondary-foreground">
          {t("showAtFacility")}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={copy}>
          <Copy className="mr-1.5 h-4 w-4" /> {t("copy")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="mr-1.5 h-4 w-4" /> {t("print")}
        </Button>
        <Button variant="outline" size="sm" onClick={share}>
          <Share2 className="mr-1.5 h-4 w-4" /> {t("share")}
        </Button>
      </div>
    </div>
  );
}
