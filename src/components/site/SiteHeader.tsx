import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/business-partner", label: "Business Partner" },
];

export function SiteHeader() {
  const { count } = useCart();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAdmin = session?.roles.includes("admin");
  const isPartner = Boolean(session?.partner);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative p-2" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink">
                {count}
              </span>
            )}
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            {session?.userId ? (
              <>
                {isAdmin && (
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                {isPartner && (
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/partner">Dashboard</Link>
                  </Button>
                )}
                <Button asChild variant="ghost" size="sm">
                  <Link to="/account">Account</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/join">Join for ₹199</Link>
                </Button>
              </>
            )}
          </div>
          <button
            className="p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm"
              >
                {link.label}
              </Link>
            ))}
            {session?.userId ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="px-2 py-2 text-sm">
                    Admin panel
                  </Link>
                )}
                {isPartner && (
                  <Link to="/partner" onClick={() => setOpen(false)} className="px-2 py-2 text-sm">
                    Partner dashboard
                  </Link>
                )}
                <Link to="/account" onClick={() => setOpen(false)} className="px-2 py-2 text-sm">
                  My account
                </Link>
                <Button variant="outline" size="sm" className="mt-2" onClick={signOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to="/join">Join ₹199</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
