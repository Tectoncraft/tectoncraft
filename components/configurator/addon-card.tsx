"use client";

import { useTranslations } from "next-intl";
import type { Addon } from "@/config/addons";
import type { Package } from "@/config/pricing";
import { isIncluded, maxQty } from "@/lib/pricing";

interface Props {
  addon: Addon;
  pkg: Package;
  qty: number;
  name: string;
  /** Formats a EUR amount. */
  eur: (n: number) => string;
  onToggle: () => void;
  onQty: (qty: number) => void;
}

export function AddonCard({ addon, pkg, qty, name, eur, onToggle, onQty }: Props) {
  const t = useTranslations("Addons");
  const included = isIncluded(addon, pkg);
  const active = qty > 0 && !included;
  const max = maxQty(addon, pkg);
  const min = addon.qty?.min ?? 1;
  const unit = addon.unit ? t(`units.${addon.unit}`) : null;
  const note = t.has(`notes.${addon.id}` as never) ? t(`notes.${addon.id}` as never) : null;

  const price =
    addon.type === "percent"
      ? `+${addon.price}% ${t("ofPackage")}`
      : addon.type === "monthly"
        ? `${eur(addon.price)}${t("perMonth")}`
        : [
            eur(addon.price) + (unit ? ` ${unit}` : ""),
            addon.monthly ? `+ ${eur(addon.monthly)}${t("perMonth")}` : null,
          ]
            .filter(Boolean)
            .join(" ");

  const stepBtn =
    "inline-flex size-9 items-center justify-center border border-line text-lg leading-none transition-colors hover:border-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line";

  return (
    <li
      className={`border bg-bg transition-colors ${
        included ? "border-line bg-surface" : active ? "border-fg" : "border-line hover:border-fg"
      }`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={active || included}
        disabled={included}
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left disabled:cursor-default"
      >
        <span
          aria-hidden="true"
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border text-xs ${
            active || included ? "border-btn-bg bg-btn-bg text-btn-fg" : "border-line"
          }`}
        >
          {(active || included) && "✓"}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-base font-medium ${included ? "text-muted" : ""}`}>{name}</span>
          <span className="block text-sm text-muted">
            {included ? t("unavailable") : price}
            {note && !included && ` · ${note}`}
          </span>
        </span>
        {included && (
          <span className="shrink-0 border border-line bg-bg px-2 py-0.5 text-xs font-medium uppercase tracking-widest">
            {t("included")}
          </span>
        )}
      </button>

      {active && addon.qty && max > 1 && (
        <div className="flex items-center justify-between border-t border-line px-4 py-3">
          <span id={`qty-${addon.id}`} className="text-sm text-muted">
            {t("qty")}
          </span>
          <div role="group" aria-labelledby={`qty-${addon.id}`} className="flex items-center gap-2">
            <button type="button" aria-label={t("decrease")} disabled={qty <= min} onClick={() => onQty(qty - 1)} className={stepBtn}>
              −
            </button>
            <output aria-live="polite" className="w-8 text-center font-medium tabular-nums">
              {qty}
            </output>
            <button type="button" aria-label={t("increase")} disabled={qty >= max} onClick={() => onQty(qty + 1)} className={stepBtn}>
              +
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
