"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { addonCategories, addons, type AddonCategory } from "@/config/addons";
import { packageById, packages, type PackageId } from "@/config/pricing";
import {
  computeTotals,
  DEFAULT_PACKAGE,
  normalizeSelection,
  parseSelection,
  serializeSelection,
  type Selection,
} from "@/lib/pricing";
import { AddonCard } from "./addon-card";
import { Summary } from "./summary";

export function Configurator() {
  const t = useTranslations("Addons");
  const p = useTranslations("Pricing");
  const locale = useLocale();
  const format = useFormatter();
  const searchParams = useSearchParams();

  const eur = (n: number) =>
    format.number(n, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  // The URL is the shareable source of truth; local state keeps rapid clicks consistent.
  const [sel, setSel] = useState<Selection>(() => parseSelection(searchParams));
  const [seenQuery, setSeenQuery] = useState(searchParams.toString());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AddonCategory | "all">("all");

  // External navigation (e.g. "Choose Starter" in the pricing section) changes the params.
  if (searchParams.toString() !== seenQuery) {
    setSeenQuery(searchParams.toString());
    if (searchParams.toString() !== serializeSelection(sel)) setSel(parseSelection(searchParams));
  }

  function commit(next: Selection) {
    const normalized = normalizeSelection(next);
    setSel(normalized);
    const { pathname, hash } = window.location;
    window.history.replaceState(null, "", `${pathname}?${serializeSelection(normalized)}${hash}`);
  }

  const pkg = packageById(sel.pkg) ?? packages[0]!;
  const totals = useMemo(() => computeTotals(sel), [sel]);
  const pkgName = p(`packages.${pkg.id}.name`);

  const names = useMemo(
    () => Object.fromEntries(addons.map((a) => [a.id, t(`items.${a.id}` as never)])),
    [t],
  );

  const needle = query.trim().toLocaleLowerCase(locale);
  const groups = addonCategories
    .filter((c) => category === "all" || category === c)
    .map((c) => ({
      category: c,
      items: addons.filter(
        (a) => a.category === c && (!needle || (names[a.id] ?? "").toLocaleLowerCase(locale).includes(needle)),
      ),
    }))
    .filter((g) => g.items.length > 0);

  const toggle = (id: string) => {
    const items = { ...sel.items };
    if (items[id]) delete items[id];
    else items[id] = 1;
    commit({ ...sel, items });
  };
  const setQty = (id: string, qty: number) => commit({ ...sel, items: { ...sel.items, [id]: qty } });
  const selectPackage = (id: PackageId) => commit({ ...sel, pkg: id });

  const chip = (active: boolean) =>
    `border px-3 py-2 text-sm font-medium transition-colors ${
      active ? "border-btn-bg bg-btn-bg text-btn-fg" : "border-line hover:border-fg"
    }`;

  return (
    <div className="mt-16 md:mt-24">
      <fieldset>
        <legend className="mb-4 text-sm font-medium uppercase tracking-widest text-muted">{t("package")}</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {packages.map((option) => (
            <label key={option.id} className="relative cursor-pointer">
              <input
                type="radio"
                name="package"
                value={option.id}
                checked={sel.pkg === option.id}
                onChange={() => selectPackage(option.id)}
                className="peer sr-only"
              />
              <span className="block border border-line bg-bg p-4 transition-colors hover:border-fg peer-checked:border-fg peer-checked:bg-btn-bg peer-checked:text-btn-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                <span className="block text-base font-semibold">{p(`packages.${option.id}.name`)}</span>
                <span className="block text-sm opacity-70">{eur(option.price)}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
        <div>
          <div className="space-y-4">
            <label htmlFor="addon-search" className="sr-only">
              {t("search")}
            </label>
            <input
              id="addon-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full border border-line bg-bg px-4 py-3 text-base outline-none placeholder:text-muted focus:border-fg"
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label={t("categories.pages")}>
              <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className={chip(category === "all")}>
                {t("all")}
              </button>
              {addonCategories.map((c) => (
                <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={chip(category === c)}>
                  {t(`categories.${c}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-12">
            {groups.length === 0 && <p className="text-muted">{t("noResults")}</p>}
            {groups.map((g) => (
              <section key={g.category} aria-labelledby={`group-${g.category}`}>
                <h3 id={`group-${g.category}`} className="mb-4 font-sans text-sm font-medium uppercase tracking-widest text-muted">
                  {t(`categories.${g.category}`)}
                </h3>
                <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {g.items.map((addon) => (
                    <AddonCard
                      key={addon.id}
                      addon={addon}
                      pkg={pkg}
                      qty={sel.items[addon.id] ?? 0}
                      name={names[addon.id] ?? addon.id}
                      eur={eur}
                      onToggle={() => toggle(addon.id)}
                      onQty={(q) => setQty(addon.id, q)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <Summary
          pkg={pkg}
          pkgName={pkgName}
          totals={totals}
          names={names}
          eur={eur}
          query={serializeSelection(sel)}
          hasAddons={totals.lines.length > 0 || totals.rush > 0}
          onReset={() => commit({ pkg: DEFAULT_PACKAGE, items: {} })}
        />
      </div>
    </div>
  );
}

