import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="surface-ink mt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm text-ink-foreground/70">
            Hind Fragrance (Alhind Fragrance India) crafts alcohol-free attars, perfumes and home
            fragrances. Our Business Partner programme is a referral sales programme — partners
            earn commission on eligible product sales only.
          </p>
        </div>
        <div>
          <h3 className="eyebrow">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/75">
            <li>
              <Link to="/shop">Shop all</Link>
            </li>
            <li>
              <Link to="/business-partner">Business Partner</Link>
            </li>
            <li>
              <Link to="/join">Join for ₹199</Link>
            </li>
            <li>
              <Link to="/auth">Login</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/75">
            <li>support@hindfragrance.com</li>
            <li>+91 90000 00000</li>
            <li>India</li>
            <li>
              <Link to="/demo">Demo access</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-ink-foreground/50">
        © {new Date().getFullYear()} Hind Fragrance. Commission is paid only on eligible product
        sales. No guaranteed income. This is not an investment scheme.
      </div>
    </footer>
  );
}
