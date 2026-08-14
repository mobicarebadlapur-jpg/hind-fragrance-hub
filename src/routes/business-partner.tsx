import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Link2, ShieldCheck, Wallet } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/business-partner")({
  head: () => ({
    meta: [
      { title: "Business Partner Programme — Hind Fragrance" },
      {
        name: "description",
        content:
          "Join the Hind Fragrance Business Partner programme for ₹199, get a referral link and earn commission on eligible product sales.",
      },
      { property: "og:title", content: "Business Partner Programme — Hind Fragrance" },
      {
        property: "og:description",
        content: "Refer, sell and earn commission with Hind Fragrance.",
      },
    ],
  }),
  component: BusinessPartner,
});

function BusinessPartner() {
  const { data: settings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("key,value")
        .in("key", ["membership", "commission"]);
      const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Record<
        string,
        Record<string, number>
      >;
      return {
        price: Number(map["membership"]?.["price"] ?? 199),
        percent: Number(map["commission"]?.["default_percent"] ?? 10),
        minPayout: Number(map["commission"]?.["min_payout"] ?? 500),
        holding: Number(map["commission"]?.["holding_days"] ?? 7),
      };
    },
  });

  const price = settings?.price ?? 199;
  const percent = settings?.percent ?? 10;

  return (
    <PublicLayout>
      <section className="surface-ink">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <span className="eyebrow text-gold">Referral sales programme</span>
          <h1 className="mt-3 font-display text-5xl text-ink-foreground md:text-6xl">
            Become a Hind Fragrance Business Partner
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-ink-foreground/70">
            A one-time ₹{price} registration gets you a Partner ID, a personal referral link and a
            dashboard that tracks every click, order and rupee you earn. Commission is paid on
            eligible product sales only — there is no recruitment income and no guaranteed returns.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="gold">
              <Link to="/join">Join for ₹{price}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost-inverted">
              <Link to="/shop">See the products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <span className="eyebrow">How it works</span>
        <h2 className="mt-2 font-display text-4xl">Four simple steps</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Register",
              body: `Sign up and pay the one-time ₹${price} membership fee.`,
            },
            {
              icon: Link2,
              title: "Get your link",
              body: "Receive your Partner ID and unique referral link instantly.",
            },
            {
              icon: BarChart3,
              title: "Share & track",
              body: "Share with customers and watch clicks and orders live.",
            },
            {
              icon: Wallet,
              title: "Get paid",
              body: `Earn ${percent}% commission and withdraw to bank or UPI.`,
            },
          ].map((step, index) => (
            <li key={step.title} className="rounded-xl border border-border bg-card p-6">
              <span className="eyebrow">Step {index + 1}</span>
              <step.icon className="mt-3 h-5 w-5 text-gold" />
              <h3 className="mt-3 font-display text-xl">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { label: "Membership fee", value: `₹${price} once` },
            { label: "Default commission", value: `${percent}% per eligible sale` },
            { label: "Minimum payout", value: `₹${settings?.minPayout ?? 500}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
              <p className="eyebrow">{stat.label}</p>
              <p className="mt-2 font-display text-3xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <span className="eyebrow">Questions</span>
        <h2 className="mt-2 font-display text-4xl">Programme FAQ</h2>
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="1">
            <AccordionTrigger>How is commission calculated?</AccordionTrigger>
            <AccordionContent>
              Commission is a percentage of the product subtotal only — shipping, taxes and
              discounts are excluded. Individual products may carry their own commission rate, which
              overrides the default {percent}%.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>When does my commission become withdrawable?</AccordionTrigger>
            <AccordionContent>
              A commission is created when the referred order is paid, and becomes approved after a{" "}
              {settings?.holding ?? 7}-day holding period covering returns. Cancelled or refunded
              orders reverse the commission automatically.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="3">
            <AccordionTrigger>Can I earn from my own purchases?</AccordionTrigger>
            <AccordionContent>
              No. Self-referral is blocked server-side — using your own referral link on your own
              order will not generate commission.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="4">
            <AccordionTrigger>Is this an investment or an income scheme?</AccordionTrigger>
            <AccordionContent>
              No. This is a referral sales programme. There is no guaranteed income, no returns on
              the membership fee, and no earnings from recruiting other partners.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </PublicLayout>
  );
}
