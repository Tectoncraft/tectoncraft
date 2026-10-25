import { describe, expect, it } from "vitest";
import { addons } from "@/config/addons";
import { packages } from "@/config/pricing";
import {
  computeTotals,
  isIncluded,
  maxQty,
  normalizeSelection,
  parseSelection,
  serializeSelection,
  type Selection,
} from "./pricing";

const sel = (pkg: Selection["pkg"], items: Selection["items"] = {}): Selection => ({ pkg, items });

describe("computeTotals", () => {
  it("returns just the package price with no add-ons", () => {
    const t = computeTotals(sel("starter"));
    expect(t).toMatchObject({ base: 399, addons: 0, rush: 0, oneTime: 399, monthly: 0, days: 7 });
    expect(t.lines).toEqual([]);
  });

  it("adds one-time add-ons and multiplies by quantity", () => {
    const t = computeTotals(sel("starter", { "extra-page": 3, faq: 1 }));
    expect(t.addons).toBe(79 * 3 + 49);
    expect(t.oneTime).toBe(399 + 79 * 3 + 49);
  });

  it("sums monthly add-ons separately from the one-time total", () => {
    const t = computeTotals(sel("business", { hosting: 1, maintenance: 1 }));
    expect(t.monthly).toBe(19 + 49);
    expect(t.oneTime).toBe(899);
  });

  it("counts both parts of an add-on with a one-time and a monthly fee", () => {
    const t = computeTotals(sel("starter", { "ai-chat": 1 }));
    expect(t.addons).toBe(399);
    expect(t.monthly).toBe(29);
  });

  it("applies rush as 25% of the package price only, not of add-ons", () => {
    const t = computeTotals(sel("business", { rush: 1, blog: 1 }));
    expect(t.rush).toBe(Math.round(899 * 0.25));
    expect(t.oneTime).toBe(899 + 249 + t.rush);
    expect(t.addons).toBe(249);
  });

  it("halves the delivery time with rush, rounding up", () => {
    expect(computeTotals(sel("starter", { rush: 1 })).days).toBe(4);
    expect(computeTotals(sel("signature", { rush: 1 })).days).toBe(18);
    expect(computeTotals(sel("signature")).days).toBe(35);
  });

  it("does not charge for add-ons included in the package", () => {
    const t = computeTotals(sel("professional", { blog: 1, cookie: 1, faq: 1 }));
    expect(t.lines.map((l) => l.id)).toEqual(["faq"]);
    expect(t.oneTime).toBe(1399 + 49);
  });

  it("charges for the same add-on on a package that does not include it", () => {
    expect(computeTotals(sel("business", { blog: 1 })).addons).toBe(249);
  });
});

describe("included handling", () => {
  it("marks package-included add-ons", () => {
    const blog = addons.find((a) => a.id === "blog")!;
    const shop = addons.find((a) => a.id === "shop")!;
    const [, business, professional, commerce] = packages;
    expect(isIncluded(blog, business!)).toBe(false);
    expect(isIncluded(blog, professional!)).toBe(true);
    expect(isIncluded(shop, professional!)).toBe(false);
    expect(isIncluded(shop, commerce!)).toBe(true);
  });

  it("caps extra languages at what is left of the three", () => {
    const extra = addons.find((a) => a.id === "extra-language")!;
    const by = Object.fromEntries(packages.map((p) => [p.id, p]));
    expect(maxQty(extra, by.starter!)).toBe(2);
    expect(maxQty(extra, by.professional!)).toBe(1);
    expect(maxQty(extra, by.signature!)).toBe(0);
    expect(isIncluded(extra, by.signature!)).toBe(true);
  });

  it("drops now-included add-ons when the package changes", () => {
    const n = normalizeSelection(sel("professional", { blog: 1, booking: 1 }));
    expect(n.items).toEqual({ booking: 1 });
  });
});

describe("normalizeSelection", () => {
  it("ignores unknown ids and clamps quantities", () => {
    const n = normalizeSelection(sel("starter", { nope: 2, "extra-page": 999, "extra-language": 5, faq: 7 }));
    expect(n.items).toEqual({ "extra-page": 20, "extra-language": 2, faq: 1 });
  });

  it("raises zero or negative quantities to the minimum", () => {
    expect(normalizeSelection(sel("starter", { "extra-page": 0 })).items).toEqual({ "extra-page": 1 });
    expect(normalizeSelection(sel("starter", { "extra-page": -4 })).items).toEqual({ "extra-page": 1 });
  });
});

describe("URL state", () => {
  it("parses the documented example", () => {
    const s = parseSelection("pkg=professional&a=blog,booking&qty=extra-page:3");
    expect(s.pkg).toBe("professional");
    // blog is included in Professional, so it is dropped; qty entries also select.
    expect(s.items).toEqual({ booking: 1, "extra-page": 3 });
  });

  it("falls back to the default package for unknown values", () => {
    expect(parseSelection("pkg=bogus").pkg).toBe("professional");
    expect(parseSelection("").pkg).toBe("professional");
  });

  it("round-trips through serialize and parse", () => {
    const s = sel("business", { blog: 1, "extra-page": 3, hosting: 1, rush: 1 });
    expect(parseSelection(serializeSelection(s))).toEqual(normalizeSelection(s));
  });

  it("produces a stable, readable query", () => {
    const q = serializeSelection(sel("starter", { booking: 1, "extra-page": 3 }));
    expect(q).toBe("pkg=starter&a=extra-page,booking&qty=extra-page:3");
  });

  it("keeps totals identical across a round trip", () => {
    const s = sel("commerce", { "products-50": 2, payment: 2, "ai-chat": 1, rush: 1 });
    const back = parseSelection(serializeSelection(s));
    expect(computeTotals(back)).toEqual(computeTotals(s));
  });
});
