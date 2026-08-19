import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-D_SPKSHh.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as DashboardShell, E as EmptyState, d as StatCard, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, S as StatusPill } from "./tabs-Bny0egfj.mjs";
import { u as useSession, a as useIsAdmin, B as Button, c as cn } from "./SiteHeader-tTtsvzPr.mjs";
import { I as Input } from "./input-22kOhlYF.mjs";
import { L as Label } from "./label-FD-FCZAk.mjs";
import { D as Dialog$1, a as DialogTrigger$1, b as DialogPortal$1, c as DialogContent$1, d as DialogClose, e as DialogTitle$1, f as DialogOverlay$1, g as DialogDescription$1 } from "../_libs/radix-ui__react-dialog.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DQj2ZNaA.mjs";
import { s as supabase } from "./router-DwfUMIJt.mjs";
import { s as shortDate, d as downloadCsv, i as inr } from "./format-BY29FUB1.mjs";
import { c as createServerFn } from "./server-CrL2kZQg.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-VIvM2KcA.mjs";
import "../_libs/seroval.mjs";
import { D as Download, P as Plus, X } from "../_libs/lucide-react.mjs";
import { o as objectType, e as enumType, s as stringType, b as booleanType, n as numberType, r as recordType, u as unknownType } from "../_libs/zod.mjs";
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
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
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
const Dialog = Dialog$1;
const DialogTrigger = DialogTrigger$1;
const DialogPortal = DialogPortal$1;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogOverlay$1,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogOverlay$1.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent$1,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogContent$1.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogTitle$1,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogTitle$1.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogDescription$1,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogDescription$1.displayName;
const updateSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  key: stringType().min(2).max(40),
  value: recordType(unknownType())
}).parse(input)).handler(createSsrRpc("742f70fd777ae551ad3e3d3d2db22cdd962f265a6451e0c71a29e8525bb6c8b6"));
const updatePartnerStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  partnerId: stringType().uuid(),
  status: enumType(["pending", "payment_pending", "active", "suspended", "cancelled"])
}).parse(input)).handler(createSsrRpc("bb217f220b6ee2e07fd572ac6c94b91d49f4222202511ecfdf722c60f9f152ad"));
const updateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  status: enumType(["created", "payment_pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded", "returned"])
}).parse(input)).handler(createSsrRpc("573e69518e877f2ce18e3820832cb2cb45d1a897de1933c05de86f50fa9a7e10"));
const updateCommissionStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  commissionId: stringType().uuid(),
  status: enumType(["pending", "approved", "available", "paid", "cancelled", "reversed"])
}).parse(input)).handler(createSsrRpc("1e39cb8e06d355ded8768a07115b74652c5439362be7608be835a970634affaf"));
const updatePayoutStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  payoutId: stringType().uuid(),
  status: enumType(["requested", "under_review", "approved", "processing", "paid", "rejected"]),
  notes: stringType().trim().max(300).optional()
}).parse(input)).handler(createSsrRpc("fbd372f9e2bf2e908d56e8f9a0c668d730c5610addadcf26b768c2651bb3d692"));
const upsertProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid().optional(),
  name: stringType().trim().min(2).max(120),
  slug: stringType().trim().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and dashes"),
  sku: stringType().trim().min(2).max(40),
  category: stringType().trim().min(2).max(40),
  short_description: stringType().trim().max(200).optional(),
  description: stringType().trim().max(2e3).optional(),
  image_url: stringType().trim().max(500).optional().nullable(),
  price: numberType().positive(),
  sale_price: numberType().positive().nullable().optional(),
  stock: numberType().int().min(0),
  status: enumType(["active", "inactive"]),
  featured: booleanType(),
  commission_percent: numberType().min(0).max(80).nullable().optional()
}).parse(input)).handler(createSsrRpc("87057b699c92d5e9cc4f021e767a44009606525481c8a27886c5fc0375dc6625"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid().optional(),
  title: stringType().trim().min(2).max(120),
  description: stringType().trim().max(400).optional(),
  category: stringType().trim().min(2).max(40),
  image_url: stringType().trim().max(500).optional().nullable(),
  body_text: stringType().trim().max(1200).optional(),
  status: enumType(["active", "inactive"])
}).parse(input)).handler(createSsrRpc("2f46a1d5dd660888216940456c90ada664f49d8ff7264050c40b4d63e7ddabae"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("77b01287e528732195ab708a742ff87badd7ccaceae23dd75d6fe75d168caf1b"));
const setCustomerBlocked = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  blocked: booleanType()
}).parse(input)).handler(createSsrRpc("2307164cc2eaa44278ff5f5ea43d5a8da63ec996663aa63c91b01f749276ba85"));
const ORDER_STATUSES = ["created", "payment_pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded", "returned"];
const PARTNER_STATUSES = ["pending", "payment_pending", "active", "suspended", "cancelled"];
const COMMISSION_STATUSES = ["pending", "approved", "available", "paid", "cancelled", "reversed"];
const PAYOUT_STATUSES = ["requested", "under_review", "approved", "processing", "paid", "rejected"];
function AdminConsole() {
  const {
    isPending
  } = useSession();
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();
  const saveSetting = useServerFn(updateSetting);
  const setPartner = useServerFn(updatePartnerStatus);
  const setOrder = useServerFn(updateOrderStatus);
  const setCommission = useServerFn(updateCommissionStatus);
  const setPayout = useServerFn(updatePayoutStatus);
  const setBlocked = useServerFn(setCustomerBlocked);
  const saveProduct = useServerFn(upsertProduct);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-data"],
    enabled: Boolean(isAdmin),
    queryFn: async () => {
      const [partners, orders, commissions, payouts, customers, settings, products, auditLogs] = await Promise.all([supabase.from("partners").select("*").order("created_at", {
        ascending: false
      }), supabase.from("orders").select("*, order_items(*)").order("created_at", {
        ascending: false
      }), supabase.from("commissions").select("*, partners(partner_code), orders(order_number)").order("created_at", {
        ascending: false
      }), supabase.from("payouts").select("id,partner_id,amount,method,account_holder,bank_name,status,notes,created_at,updated_at,account_number_last4,upi_id_masked,ifsc_masked, partners(partner_code)").order("created_at", {
        ascending: false
      }), supabase.from("profiles").select("*").order("created_at", {
        ascending: false
      }).limit(200), supabase.from("app_settings").select("*"), supabase.from("products").select("*").order("created_at", {
        ascending: false
      }), supabase.from("audit_logs").select("*").order("created_at", {
        ascending: false
      }).limit(100)]);
      return {
        partners: partners.data ?? [],
        orders: orders.data ?? [],
        commissions: commissions.data ?? [],
        payouts: payouts.data ?? [],
        customers: customers.data ?? [],
        settings: settings.data ?? [],
        products: products.data ?? [],
        auditLogs: auditLogs.data ?? []
      };
    }
  });
  const commissionSetting = data?.settings.find((s) => s.key === "commission")?.value;
  const membershipSetting = data?.settings.find((s) => s.key === "membership")?.value;
  const [form, setForm] = reactExports.useState({
    default_percent: "10",
    min_payout: "500",
    holding_days: "7",
    membership_price: "199"
  });
  reactExports.useEffect(() => {
    if (!commissionSetting && !membershipSetting) return;
    setForm({
      default_percent: String(commissionSetting?.["default_percent"] ?? 10),
      min_payout: String(commissionSetting?.["min_payout"] ?? 500),
      holding_days: String(commissionSetting?.["holding_days"] ?? 7),
      membership_price: String(membershipSetting?.["price"] ?? 199)
    });
  }, [commissionSetting, membershipSetting]);
  const refresh = () => queryClient.invalidateQueries({
    queryKey: ["admin-data"]
  });
  async function run(action, message) {
    try {
      const res = await action;
      if (!res.ok) {
        toast.error(res.error ?? "Action failed");
        return;
      }
      toast.success(message);
      await refresh();
    } catch {
      toast.error("Action failed. Please try again.");
    }
  }
  if (isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: "Admin console", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: "Admin console", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "You do not have access to the admin console." }) });
  }
  const revenue = (data?.orders ?? []).filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status)).reduce((s, o) => s + Number(o.total), 0);
  const commissionTotal = (data?.commissions ?? []).filter((c) => c.status !== "reversed").reduce((s, c) => s + Number(c.amount), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardShell, { title: "Admin console", subtitle: "Operations, partners and platform settings", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Partners", value: data?.partners.length ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Orders", value: data?.orders.length ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Revenue", value: revenue, currency: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Commission payable", value: commissionTotal, currency: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "partners", className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "partners", children: "Partners" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "orders", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "commissions", children: "Commissions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "payouts", children: "Payouts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "customers", children: "Customers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "products", children: "Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "settings", children: "Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "audit", children: "Audit log" })
      ] }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-sm text-muted-foreground", children: "Loading data…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "partners", className: "mt-6 space-y-3", children: [
        (data?.partners ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No partners yet." }),
        (data?.partners ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: `${p.partner_code} · ${p.referral_code}`, meta: `Joined ${shortDate(p.created_at)}`, status: p.status, options: PARTNER_STATUSES, onChange: (status) => run(setPartner({
          data: {
            partnerId: p.id,
            status
          }
        }), "Partner updated") }, p.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "orders", className: "mt-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => downloadCsv("orders.csv", (data?.orders ?? []).map((o) => ({
          order: o.order_number,
          total: o.total,
          status: o.status,
          date: o.created_at
        }))), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
          " Export CSV"
        ] }) }),
        (data?.orders ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No orders yet." }),
        (data?.orders ?? []).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: `${o.order_number} · ${inr(o.total)}`, meta: `${o.referral_code ? `Ref ${o.referral_code} · ` : ""}${shortDate(o.created_at)}`, status: o.status, options: ORDER_STATUSES, onChange: (status) => run(setOrder({
          data: {
            orderId: o.id,
            status
          }
        }), "Order updated") }, o.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "commissions", className: "mt-6 space-y-3", children: [
        (data?.commissions ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No commissions yet." }),
        (data?.commissions ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: `${inr(c.amount)} · ${c.percent}%`, meta: `${c.partners?.partner_code ?? ""} · ${c.orders?.order_number ?? ""}`, status: c.status, options: COMMISSION_STATUSES, onChange: (status) => run(setCommission({
          data: {
            commissionId: c.id,
            status
          }
        }), "Commission updated") }, c.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "payouts", className: "mt-6 space-y-3", children: [
        (data?.payouts ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No payout requests." }),
        (data?.payouts ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: `${inr(p.amount)} · ${p.method.toUpperCase()}`, meta: `${p.partners?.partner_code ?? ""} · ${shortDate(p.created_at)} · ${p.method === "upi" ? `UPI ${p.upi_id_masked ?? "—"}` : `${p.bank_name ?? "Bank"} ${p.account_number_last4 ? `••••${p.account_number_last4}` : "—"} · IFSC ${p.ifsc_masked ?? "—"}`}${p.account_holder ? ` · ${p.account_holder}` : ""}`, status: p.status, options: PAYOUT_STATUSES, onChange: (status) => run(setPayout({
          data: {
            payoutId: p.id,
            status
          }
        }), "Payout updated") }, p.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "customers", className: "mt-6 space-y-3", children: [
        !isLoading && (data?.customers ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No customers yet." }),
        (data?.customers ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: c.full_name || c.email || "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              c.email,
              " ",
              c.mobile ? `· ${c.mobile}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: c.blocked ? "blocked" : "active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => run(setBlocked({
              data: {
                userId: c.id,
                blocked: !c.blocked
              }
            }), c.blocked ? "Customer unblocked" : "Customer blocked"), children: c.blocked ? "Unblock" : "Block" })
          ] })
        ] }, c.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "products", className: "mt-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductDialog, { trigger: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          " New product"
        ] }), onSave: (payload) => run(saveProduct({
          data: payload
        }), "Product saved") }, "new-product") }),
        !isLoading && (data?.products ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No products yet. Create your first product." }),
        (data?.products ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              p.category,
              " · ",
              p.sku,
              " · stock ",
              p.stock,
              " · commission",
              " ",
              p.commission_percent ?? form.default_percent,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: p.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: inr(p.sale_price ?? p.price) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProductDialog, { product: p, trigger: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", children: "Edit" }), onSave: (payload) => run(saveProduct({
              data: payload
            }), "Product saved") })
          ] })
        ] }, p.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "settings", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2", onSubmit: async (e) => {
        e.preventDefault();
        await run(saveSetting({
          data: {
            key: "commission",
            value: {
              ...commissionSetting ?? {},
              default_percent: Number(form.default_percent),
              min_payout: Number(form.min_payout),
              holding_days: Number(form.holding_days)
            }
          }
        }), "Commission settings saved");
        await run(saveSetting({
          data: {
            key: "membership",
            value: {
              ...membershipSetting ?? {},
              price: Number(form.membership_price)
            }
          }
        }), "Membership settings saved");
      }, children: [
        [["default_percent", "Default commission %"], ["min_payout", "Minimum payout (₹)"], ["holding_days", "Holding period (days)"], ["membership_price", "Membership price (₹)"]].map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: key, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: key, inputMode: "decimal", value: form[key], onChange: (e) => setForm({
            ...form,
            [key]: e.target.value.replace(/[^\d.]/g, "")
          }) })
        ] }, key)),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "sm:col-span-2", children: "Save settings" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "audit", className: "mt-6 space-y-3", children: [
        !isLoading && (data?.auditLogs ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No admin activity recorded yet." }),
        (data?.auditLogs ?? []).map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: log.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            shortDate(log.created_at),
            log.target ? ` · ${log.target}` : "",
            log.old_value != null || log.new_value != null ? ` · ${JSON.stringify(log.old_value)} → ${JSON.stringify(log.new_value)}` : ""
          ] })
        ] }, log.id))
      ] })
    ] })
  ] });
}
function Row({
  title,
  meta,
  status,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: meta })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: status, onValueChange: onChange, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o, className: "capitalize", children: o.replace(/_/g, " ") }, o)) })
      ] })
    ] })
  ] });
}
function ProductDialog({
  product,
  trigger,
  onSave
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [f, setF] = reactExports.useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    category: product?.category ?? "attar",
    short_description: product?.short_description ?? "",
    image_url: product?.image_url ?? "",
    price: String(product?.price ?? ""),
    sale_price: product?.sale_price != null ? String(product.sale_price) : "",
    stock: String(product?.stock ?? 0),
    status: product?.status === "inactive" ? "inactive" : "active",
    featured: Boolean(product?.featured),
    commission_percent: product?.commission_percent != null ? String(product.commission_percent) : ""
  });
  const set = (key, value) => setF((p) => ({
    ...p,
    [key]: value
  }));
  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim() || !f.slug.trim() || !f.sku.trim() || !Number(f.price)) {
      toast.error("Name, slug, SKU and a price above zero are required.");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(f.slug)) {
      toast.error("Slug can only contain lowercase letters, numbers and dashes.");
      return;
    }
    setBusy(true);
    await onSave({
      ...product?.id ? {
        id: product.id
      } : {},
      name: f.name.trim(),
      slug: f.slug.trim(),
      sku: f.sku.trim(),
      category: f.category.trim(),
      ...f.short_description.trim() ? {
        short_description: f.short_description.trim()
      } : {},
      image_url: f.image_url.trim() || null,
      price: Number(f.price),
      sale_price: f.sale_price ? Number(f.sale_price) : null,
      stock: Number(f.stock || 0),
      status: f.status,
      featured: f.featured,
      commission_percent: f.commission_percent ? Number(f.commission_percent) : null
    });
    setBusy(false);
    setOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[85vh] overflow-y-auto sm:max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: product ? "Edit product" : "New product" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "grid gap-4 sm:grid-cols-2", onSubmit: submit, children: [
        [["name", "Name", "sm:col-span-2"], ["slug", "Slug", ""], ["sku", "SKU", ""], ["category", "Category", ""], ["price", "Price (₹)", ""], ["sale_price", "Sale price (₹)", ""], ["stock", "Stock", ""], ["commission_percent", "Commission % (blank = default)", ""], ["image_url", "Image URL", "sm:col-span-2"], ["short_description", "Short description", "sm:col-span-2"]].map(([key, label, span]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-1.5 ${span}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `p-${key}`, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `p-${key}`, value: f[key], onChange: (e) => set(key, e.target.value) })
        ] }, key)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-status", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: f.status, onValueChange: (v) => set("status", v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "p-status", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-featured", children: "Featured" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: f.featured ? "yes" : "no", onValueChange: (v) => set("featured", v === "yes"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "p-featured", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "yes", children: "Yes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "no", children: "No" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "sm:col-span-2", disabled: busy, children: busy ? "Saving…" : "Save product" })
      ] })
    ] })
  ] });
}
export {
  AdminConsole as component
};
