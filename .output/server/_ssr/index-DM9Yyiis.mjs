import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PublicLayout } from "./PublicLayout-DNCcDc1W.mjs";
import { P as ProductCard } from "./ProductCard-DW3GGd6O.mjs";
import { B as Button } from "./SiteHeader-t5CpO3pB.mjs";
import { s as supabase } from "./router-BfVb2A60.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowRight, L as Leaf, S as Sparkles, a as ShieldCheck, B as BadgeIndianRupee } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
import "./format-BY29FUB1.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
const hero = "/assets/hero-fragrance-F9SjCqfn.jpg";
function Home() {
  const {
    data: products
  } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("products").select("*").eq("status", "active").order("featured", {
        ascending: false
      }).limit(4);
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: hero, alt: "Hand-blended attar bottles on a warm parchment surface", className: "absolute inset-0 h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/25" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto grid max-w-6xl gap-6 px-4 py-28 md:py-36", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow text-gold", children: "Alhind Fragrance India" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "max-w-2xl font-display text-5xl leading-[1.05] text-ink-foreground md:text-6xl", children: "Alcohol-free attars, blended in the Indian tradition." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xl text-ink-foreground/75", children: "Long-lasting perfume oils, roll-ons and home fragrances — crafted in small batches and shipped across India. Become a Business Partner for ₹199 and earn commission on every sale you refer." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", children: [
            "Shop the collection ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "gold-outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/business-partner", children: "Become a Partner" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: [{
      icon: Leaf,
      title: "Alcohol-free",
      body: "Pure oil concentrates, skin friendly."
    }, {
      icon: Sparkles,
      title: "Long lasting",
      body: "8–12 hours of steady projection."
    }, {
      icon: ShieldCheck,
      title: "Secure payments",
      body: "Encrypted checkout, tracked orders."
    }, {
      icon: BadgeIndianRupee,
      title: "Earn as a partner",
      body: "Commission on every referred sale."
    }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-5 w-5 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-xl", children: item.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: item.body })
    ] }, item.title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-4 pb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: "Bestsellers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-4xl", children: "Signature fragrances" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "text-sm text-muted-foreground hover:text-foreground", children: "View all" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: [
        (products ?? []).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product }, product.id)),
        products?.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Products are being added shortly." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto mt-16 max-w-6xl px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-ink rounded-2xl px-8 py-14 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow text-gold", children: "Business Partner Programme" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mx-auto mt-3 max-w-2xl font-display text-4xl text-ink-foreground", children: "Join once for ₹199. Earn commission on every sale you refer." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-xl text-sm text-ink-foreground/70", children: "Get your own referral link and Partner ID, share it anywhere, and track clicks, orders and earnings from a live dashboard. Commission is paid on eligible product sales only." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/join", children: "Join for ₹199" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "ghost-inverted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/business-partner", children: "How it works" }) })
      ] })
    ] }) })
  ] });
}
export {
  Home as component
};
