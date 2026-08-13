import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeIndianRupee, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-fragrance.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hind Fragrance — Alcohol-Free Attars & Perfumes in India" },
      {
        name: "description",
        content:
          "Shop alcohol-free attars, perfumes and home fragrances from Hind Fragrance, and earn referral commission as a ₹199 Business Partner.",
      },
      { property: "og:title", content: "Hind Fragrance — Alcohol-Free Attars & Perfumes" },
      {
        property: "og:description",
        content: "Handcrafted Indian attars, perfume oils and home fragrances.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("featured", { ascending: false })
        .limit(4);
      return data ?? [];
    },
  });

  return (
    <PublicLayout>
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Hand-blended attar bottles on a warm parchment surface"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/25" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-28 md:py-36">
          <span className="eyebrow text-gold">Alhind Fragrance India</span>
          <h1 className="max-w-2xl font-display text-5xl leading-[1.05] text-ink-foreground md:text-6xl">
            Alcohol-free attars, blended in the Indian tradition.
          </h1>
          <p className="max-w-xl text-ink-foreground/75">
            Long-lasting perfume oils, roll-ons and home fragrances — crafted in small batches and
            shipped across India. Become a Business Partner for ₹199 and earn commission on every
            sale you refer.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/shop">
                Shop the collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="gold-outline">
              <Link to="/business-partner">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Leaf, title: "Alcohol-free", body: "Pure oil concentrates, skin friendly." },
            { icon: Sparkles, title: "Long lasting", body: "8–12 hours of steady projection." },
            { icon: ShieldCheck, title: "Secure payments", body: "Encrypted checkout, tracked orders." },
            {
              icon: BadgeIndianRupee,
              title: "Earn as a partner",
              body: "Commission on every referred sale.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-6">
              <item.icon className="h-5 w-5 text-gold" />
              <h3 className="mt-4 font-display text-xl">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="eyebrow">Bestsellers</span>
            <h2 className="mt-2 font-display text-4xl">Signature fragrances</h2>
          </div>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(products ?? []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products?.length === 0 && (
            <p className="text-sm text-muted-foreground">Products are being added shortly.</p>
          )}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="surface-ink rounded-2xl px-8 py-14 text-center">
          <span className="eyebrow text-gold">Business Partner Programme</span>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl text-ink-foreground">
            Join once for ₹199. Earn commission on every sale you refer.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ink-foreground/70">
            Get your own referral link and Partner ID, share it anywhere, and track clicks, orders
            and earnings from a live dashboard. Commission is paid on eligible product sales only.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="gold">
              <Link to="/join">Join for ₹199</Link>
            </Button>
            <Button asChild size="lg" variant="ghost-inverted">
              <Link to="/business-partner">How it works</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
