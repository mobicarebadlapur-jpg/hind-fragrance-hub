import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/format";
import { useCart } from "@/lib/cart";

export type Product = Database["public"]["Tables"]["products"]["Row"];

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const price = Number(product.sale_price ?? product.price);
  const hasDiscount = product.sale_price != null && Number(product.sale_price) < Number(product.price);
  const soldOut = (product.stock ?? 0) <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-muted-foreground">
            HF
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2 py-0.5 text-[11px] font-medium text-ink">
            Offer
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="eyebrow">{product.category}</span>
        <h3 className="mt-1 font-display text-xl leading-tight">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-medium">{inr(price)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">{inr(product.price)}</span>
          )}
        </div>
        <Button
          className="mt-4"
          variant="outline"
          disabled={soldOut}
          onClick={() => {
            cart.add({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price,
              image: product.image_url,
            });
            toast.success(`${product.name} added to cart`);
          }}
        >
          {soldOut ? "Sold out" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}
