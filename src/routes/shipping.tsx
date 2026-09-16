import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/shipping")({
  head: () => ({ meta: [{ title: "Shipping Policy — Hind Fragrance" }] }),
  component: Shipping,
});

function Shipping() {
  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-4 py-14">
        <span className="eyebrow">Legal</span><h1 className="mt-2 font-display text-5xl">Shipping Policy</h1><p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>
        <div className="prose prose-sm mt-10 max-w-none space-y-8 text-foreground/80">
          <section><h2>1. Delivery coverage</h2><p>We ship eligible Hind Fragrance orders to serviceable addresses across India through available delivery partners.</p></section>
          <section><h2>2. Processing and delivery</h2><p>Orders are processed after successful payment confirmation. Delivery estimates can vary by destination, courier capacity, weather, public holidays and other events outside our reasonable control. The delivery estimate shown during the order process is an estimate, not a guarantee.</p></section>
          <section><h2>3. Shipping charges</h2><p>The applicable shipping charge is shown at checkout before you confirm the order. Orders meeting the store's free-shipping threshold may qualify for free standard shipping.</p></section>
          <section><h2>4. Address and delivery issues</h2><p>Please provide a complete and accurate address and reachable mobile number. If a parcel is returned because the address is incomplete or delivery cannot be completed, additional shipping or re-delivery arrangements may apply.</p></section>
          <section><h2>5. Contact</h2><p>For delivery questions, contact <a href="mailto:support@hindfragrance.com">support@hindfragrance.com</a> with your order number.</p></section>
        </div>
      </article>
    </PublicLayout>
  );
}
