import { addonById, addons, totalLanguages, type Addon } from "@/config/addons";
import { packageById, packages, type Package, type PackageId } from "@/config/pricing";

export const DEFAULT_PACKAGE: PackageId = "professional";

/** Selected add-ons: id → quantity (1 for add-ons without a stepper). */
export interface Selection {
  pkg: PackageId;
  items: Record<string, number>;
}

export interface Line {
  id: string;
  qty: number;
  oneTime: number;
  monthly: number;
}

export interface Totals {
  base: number;
  addons: number;
  /** Rush surcharge: a percentage of the package price only, rounded to whole euro. */
  rush: number;
  /** base + add-ons + rush */
  oneTime: number;
  monthly: number;
  /** Delivery estimate in days (halved, rounded up, with rush). */
  days: number;
  lines: Line[];
}

const getPackage = (id: PackageId): Package => {
  const pkg = packageById(id);
  if (!pkg) throw new Error(`Unknown package: ${id}`);
  return pkg;
};

/** Highest quantity allowed for an add-on in a package (0 = nothing left to add). */
export function maxQty(addon: Addon, pkg: Package): number {
  if (addon.id === "extra-language") return Math.max(0, totalLanguages - pkg.languages);
  return addon.qty?.max ?? 1;
}

/** Already part of the package (or impossible to add more of): shown as "Included", never charged. */
export function isIncluded(addon: Addon, pkg: Package): boolean {
  return pkg.includedAddons.includes(addon.id) || maxQty(addon, pkg) === 0;
}

/** Drop unknown/included add-ons and clamp quantities. */
export function normalizeSelection(sel: Selection): Selection {
  const pkg = getPackage(sel.pkg);
  const items: Record<string, number> = {};
  for (const [id, raw] of Object.entries(sel.items)) {
    const addon = addonById(id);
    if (!addon || isIncluded(addon, pkg)) continue;
    const min = addon.qty?.min ?? 1;
    const qty = addon.qty ? Math.min(Math.max(Math.trunc(raw) || min, min), maxQty(addon, pkg)) : 1;
    items[id] = qty;
  }
  return { pkg: sel.pkg, items };
}

export function computeTotals(selection: Selection): Totals {
  const sel = normalizeSelection(selection);
  const pkg = getPackage(sel.pkg);

  const lines: Line[] = [];
  let rushPct = 0;
  for (const addon of addons) {
    const qty = sel.items[addon.id];
    if (!qty) continue;
    if (addon.type === "percent") {
      rushPct += addon.price;
      continue;
    }
    lines.push({
      id: addon.id,
      qty,
      oneTime: addon.type === "one-time" ? addon.price * qty : 0,
      monthly: (addon.type === "monthly" ? addon.price : (addon.monthly ?? 0)) * qty,
    });
  }

  const addonsTotal = lines.reduce((sum, l) => sum + l.oneTime, 0);
  const monthly = lines.reduce((sum, l) => sum + l.monthly, 0);
  const rush = Math.round((pkg.price * rushPct) / 100);

  return {
    base: pkg.price,
    addons: addonsTotal,
    rush,
    oneTime: pkg.price + addonsTotal + rush,
    monthly,
    days: rushPct > 0 ? Math.ceil(pkg.days / 2) : pkg.days,
    lines,
  };
}

/**
 * URL state: `?pkg=professional&a=blog,booking&qty=extra-page:3`.
 * `a` lists selected ids; `qty` lists quantities above 1 and also selects.
 */
export function parseSelection(input: string | URLSearchParams): Selection {
  const params = typeof input === "string" ? new URLSearchParams(input) : input;
  const requested = params.get("pkg") ?? "";
  const pkg = packages.find((p) => p.id === requested)?.id ?? DEFAULT_PACKAGE;

  const items: Record<string, number> = {};
  for (const id of (params.get("a") ?? "").split(",")) {
    if (id) items[id] = 1;
  }
  for (const pair of (params.get("qty") ?? "").split(",")) {
    const [id, n] = pair.split(":");
    const qty = Number(n);
    if (id && Number.isFinite(qty) && qty >= 1) items[id] = qty;
  }
  return normalizeSelection({ pkg, items });
}

export function serializeSelection(selection: Selection): string {
  const sel = normalizeSelection(selection);
  const ids = addons.map((a) => a.id).filter((id) => sel.items[id]);
  const params = new URLSearchParams({ pkg: sel.pkg });
  if (ids.length) params.set("a", ids.join(","));
  const qty = ids.filter((id) => (sel.items[id] ?? 1) > 1).map((id) => `${id}:${sel.items[id]}`);
  if (qty.length) params.set("qty", qty.join(","));
  // Keep commas readable in the address bar.
  return params.toString().replace(/%2C/g, ",").replace(/%3A/g, ":");
}
