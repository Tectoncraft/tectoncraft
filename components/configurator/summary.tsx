"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { pricesInclude, smallBusinessExemption, type Package } from "@/config/pricing";
import { Link } from "@/i18n/navigation";
import type { Totals } from "@/lib/pricing";

interface Props {
  pkg: Package;
  pkgName: string;
  totals: Totals;
  names: Record<string, string>;
  eur: (n: number) => string;
  query: string;
  hasAddons: boolean;
  onReset: () => void;
}

export function Summary({ pkg, pkgName, totals, names, eur, query, hasAddons, onReset }: Props) {
  const t = useTranslations("Addons.summary");
  const a = useTranslations("Addons");
  const p = useTranslations("Pricing");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const row = "flex items-baseline justify-between gap-4 text-base";

  return (
    <aside
      aria-label={t("title")}
      className="border border-fg bg-bg p-6 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto"
    >
      <h3 className="text-2xl font-semibold tracking-tight">{t("title")}</h3>

      <dl className="mt-6 space-y-3 border-t border-line pt-6">
        <div className={row}>
          <dt>
            {t("package")}: <span className="font-medium">{pkgName}</span>
          </dt>
          <dd className="tabular-nums">{eur(totals.base)}</dd>
        </div>
        {totals.lines.map((l) => (
          <div key={l.id} className={`${row} text-muted`}>
            <dt className="min-w-0">
              {names[l.id]}
              {l.qty > 1 && ` × ${l.qty}`}
            </dt>
            <dd className="shrink-0 tabular-nums">
              {[l.oneTime ? eur(l.oneTime) : null, l.monthly ? `${eur(l.monthly)}${a("perMonth")}` : null]
                .filter(Boolean)
                .join(" + ")}
            </dd>
          </div>
        ))}
        {totals.rush > 0 && (
          <div className={`${row} text-muted`}>
            <dt>{t("rush")}</dt>
            <dd className="tabular-nums">{eur(totals.rush)}</dd>
          </div>
        )}
        {!hasAddons && <p className="text-sm text-muted">{t("none")}</p>}
      </dl>

      <dl className="mt-6 space-y-3 border-t border-line pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-medium">{t("oneTime")}</dt>
          <dd className="font-display text-4xl font-semibold tracking-tighter tabular-nums">{eur(totals.oneTime)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-medium">{t("monthly")}</dt>
          <dd className="text-xl font-semibold tabular-nums">
            {totals.monthly > 0 ? `${eur(totals.monthly)}${a("perMonth")}` : <span className="text-muted">{t("noMonthly")}</span>}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 text-sm text-muted">
          <dt>{t("delivery")}</dt>
          <dd>{t("days", { days: totals.days })}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-muted">{smallBusinessExemption ? p("vat.small") : p(`vat.${pricesInclude}`)}</p>

      {/* Phase 5: saves to the account when logged in, otherwise opens the quote form. */}
      <Link href={`/contact?${query}`} className="btn btn-primary mt-6 w-full" data-package={pkg.id}>
        {t("cta")}
      </Link>
      <div className="mt-3 flex justify-between text-sm">
        <button type="button" onClick={onReset} className="link-text text-muted">
          {t("reset")}
        </button>
        <button type="button" onClick={copy} className="link-text text-muted">
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
    </aside>
  );
}
