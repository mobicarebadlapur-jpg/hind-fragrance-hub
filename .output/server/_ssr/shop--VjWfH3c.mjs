import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PublicLayout } from "./PublicLayout-DNCcDc1W.mjs";
import { P as ProductCard } from "./ProductCard-DW3GGd6O.mjs";
import { I as Input } from "./input-CfgHp7Je.mjs";
import { s as supabase } from "./router-BfVb2A60.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./SiteHeader-t5CpO3pB.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lucide-react.mjs";
import "./format-BY29FUB1.mjs";
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
function Shop() {
  const [search, setSearch] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("all");
  const {
    data: products,
    isPending
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("products").select("*").eq("status", "active").order("featured", {
        ascending: false
      }).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const categories = ["all", ...new Set((products ?? []).map((p) => p.category))];
  const filtered = (products ?? []).filter((p) => (category === "all" || p.category === category) && p.name.toLowerCase().includes(search.trim().toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: "The collection" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-5xl", children: "Fragrances" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-sm text-muted-foreground", children: "Every blend is alcohol-free and made in small batches. Free shipping on orders above ₹999." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search fragrances", value: search, onChange: (e) => setSearch(e.target.value), className: "max-w-xs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategory(c), className: `rounded-full border px-3 py-1 text-xs capitalize transition-colors ${category === c ? "border-gold bg-gold/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`, children: c }, c)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: filtered.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product }, product.id)) }),
    !isPending && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-12 text-sm text-muted-foreground", children: "No fragrances match your search." })
  ] }) });
}
export {
  Shop as component
};
