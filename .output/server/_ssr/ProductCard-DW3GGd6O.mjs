import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button } from "./SiteHeader-t5CpO3pB.mjs";
import { i as inr } from "./format-BY29FUB1.mjs";
import { u as useCart } from "./router-BfVb2A60.mjs";
function ProductCard({ product }) {
  const cart = useCart();
  const price = Number(product.sale_price ?? product.price);
  const hasDiscount = product.sale_price != null && Number(product.sale_price) < Number(product.price);
  const soldOut = (product.stock ?? 0) <= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group flex flex-col overflow-hidden rounded-xl border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/product/$slug",
        params: { slug: product.slug },
        className: "relative block aspect-square overflow-hidden bg-secondary",
        children: [
          product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.image_url,
              alt: product.name,
              loading: "lazy",
              className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center font-display text-3xl text-muted-foreground", children: "HF" }),
          hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-3 rounded-full bg-gold px-2 py-0.5 text-[11px] font-medium text-ink", children: "Offer" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: product.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-display text-xl leading-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$slug", params: { slug: product.slug }, children: product.name }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium", children: inr(price) }),
        hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground line-through", children: inr(product.price) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "mt-4",
          variant: "outline",
          disabled: soldOut,
          onClick: () => {
            cart.add({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price,
              image: product.image_url
            });
            toast.success(`${product.name} added to cart`);
          },
          children: soldOut ? "Sold out" : "Add to cart"
        }
      )
    ] })
  ] });
}
export {
  ProductCard as P
};
