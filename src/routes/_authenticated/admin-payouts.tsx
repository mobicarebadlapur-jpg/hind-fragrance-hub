import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell, EmptyState, StatusPill } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/lib/session";
import { listAdminPayouts, updateAdminPayout } from "@/lib/admin-payouts.functions";

export const Route = createFileRoute("/_authenticated/admin-payouts")({
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth", search: { redirect: "/admin-payouts" } });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
    if (profile?.role !== "admin") throw redirect({ to: "/account" });
  },
  head: () => ({ meta: [{ title: "Partner Payouts — Hind Fragrance" }] }),
  component: AdminPayouts,
});

const STATUSES = ["requested", "under_review", "approved", "processing", "paid", "rejected"] as const;
type PayoutStatus = (typeof STATUSES)[number];

function AdminPayouts() {
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();
  const list = useServerFn(listAdminPayouts);
  const update = useServerFn(updateAdminPayout);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | PayoutStatus>("all");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const payoutsQuery = useQuery({
    queryKey: ["admin-payouts"],
    enabled: isAdmin,
    queryFn: async () => {
      const result = await list();
      if (!result.ok) throw new Error(result.error);
      return result.payouts;
    },
  });

  async function changeStatus(id: string, status: PayoutStatus) {
    setBusy(id);
    try {
      const result = await update({ data: { payoutId: id, status, notes: notes[id]?.trim() || null } });
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(`Payout marked ${status.replace("_", " ")}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    } catch {
      toast.error("Could not update payout.");
    } finally {
      setBusy(null);
    }
  }

  const payouts = (payoutsQuery.data ?? []).filter((p) => filter === "all" || p.status === filter);

  return (
    <DashboardShell title="Partner payouts" subtitle="Review and process commission withdrawal requests.">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl">Payout queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">Paid requests automatically consume the oldest available commissions for that partner.</p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-md border bg-background px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as "all" | PayoutStatus)}>
            <option value="all">All statuses</option>
            {STATUSES.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
          </select>
          <Button variant="outline" onClick={() => void payoutsQuery.refetch()} disabled={payoutsQuery.isFetching}>Refresh</Button>
        </div>
      </div>

      {payoutsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading payouts…</p> : payoutsQuery.error ? <EmptyState message="Could not load payouts." /> : payouts.length === 0 ? <EmptyState message="No payout requests match this filter." /> : (
        <div className="space-y-4">
          {payouts.map((payout) => {
            const partner = payout.partners as { partner_code: string; user_id: string } | null;
            return (
              <div key={payout.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-medium">₹{Number(payout.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      <StatusPill status={payout.status} />
                      <span className="text-xs text-muted-foreground">{new Date(payout.created_at).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                      <div><p className="text-xs text-muted-foreground">Partner</p><p>{partner?.partner_code ?? payout.partner_id}</p></div>
                      <div><p className="text-xs text-muted-foreground">Method</p><p>{String(payout.method ?? "—").toUpperCase()}</p></div>
                      <div><p className="text-xs text-muted-foreground">Payment destination</p><p>{payout.method === "upi" ? payout.upi_id_masked ?? "—" : `${payout.bank_name ?? "Bank"} · ****${payout.account_number_last4 ?? ""}`}</p></div>
                    </div>
                    {payout.account_holder && <p className="mt-2 text-xs text-muted-foreground">Account holder: {payout.account_holder}</p>}
                    {payout.notes && <p className="mt-2 rounded-md bg-secondary px-3 py-2 text-xs">Notes: {payout.notes}</p>}
                  </div>
                  <div className="w-full space-y-2 xl:max-w-sm">
                    <input className="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Admin note (optional)" maxLength={300} value={notes[payout.id] ?? ""} onChange={(e) => setNotes((current) => ({ ...current, [payout.id]: e.target.value }))} />
                    <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={payout.status} disabled={busy === payout.id || payout.status === "paid"} onChange={(e) => void changeStatus(payout.id, e.target.value as PayoutStatus)}>
                      {STATUSES.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                    </select>
                    {busy === payout.id && <p className="text-xs text-muted-foreground">Updating…</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
