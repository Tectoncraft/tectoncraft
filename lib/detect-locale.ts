import {
  countryToLocale,
  defaultLocale,
  LOCALE_COOKIE,
  locales,
  type Locale,
} from "@/config/site";

export const isLocale = (v: string | undefined | null): v is Locale =>
  !!v && (locales as readonly string[]).includes(v);

const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|lighthouse|headless/i;

export const isBot = (ua: string | null) => !!ua && BOT_RE.test(ua);

/** Best match from an Accept-Language header, q-weighted, by base language. */
export function fromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { base: tag.trim().toLowerCase().split("-")[0], q, index };
    })
    .filter((x) => x.base && Number.isFinite(x.q) && x.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { base } of ranked) {
    if (isLocale(base)) return base;
  }
  return null;
}

export function fromCountry(country: string | null): Locale | null {
  return (country && countryToLocale[country.toUpperCase()]) || null;
}

export interface DetectInput {
  cookie?: string | null;
  acceptLanguage: string | null;
  country: string | null;
}

/** Steps 2–5 of SPEC §2 (step 1, locale already in URL, is handled by the proxy). */
export function detectLocale({ cookie, acceptLanguage, country }: DetectInput): Locale {
  if (isLocale(cookie)) return cookie;
  return fromAcceptLanguage(acceptLanguage) ?? fromCountry(country) ?? defaultLocale;
}

export { LOCALE_COOKIE };

/** Client-side: remember the visitor's explicit choice for a year (SPEC §2). */
export function setLocaleCookie(locale: Locale, maxAge: number) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${maxAge}; samesite=lax`;
}
