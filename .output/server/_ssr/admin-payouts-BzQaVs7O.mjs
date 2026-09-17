import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-DMPreFkr.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as DashboardShell, E as EmptyState, S as StatusPill } from "./DashboardShell-CDdOn0xK.mjs";
import { a as useIsAdmin, B as Button } from "./SiteHeader-jDQ4_J-a.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
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
import "./format-BY29FUB1.mjs";
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
import "../_libs/lucide-react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
const payoutStatus = enumType(["requested", "under_review", "approved", "processing", "paid", "rejected"]);
const listAdminPayouts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("36318e3d34331c6d023e650a11994835c333f34cb680f3f603c07658a671ce78"));
const updateAdminPayout = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  payoutId: stringType().uuid(),
  status: payoutStatus,
  notes: stringType().trim().max(300).nullable().optional()
}).parse(input)).handler(createSsrRpc("45d5c35069e008d6497afe240e19889a0f0f977c34b40a748ee36bbf9a592d6a"));
const STATUSES = ["requested", "under_review", "approved", "processing", "paid", "rejected"];
function AdminPayouts() {
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();
  const list = useServerFn(listAdminPayouts);
  const update = useServerFn(updateAdminPayout);
  const [busy, setBusy] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("all");
  const [notes, setNotes] = reactExports.useState({});
  const payoutsQuery = useQuery({
    queryKey: ["admin-payouts"],
    enabled: isAdmin,
    queryFn: async () => {
      const result = await list();
      if (!result.ok) throw new Error(result.error);
      return result.payouts;
    }
  });
  async function changeStatus(id, status) {
    setBusy(id);
    try {
      const result = await update({
        data: {
          payoutId: id,
          status,
          notes: notes[id]?.trim() || null
        }
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Payout marked ${status.replace("_", " ")}.`);
      await queryClient.invalidateQueries({
        queryKey: ["admin-payouts"]
      });
    } catch {
      toast.error("Could not update payout.");
    } finally {
      setBusy(null);
    }
  }
  const payouts = (payoutsQuery.data ?? []).filter((p) => filter === "all" || p.status === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardShell, { title: "Partner payouts", subtitle: "Review and process commission withdrawal requests.", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Payout queue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Paid requests automatically consume the oldest available commissions for that partner." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "rounded-md border bg-background px-3 py-2 text-sm", value: filter, onChange: (e) => setFilter(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All statuses" }),
          STATUSES.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: status, children: status.replace("_", " ") }, status))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => void payoutsQuery.refetch(), disabled: payoutsQuery.isFetching, children: "Refresh" })
      ] })
    ] }),
    payoutsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading payouts…" }) : payoutsQuery.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Could not load payouts." }) : payouts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No payout requests match this filter." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: payouts.map((payout) => {
      const partner = payout.partners;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              "₹",
              Number(payout.amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: payout.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(payout.created_at).toLocaleString("en-IN") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-3 text-sm md:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Partner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: partner?.partner_code ?? payout.partner_id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Method" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: String(payout.method ?? "—").toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Payment destination" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: payout.method === "upi" ? payout.upi_id_masked ?? "—" : `${payout.bank_name ?? "Bank"} · ****${payout.account_number_last4 ?? ""}` })
            ] })
          ] }),
          payout.account_holder && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
            "Account holder: ",
            payout.account_holder
          ] }),
          payout.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 rounded-md bg-secondary px-3 py-2 text-xs", children: [
            "Notes: ",
            payout.notes
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-2 xl:max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full rounded-md border bg-background px-3 py-2 text-sm", placeholder: "Admin note (optional)", maxLength: 300, value: notes[payout.id] ?? "", onChange: (e) => setNotes((current) => ({
            ...current,
            [payout.id]: e.target.value
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full rounded-md border bg-background px-3 py-2 text-sm", value: payout.status, disabled: busy === payout.id || payout.status === "paid", onChange: (e) => void changeStatus(payout.id, e.target.value), children: STATUSES.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: status, children: status.replace("_", " ") }, status)) }),
          busy === payout.id && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Updating…" })
        ] })
      ] }) }, payout.id);
    }) })
  ] });
}
export {
  AdminPayouts as component
};
