import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Hind Fragrance" },
      {
        name: "description",
        content: "Review the attars and perfumes in your Hind Fragrance cart.",
      },
      { property: "og:title", content: "Your Cart — Hind Fragrance" },
      { property: "og:description", content: "Review your Hind Fragrance cart before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQuantity, remove } = useCart();
  const shipping = items.length === 0 || subtotal >= 999 ? 0 : 59;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-display text-5xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-5">
              <Link to="/shop">Browse fragrances</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 p-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg leading-tight">{item.name}</h2>
                    <p className="text-sm text-muted-foreground">{inr(item.price)} each</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          className="px-2 py-1"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          className="px-2 py-1"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => remove(item.productId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{inr(item.price * item.quantity)}</div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl">Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{inr(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : inr(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
                  <dt>Total</dt>
                  <dd>{inr(subtotal + shipping)}</dd>
                </div>
              </dl>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
