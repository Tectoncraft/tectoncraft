"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Honeypot } from "@/components/forms/fields";
import { Turnstile } from "@/components/forms/turnstile";
import { useSubmit } from "@/components/forms/use-submit";

/** Double opt-in signup: stores the address unconfirmed and emails a confirmation link. */
export function NewsletterForm() {
  const t = useTranslations("Footer");
  const f = useTranslations("Forms");
  const locale = useLocale();
  const [engaged, setEngaged] = useState(false);
  const [token, setToken] = useState("");
  const { status, submit, resetKey } = useSubmit("/api/newsletter");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    await submit({ email: String(d.get("email") ?? ""), locale, token, website: String(d.get("website") ?? "") });
  }

  if (status === "success") {
    return (
      <p role="status" className="max-w-sm text-sm">
        {t("newsletterSent")}
      </p>
    );
  }
  const error = status !== "idle" && status !== "sending" ? status : null;

  return (
    <form onSubmit={onSubmit} onFocus={() => setEngaged(true)} className="relative max-w-sm">
      <label htmlFor="newsletter-email" className="text-sm font-medium">
        {t("newsletter")}
      </label>
      <div className="mt-3 flex border border-bg/30 focus-within:border-bg">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("newsletterPlaceholder")}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-bg/40"
        />
        <button type="submit" disabled={status === "sending"} className="px-4 text-sm font-medium hover:opacity-60 disabled:opacity-40">
          {status === "sending" ? f("sending") : t("subscribe")}
        </button>
      </div>
      <Honeypot />
      {engaged && (
        <div className="mt-3">
          <Turnstile onToken={setToken} resetKey={resetKey} />
        </div>
      )}
      <p className="mt-2 text-xs text-bg/60">{t("newsletterNote")}</p>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium">
          {f(`errors.${error}`)}
        </p>
      )}
    </form>
  );
}
