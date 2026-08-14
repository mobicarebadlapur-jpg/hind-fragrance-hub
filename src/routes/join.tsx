import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/session";
import { referralUrl } from "@/lib/referral";
import { sendOtp, verifyOtp } from "@/lib/otp.functions";
import { createMembershipOrder, verifyMembershipPayment } from "@/lib/membership.functions";
import { ensureProfile } from "@/lib/account.functions";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join as a Business Partner for ₹199 — Hind Fragrance" },
      {
        name: "description",
        content:
          "Register as a Hind Fragrance Business Partner for ₹199, verify your mobile and start earning referral commission.",
      },
      { property: "og:title", content: "Join as a Business Partner — Hind Fragrance" },
      { property: "og:description", content: "One-time ₹199 registration. Earn on every referral." },
    ],
  }),
  component: Join,
});

function Join() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const requestOtp = useServerFn(sendOtp);
  const checkOtp = useServerFn(verifyOtp);
  const startPayment = useServerFn(createMembershipOrder);
  const confirmPayment = useServerFn(verifyMembershipPayment);
  const saveProfile = useServerFn(ensureProfile);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ partnerCode: string; referralCode: string } | null>(null);

  if (!isPending && !session?.userId) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="font-display text-4xl">Sign in to continue</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Create your Hind Fragrance account first, then complete the ₹199 partner registration.
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate({ to: "/auth", search: { redirect: "/join", mode: "signup" } })}
          >
            Create account
          </Button>
        </div>
      </PublicLayout>
    );
  }

  if (session?.partner?.status === "active" && !result) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="font-display text-4xl">You're already a partner</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Partner ID {session.partner.partner_code}
          </p>
          <Button asChild className="mt-6">
            <Link to="/partner">Open dashboard</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  async function handleSendOtp() {
    setBusy(true);
    try {
      const res = await requestOtp({ data: { mobile } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setHint(res.demoCode ? `Demo mode: your OTP is ${res.demoCode}` : null);
      setStep(2);
      toast.success("OTP sent to your mobile.");
    } catch {
      toast.error("Enter a valid 10 digit mobile number.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    setBusy(true);
    try {
      const res = await checkOtp({ data: { mobile, code } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      await saveProfile({ data: { full_name: fullName, mobile } });
      setStep(3);
    } catch {
      toast.error("Enter the 6 digit code.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePay() {
    setBusy(true);
    try {
      const order = await startPayment({});
      if (!order.ok) {
        toast.error(order.error);
        return;
      }
      // Demo mode simulates the gateway callback; production hands the order to Razorpay Checkout.
      const verified = await confirmPayment({ data: { gatewayOrderId: order.gatewayOrderId } });
      if (!verified.ok) {
        toast.error(verified.error);
        return;
      }
      setResult({ partnerCode: verified.partnerCode, referralCode: verified.referralCode });
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Membership activated!");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    const link = referralUrl(result.referralCode);
    return (
      <PublicLayout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20">
            <Check className="h-6 w-6 text-gold" />
          </div>
          <h1 className="mt-6 font-display text-4xl">Welcome, partner</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your Partner ID is{" "}
            <span className="font-medium text-foreground">{result.partnerCode}</span>
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left">
            <p className="eyebrow">Your referral link</p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-secondary px-3 py-2 text-xs">
                {link}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  void navigator.clipboard.writeText(link);
                  toast.success("Referral link copied");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button asChild className="mt-8" size="lg">
            <Link to="/partner">Open my dashboard</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-lg px-4 py-16">
        <span className="eyebrow">Step {step} of 3</span>
        <h1 className="mt-2 font-display text-4xl">Business Partner registration</h1>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mobile">Mobile number</Label>
                <Input
                  id="mobile"
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10 digit mobile"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSendOtp}
                disabled={busy || mobile.length !== 10 || fullName.trim().length < 2}
              >
                {busy ? "Sending…" : "Send OTP"}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter the 6 digit code sent to {mobile}.
              </p>
              {hint && <p className="rounded-md bg-secondary p-3 text-xs">{hint}</p>}
              <Input
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                className="text-center tracking-[0.5em]"
              />
              <Button className="w-full" onClick={handleVerify} disabled={busy || code.length !== 6}>
                {busy ? "Verifying…" : "Verify mobile"}
              </Button>
              <button
                className="w-full text-xs text-muted-foreground underline underline-offset-4"
                onClick={handleSendOtp}
                disabled={busy}
              >
                Resend OTP
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <span className="text-sm text-muted-foreground">Business Partner Membership</span>
                <span className="font-display text-3xl">₹199</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Unique Partner ID and referral link</li>
                <li>• Live earnings, clicks and orders dashboard</li>
                <li>• Bank / UPI payouts once approved</li>
              </ul>
              <Button className="w-full" size="lg" onClick={handlePay} disabled={busy}>
                {busy ? "Processing…" : "Pay ₹199 and activate"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                One-time, non-refundable registration fee. Commission is earned on eligible product
                sales only.
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
