import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Attars & Perfumes — Hind Fragrance" },
      {
        name: "description",
        content:
          "Browse alcohol-free attars, perfume oils, roll-ons and home fragrances from Hind Fragrance, shipped across India.",
      },
      { property: "og:title", content: "Shop Attars & Perfumes — Hind Fragrance" },
      {
        property: "og:description",
        content: "Alcohol-free attars, perfume oils and home fragrances.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: products, isPending } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const categories = ["all", ...new Set((products ?? []).map((p) => p.category))];
  const filtered = (products ?? []).filter(
    (p) =>
      (category === "all" || p.category === category) &&
      p.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <span className="eyebrow">The collection</span>
        <h1 className="mt-2 font-display text-5xl">Fragrances</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Every blend is alcohol-free and made in small batches. Free shipping on orders above ₹999.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search fragrances"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                  category === c
                    ? "border-gold bg-gold/15 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {!isPending && filtered.length === 0 && (
          <p className="mt-12 text-sm text-muted-foreground">No fragrances match your search.</p>
        )}
      </div>
    </PublicLayout>
  );
}
