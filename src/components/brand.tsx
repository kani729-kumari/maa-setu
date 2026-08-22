import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { homeForRole, useProfile, useSignOut } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MaaSetuLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-10 w-10", className)} aria-hidden="true">
      <defs>
        <linearGradient id="maasetu-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.575 0.212 350)" />
          <stop offset="100%" stopColor="oklch(0.52 0.2 300)" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#maasetu-g)" />
      {/* mother arc (setu / bridge) */}
      <path
        d="M9 32c0-9 6.7-16 15-16s15 7 15 16"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.95"
      />
      {/* bridge pillars */}
      <path d="M14 32v5M24 27v10M34 32v5" stroke="white" strokeWidth="2.4" strokeLinecap="round" opacity="0.75" />
      {/* baby */}
      <circle cx="24" cy="21" r="4.4" fill="white" />
      <circle cx="24" cy="21" r="1.6" fill="oklch(0.575 0.212 350)" />
    </svg>
  );
}

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm",
        compact ? "text-sm" : "text-base",
      )}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-full px-3 py-1 font-semibold transition-colors",
          lang === "en" ? "brand-gradient text-primary-foreground" : "text-muted-foreground",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        className={cn(
          "rounded-full px-3 py-1 font-semibold transition-colors",
          lang === "hi" ? "brand-gradient text-primary-foreground" : "text-muted-foreground",
        )}
      >
        हिंदी
      </button>
    </div>
  );
}

export function DemoBadge({ label }: { label?: string }) {
  const { t } = useI18n();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/20 px-3 py-1 text-xs font-semibold text-warning-foreground">
      ● {label ?? t("demoData")}
    </span>
  );
}

export function BrandMark({ subtitle = true }: { subtitle?: boolean }) {
  const { t } = useI18n();
  return (
    <Link to="/" className="flex items-center gap-3">
      <MaaSetuLogo />
      <span className="leading-tight">
        <span className="block text-xl font-bold brand-text">{t("brand")}</span>
        {subtitle && (
          <span className="block text-[11px] font-medium text-muted-foreground">{t("tagline")}</span>
        )}
      </span>
    </Link>
  );
}

export function AppShell({ children, nav }: { children: ReactNode; nav?: ReactNode }) {
  const { t } = useI18n();
  const { data: profile } = useProfile();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen soft-gradient">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <BrandMark subtitle={false} />
          <span className="hidden rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-destructive sm:inline">
            {t("demoMode")}
          </span>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            {nav}
            <LangToggle compact />
            {profile ? (
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="mr-1.5 h-4 w-4" /> {t("logout")}
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate({ to: "/auth" })}>
                {t("login")}
              </Button>
            )}
          </div>
          <button
            type="button"
            className="ml-auto rounded-xl border border-border p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        {open && (
          <div className="flex flex-col gap-2 border-t border-border px-4 py-3 md:hidden">
            {nav}
            <LangToggle compact />
            {profile ? (
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="mr-1.5 h-4 w-4" /> {t("logout")}
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate({ to: "/auth" })}>
                {t("login")}
              </Button>
            )}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-4 text-center text-xs text-muted-foreground">
        {t("brand")} · {t("demoData")} · {profile ? profile.full_name : ""}
        {profile ? ` · ${homeForRole(profile.role)}` : ""}
      </footer>
    </div>
  );
}

export function SectionCard({
  title,
  icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-soft p-5", className)}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="ml-auto">{action}</div>
      </div>
      {children}
    </section>
  );
}

export function StatTile({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  tone?: "primary" | "violet" | "success" | "warning" | "destructive";
}) {
  const tones: Record<string, string> = {
    primary: "from-primary/12 to-primary/5 text-primary",
    violet: "from-violet/12 to-violet/5 text-violet",
    success: "from-success/12 to-success/5 text-success",
    warning: "from-warning/25 to-warning/10 text-warning-foreground",
    destructive: "from-destructive/12 to-destructive/5 text-destructive",
  };
  return (
    <div className={cn("rounded-2xl border border-border bg-gradient-to-br p-4", tones[tone])}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
