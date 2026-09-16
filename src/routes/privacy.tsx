import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Hind Fragrance" }] }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-4 py-14">
        <span className="eyebrow">Legal</span>
        <h1 className="mt-2 font-display text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>
        <div className="prose prose-sm mt-10 max-w-none space-y-8 text-foreground/80">
          <section><h2>1. Information we collect</h2><p>When you create an account, place an order, join the Business Partner programme, or contact us, we may collect information such as your name, email address, mobile number, shipping address, account details, order details and partner/referral information needed to provide the requested service.</p></section>
          <section><h2>2. How we use information</h2><p>We use information to operate accounts, process orders and payments, deliver products, provide customer support, manage partner commissions and payouts, prevent fraud and abuse, maintain security, and comply with applicable legal obligations.</p></section>
          <section><h2>3. Payments</h2><p>Payment information is processed through the payment provider configured for the store. We do not ask customers to send card, UPI PIN, CVV or other sensitive payment credentials to us by email or chat.</p></section>
          <section><h2>4. Sharing</h2><p>We may share only the information reasonably necessary with service providers involved in hosting, payment processing, authentication, shipping, communications and fraud prevention, or when required by law.</p></section>
          <section><h2>5. Security and retention</h2><p>We use access controls, server-side checks and database security policies intended to protect customer and partner information. We retain information only for as long as reasonably necessary for the purposes described above, including accounting, dispute resolution and legal requirements.</p></section>
          <section><h2>6. Your choices</h2><p>You may contact us to request access, correction or deletion of personal information, subject to applicable legal and operational requirements.</p></section>
          <section><h2>7. Contact</h2><p>For privacy questions, contact <a href="mailto:support@hindfragrance.com">support@hindfragrance.com</a>.</p></section>
        </div>
      </article>
    </PublicLayout>
  );
}
