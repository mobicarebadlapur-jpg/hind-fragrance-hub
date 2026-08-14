import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { seedDemoAccounts } from "@/lib/demo.functions";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo Access — Hind Fragrance Platform" },
      {
        name: "description",
        content: "Create demo admin, partner and customer logins to explore the Hind Fragrance platform.",
      },
      { property: "og:title", content: "Demo Access — Hind Fragrance" },
      { property: "og:description", content: "Explore the platform with demo credentials." },
    ],
  }),
  component: Demo,
});

function Demo() {
  const seed = useServerFn(seedDemoAccounts);
  const [busy, setBusy] = useState(false);
  const [accounts, setAccounts] = useState<{ email: string; password: string; role: string }[]>([]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-4 py-16">
        <span className="eyebrow">Testing</span>
        <h1 className="mt-2 font-display text-4xl">Demo access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Generate ready-to-use admin, partner and customer logins so you can test the full
          purchase → commission → payout lifecycle. Payments and OTP run in demo mode until live
          keys are configured.
        </p>
        <Button
          className="mt-6"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const res = await seed({});
              setAccounts(res.accounts as { email: string; password: string; role: string }[]);
              toast.success("Demo accounts ready");
            } catch {
              toast.error("Could not create demo accounts.");
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Creating…" : "Create demo accounts"}
        </Button>

        {accounts.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Password</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.email} className="border-t border-border">
                    <td className="p-3 capitalize">{a.role}</td>
                    <td className="p-3">{a.email}</td>
                    <td className="p-3 font-mono text-xs">{a.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
