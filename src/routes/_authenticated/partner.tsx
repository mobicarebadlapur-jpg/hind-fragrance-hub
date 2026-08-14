import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";
import { DashboardShell, EmptyState, StatCard, StatusPill } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { downloadCsv, inr, shortDate } from "@/lib/format";
import { referralUrl } from "@/lib/referral";
import { useSession } from "@/lib/session";
import { getPartnerBalance, requestPayout } from "@/lib/payouts.functions";

export const Route = createFileRoute("/_authenticated/partner")({
  head: () => ({
    meta: [
      { title: "Partner Dashboard — Hind Fragrance" },
      {
        name: "description",
        content: "Track referral clicks, orders, commission and payouts as a Hind Fragrance partner.",
      },
      { property: "og:title", content: "Partner Dashboard — Hind Fragrance" },
      { property: "og:description", content: "Your referral performance at a glance." },
    ],
  }),
  component: PartnerDashboard,
});

function PartnerDashboard() {
  const { data: session, isPending } = useSession();
  const partner = session?.partner ?? null;
  const queryClient = useQueryClient();
  const balanceFn = useServerFn(getPartnerBalance);
  const payoutFn = useServerFn(requestPayout);

  const { data: balance } = useQuery({
    queryKey: ["partner-balance", partner?.id],
    enabled: Boolean(partner),
    queryFn: () => balanceFn({}),
  });

  const { data: stats } = useQuery({
    queryKey: ["partner-stats", partner?.id],
    enabled: Boolean(partner),
    queryFn: async () => {
      const [clicks, orders, commissions, payouts, assets] = await Promise.all([
        supabase
          .from("referral_clicks")
          .select("id", { count: "exact", head: true })
          .eq("partner_id", partner!.id),
        supabase
          .from("orders")
          .select("id,order_number,total,status,created_at")
          .eq("partner_id", partner!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("commissions")
          .select("*, orders(order_number)")
          .eq("partner_id", partner!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("payouts")
          .select("*")
          .eq("partner_id", partner!.id)
          .order("created_at", { ascending: false }),
        supabase.from("marketing_assets").select("*").eq("status", "active"),
      ]);
      return {
        clicks: clicks.count ?? 0,
        orders: orders.data ?? [],
        commissions: commissions.data ?? [],
        payouts: payouts.data ?? [],
        assets: assets.data ?? [],
      };
    },
  });

  const [payout, setPayout] = useState({
    amount: "",
    method: "upi" as "upi" | "bank",
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
  });
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return <DashboardShell title="Partner dashboard"><p className="text-sm text-muted-foreground">Loading…</p></DashboardShell>;
  }

  if (!partner || partner.status !== "active") {
    return (
      <DashboardShell title="Partner dashboard">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {partner
              ? `Your partner account is currently ${partner.status}. Contact support for help.`
              : "You are not a Business Partner yet."}
          </p>
          {!partner && (
            <Button asChild className="mt-5">
              <Link to="/join">Join for ₹199</Link>
            </Button>
          )}
        </div>
      </DashboardShell>
    );
  }

  const link = referralUrl(partner.referral_code);
  const commissions = stats?.commissions ?? [];
  const earned = commissions
    .filter((c) => c.status !== "reversed")
    .reduce((s, c) => s + Number(c.amount), 0);
  const pending = commissions
    .filter((c) => c.status === "pending")
    .reduce((s, c) => s + Number(c.amount), 0);

  return (
    <DashboardShell
      title="Partner dashboard"
      subtitle={`Partner ID ${partner.partner_code} · Referral code ${partner.referral_code}`}
      actions={
        <Button
          variant="gold"
          onClick={() => {
            void navigator.clipboard.writeText(link);
            toast.success("Referral link copied");
          }}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy referral link
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Referral clicks" value={stats?.clicks ?? 0} />
        <StatCard label="Referred orders" value={stats?.orders.length ?? 0} />
        <StatCard label="Total commission" value={earned} currency hint={`${inr(pending)} pending`} />
        <StatCard
          label="Available to withdraw"
          value={balance?.available ?? 0}
          currency
          hint={`Min payout ${inr(balance?.minPayout ?? 0)}`}
        />
      </div>

      <Tabs defaultValue="links" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="links">Referral tools</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="eyebrow">Your referral link</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-secondary px-3 py-2 text-xs">{link}</code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(link);
                  toast.success("Copied");
                }}
              >
                Copy
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Shop alcohol-free attars from Hind Fragrance: ${link}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share on WhatsApp
                </a>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Attribution uses last click within 30 days. Self-referred orders never earn commission.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          {(stats?.orders.length ?? 0) === 0 ? (
            <EmptyState message="No referred orders yet. Share your link to get started." />
          ) : (
            <Table
              headers={["Order", "Date", "Status", "Value"]}
              rows={(stats?.orders ?? []).map((o) => [
                o.order_number,
                shortDate(o.created_at),
                <StatusPill key={o.id} status={o.status} />,
                inr(o.total),
              ])}
            />
          )}
        </TabsContent>

        <TabsContent value="earnings" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadCsv(
                  "commissions.csv",
                  commissions.map((c) => ({
                    order: c.orders?.order_number ?? "",
                    amount: c.amount,
                    percent: c.percent,
                    status: c.status,
                    date: c.created_at,
                  })),
                )
              }
            >
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          {commissions.length === 0 ? (
            <EmptyState message="No commission entries yet." />
          ) : (
            <Table
              headers={["Order", "Base", "Rate", "Commission", "Status", "Date"]}
              rows={commissions.map((c) => [
                c.orders?.order_number ?? "—",
                inr(c.base_amount),
                `${c.percent}%`,
                inr(c.amount),
                <StatusPill key={c.id} status={c.status} />,
                shortDate(c.created_at),
              ])}
            />
          )}
        </TabsContent>

        <TabsContent value="payouts" className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          <form
            className="h-fit space-y-4 rounded-xl border border-border bg-card p-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                const res = await payoutFn({
                  data: {
                    amount: Number(payout.amount),
                    method: payout.method,
                    accountHolder: payout.accountHolder || undefined,
                    bankName: payout.bankName || undefined,
                    accountNumber: payout.accountNumber || undefined,
                    ifsc: payout.ifsc || undefined,
                    upiId: payout.upiId || undefined,
                  },
                });
                if (!res.ok) {
                  toast.error(res.error);
                  return;
                }
                toast.success("Payout requested");
                setPayout({ ...payout, amount: "" });
                await queryClient.invalidateQueries({ queryKey: ["partner-stats"] });
                await queryClient.invalidateQueries({ queryKey: ["partner-balance"] });
              } catch {
                toast.error("Could not submit payout request.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <h2 className="font-display text-2xl">Request payout</h2>
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input
                inputMode="decimal"
                value={payout.amount}
                onChange={(e) => setPayout({ ...payout, amount: e.target.value.replace(/[^\d.]/g, "") })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Method</Label>
              <Select
                value={payout.method}
                onValueChange={(v) => setPayout({ ...payout, method: v as "upi" | "bank" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {payout.method === "upi" ? (
              <div className="space-y-1.5">
                <Label>UPI ID</Label>
                <Input
                  value={payout.upiId}
                  maxLength={60}
                  onChange={(e) => setPayout({ ...payout, upiId: e.target.value })}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  placeholder="Account holder"
                  value={payout.accountHolder}
                  maxLength={100}
                  onChange={(e) => setPayout({ ...payout, accountHolder: e.target.value })}
                />
                <Input
                  placeholder="Bank name"
                  value={payout.bankName}
                  maxLength={100}
                  onChange={(e) => setPayout({ ...payout, bankName: e.target.value })}
                />
                <Input
                  placeholder="Account number"
                  value={payout.accountNumber}
                  maxLength={30}
                  onChange={(e) => setPayout({ ...payout, accountNumber: e.target.value })}
                />
                <Input
                  placeholder="IFSC"
                  value={payout.ifsc}
                  maxLength={20}
                  onChange={(e) => setPayout({ ...payout, ifsc: e.target.value.toUpperCase() })}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Submitting…" : "Request payout"}
            </Button>
          </form>

          <div>
            {(stats?.payouts.length ?? 0) === 0 ? (
              <EmptyState message="No payout requests yet." />
            ) : (
              <Table
                headers={["Date", "Amount", "Method", "Status"]}
                rows={(stats?.payouts ?? []).map((p) => [
                  shortDate(p.created_at),
                  inr(p.amount),
                  p.method.toUpperCase(),
                  <StatusPill key={p.id} status={p.status} />,
                ])}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="mt-6">
          {(stats?.assets.length ?? 0) === 0 ? (
            <EmptyState message="Marketing material will appear here once the admin uploads it." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(stats?.assets ?? []).map((asset) => (
                <a
                  key={asset.id}
                  href={asset.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold"
                >
                  <span className="eyebrow">{asset.asset_type}</span>
                  <h3 className="mt-2 font-display text-xl">{asset.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Open / download</p>
                </a>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-secondary text-left">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {row.map((cell, j) => (
                <td key={j} className="p-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
