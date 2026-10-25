import type { Metadata } from "next";
import { defaultLocale, locales, siteConfig, type Locale } from "@/config/site";

/** "/" → "", "/work" → "/work" */
const suffix = (path: string) => (path === "/" ? "" : path);

export const localizedUrl = (locale: Locale, path = "/") => `${siteConfig.url}/${locale}${suffix(path)}`;

/** Canonical + hreflang for every locale, with x-default pointing at /en (SPEC §2). */
export function alternates(locale: Locale, path = "/"): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)])),
      "x-default": localizedUrl(defaultLocale, path),
    },
  };
}

export const openGraphLocale: Record<Locale, string> = { en: "en_US", de: "de_DE", el: "el_GR" };

export function pageMetadata(opts: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  noindex?: boolean;
}): Metadata {
  const { locale, path, title, description, noindex } = opts;
  return {
    title,
    ...(description ? { description } : {}),
    alternates: alternates(locale, path),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      url: localizedUrl(locale, path),
      siteName: siteConfig.displayName,
      locale: openGraphLocale[locale],
      type: "website",
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const asLocale = (l: string): Locale =>
  (locales as readonly string[]).includes(l) ? (l as Locale) : defaultLocale;
