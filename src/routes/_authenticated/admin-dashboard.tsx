import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { DashboardShell, EmptyState } from "@/components/dash/DashboardShell";
import { supabase } from "@/integrations/supabase/client";
import { getAdminDashboardSummary } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin-dashboard")({
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth", search: { redirect: "/admin-dashboard" } });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
    if (profile?.role !== "admin") throw redirect({ to: "/account" });
  },
  head: () => ({ meta: [{ title: "Admin Dashboard — Hind Fragrance" }, { name: "description", content: "Financial and operational overview for Hind Fragrance." }] }),
  component: AdminDashboard,
});

function money(value: number) { return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`; }

function AdminDashboard() {
  const getSummary = useServerFn(getAdminDashboardSummary);
  const query = useQuery({ queryKey: ["admin-dashboard-summary"], queryFn: async () => { const result = await getSummary(); if (!result.ok) throw new Error(result.error); return result.summary; } });
  const s = query.data;

  return <DashboardShell title="Admin Dashboard" subtitle="Financial & operational overview">
    {query.isLoading ? <p className="text-sm text-muted-foreground">Loading dashboard…</p> : query.error ? <EmptyState message="Could not load dashboard summary." /> : !s ? <EmptyState message="No dashboard data." /> : <div className="space-y-6">
      <div className="flex justify-end"><Button variant="outline" size="sm" onClick={() => void query.refetch()} disabled={query.isFetching}>{query.isFetching ? "Refreshing…" : "Refresh"}</Button></div>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric title="Net sales" value={money(s.revenue)} detail={`${s.paidOrders} paid orders`} />
        <Metric title="Total orders" value={String(s.totalOrders)} detail={`${s.pendingPayments ? money(s.pendingPayments) : "₹0"} payment pending`} />
        <Metric title="Commission liability" value={money(s.commissionsPending + s.commissionsApproved + s.commissionsAvailable)} detail={`${money(s.commissionsAvailable)} available`} />
        <Metric title="Active partners" value={String(s.activePartners)} detail={`${s.pendingPartners} applications pending`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5"><h2 className="font-display text-xl">Commission ledger</h2><div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4"><Stat label="Pending" value={money(s.commissionsPending)} /><Stat label="Approved" value={money(s.commissionsApproved)} /><Stat label="Available" value={money(s.commissionsAvailable)} /><Stat label="Paid" value={money(s.commissionsPaid)} /></div></div>
        <div className="rounded-xl border border-border bg-card p-5"><h2 className="font-display text-xl">Operations</h2><div className="mt-4 grid grid-cols-2 gap-4 text-sm"><Stat label="Active products" value={String(s.activeProducts)} /><Stat label="Low stock ≤ 5" value={String(s.lowStockProducts)} /><Stat label="Pending payments" value={money(s.pendingPayments)} /><Stat label="Cancelled/refunded" value={money(s.cancelledRevenue)} /></div></div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5"><h2 className="font-display text-xl">Recent orders</h2><div className="mt-4 space-y-2">{s.recent.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet.</p> : s.recent.map((order) => <div key={order.id} className="flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{order.order_number}</p><p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString("en-IN")}</p></div><div className="flex items-center gap-4 text-sm"><span className="capitalize text-muted-foreground">{order.status.replace("_", " ")}</span><span className="font-medium">{money(Number(order.total))}</span></div></div>)}</div></section>
    </div>}
  </DashboardShell>;
}

function Metric({ title, value, detail }: { title: string; value: string; detail: string }) { return <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{title}</p><p className="mt-2 font-display text-2xl">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>; }
function Stat({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>; }
