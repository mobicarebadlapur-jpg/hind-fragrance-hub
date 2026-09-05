import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-DN3Pp-JT.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as DashboardShell, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, E as EmptyState, S as StatusPill } from "./tabs-BJHUiSyn.mjs";
import { u as useSession, B as Button } from "./SiteHeader-t5CpO3pB.mjs";
import { I as Input } from "./input-CfgHp7Je.mjs";
import { L as Label } from "./label-C-g-sDNu.mjs";
import { s as supabase } from "./router-BfVb2A60.mjs";
import { s as shortDate, i as inr } from "./format-BY29FUB1.mjs";
import { e as ensureProfile } from "./account.functions-CFHeoWc3.mjs";
import "../_libs/seroval.mjs";
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
import "./server-dt98x2q-.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
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
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-label.mjs";
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
import "./auth-middleware-BYHyo-go.mjs";
function Account() {
  const {
    data: session
  } = useSession();
  const queryClient = useQueryClient();
  const save = useServerFn(ensureProfile);
  const [form, setForm] = reactExports.useState({
    full_name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const p = session?.profile;
    if (p) setForm({
      full_name: p.full_name ?? "",
      mobile: p.mobile ?? "",
      address: p.address ?? "",
      city: p.city ?? "",
      state: p.state ?? "",
      pincode: p.pincode ?? ""
    });
  }, [session?.profile]);
  const {
    data: orders
  } = useQuery({
    queryKey: ["my-orders", session?.userId],
    enabled: Boolean(session?.userId),
    queryFn: async () => {
      const {
        data
      } = await supabase.from("orders").select("*, order_items(*)").eq("customer_id", session.userId).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: "My account", subtitle: session?.email ?? "", actions: !session?.partner && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/join", children: "Become a partner" }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "orders", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "orders", children: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "profile", children: "Profile" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "orders", className: "mt-6 space-y-4", children: [
      (orders ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "You haven't placed any orders yet." }),
      (orders ?? []).map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: order.order_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: shortDate(order.created_at) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: order.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: inr(order.total) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground", children: order.order_items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          item.product_name,
          " × ",
          item.quantity,
          " — ",
          inr(item.line_total)
        ] }, item.id)) })
      ] }, order.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "profile", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2", onSubmit: async (e) => {
      e.preventDefault();
      setBusy(true);
      try {
        await save({
          data: form
        });
        await queryClient.invalidateQueries({
          queryKey: ["session"]
        });
        toast.success("Profile updated");
      } catch {
        toast.error("Could not update your profile.");
      } finally {
        setBusy(false);
      }
    }, children: [
      [["full_name", "Full name", 100], ["mobile", "Mobile", 10], ["city", "City", 80], ["state", "State", 80], ["pincode", "Pincode", 6]].map(([key, label, max]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: key, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: key, value: form[key], maxLength: max, onChange: (e) => setForm({
          ...form,
          [key]: e.target.value
        }) })
      ] }, key)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "address", value: form.address, maxLength: 300, onChange: (e) => setForm({
          ...form,
          address: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "sm:col-span-2", children: busy ? "Saving…" : "Save profile" })
    ] }) })
  ] }) });
}
export {
  Account as component
};
