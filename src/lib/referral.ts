import { supabase } from "@/integrations/supabase/client";

const KEY = "hf_referral";

type StoredReferral = { code: string; at: number; expires: number };

/** Persist the referral code from ?ref= for the configured cookie window. */
export function captureReferral(search: string, landingPage: string, cookieDays = 30) {
  if (typeof window === "undefined") return;
  const code = new URLSearchParams(search).get("ref");
  if (!code) return;
  const existing = readReferralRecord();
  const payload: StoredReferral = {
    code: code.toUpperCase(),
    at: Date.now(),
    expires: Date.now() + cookieDays * 86400000,
  };
  // Default attribution rule: last valid click wins.
  window.localStorage.setItem(KEY, JSON.stringify(payload));
  document.cookie = `hf_ref=${payload.code}; path=/; max-age=${cookieDays * 86400}; SameSite=Lax`;
  if (existing?.code === payload.code && Date.now() - existing.at < 60_000) return;
  void logReferralClick(payload.code, landingPage);
}

function readReferralRecord(): StoredReferral | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReferral;
    if (parsed.expires < Date.now()) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getReferralCode(): string | null {
  return readReferralRecord()?.code ?? null;
}

export function clearReferral() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

async function logReferralClick(code: string, landingPage: string) {
  const { data: partner } = await supabase
    .from("partners")
    .select("id")
    .eq("referral_code", code)
    .maybeSingle();
  await supabase.from("referral_clicks").insert({
    referral_code: code,
    partner_id: partner?.id ?? null,
    landing_page: landingPage,
  });
}

export function referralUrl(code: string, path = "/"): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://hindfragrance.com";
  return `${origin}${path}?ref=${code}`;
}
