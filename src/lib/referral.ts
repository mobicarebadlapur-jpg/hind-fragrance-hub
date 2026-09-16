import { supabase } from "@/integrations/supabase/client";

const KEY = "hf_referral";
const VISITOR_KEY = "hf_referral_visitor";

type StoredReferral = { code: string; at: number; expires: number };

/** Persist the referral code from ?ref= for the configured cookie window. */
export function captureReferral(search: string, landingPage: string, cookieDays = 30) {
  if (typeof window === "undefined") return;
  const code = new URLSearchParams(search).get("ref")?.trim();
  if (!code) return;

  const existing = readReferralRecord();
  const visitorId = getReferralVisitorId();
  const payload: StoredReferral = {
    code: code.toUpperCase(),
    at: Date.now(),
    expires: Date.now() + cookieDays * 86400000,
  };

  // Default attribution rule: last valid click wins.
  window.localStorage.setItem(KEY, JSON.stringify(payload));
  document.cookie = `hf_ref=${payload.code}; path=/; max-age=${cookieDays * 86400}; SameSite=Lax`;

  if (existing?.code === payload.code && Date.now() - existing.at < 60_000) return;
  void logReferralClick(payload.code, landingPage, visitorId);
}

function readReferralRecord(): StoredReferral | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReferral;
    if (!parsed.code || parsed.expires < Date.now()) {
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

/** Stable, browser-local identifier used only to bind a click to later checkout attribution. */
export function getReferralVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return null;
  }
}

export function clearReferral() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

async function logReferralClick(code: string, landingPage: string, visitorId: string | null) {
  await supabase.rpc("track_referral_click" as never, {
    p_referral_code: code,
    p_landing_page: landingPage,
    p_visitor_id: visitorId,
  } as never);
}

export function referralUrl(code: string, path = "/"): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://hindfragrance.com";
  const separator = path.includes("?") ? "&" : "?";
  return `${origin}${path}${separator}ref=${encodeURIComponent(code)}`;
}
