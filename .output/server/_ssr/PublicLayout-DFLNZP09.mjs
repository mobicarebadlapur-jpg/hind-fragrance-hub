import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteHeader, L as Logo } from "./SiteHeader-tTtsvzPr.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "surface-ink mt-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { inverted: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-sm text-sm text-ink-foreground/70", children: "Hind Fragrance (Alhind Fragrance India) crafts alcohol-free attars, perfumes and home fragrances. Our Business Partner programme is a referral sales programme — partners earn commission on eligible product sales only." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "eyebrow", children: "Explore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-ink-foreground/75", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", children: "Shop all" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/business-partner", children: "Business Partner" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/join", children: "Join for ₹199" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Login" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "eyebrow", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-ink-foreground/75", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "support@hindfragrance.com" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "+91 90000 00000" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "India" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/demo", children: "Demo access" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10 px-4 py-5 text-center text-xs text-ink-foreground/50", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Hind Fragrance. Commission is paid only on eligible product sales. No guaranteed income. This is not an investment scheme."
    ] })
  ] });
}
function PublicLayout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  PublicLayout as P
};
