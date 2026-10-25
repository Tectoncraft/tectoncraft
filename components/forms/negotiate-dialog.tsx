"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { budget } from "@/config/pricing";
import { Link } from "@/i18n/navigation";
import { Modal } from "./dialog";
import { Field, Honeypot, inputCls } from "./fields";
import { Turnstile } from "./turnstile";
import { useSubmit } from "./use-submit";

export function NegotiateDialog({ label }: { label: string }) {
  const t = useTranslations("Negotiate");
  const f = useTranslations("Forms");
  const locale = useLocale();
  const format = useFormatter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(budget.min);
  const [token, setToken] = useState("");
  const { status, submit, resetKey, reset } = useSubmit("/api/quotes");

  const eur = (n: number) => format.number(n, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const close = () => {
    setOpen(false);
    reset();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const str = (k: string) => String(d.get(k) ?? "");
    await submit({
      kind: "negotiate",
      locale,
      token,
      website: str("website"),
      name: str("name"),
      email: str("email"),
      company: str("company"),
      country: str("country"),
      phone: str("phone"),
      budget: amount,
      description: str("description"),
      launchDate: str("launchDate"),
      contact: str("contact"),
      consent: d.get("consent") === "on",
    });
  }

  const errorKey = status !== "idle" && status !== "sending" && status !== "success" ? status : null;

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
        {label}
      </button>
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
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={f("name")} htmlFor="ng-name">
                <input id="ng-name" name="name" required minLength={2} autoComplete="name" className={inputCls} />
              </Field>
              <Field label={f("email")} htmlFor="ng-email">
                <input id="ng-email" name="email" type="email" required autoComplete="email" className={inputCls} />
              </Field>
              <Field label={f("company")} htmlFor="ng-company" hint={f("optional")}>
                <input id="ng-company" name="company" autoComplete="organization" className={inputCls} />
              </Field>
              <Field label={f("country")} htmlFor="ng-country">
                <select id="ng-country" name="country" required defaultValue="DE" className={inputCls}>
                  <option value="DE">{f("countryDE")}</option>
                  <option value="GR">{f("countryGR")}</option>
                  <option value="other">{f("countryOther")}</option>
                </select>
              </Field>
              <Field label={f("phone")} htmlFor="ng-phone" hint={f("optional")}>
                <input id="ng-phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
              </Field>
              <Field label={t("launch")} htmlFor="ng-launch" hint={f("optional")}>
                <input id="ng-launch" name="launchDate" type="date" className={inputCls} />
              </Field>
            </div>

            <Field label={t("budget")} htmlFor="ng-budget">
              <input
                id="ng-budget"
                type="range"
                min={budget.min}
                max={budget.max}
                step={budget.step}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                aria-valuetext={amount >= budget.max ? t("budgetMax", { amount: eur(amount) }) : eur(amount)}
                className="w-full accent-[var(--fg)]"
              />
              <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
                {amount >= budget.max ? t("budgetMax", { amount: eur(amount) }) : eur(amount)}
              </p>
            </Field>

            <Field label={t("description")} htmlFor="ng-desc">
              <textarea id="ng-desc" name="description" required minLength={10} maxLength={4000} rows={4} className={inputCls} />
            </Field>

            <fieldset>
              <legend className="mb-2 text-sm font-medium">{t("contact")}</legend>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {(["email", "phone", "whatsapp"] as const).map((c) => (
                  <label key={c} className="flex items-center gap-2 text-base">
                    <input type="radio" name="contact" value={c} defaultChecked={c === "email"} className="accent-[var(--fg)]" />
                    {t(`contact_${c}`)}
                  </label>
                ))}
              </div>
            </fieldset>

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
          </form>
        )}
      </Modal>
    </>
  );
}
