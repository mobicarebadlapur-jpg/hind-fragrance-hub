import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-D_SPKSHh.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PublicLayout } from "./PublicLayout-DFLNZP09.mjs";
import { B as Button } from "./SiteHeader-tTtsvzPr.mjs";
import { c as createServerFn } from "./server-CrL2kZQg.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./router-DwfUMIJt.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
const seedDemoAccounts = createServerFn({
  method: "POST"
}).handler(createSsrRpc("e42712be89fe2c5a6044deebf084d5708d7ff0349ebf1793bc67d58e26337b8c"));
function Demo() {
  const seed = useServerFn(seedDemoAccounts);
  const [busy, setBusy] = reactExports.useState(false);
  const [accounts, setAccounts] = reactExports.useState([]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: "Testing" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-4xl", children: "Demo access" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Generate ready-to-use admin, partner and customer logins so you can test the full purchase → commission → payout lifecycle. Payments and OTP run in demo mode until live keys are configured." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6", disabled: busy, onClick: async () => {
      setBusy(true);
      try {
        const res = await seed({});
        setAccounts(res.accounts);
        toast.success("Demo accounts ready");
      } catch {
        toast.error("Could not create demo accounts.");
      } finally {
        setBusy(false);
      }
    }, children: busy ? "Creating…" : "Create demo accounts" }),
    accounts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 overflow-hidden rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Password" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 capitalize", children: a.role }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: a.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs", children: a.password })
      ] }, a.email)) })
    ] }) })
  ] }) });
}
export {
  Demo as component
};
