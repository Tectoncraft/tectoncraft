"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

/**
 * Sun/moon swap is pure CSS (driven by the `dark` class), so the icon is right on
 * first paint and there is no mounted-state flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Theme");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={t("toggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`relative inline-flex size-10 items-center justify-center rounded-sm hover:bg-surface ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="absolute size-5 rotate-0 scale-100 transition-transform duration-500 ease-out dark:-rotate-90 dark:scale-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="absolute size-5 rotate-90 scale-0 transition-transform duration-500 ease-out dark:rotate-0 dark:scale-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
      </svg>
    </button>
  );
}
