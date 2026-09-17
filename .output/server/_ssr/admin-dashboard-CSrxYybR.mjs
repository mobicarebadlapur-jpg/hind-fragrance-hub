import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-DMPreFkr.mjs";
import { B as Button } from "./SiteHeader-jDQ4_J-a.mjs";
import { D as DashboardShell, E as EmptyState } from "./DashboardShell-CDdOn0xK.mjs";
import { g as getAdminDashboardSummary } from "./admin.functions-Ga6eB7B3.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./server-aKsQTMQw.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./router-BNTsyRpR.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/lucide-react.mjs";
import "./format-BY29FUB1.mjs";
import "./auth-middleware-Cs6le4K7.mjs";
function money(value) {
  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })}`;
}
function AdminDashboard() {
  const getSummary = useServerFn(getAdminDashboardSummary);
  const query = useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: async () => {
      const result = await getSummary();
      if (!result.ok) throw new Error(result.error);
      return result.summary;
    }
  });
  const s = query.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: "Admin Dashboard", subtitle: "Financial & operational overview", children: query.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading dashboard…" }) : query.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Could not load dashboard summary." }) : !s ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No dashboard data." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => void query.refetch(), disabled: query.isFetching, children: query.isFetching ? "Refreshing…" : "Refresh" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { title: "Net sales", value: money(s.revenue), detail: `${s.paidOrders} paid orders` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { title: "Total orders", value: String(s.totalOrders), detail: `${s.pendingPayments ? money(s.pendingPayments) : "₹0"} payment pending` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { title: "Commission liability", value: money(s.commissionsPending + s.commissionsApproved + s.commissionsAvailable), detail: `${money(s.commissionsAvailable)} available` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { title: "Active partners", value: String(s.activePartners), detail: `${s.pendingPartners} applications pending` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: "Commission ledger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Pending", value: money(s.commissionsPending) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Approved", value: money(s.commissionsApproved) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Available", value: money(s.commissionsAvailable) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Paid", value: money(s.commissionsPaid) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: "Operations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Active products", value: String(s.activeProducts) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Low stock ≤ 5", value: String(s.lowStockProducts) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Pending payments", value: money(s.pendingPayments) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Cancelled/refunded", value: money(s.cancelledRevenue) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: "Recent orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: s.recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No orders yet." }) : s.recent.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: order.order_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(order.created_at).toLocaleString("en-IN") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-muted-foreground", children: order.status.replace("_", " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: money(Number(order.total)) })
        ] })
      ] }, order.id)) })
    ] })
  ] }) });
}
function Metric({
  title,
  value,
  detail
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-display text-2xl", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: detail })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-medium", children: value })
  ] });
}
export {
  AdminDashboard as component
};
