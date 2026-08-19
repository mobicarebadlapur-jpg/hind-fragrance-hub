import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/format";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Hind Fragrance` },
      {
        name: "description",
        content: "Alcohol-free attar from Hind Fragrance. Long lasting, small-batch blended.",
      },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — Hind Fragrance` },
      {
        property: "og:description",
        content: "Alcohol-free attar from Hind Fragrance.",
      },
    ],
  }),
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Fragrance not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This product may have been removed from the collection.
        </p>
        <Button asChild className="mt-6">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    </PublicLayout>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isPending } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .maybeSingle();
      return data;
    },
  });

  if (isPending) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-6xl px-4 py-24 text-sm text-muted-foreground">Loading…</div>
      </PublicLayout>
    );
  }

  if (!product) return <ProductNotFound />;

  const price = Number(product.sale_price ?? product.price);
  const soldOut = (product.stock ?? 0) <= 0;

  return (
    <PublicLayout>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center font-display text-6xl text-muted-foreground">
              HF
            </div>
          )}
        </div>
        <div>
          <span className="eyebrow">{product.category}</span>
          <h1 className="mt-2 font-display text-5xl leading-tight">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-medium">{inr(price)}</span>
            {product.sale_price != null && Number(product.sale_price) < Number(product.price) && (
              <span className="text-sm text-muted-foreground line-through">
                {inr(product.price)}
              </span>
            )}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.description ??
              "A signature alcohol-free blend from the Hind Fragrance atelier."}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-border">
              <button className="px-3 py-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button className="px-3 py-2" onClick={() => setQuantity((q) => Math.min(20, q + 1))}>
                +
              </button>
            </div>
            <Button
              size="lg"
              disabled={soldOut}
              onClick={() => {
                cart.add(
                  {
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    price,
                    image: product.image_url,
                  },
                  quantity,
                );
                toast.success("Added to cart");
              }}
            >
              {soldOut ? "Sold out" : "Add to cart"}
            </Button>
          </div>

          <dl className="mt-10 grid gap-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Availability</dt>
              <dd>{soldOut ? "Out of stock" : `${product.stock} in stock`}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>Free above ₹999, otherwise ₹59</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Formulation</dt>
              <dd>Alcohol-free oil concentrate</dd>
            </div>
          </dl>
        </div>
      </div>
    </PublicLayout>
  );
}
