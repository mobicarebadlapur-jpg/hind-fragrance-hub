import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "./_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-DMPreFkr.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { D as DashboardShell, E as EmptyState, S as StatusPill } from "./_ssr/DashboardShell-CDdOn0xK.mjs";
import { B as Button } from "./_ssr/SiteHeader-jDQ4_J-a.mjs";
import { i as inr, s as shortDate } from "./_ssr/format-BY29FUB1.mjs";
import { g as getCustomerOrderDetail } from "./_ssr/orders.functions-dU58mwV4.mjs";
import { r as requestOrderCancellationOrRefund } from "./_ssr/refunds.functions-BCJgJCZB.mjs";
import { c as Route } from "./_ssr/router-BNTsyRpR.mjs";
import "./_libs/seroval.mjs";
import { j as ArrowLeft, P as Package, k as CreditCard, l as Circle, m as Truck, e as Check, f as RotateCcw, n as MapPin, o as Printer } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_ssr/server-aKsQTMQw.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_ssr/auth-middleware-Cs6le4K7.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/zod.mjs";
const steps = [{
  key: "placed",
  label: "Order placed",
  icon: Package
}, {
  key: "paid",
  label: "Payment confirmed",
  icon: CreditCard
}, {
  key: "processing",
  label: "Processing",
  icon: Circle
}, {
  key: "shipped",
  label: "Shipped",
  icon: Truck
}, {
  key: "delivered",
  label: "Delivered",
  icon: Check
}];
const rank = {
  created: 0,
  payment_pending: 0,
  paid: 1,
  processing: 2,
  shipped: 3,
  delivered: 4
};
function OrderDetail() {
  const {
    orderId
  } = Route.useParams();
  const queryClient = useQueryClient();
  const getDetail = useServerFn(getCustomerOrderDetail);
  const requestRefund = useServerFn(requestOrderCancellationOrRefund);
  const [reason, setReason] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["customer-order", orderId],
    queryFn: () => getDetail({
      data: {
        orderId
      }
    })
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: "Order details", subtitle: "Loading your order…", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 animate-pulse rounded-xl border border-border bg-card" }) });
  if (!data?.ok) return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardShell, { title: "Order not found", subtitle: "This order is unavailable or does not belong to your account.", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "We couldn't find that order." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", children: "Back to account" }) })
  ] });
  const {
    order,
    items,
    transactions
  } = data;
  const currentRank = rank[order.status] ?? 0;
  const cancelled = order.status === "cancelled" || order.status === "refunded";
  const successfulPayment = transactions.find((tx) => tx.status === "success");
  const canCancel = ["created", "payment_pending"].includes(order.status) && !order.refund_status;
  const canRequestRefund = ["paid", "processing", "shipped", "delivered"].includes(order.status) && !order.refund_status;
  const hasRefundRequest = ["requested", "approved"].includes(order.refund_status ?? "");
  async function submitRequest() {
    if (reason.trim().length < 5) return toast.error("Please enter a short reason (at least 5 characters).");
    setSubmitting(true);
    const result = await requestRefund({
      data: {
        orderId,
        reason
      }
    });
    setSubmitting(false);
    if (!result.ok) return toast.error(result.error);
    toast.success(result.mode === "cancelled" ? "Order cancelled." : "Refund request submitted.");
    setReason("");
    await queryClient.invalidateQueries({
      queryKey: ["customer-order", orderId]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardShell, { title: `Order ${order.order_number}`, subtitle: shortDate(order.created_at), actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => window.print(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-2 h-4 w-4" }),
    "Print / Save PDF"
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/account", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "My orders"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: order.status })
    ] }),
    cancelled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm", children: [
      "This order is ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: order.status }),
      ". ",
      order.refund_status === "paid" ? "Refund has been processed." : "Please contact support if you need further help."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6 rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Order tracking" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid gap-4 sm:grid-cols-5", children: steps.map((step, index) => {
        const active = currentRank >= index;
        const Icon = step.icon;
        const pendingPayment = step.key === "paid" && order.status === "payment_pending";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:block sm:text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mx-auto flex h-10 w-10 items-center justify-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: step.label }),
          pendingPayment && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Awaiting payment" })
        ] }, step.key);
      }) })
    ] }),
    (order.refund_status || hasRefundRequest) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-xl border border-border bg-card p-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
        "Refund status: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: order.refund_status })
      ] }),
      order.refund_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-muted-foreground", children: [
        "Reason: ",
        order.refund_reason
      ] }),
      order.refund_payment_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-muted-foreground", children: [
        "Refund ID: ",
        order.refund_payment_id
      ] })
    ] }),
    (canCancel || canRequestRefund) && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6 rounded-xl border border-border bg-card p-5 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
        canCancel ? "Cancel order" : "Request refund"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: canCancel ? "This order has not been paid yet, so it can be cancelled immediately." : "Submit a refund request for the full order amount. An admin will review it before the payment is refunded." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "mt-4 min-h-24 w-full rounded-md border bg-background p-3 text-sm", value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Reason for cancellation / refund", maxLength: 500 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-3", onClick: submitRequest, disabled: submitting, children: submitting ? "Submitting…" : canCancel ? "Cancel order" : "Request refund" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.5fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6 print:space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 divide-y divide-border", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4 py-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: item.product_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
                item.quantity,
                " × ",
                inr(item.unit_price)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: inr(item.line_total) })
          ] }, item.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2 border-t border-border pt-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inr(order.subtotal) })
            ] }),
            Number(order.discount) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "-",
                inr(order.discount)
              ] })
            ] }),
            Number(order.tax) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inr(order.tax) })
            ] }),
            Number(order.shipping) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inr(order.shipping) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-2 text-base font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inr(order.total) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Payment history" }),
          transactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "No payment transaction is recorded yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 divide-y divide-border", children: transactions.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between gap-3 py-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium capitalize", children: tx.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
                tx.gateway,
                " · ",
                shortDate(tx.created_at),
                tx.gateway_payment_id ? ` · ${tx.gateway_payment_id}` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: inr(tx.amount) })
          ] }, tx.id)) }),
          successfulPayment && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
            "Payment ID: ",
            successfulPayment.gateway_payment_id ?? "—"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            "Delivery address"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: order.shipping_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: order.mobile }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: order.address }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              order.city,
              ", ",
              order.state,
              " — ",
              order.pincode
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Invoice / receipt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Use your browser's print dialog to print this receipt or save it as a PDF." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-4 w-full", onClick: () => window.print(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-2 h-4 w-4" }),
            "Print invoice"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 hidden border-t border-border pt-6 print:block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "Hind Fragrance Hub" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        "Invoice / Payment Receipt · ",
        order.order_number
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          order.shipping_name,
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          order.mobile
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Order date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          shortDate(order.created_at),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Status: ",
          order.status
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 text-sm", children: [
        "Payment: ",
        successfulPayment ? `Paid via ${successfulPayment.gateway}` : "Payment pending",
        successfulPayment?.gateway_payment_id ? ` · ${successfulPayment.gateway_payment_id}` : ""
      ] })
    ] })
  ] });
}
export {
  OrderDetail as component
};
