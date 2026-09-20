import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import { getReferralCode } from "@/lib/referral";
import { useSession } from "@/lib/session";
import { placeOrder, payForOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Hind Fragrance" },
      { name: "description", content: "Complete your Hind Fragrance order with secure payment." },
      { property: "og:title", content: "Secure Checkout — Hind Fragrance" },
      { property: "og:description", content: "Complete your Hind Fragrance order." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const submitOrder = useServerFn(placeOrder);
  const pay = useServerFn(payForOrder);

  const [form, setForm] = useState({
    shippingName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState<{ orderNumber: string } | null>(null);
  const referral = typeof window !== "undefined" ? getReferralCode() : null;
  const shipping = subtotal >= 999 ? 0 : 59;

  useEffect(() => {
    const profile = session?.profile;
    if (profile)
      setForm((f) => ({
        shippingName: f.shippingName || (profile.full_name ?? ""),
        mobile: f.mobile || (profile.mobile ?? ""),
        address: f.address || (profile.address ?? ""),
        city: f.city || (profile.city ?? ""),
        state: f.state || (profile.state ?? ""),
        pincode: f.pincode || (profile.pincode ?? ""),
      }));
  }, [session?.profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const created = await submitOrder({
        data: {
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          referralCode: referral,
          ...form,
        },
      });
      if (!created.ok) {
        toast.error(created.error);
        return;
      }
      const paid = await pay({ data: { orderId: created.orderId } });
      if (!paid.ok) {
        toast.error(paid.error);
        return;
      }
      clear();
      setPlaced({ orderNumber: paid.orderNumber });
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (placed) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="font-display text-4xl">Order confirmed</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your order <span className="font-medium text-foreground">{placed.orderNumber}</span> has
            been placed. You'll receive updates as it ships.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild>
              <Link to="/account">View my orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!isPending && !session?.userId) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="font-display text-4xl">Sign in to checkout</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You need an account so we can track and deliver your order.
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate({ to: "/auth", search: { redirect: "/checkout" } })}
          >
            Sign in or create account
          </Button>
        </div>
      </PublicLayout>
    );
  }

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="font-display text-4xl">Your cart is empty</h1>
          <Button asChild className="mt-6">
            <Link to="/shop">Browse fragrances</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 lg:grid-cols-[1fr_320px]">
        <form className="rounded-xl border border-border bg-card p-6" onSubmit={handleSubmit}>
          <h1 className="font-display text-4xl">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">Delivery details</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              value={form.shippingName}
              onChange={(v) => setForm({ ...form, shippingName: v })}
              maxLength={100}
            />
            <Field
              label="Mobile (10 digits)"
              value={form.mobile}
              onChange={(v) => setForm({ ...form, mobile: v.replace(/\D/g, "").slice(0, 10) })}
              maxLength={10}
            />
            <div className="sm:col-span-2">
              <Field
                label="Address"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                maxLength={300}
              />
            </div>
            <Field
              label="City"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
              maxLength={80}
            />
            <Field
              label="State"
              value={form.state}
              onChange={(v) => setForm({ ...form, state: v })}
              maxLength={80}
            />
            <Field
              label="Pincode"
              value={form.pincode}
              onChange={(v) => setForm({ ...form, pincode: v.replace(/\D/g, "").slice(0, 6) })}
              maxLength={6}
            />
          </div>
          {referral && (
            <p className="mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground">
              Referral code <span className="font-medium text-foreground">{referral}</span> will be
              applied to this order.
            </p>
          )}
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy}>
            {busy ? "Processing payment…" : `Pay ${inr(subtotal + shipping)}`}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Payments are verified server-side. Demo mode simulates the gateway until live keys are
            added.
          </p>
        </form>

        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span>{inr(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
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
        </aside>
      </div>
    </PublicLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required
      />
    </div>
  );
}
