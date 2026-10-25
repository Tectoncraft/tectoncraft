export type PackageId =
  | "starter"
  | "business"
  | "professional"
  | "commerce"
  | "signature";

export interface Package {
  id: PackageId;
  /** One-time price in EUR. */
  price: number;
  popular?: boolean;
  /** Typical delivery in days. */
  days: number;
  languages: number;
  /** Add-on ids that come bundled with this package. */
  includedAddons: string[];
  /** Structured facts; display copy lives in the message files. */
  limits: {
    pages?: number;
    sections?: number;
    products?: number;
    revisions: number;
  };
}

/** "net" shows "plus VAT", "gross" shows "incl. VAT". Confirm with your accountant (SPEC §9). */
export const pricesInclude: "net" | "gross" = "net";
/** Small-business exemption: show that note instead of the VAT note. */
export const smallBusinessExemption = false;

export const packages: Package[] = [
  {
    id: "starter",
    price: 399,
    days: 7,
    languages: 1,
    includedAddons: [],
    limits: { sections: 5, revisions: 2 },
  },
  {
    id: "business",
    price: 899,
    days: 14,
    languages: 1,
    includedAddons: [],
    limits: { pages: 5, revisions: 2 },
  },
  {
    id: "professional",
    price: 1399,
    popular: true,
    days: 21,
    languages: 2,
    includedAddons: ["blog", "cookie"],
    limits: { pages: 10, revisions: 3 },
  },
  {
    id: "commerce",
    price: 1999,
    days: 28,
    languages: 2,
    includedAddons: ["blog", "cookie", "shop"],
    limits: { products: 50, revisions: 3 },
  },
  {
    id: "signature",
    price: 2499,
    days: 35,
    languages: 3,
    includedAddons: ["blog", "cookie", "a11y", "3d-sequence", "loader"],
    limits: { pages: 15, revisions: 4 },
  },
];

export const packageById = (id: string): Package | undefined =>
  packages.find((p) => p.id === id);

/** Negotiate dialog budget slider range (EUR). */
export const budget = { min: 2500, max: 25000, step: 500 } as const;
