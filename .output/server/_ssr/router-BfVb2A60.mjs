import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-B1iYvzhH.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
  const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : void 0;
  window.__lovableReportRuntimeError?.({
    message,
    ...stack !== void 0 && { stack },
    filename: window.location.pathname
  });
}
const CartContext = reactExports.createContext(null);
const KEY$1 = "hf_cart";
function CartProvider({ children }) {
  const [items, setItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY$1);
      if (raw) setItems(JSON.parse(raw));
    } catch {
    }
  }, []);
  const persist = reactExports.useCallback((next) => {
    setItems(next);
    window.localStorage.setItem(KEY$1, JSON.stringify(next));
  }, []);
  const value = reactExports.useMemo(() => {
    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.quantity * i.price, 0),
      add: (item, quantity = 1) => {
        const existing = items.find((i) => i.productId === item.productId);
        persist(
          existing ? items.map(
            (i) => i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
          ) : [...items, { ...item, quantity }]
        );
      },
      setQuantity: (productId, quantity) => persist(
        quantity <= 0 ? items.filter((i) => i.productId !== productId) : items.map((i) => i.productId === productId ? { ...i, quantity } : i)
      ),
      remove: (productId) => persist(items.filter((i) => i.productId !== productId)),
      clear: () => persist([])
    };
  }, [items, persist]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartContext.Provider, { value, children });
}
function useCart() {
  const ctx = reactExports.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
function brokeredPreviewStorage() {
  if (typeof window === "undefined") return void 0;
  const host = location.hostname;
  const PREVIEW_ZONES = ["lovableproject.com", "lovableproject-dev.com", "lovable.app", "gpt-eng.com", "gptengineer.run"];
  const onPreviewZone = PREVIEW_ZONES.some((z2) => host === z2 || host.endsWith("." + z2));
  const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
  const projectId = onPreviewZone ? host.match(new RegExp("^(?:id-preview(?:-[a-z0-9]+)?|project)--(" + UUID + ")(?:-dev)?(?=\\.|$)", "i"))?.[1] ?? host.match(new RegExp("^(" + UUID + ")(?=[.-])", "i"))?.[1] : void 0;
  const framed = window.parent && window.parent !== window;
  if (!projectId || !framed) return localStorage;
  const dev = host.endsWith(".lovableproject-dev.com") || host.endsWith(".gpt-eng.com");
  const EDITOR = dev ? /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$|^http:\/\/localhost:3000$/ : /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$/;
  const ancestor = location.ancestorOrigins && location.ancestorOrigins[0] || (document.referrer ? new URL(document.referrer).origin : "");
  const editorOrigins = ancestor && EDITOR.test(ancestor) ? [ancestor] : dev ? ["https://lovable.dev", "http://localhost:3000"] : ["https://lovable.dev"];
  const RESULT = "lovable-preview-auth:result";
  const TIMEOUT = 2e3;
  const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  const request = (type, key, value) => new Promise((resolve) => {
    const requestId = newId();
    let done = false;
    let timer;
    const finish = (r) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      resolve(r);
    };
    const onMessage = (e) => {
      if (editorOrigins.indexOf(e.origin) < 0) return;
      const d = e.data;
      if (d && d.type === RESULT && d.requestId === requestId) finish(d);
    };
    window.addEventListener("message", onMessage);
    const msg = { type, requestId, projectId, key };
    if (value !== void 0) msg["value"] = value;
    for (const origin of editorOrigins) window.parent.postMessage(msg, origin);
    timer = setTimeout(() => finish(null), TIMEOUT);
  });
  let firstGet = true;
  const RETRY_DELAY = 250;
  return {
    getItem: async (key) => {
      let res = await request("lovable-preview-auth:get", key);
      if (!res && firstGet) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY));
        res = await request("lovable-preview-auth:get", key);
      }
      firstGet = false;
      if (res && res.ok && typeof res.value === "string") {
        if (res.value === "") {
          localStorage.removeItem(key);
          return null;
        }
        return res.value;
      }
      return localStorage.getItem(key);
    },
    setItem: (key, value) => {
      localStorage.setItem(key, value);
      return request("lovable-preview-auth:set", key, value).then(() => void 0);
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
      return request("lovable-preview-auth:remove", key).then(() => void 0);
    }
  };
}
function isNewSupabaseApiKey(value) {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}
function createSupabaseClient() {
  const SUPABASE_URL = "https://rgdwmvqbytlpmaobewfo.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_KP1NDEaB1XmfMAY4ZOwNIw_Y6MNb6tz";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY)
    },
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const KEY = "hf_referral";
function captureReferral(search, landingPage, cookieDays = 30) {
  if (typeof window === "undefined") return;
  const code = new URLSearchParams(search).get("ref");
  if (!code) return;
  const existing = readReferralRecord();
  const payload = {
    code: code.toUpperCase(),
    at: Date.now(),
    expires: Date.now() + cookieDays * 864e5
  };
  window.localStorage.setItem(KEY, JSON.stringify(payload));
  document.cookie = `hf_ref=${payload.code}; path=/; max-age=${cookieDays * 86400}; SameSite=Lax`;
  if (existing?.code === payload.code && Date.now() - existing.at < 6e4) return;
  void logReferralClick(payload.code, landingPage);
}
function readReferralRecord() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.expires < Date.now()) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
function getReferralCode() {
  return readReferralRecord()?.code ?? null;
}
async function logReferralClick(code, landingPage) {
  const { data: partner } = await supabase.from("partners").select("id").eq("referral_code", code).maybeSingle();
  await supabase.from("referral_clicks").insert({
    referral_code: code,
    partner_id: partner?.id ?? null,
    landing_page: landingPage
  });
}
function referralUrl(code, path = "/") {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://hindfragrance.com";
  return `${origin}${path}?ref=${code}`;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$d = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hind Fragrance — Alcohol-Free Attars & Perfumes" },
      {
        name: "description",
        content: "Hind Fragrance crafts alcohol-free attars, perfumes and room fragrances in India, with a ₹199 Business Partner referral programme."
      },
      { name: "author", content: "Hind Fragrance" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap"
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$d.useRouteContext();
  const router2 = useRouter();
  reactExports.useEffect(() => {
    captureReferral(window.location.search, window.location.pathname);
  }, []);
  reactExports.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router2.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router2, queryClient]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CartProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] }) });
}
const $$splitComponentImporter$c = () => import("./index-DM9Yyiis.mjs");
const Route$c = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Hind Fragrance — Alcohol-Free Attars & Perfumes in India"
    }, {
      name: "description",
      content: "Shop alcohol-free attars, perfumes and home fragrances from Hind Fragrance, and earn referral commission as a ₹199 Business Partner."
    }, {
      property: "og:title",
      content: "Hind Fragrance — Alcohol-Free Attars & Perfumes"
    }, {
      property: "og:description",
      content: "Handcrafted Indian attars, perfume oils and home fragrances."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./route-BFsOu0JM.mjs");
const Route$b = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth"
    });
    return {
      user: data.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./auth-XLl7q4MQ.mjs");
const searchSchema = objectType({
  redirect: stringType().optional(),
  mode: enumType(["login", "signup"]).optional()
});
const Route$a = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{
      title: "Login or Create Account — Hind Fragrance"
    }, {
      name: "description",
      content: "Sign in to track orders, manage your account and access your partner dashboard."
    }, {
      property: "og:title",
      content: "Login — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Access your Hind Fragrance account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./business-partner-FEEvKOes.mjs");
const Route$9 = createFileRoute("/business-partner")({
  head: () => ({
    meta: [{
      title: "Business Partner Programme — Hind Fragrance"
    }, {
      name: "description",
      content: "Join the Hind Fragrance Business Partner programme for ₹199, get a referral link and earn commission on eligible product sales."
    }, {
      property: "og:title",
      content: "Business Partner Programme — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Refer, sell and earn commission with Hind Fragrance."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./cart-Y1sUve71.mjs");
const Route$8 = createFileRoute("/cart")({
  head: () => ({
    meta: [{
      title: "Your Cart — Hind Fragrance"
    }, {
      name: "description",
      content: "Review the attars and perfumes in your Hind Fragrance cart."
    }, {
      property: "og:title",
      content: "Your Cart — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Review your Hind Fragrance cart before checkout."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./checkout-C0zp_ox2.mjs");
const Route$7 = createFileRoute("/checkout")({
  head: () => ({
    meta: [{
      title: "Secure Checkout — Hind Fragrance"
    }, {
      name: "description",
      content: "Complete your Hind Fragrance order with secure payment."
    }, {
      property: "og:title",
      content: "Secure Checkout — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Complete your Hind Fragrance order."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./demo-_qvF478U.mjs");
const Route$6 = createFileRoute("/demo")({
  head: () => ({
    meta: [{
      title: "Demo Access — Hind Fragrance Platform"
    }, {
      name: "description",
      content: "Create demo admin, partner and customer logins to explore the Hind Fragrance platform."
    }, {
      property: "og:title",
      content: "Demo Access — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Explore the platform with demo credentials."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./join-B7y2AUcv.mjs");
const Route$5 = createFileRoute("/join")({
  head: () => ({
    meta: [{
      title: "Join as a Business Partner for ₹199 — Hind Fragrance"
    }, {
      name: "description",
      content: "Register as a Hind Fragrance Business Partner for ₹199, verify your mobile and start earning referral commission."
    }, {
      property: "og:title",
      content: "Join as a Business Partner — Hind Fragrance"
    }, {
      property: "og:description",
      content: "One-time ₹199 registration. Earn on every referral."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./shop--VjWfH3c.mjs");
const Route$4 = createFileRoute("/shop")({
  head: () => ({
    meta: [{
      title: "Shop Attars & Perfumes — Hind Fragrance"
    }, {
      name: "description",
      content: "Browse alcohol-free attars, perfume oils, roll-ons and home fragrances from Hind Fragrance, shipped across India."
    }, {
      property: "og:title",
      content: "Shop Attars & Perfumes — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Alcohol-free attars, perfume oils and home fragrances."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./account-DWvzDkH1.mjs");
const Route$3 = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [{
      title: "My Account — Hind Fragrance"
    }, {
      name: "description",
      content: "Manage your Hind Fragrance profile and track your orders."
    }, {
      property: "og:title",
      content: "My Account — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Profile and order history."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin-BhxC9SM-.mjs");
const Route$2 = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{
      title: "Admin Console — Hind Fragrance"
    }, {
      name: "description",
      content: "Manage partners, orders, commissions, payouts and platform settings."
    }, {
      property: "og:title",
      content: "Admin Console — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Hind Fragrance operations control centre."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./partner-BoTHeSEE.mjs");
const Route$1 = createFileRoute("/_authenticated/partner")({
  head: () => ({
    meta: [{
      title: "Partner Dashboard — Hind Fragrance"
    }, {
      name: "description",
      content: "Track referral clicks, orders, commission and payouts as a Hind Fragrance partner."
    }, {
      property: "og:title",
      content: "Partner Dashboard — Hind Fragrance"
    }, {
      property: "og:description",
      content: "Your referral performance at a glance."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitNotFoundComponentImporter = () => import("./product._slug-uah2BsKq.mjs");
const $$splitComponentImporter = () => import("./product._slug-CZLXsadL.mjs");
const Route = createFileRoute("/product/$slug")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${params.slug.replace(/-/g, " ")} — Hind Fragrance`
    }, {
      name: "description",
      content: "Alcohol-free attar from Hind Fragrance. Long lasting, small-batch blended."
    }, {
      property: "og:title",
      content: `${params.slug.replace(/-/g, " ")} — Hind Fragrance`
    }, {
      property: "og:description",
      content: "Alcohol-free attar from Hind Fragrance."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const IndexRoute = Route$c.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$d
});
const AuthenticatedRouteRoute = Route$b.update({
  id: "/_authenticated",
  getParentRoute: () => Route$d
});
const AuthRoute = Route$a.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$d
});
const BusinessPartnerRoute = Route$9.update({
  id: "/business-partner",
  path: "/business-partner",
  getParentRoute: () => Route$d
});
const CartRoute = Route$8.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$d
});
const CheckoutRoute = Route$7.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$d
});
const DemoRoute = Route$6.update({
  id: "/demo",
  path: "/demo",
  getParentRoute: () => Route$d
});
const JoinRoute = Route$5.update({
  id: "/join",
  path: "/join",
  getParentRoute: () => Route$d
});
const ShopRoute = Route$4.update({
  id: "/shop",
  path: "/shop",
  getParentRoute: () => Route$d
});
const AuthenticatedAccountRoute = Route$3.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminRoute = Route$2.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPartnerRoute = Route$1.update({
  id: "/partner",
  path: "/partner",
  getParentRoute: () => AuthenticatedRouteRoute
});
const ProductSlugRoute = Route.update({
  id: "/product/$slug",
  path: "/product/$slug",
  getParentRoute: () => Route$d
});
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAccountRoute,
  AuthenticatedAdminRoute,
  AuthenticatedPartnerRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute,
  BusinessPartnerRoute,
  CartRoute,
  CheckoutRoute,
  DemoRoute,
  JoinRoute,
  ShopRoute,
  ProductSlugRoute
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route as R,
  Route$a as a,
  router as b,
  getReferralCode as g,
  referralUrl as r,
  supabase as s,
  useCart as u
};
