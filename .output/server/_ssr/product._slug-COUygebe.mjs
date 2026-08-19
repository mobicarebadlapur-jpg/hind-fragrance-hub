import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { notFoundComponent as ProductNotFound } from "./product._slug-Q5os45BE.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PublicLayout } from "./PublicLayout-DFLNZP09.mjs";
import { B as Button } from "./SiteHeader-tTtsvzPr.mjs";
import { R as Route, u as useCart, s as supabase } from "./router-DwfUMIJt.mjs";
import { i as inr } from "./format-BY29FUB1.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lucide-react.mjs";
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
function ProductPage() {
  const {
    slug
  } = Route.useParams();
  const cart = useCart();
  const [quantity, setQuantity] = reactExports.useState(1);
  const {
    data: product,
    isPending
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("products").select("*").eq("slug", slug).eq("status", "active").maybeSingle();
      return data;
    }
  });
  if (isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-4 py-24 text-sm text-muted-foreground", children: "Loading…" }) });
  }
  if (!product) return /* @__PURE__ */ jsxRuntimeExports.jsx(ProductNotFound, {});
  const price = Number(product.sale_price ?? product.price);
  const soldOut = (product.stock ?? 0) <= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border bg-secondary", children: product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: product.name, className: "aspect-square w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex aspect-square items-center justify-center font-display text-6xl text-muted-foreground", children: "HF" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: product.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-5xl leading-tight", children: product.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-baseline gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-medium", children: inr(price) }),
        product.sale_price != null && Number(product.sale_price) < Number(product.price) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground line-through", children: inr(product.price) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-sm leading-relaxed text-muted-foreground", children: product.description ?? "A signature alcohol-free blend from the Hind Fragrance atelier." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center rounded-md border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-2", onClick: () => setQuantity((q) => Math.max(1, q - 1)), children: "−" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10 text-center text-sm", children: quantity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-2", onClick: () => setQuantity((q) => Math.min(20, q + 1)), children: "+" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", disabled: soldOut, onClick: () => {
          cart.add({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price,
            image: product.image_url
          }, quantity);
          toast.success("Added to cart");
        }, children: soldOut ? "Sold out" : "Add to cart" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-10 grid gap-3 border-t border-border pt-6 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Availability" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: soldOut ? "Out of stock" : `${product.stock} in stock` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Shipping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "Free above ₹999, otherwise ₹59" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Formulation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "Alcohol-free oil concentrate" })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  ProductPage as component
};
