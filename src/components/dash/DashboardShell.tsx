import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { inr } from "@/lib/format";

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Hind Fragrance</span>
            <h1 className="mt-1 font-display text-4xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {actions}
        </div>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  currency = false,
}: {
  label: string;
  value: number | string;
  hint?: string;
  currency?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-display text-3xl">
        {currency ? inr(Number(value)) : value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    /paid|approved|active|delivered|success|completed/.test(status)
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
      : /pending|requested|processing|created|shipped|hold/.test(status)
        ? "bg-gold/20 text-foreground"
        : /cancel|refund|reversed|rejected|failed|blocked|suspend/.test(status)
          ? "bg-destructive/15 text-destructive"
          : "bg-secondary text-muted-foreground";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] capitalize ${tone}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{message}</p>;
}
