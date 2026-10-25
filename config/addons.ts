export type AddonType = "one-time" | "monthly" | "percent";

export type AddonCategory =
  | "pages"
  | "design"
  | "shop"
  | "marketing"
  | "legal"
  | "technical"
  | "care"
  | "service";

export interface Addon {
  id: string;
  category: AddonCategory;
  type: AddonType;
  /** EUR for one-time/monthly; percentage of package price for "percent". */
  price: number;
  /** Optional recurring fee on top of a one-time price (e.g. ai-chat). */
  monthly?: number;
  /** Quantity stepper allowed. */
  qty?: { min: number; max: number };
}

export const addonCategories: AddonCategory[] = [
  "pages",
  "design",
  "shop",
  "marketing",
  "legal",
  "technical",
  "care",
  "service",
];

const q = (max = 20) => ({ min: 1, max });

export const addons: Addon[] = [
  // Pages & content
  { id: "extra-page", category: "pages", type: "one-time", price: 79, qty: q() },
  { id: "extra-language", category: "pages", type: "one-time", price: 149, qty: q(3) },
  { id: "copywriting", category: "pages", type: "one-time", price: 49, qty: q() },
  { id: "translation", category: "pages", type: "one-time", price: 39, qty: q() },
  { id: "blog", category: "pages", type: "one-time", price: 249 },
  { id: "portfolio", category: "pages", type: "one-time", price: 129 },
  { id: "faq", category: "pages", type: "one-time", price: 49 },
  { id: "testimonials", category: "pages", type: "one-time", price: 69 },
  { id: "events", category: "pages", type: "one-time", price: 149 },
  { id: "careers", category: "pages", type: "one-time", price: 129 },

  // Design & motion
  { id: "logo", category: "design", type: "one-time", price: 249 },
  { id: "brand-kit", category: "design", type: "one-time", price: 599 },
  { id: "3d-sequence", category: "design", type: "one-time", price: 499, qty: q(5) },
  { id: "loader", category: "design", type: "one-time", price: 199 },
  { id: "video-bg", category: "design", type: "one-time", price: 149 },
  { id: "illustrations", category: "design", type: "one-time", price: 199 },
  { id: "micro", category: "design", type: "one-time", price: 149 },
  { id: "dark-mode", category: "design", type: "one-time", price: 99 },

  // Shop & bookings
  { id: "booking", category: "shop", type: "one-time", price: 249 },
  { id: "shop", category: "shop", type: "one-time", price: 599 },
  { id: "products-50", category: "shop", type: "one-time", price: 149, qty: q(10) },
  { id: "payment", category: "shop", type: "one-time", price: 99, qty: q(4) },
  { id: "vouchers", category: "shop", type: "one-time", price: 149 },
  { id: "menu-qr", category: "shop", type: "one-time", price: 129 },
  { id: "listings", category: "shop", type: "one-time", price: 399 },
  { id: "members", category: "shop", type: "one-time", price: 349 },
  { id: "quote-form", category: "shop", type: "one-time", price: 149 },

  // Marketing & SEO
  { id: "seo-pro", category: "marketing", type: "one-time", price: 299 },
  { id: "local-seo", category: "marketing", type: "one-time", price: 149 },
  { id: "newsletter", category: "marketing", type: "one-time", price: 129 },
  { id: "social-feed", category: "marketing", type: "one-time", price: 79 },
  { id: "chat", category: "marketing", type: "one-time", price: 59 },
  { id: "ai-chat", category: "marketing", type: "one-time", price: 399, monthly: 29 },
  { id: "pixels", category: "marketing", type: "one-time", price: 99 },
  { id: "analytics", category: "marketing", type: "one-time", price: 99 },
  { id: "popup", category: "marketing", type: "one-time", price: 79 },

  // Legal & accessibility
  { id: "cookie", category: "legal", type: "one-time", price: 99 },
  { id: "legal-pages", category: "legal", type: "one-time", price: 79 },
  { id: "a11y", category: "legal", type: "one-time", price: 399 },

  // Technical
  { id: "domain-email", category: "technical", type: "one-time", price: 49 },
  { id: "migration", category: "technical", type: "one-time", price: 199 },
  { id: "speed", category: "technical", type: "one-time", price: 149 },
  { id: "pwa", category: "technical", type: "one-time", price: 249 },
  { id: "integration", category: "technical", type: "one-time", price: 299 },
  { id: "staging", category: "technical", type: "one-time", price: 79 },

  // Care plans (monthly)
  { id: "hosting", category: "care", type: "monthly", price: 19 },
  { id: "maintenance", category: "care", type: "monthly", price: 49 },
  { id: "content-care", category: "care", type: "monthly", price: 79 },
  { id: "seo-report", category: "care", type: "monthly", price: 99 },
  { id: "priority", category: "care", type: "monthly", price: 39 },

  // Service
  { id: "rush", category: "service", type: "percent", price: 25 },
  { id: "revision", category: "service", type: "one-time", price: 79, qty: q(10) },
  { id: "training", category: "service", type: "one-time", price: 59, qty: q(10) },
];

export const addonById = (id: string): Addon | undefined =>
  addons.find((a) => a.id === id);
