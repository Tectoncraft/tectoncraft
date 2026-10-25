"use client";

import { useTranslations } from "next-intl";

/** UI only for now; submission (double opt-in via Supabase + Resend) lands in Phase 5. */
export function NewsletterForm() {
  const t = useTranslations("Footer");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-sm">
      <label htmlFor="newsletter-email" className="text-sm font-medium">
        {t("newsletter")}
      </label>
      <div className="mt-3 flex border border-bg/30 focus-within:border-bg">
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("newsletterPlaceholder")}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-bg/40"
        />
        <button type="submit" className="px-4 text-sm font-medium hover:opacity-60">
          {t("subscribe")}
        </button>
      </div>
      <p className="mt-2 text-xs text-bg/60">{t("newsletterNote")}</p>
    </form>
  );
}
