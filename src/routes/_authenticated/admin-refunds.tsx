import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, EmptyState, StatusPill } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { listAdminRefundRequests, processAdminRefund } from "@/lib/refunds.functions";
import { inr, shortDate } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin-refunds")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) throw redirect({ to: "/auth", search: { redirect: "/admin-refunds" } });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.claims.sub).maybeSingle();
    if (profile?.role !== "admin") throw redirect({ to: "/account" });
  },
  component: AdminRefundsPage,
});

function AdminRefundsPage() {
  const queryClient = useQueryClient();
  const list = useServerFn(listAdminRefundRequests);
  const process = useServerFn(processAdminRefund);
  const { data, isLoading, refetch } = useQuery({ queryKey: ["admin-refunds"], queryFn: () => list() });

  return (
    <DashboardShell title="Refund requests" description="Review customer cancellation and refund requests.">
      <div className="mb-4 flex flex-wrap justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => window.location.assign("/admin")}>Back to admin</Button>
        <Button variant="outline" onClick={() => refetch()} disabled={isLoading}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
      </div>
      {!data?.ok || !data.refunds.length ? (
        <EmptyState icon={RotateCcw} title="No pending refunds" description="New customer refund requests will appear here." />
      ) : (
        <div className="space-y-4">
          {data.refunds.map((refund: any) => (
            <RefundCard key={refund.id} refund={refund} onProcess={async (decision, note) => {
              const result = await process({ data: { orderId: refund.id, decision, note } });
              if (!result.ok) return toast.error(result.error);
              toast.success(decision === "approved" ? "Refund processed." : "Refund request rejected.");
              await queryClient.invalidateQueries({ queryKey: ["admin-refunds"] });
            }} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

function RefundCard({ refund, onProcess }: { refund: any; onProcess: (decision: "approved" | "rejected", note: string) => Promise<void> }) {
  const [note, setNote] = React.useState("");
  const approved = refund.refund_status === "approved";
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><h3 className="font-semibold">{refund.order_number}</h3><StatusPill status={approved ? "approved" : "requested"} /></div>
          <p className="mt-1 text-sm text-muted-foreground">{refund.shipping_name} · {refund.mobile}</p>
          <p className="text-sm text-muted-foreground">Requested {shortDate(refund.refund_requested_at)}</p>
        </div>
        <div className="text-right"><p className="text-lg font-semibold">{inr(refund.refund_requested_amount ?? refund.total)}</p><p className="text-xs text-muted-foreground">Full order refund</p></div>
      </div>
      <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm"><strong>Reason:</strong> {refund.refund_reason || "No reason provided"}</div>
      {approved && <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">Refund is already approved and can be safely resumed. If the gateway refund reference was saved, retry will not create a second refund.</div>}
      <textarea className="mt-4 min-h-20 w-full rounded-md border bg-background p-3 text-sm" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional admin note" maxLength={300} />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onProcess("approved", note)}><RotateCcw className="mr-2 h-4 w-4" />{approved ? "Resume refund" : "Approve & refund"}</Button>
        {!approved && <Button variant="outline" onClick={() => onProcess("rejected", note)}><XCircle className="mr-2 h-4 w-4" />Reject</Button>}
      </div>
    </div>
  );
}
