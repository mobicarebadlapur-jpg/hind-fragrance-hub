import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-DMPreFkr.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as DashboardShell, E as EmptyState, S as StatusPill } from "./DashboardShell-CDdOn0xK.mjs";
import { B as Button } from "./SiteHeader-jDQ4_J-a.mjs";
import { p as processAdminRefund, l as listAdminRefundRequests } from "./refunds.functions-BCJgJCZB.mjs";
import { s as shortDate, i as inr } from "./format-BY29FUB1.mjs";
import "../_libs/seroval.mjs";
import { R as RefreshCw, f as RotateCcw, g as CircleX } from "../_libs/lucide-react.mjs";
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
import "./auth-middleware-Cs6le4K7.mjs";
function AdminRefundsPage() {
  const queryClient = useQueryClient();
  const list = useServerFn(listAdminRefundRequests);
  const process = useServerFn(processAdminRefund);
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["admin-refunds"],
    queryFn: () => list()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardShell, { title: "Refund requests", subtitle: "Review customer cancellation and refund requests.", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => window.location.assign("/admin"), children: "Back to admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => refetch(), disabled: isLoading, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
        "Refresh"
      ] })
    ] }),
    !data?.ok || !data.refunds.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No pending refunds. New customer refund requests will appear here." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: data.refunds.map((refund) => /* @__PURE__ */ jsxRuntimeExports.jsx(RefundCard, { refund, onProcess: async (decision, note) => {
      const result = await process({
        data: {
          orderId: refund.id,
          decision,
          note
        }
      });
      if (!result.ok) return toast.error(result.error);
      toast.success(decision === "approved" ? "Refund processed." : "Refund request rejected.");
      await queryClient.invalidateQueries({
        queryKey: ["admin-refunds"]
      });
    } }, refund.id)) })
  ] });
}
function RefundCard({
  refund,
  onProcess
}) {
  const [note, setNote] = reactExports.useState("");
  const approved = refund.refund_status === "approved";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: refund.order_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: approved ? "approved" : "requested" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          refund.shipping_name,
          " · ",
          refund.mobile
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Requested ",
          shortDate(refund.refund_requested_at)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: inr(refund.refund_requested_amount ?? refund.total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Full order refund" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-lg bg-muted/50 p-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Reason:" }),
      " ",
      refund.refund_reason || "No reason provided"
    ] }),
    approved && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm", children: "Refund is already approved and can be safely resumed. If the gateway refund reference was saved, retry will not create a second refund." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "mt-4 min-h-20 w-full rounded-md border bg-background p-3 text-sm", value: note, onChange: (e) => setNote(e.target.value), placeholder: "Optional admin note", maxLength: 300 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => onProcess("approved", note), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "mr-2 h-4 w-4" }),
        approved ? "Resume refund" : "Approve & refund"
      ] }),
      !approved && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => onProcess("rejected", note), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "mr-2 h-4 w-4" }),
        "Reject"
      ] })
    ] })
  ] });
}
export {
  AdminRefundsPage as component
};
