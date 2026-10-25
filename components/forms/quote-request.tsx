"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { serializeSelection, type Selection } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "./dialog";
import { Field, Honeypot, inputCls } from "./fields";
import { Turnstile } from "./turnstile";
import { useSubmit } from "./use-submit";

const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * "Request this quote". Signed-in visitors save straight to their account;
 * everyone else gets a short form with the configuration attached.
 */
export function QuoteRequest({ selection }: { selection: Selection }) {
  const t = useTranslations("Quote");
  const f = useTranslations("Forms");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);
  const { status, submit, resetKey, reset } = useSubmit("/api/quotes");

  const payload = (extra: Record<string, unknown>) => ({ kind: "quote", locale, selection, ...extra });

  async function onClick() {
    if (supabaseConfigured) {
      const { data } = await createClient().auth.getUser();
      if (data.user) {
        const res = await submit(payload({}));
        if (res.ok) setSaved(true);
        return;
      }
    }
    setOpen(true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const str = (k: string) => String(d.get(k) ?? "");
    await submit(
      payload({
        token,
        website: str("website"),
        name: str("name"),
        email: str("email"),
        message: str("message"),
        consent: d.get("consent") === "on",
      }),
    );
  }

  const close = () => {
    setOpen(false);
    reset();
  };
  const errorKey = status !== "idle" && status !== "sending" && status !== "success" ? status : null;
  const next = `/${locale}?${serializeSelection(selection)}#add-ons`;

  return (
    <>
      <button type="button" onClick={onClick} disabled={status === "sending" && !open} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {status === "sending" && !open ? f("sending") : t("cta")}
      </button>
      <div role="status" aria-live="polite">
        {saved && (
          <p className="mt-3 text-sm">
            {t("saved")}{" "}
            <Link href="/dashboard" className="underline">
              {t("viewDashboard")}
            </Link>
          </p>
        )}
        {!open && errorKey && (
          <p role="alert" className="mt-3 text-sm font-medium">
            {f(`errors.${errorKey}`)}
          </p>
        )}
      </div>

      <Modal open={open} onClose={close} title={t("title")} closeLabel={f("close")}>
        {status === "success" ? (
          <div role="status" className="mt-6">
            <p className="font-medium">{t("successTitle")}</p>
            <p className="mt-2 text-muted">{t("successText")}</p>
            <button type="button" onClick={close} className="btn btn-secondary mt-8">
              {f("close")}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="relative mt-4 space-y-5">
            <p className="text-muted">{t("intro")}</p>
            <Field label={f("name")} htmlFor="q-name">
              <input id="q-name" name="name" required minLength={2} autoComplete="name" className={inputCls} />
            </Field>
            <Field label={f("email")} htmlFor="q-email">
              <input id="q-email" name="email" type="email" required autoComplete="email" className={inputCls} />
            </Field>
            <Field label={t("message")} htmlFor="q-msg" hint={f("optional")}>
              <textarea id="q-msg" name="message" rows={3} maxLength={2000} className={inputCls} />
            </Field>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="consent" required className="mt-1 size-4 accent-[var(--fg)]" />
              <span>
                {f("consent")}{" "}
                <Link href="/privacy" className="underline">
                  {f("privacy")}
                </Link>
              </span>
            </label>
            <Honeypot />
            {open && <Turnstile onToken={setToken} resetKey={resetKey} />}
            {errorKey && (
              <p role="alert" className="text-sm font-medium">
                {f(`errors.${errorKey}`)}
              </p>
            )}
            <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full disabled:opacity-60">
              {status === "sending" ? f("sending") : f("send")}
            </button>
            <p className="text-sm text-muted">
              {t("haveAccount")}{" "}
              <Link href={{ pathname: "/login", query: { next } }} className="underline">
                {t("login")}
              </Link>
            </p>
          </form>
        )}
      </Modal>
    </>
  );
}
