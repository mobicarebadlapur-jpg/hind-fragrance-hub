import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-D_SPKSHh.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { Q as QRCode } from "../_libs/qrcode.mjs";
import { D as DashboardShell, d as StatCard, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, E as EmptyState, S as StatusPill } from "./tabs-Bny0egfj.mjs";
import { u as useSession, B as Button } from "./SiteHeader-tTtsvzPr.mjs";
import { I as Input } from "./input-22kOhlYF.mjs";
import { L as Label } from "./label-FD-FCZAk.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DQj2ZNaA.mjs";
import { r as referralUrl, s as supabase } from "./router-DwfUMIJt.mjs";
import { i as inr, s as shortDate, d as downloadCsv } from "./format-BY29FUB1.mjs";
import { c as createServerFn } from "./server-CrL2kZQg.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-VIvM2KcA.mjs";
import "../_libs/seroval.mjs";
import { D as Download, f as Copy } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "fs";
import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
const payoutSchema = objectType({
  amount: numberType().positive().max(1e6),
  method: enumType(["bank", "upi"]),
  accountHolder: stringType().trim().max(100).optional(),
  bankName: stringType().trim().max(100).optional(),
  accountNumber: stringType().trim().max(30).optional(),
  ifsc: stringType().trim().max(20).optional(),
  upiId: stringType().trim().max(60).optional()
});
const getPartnerBalance = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("44b55c12a99f027b52a99e0c7d22bb9e90405f6e55d91cb56c40afce0edd8db9"));
const requestPayout = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => payoutSchema.parse(input)).handler(createSsrRpc("e8d18f8d1d96cbdfb3bef5ec00e6ae7d3e21760252dd97c94b5f26794a5df23f"));
function PartnerDashboard() {
  const {
    data: session,
    isPending
  } = useSession();
  const partner = session?.partner ?? null;
  const queryClient = useQueryClient();
  const balanceFn = useServerFn(getPartnerBalance);
  const payoutFn = useServerFn(requestPayout);
  const {
    data: balance
  } = useQuery({
    queryKey: ["partner-balance", partner?.id],
    enabled: Boolean(partner),
    queryFn: () => balanceFn({})
  });
  const {
    data: stats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ["partner-stats", partner?.id],
    enabled: Boolean(partner),
    queryFn: async () => {
      const [clicks, orders, commissions2, payouts, assets, products] = await Promise.all([supabase.from("referral_clicks").select("id", {
        count: "exact",
        head: true
      }).eq("partner_id", partner.id), supabase.from("orders").select("id,order_number,total,status,created_at").eq("partner_id", partner.id).order("created_at", {
        ascending: false
      }), supabase.from("commissions").select("*, orders(order_number)").eq("partner_id", partner.id).order("created_at", {
        ascending: false
      }), supabase.from("payouts").select("id,partner_id,amount,method,account_holder,bank_name,status,notes,created_at,updated_at,account_number_last4,upi_id_masked,ifsc_masked").eq("partner_id", partner.id).order("created_at", {
        ascending: false
      }), supabase.from("marketing_assets").select("*").eq("status", "active"), supabase.from("products").select("id,name,slug").eq("status", "active").order("name", {
        ascending: true
      })]);
      return {
        clicks: clicks.count ?? 0,
        orders: orders.data ?? [],
        commissions: commissions2.data ?? [],
        payouts: payouts.data ?? [],
        assets: assets.data ?? [],
        products: products.data ?? []
      };
    }
  });
  const [payout, setPayout] = reactExports.useState({
    amount: "",
    method: "upi",
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: ""
  });
  const [busy, setBusy] = reactExports.useState(false);
  const [productSlug, setProductSlug] = reactExports.useState("__store");
  const [qrDataUrl, setQrDataUrl] = reactExports.useState(null);
  const shareLink = reactExports.useMemo(() => {
    if (!partner) return "";
    return referralUrl(partner.referral_code, productSlug === "__store" ? "/" : `/product/${productSlug}`);
  }, [partner, productSlug]);
  reactExports.useEffect(() => {
    if (!shareLink) return;
    let active = true;
    void QRCode.toDataURL(shareLink, {
      width: 320,
      margin: 1
    }).then((url) => {
      if (active) setQrDataUrl(url);
    });
    return () => {
      active = false;
    };
  }, [shareLink]);
  if (isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: "Partner dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) });
  }
  if (!partner || partner.status !== "active") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: "Partner dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: partner ? `Your partner account is currently ${partner.status}. Contact support for help.` : "You are not a Business Partner yet." }),
      !partner && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/join", children: "Join for ₹199" }) })
    ] }) });
  }
  const link = referralUrl(partner.referral_code);
  const commissions = stats?.commissions ?? [];
  const earned = commissions.filter((c) => c.status !== "reversed").reduce((s, c) => s + Number(c.amount), 0);
  const pending = commissions.filter((c) => c.status === "pending").reduce((s, c) => s + Number(c.amount), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardShell, { title: "Partner dashboard", subtitle: `Partner ID ${partner.partner_code} · Referral code ${partner.referral_code}`, actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "gold", onClick: () => {
    void navigator.clipboard.writeText(link);
    toast.success("Referral link copied");
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-2 h-4 w-4" }),
    " Copy referral link"
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Referral clicks", value: stats?.clicks ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Referred orders", value: stats?.orders.length ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total commission", value: earned, currency: true, hint: `${inr(pending)} pending` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Available to withdraw", value: balance?.available ?? 0, currency: true, hint: `Min payout ${inr(balance?.minPayout ?? 0)}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "links", className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "links", children: "Referral tools" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "orders", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "earnings", children: "Earnings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "payouts", children: "Payouts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "marketing", children: "Marketing" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "links", className: "mt-6 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", children: "Your referral link" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "min-w-0 flex-1 truncate rounded-md bg-secondary px-3 py-2 text-xs", children: shareLink }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => {
            void navigator.clipboard.writeText(shareLink);
            toast.success("Copied");
          }, children: "Copy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/?text=${encodeURIComponent(`Shop alcohol-free attars from Hind Fragrance: ${shareLink}`)}`, target: "_blank", rel: "noreferrer", children: "Share on WhatsApp" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-5 sm:grid-cols-[220px_1fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: qrDataUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: qrDataUrl, alt: `QR code for referral link ${shareLink}`, className: "h-40 w-40 rounded-lg border border-border bg-white p-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: qrDataUrl, download: `${partner.referral_code}-qr.png`, children: "Download QR" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 w-40 animate-pulse rounded-lg border border-border bg-secondary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Link a specific product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: productSlug, onValueChange: setProductSlug, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Whole store" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__store", children: "Whole store (home page)" }),
                (stats?.products ?? []).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: product.slug, children: product.name }, product.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Attribution uses last click within 30 days. Self-referred orders never earn commission." })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "orders", className: "mt-6", children: statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading orders…" }) : (stats?.orders.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No referred orders yet. Share your link to get started." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { headers: ["Order", "Date", "Status", "Value"], rows: (stats?.orders ?? []).map((o) => [o.order_number, shortDate(o.created_at), /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: o.status }, o.id), inr(o.total)]) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "earnings", className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => downloadCsv("commissions.csv", commissions.map((c) => ({
          order: c.orders?.order_number ?? "",
          amount: c.amount,
          percent: c.percent,
          status: c.status,
          date: c.created_at
        }))), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
          " Export CSV"
        ] }) }),
        commissions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No commission entries yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { headers: ["Order", "Base", "Rate", "Commission", "Status", "Date"], rows: commissions.map((c) => [c.orders?.order_number ?? "—", inr(c.order_amount), `${c.percent}%`, inr(c.amount), /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: c.status }, c.id), shortDate(c.created_at)]) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "payouts", className: "mt-6 grid gap-6 lg:grid-cols-[360px_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "h-fit space-y-4 rounded-xl border border-border bg-card p-6", onSubmit: async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const res = await payoutFn({
              data: {
                amount: Number(payout.amount),
                method: payout.method,
                accountHolder: payout.accountHolder || void 0,
                bankName: payout.bankName || void 0,
                accountNumber: payout.accountNumber || void 0,
                ifsc: payout.ifsc || void 0,
                upiId: payout.upiId || void 0
              }
            });
            if (!res.ok) {
              toast.error(res.error);
              return;
            }
            toast.success("Payout requested");
            setPayout({
              ...payout,
              amount: ""
            });
            await queryClient.invalidateQueries({
              queryKey: ["partner-stats"]
            });
            await queryClient.invalidateQueries({
              queryKey: ["partner-balance"]
            });
          } catch {
            toast.error("Could not submit payout request.");
          } finally {
            setBusy(false);
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Request payout" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "decimal", value: payout.amount, onChange: (e) => setPayout({
              ...payout,
              amount: e.target.value.replace(/[^\d.]/g, "")
            }), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: payout.method, onValueChange: (v) => setPayout({
              ...payout,
              method: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "upi", children: "UPI" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bank", children: "Bank transfer" })
              ] })
            ] })
          ] }),
          payout.method === "upi" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "UPI ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: payout.upiId, maxLength: 60, onChange: (e) => setPayout({
              ...payout,
              upiId: e.target.value
            }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Account holder", value: payout.accountHolder, maxLength: 100, onChange: (e) => setPayout({
              ...payout,
              accountHolder: e.target.value
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Bank name", value: payout.bankName, maxLength: 100, onChange: (e) => setPayout({
              ...payout,
              bankName: e.target.value
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Account number", value: payout.accountNumber, maxLength: 30, onChange: (e) => setPayout({
              ...payout,
              accountNumber: e.target.value
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "IFSC", value: payout.ifsc, maxLength: 20, onChange: (e) => setPayout({
              ...payout,
              ifsc: e.target.value.toUpperCase()
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Submitting…" : "Request payout" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: (stats?.payouts.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No payout requests yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { headers: ["Date", "Amount", "Method", "Status"], rows: (stats?.payouts ?? []).map((p) => [shortDate(p.created_at), inr(p.amount), p.method.toUpperCase(), /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: p.status }, p.id)]) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "marketing", className: "mt-6", children: (stats?.assets.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Marketing material will appear here once the admin uploads it." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: (stats?.assets ?? []).map((asset) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: asset.file_url ?? asset.image_url ?? "#", target: "_blank", rel: "noreferrer", className: "rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: asset.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-display text-xl", children: asset.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Open / download" })
      ] }, asset.id)) }) })
    ] })
  ] });
}
function Table({
  headers,
  rows
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[520px] text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: headers.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: h }, h)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-t border-border", children: row.map((cell, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: cell }, j)) }, i)) })
  ] }) });
}
export {
  PartnerDashboard as component
};
