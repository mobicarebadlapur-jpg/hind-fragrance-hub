import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, Circle, CreditCard, MapPin, Package, Printer, Truck } from "lucide-react";
import { DashboardShell, EmptyState, StatusPill } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { inr, shortDate } from "@/lib/format";
import { getCustomerOrderDetail } from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order Details — Hind Fragrance" }] }),
  component: OrderDetail,
});

const steps = [
  { key: "placed", label: "Order placed", icon: Package },
  { key: "paid", label: "Payment confirmed", icon: CreditCard },
  { key: "processing", label: "Processing", icon: Circle },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Check },
] as const;

const rank: Record<string, number> = { created: 0, payment_pending: 0, paid: 1, processing: 2, shipped: 3, delivered: 4 };

function OrderDetail() {
  const { orderId } = Route.useParams();
  const getDetail = useServerFn(getCustomerOrderDetail);
  const { data, isLoading } = useQuery({
    queryKey: ["customer-order", orderId],
    queryFn: () => getDetail({ data: { orderId } }),
  });

  if (isLoading) return <DashboardShell title="Order details" subtitle="Loading your order…"><div className="h-48 animate-pulse rounded-xl border border-border bg-card" /></DashboardShell>;
  if (!data?.ok) return <DashboardShell title="Order not found" subtitle="This order is unavailable or does not belong to your account."><EmptyState message="We couldn't find that order." /><Button asChild className="mt-4"><Link to="/account">Back to account</Link></Button></DashboardShell>;

  const { order, items, transactions } = data;
  const currentRank = rank[order.status] ?? 0;
  const cancelled = order.status === "cancelled" || order.status === "refunded";
  const successfulPayment = transactions.find((tx) => tx.status === "success");

  return (
    <DashboardShell
      title={`Order ${order.order_number}`}
      subtitle={shortDate(order.created_at)}
      actions={<Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print / Save PDF</Button>}
    >
      <div className="mb-4 flex items-center gap-2 print:hidden">
        <Button asChild variant="ghost" size="sm"><Link to="/account"><ArrowLeft className="mr-2 h-4 w-4" />My orders</Link></Button>
        <StatusPill status={order.status} />
      </div>

      {cancelled ? (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          This order is <strong>{order.status}</strong>. Please contact support if you need help with a refund or cancellation.
        </div>
      ) : (
        <section className="mb-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Order tracking</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-5">
            {steps.map((step, index) => {
              const active = currentRank >= index;
              const Icon = step.icon;
              const pendingPayment = step.key === "paid" && order.status === "payment_pending";
              return <div key={step.key} className="flex items-center gap-3 sm:block sm:text-center">
                <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}><Icon className="h-4 w-4" /></div>
                <div className="text-sm font-medium">{step.label}</div>
                {pendingPayment && <div className="text-xs text-muted-foreground">Awaiting payment</div>}
              </div>;
            })}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6 print:space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">Items</h2>
            <div className="mt-4 divide-y divide-border">
              {items.map((item) => <div key={item.id} className="flex justify-between gap-4 py-3 text-sm"><div><div className="font-medium">{item.product_name}</div><div className="text-muted-foreground">{item.quantity} × {inr(item.unit_price)}</div></div><div className="font-medium">{inr(item.line_total)}</div></div>)}
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between"><span>Discount</span><span>-{inr(order.discount)}</span></div>}
              {Number(order.tax) > 0 && <div className="flex justify-between"><span>Tax</span><span>{inr(order.tax)}</span></div>}
              {Number(order.shipping) > 0 && <div className="flex justify-between"><span>Shipping</span><span>{inr(order.shipping)}</span></div>}
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Total</span><span>{inr(order.total)}</span></div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">Payment history</h2>
            {transactions.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No payment transaction is recorded yet.</p> : <div className="mt-4 divide-y divide-border">{transactions.map((tx) => <div key={tx.id} className="flex flex-wrap justify-between gap-3 py-3 text-sm"><div><div className="font-medium capitalize">{tx.status}</div><div className="text-muted-foreground">{tx.gateway} · {shortDate(tx.created_at)}{tx.gateway_payment_id ? ` · ${tx.gateway_payment_id}` : ""}</div></div><div className="font-medium">{inr(tx.amount)}</div></div>)}</div>}
            {successfulPayment && <p className="mt-3 text-xs text-muted-foreground">Payment ID: {successfulPayment.gateway_payment_id ?? "—"}</p>}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4" />Delivery address</h2>
            <div className="mt-3 text-sm leading-6 text-muted-foreground"><div className="font-medium text-foreground">{order.shipping_name}</div><div>{order.mobile}</div><div>{order.address}</div><div>{order.city}, {order.state} — {order.pincode}</div></div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 print:hidden">
            <h2 className="font-semibold">Invoice / receipt</h2>
            <p className="mt-2 text-sm text-muted-foreground">Use your browser's print dialog to print this receipt or save it as a PDF.</p>
            <Button className="mt-4 w-full" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print invoice</Button>
          </div>
        </aside>
      </div>

      <div className="mt-8 hidden border-t border-border pt-6 print:block">
        <div className="text-lg font-semibold">Hind Fragrance Hub</div>
        <div className="text-sm text-muted-foreground">Invoice / Payment Receipt · {order.order_number}</div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm"><div><strong>Customer</strong><br />{order.shipping_name}<br />{order.mobile}</div><div><strong>Order date</strong><br />{shortDate(order.created_at)}<br />Status: {order.status}</div></div>
        <div className="mt-5 text-sm">Payment: {successfulPayment ? `Paid via ${successfulPayment.gateway}` : "Payment pending"}{successfulPayment?.gateway_payment_id ? ` · ${successfulPayment.gateway_payment_id}` : ""}</div>
      </div>
    </DashboardShell>
  );
}
