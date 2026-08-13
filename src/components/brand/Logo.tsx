import { Link } from "@tanstack/react-router";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full border ${
          inverted ? "border-gold/60" : "border-gold"
        }`}
      >
        <span className="font-display text-lg leading-none text-gold">HF</span>
      </span>
      <span className="leading-tight">
        <span
          className={`block font-display text-lg font-semibold ${inverted ? "text-ink-foreground" : "text-foreground"}`}
        >
          Hind Fragrance
        </span>
        <span className="eyebrow block">Alcohol-free attars</span>
      </span>
    </Link>
  );
}
