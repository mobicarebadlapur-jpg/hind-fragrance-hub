import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Return & Refund Policy — Hind Fragrance" }] }),
  component: Refund,
});

function Refund() {
  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-4 py-14">
        <span className="eyebrow">Legal</span><h1 className="mt-2 font-display text-5xl">Return & Refund Policy</h1><p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>
        <div className="prose prose-sm mt-10 max-w-none space-y-8 text-foreground/80">
          <section><h2>1. Damaged or incorrect delivery</h2><p>If your order arrives damaged, leaking, materially defective, or contains an incorrect product, contact us promptly with your order number and clear photos of the package and product so we can review the issue.</p></section>
          <section><h2>2. Returns</h2><p>Because fragrances are personal-use products, returns are generally accepted only where the product is damaged, defective or incorrectly supplied, subject to inspection and applicable law. Do not return a product without first contacting support.</p></section>
          <section><h2>3. Refunds</h2><p>Where a refund is approved, it will normally be issued to the original payment method after the return or claim is reviewed. Processing time may depend on the payment provider and banking system.</p></section>
          <section><h2>4. Cancellation</h2><p>Cancellation requests should be made as soon as possible. An order that has already been shipped may not be cancellable and may instead be handled under the return policy.</p></section>
          <section><h2>5. Contact</h2><p>For returns or refunds, contact <a href="mailto:support@hindfragrance.com">support@hindfragrance.com</a> with your order number.</p></section>
        </div>
      </article>
    </PublicLayout>
  );
}
