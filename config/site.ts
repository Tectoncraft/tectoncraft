export const locales = ["en", "de", "el"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  el: "ΕΛ",
};

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const siteConfig = {
  name: "tectoncraft",
  displayName: "Tectoncraft",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tectoncraft.com",
  /** Follow the OS colour scheme on the first visit. Default: always start light. */
  followSystemTheme: false,
  contact: {
    email: "hello@tectoncraft.com",
    phone: "+49 000 0000000",
    whatsapp: "+49 000 0000000",
  },
  areas: ["Germany", "Greece"],
  vatId: "VAT ID placeholder",
  socials: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    behance: "https://behance.net/",
  },
} as const;

/** Countries whose IP implies a language (SPEC §2, step 4). */
export const countryToLocale: Record<string, Locale> = {
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  LU: "de",
  GR: "el",
  CY: "el",
};
