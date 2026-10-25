import { defineRouting } from "next-intl/routing";
import { defaultLocale, LOCALE_COOKIE_MAX_AGE, locales } from "@/config/site";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Detection is done by proxy.ts exactly as in SPEC §2.
  localeDetection: false,
  localeCookie: { name: "NEXT_LOCALE", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" },
});
