import { useSyncExternalStore } from "react";

export interface Consent {
  v: 1;
  /** Strictly-necessary cookies (session, locale, theme, Turnstile) are always on and not listed here. */
  analytics: boolean;
  ts: number;
}

export const CONSENT_COOKIE = "tc_consent";
const EVENT = "tc:consent";
const MAX_AGE = 60 * 60 * 24 * 182; // re-ask after ~6 months

export function readConsent(): Consent | null {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
    if (!raw) return null;
    const c = JSON.parse(decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1))) as Consent;
    return c.v === 1 && typeof c.analytics === "boolean" ? c : null;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean) {
  const value = encodeURIComponent(JSON.stringify({ v: 1, analytics, ts: Date.now() } satisfies Consent));
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  window.dispatchEvent(new Event(EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};

/** undefined on the server and during hydration, null = not decided yet. Gate any non-essential script on `?.analytics`. */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore(
    subscribe,
    () => (readConsent() ? document.cookie : "none"),
    () => undefined,
  );
  if (raw === undefined) return undefined;
  return readConsent();
}
