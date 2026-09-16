import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Hind Fragrance" }] }),
  component: Terms,
});

function Terms() {
  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-4 py-14">
        <span className="eyebrow">Legal</span><h1 className="mt-2 font-display text-5xl">Terms & Conditions</h1><p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>
        <div className="prose prose-sm mt-10 max-w-none space-y-8 text-foreground/80">
          <section><h2>1. About these terms</h2><p>These terms apply to purchases, accounts and use of the Hind Fragrance website. By using the website or placing an order, you agree to these terms and applicable Indian law.</p></section>
          <section><h2>2. Products and pricing</h2><p>Product descriptions, availability and prices may change. The price and product details confirmed by the store at checkout are used for an order. We may correct obvious errors and will contact you where appropriate before processing an affected order.</p></section>
          <section><h2>3. Orders and payment</h2><p>An order is subject to product availability and successful payment confirmation. Do not share payment PINs, passwords or OTPs with anyone claiming to represent Hind Fragrance.</p></section>
          <section><h2>4. Business Partner programme</h2><p>The Business Partner programme is a referral sales programme. Any commission is based on eligible product sales under the programme rules. There is no guaranteed income and membership should not be represented as an investment or deposit scheme.</p></section>
          <section><h2>5. Prohibited use</h2><p>You must not misuse the website, attempt unauthorized access, manipulate referrals or transactions, submit false information, or interfere with website security or availability.</p></section>
          <section><h2>6. Contact</h2><p>Questions about these terms can be sent to <a href="mailto:support@hindfragrance.com">support@hindfragrance.com</a>.</p></section>
        </div>
      </article>
    </PublicLayout>
  );
}
