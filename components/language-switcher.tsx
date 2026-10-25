"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALE_COOKIE_MAX_AGE, localeLabels, locales, type Locale } from "@/config/site";
import { usePathname, useRouter } from "@/i18n/navigation";
import { setLocaleCookie } from "@/lib/detect-locale";

export function LanguageSwitcher({
  className,
  onSwitch,
}: {
  className?: string;
  onSwitch?: () => void;
}) {
  const t = useTranslations("Lang");
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function select(next: Locale) {
    if (next === active) return;
    setLocaleCookie(next, LOCALE_COOKIE_MAX_AGE);
    const { search, hash } = window.location;
    router.replace(`${pathname}${search}${hash}`, { locale: next });
    onSwitch?.();
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`inline-flex items-center gap-1 text-sm font-medium ${className ?? ""}`}
    >
      {locales.map((l, i) => (
        <span key={l} className="inline-flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
          )}
          <button
            type="button"
            lang={l}
            aria-current={l === active ? "true" : undefined}
            onClick={() => select(l)}
            className={`px-1 py-2 transition-opacity ${l === active ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
          >
            {localeLabels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
