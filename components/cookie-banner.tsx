"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useConsent, writeConsent } from "@/lib/consent";

/**
 * GDPR consent banner. Accept and reject carry equal weight; nothing non-essential
 * runs before a choice. Reopened from the footer's "Cookie settings" button.
 */
export function CookieBanner() {
  const t = useTranslations("Cookies");
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest("[data-cookie-settings]")) {
        setAnalytics(consent?.analytics ?? false);
        setDetails(true);
        setReopened(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [consent]);

  if (consent === undefined || (consent && !reopened)) return null;

  const decide = (value: boolean) => {
    writeConsent(value);
    setReopened(false);
    setDetails(false);
  };

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-3xl border border-fg bg-bg p-5 text-fg md:p-6"
    >
      <h2 id="cookie-title" className="font-display text-xl font-semibold tracking-tight">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-muted">
        {t("text")}{" "}
        <Link href="/privacy" className="underline">
          {t("privacy")}
        </Link>
      </p>

      {details && (
        <div className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
          <label className="flex items-start gap-3">
            <input type="checkbox" checked disabled className="mt-1 size-4 accent-[var(--fg)]" />
            <span>
              <span className="font-medium">{t("necessary")}</span>
              <span className="block text-muted">{t("necessaryText")}</span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1 size-4 accent-[var(--fg)]"
            />
            <span>
              <span className="font-medium">{t("analytics")}</span>
              <span className="block text-muted">{t("analyticsText")}</span>
            </span>
          </label>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={() => decide(true)}>
          {t("accept")}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => decide(false)}>
          {t("reject")}
        </button>
        {details ? (
          <button type="button" className="btn btn-secondary" onClick={() => decide(analytics)}>
            {t("save")}
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setDetails(true)}>
            {t("settings")}
          </button>
        )}
      </div>
    </section>
  );
}
