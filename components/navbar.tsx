"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";

const links = [
  { key: "work", href: "/work" },
  { key: "services", href: "/#services" },
  { key: "pricing", href: "/#pricing" },
  { key: "addons", href: "/#add-ons" },
  { key: "process", href: "/#process" },
  { key: "faq", href: "/#faq" },
  { key: "contact", href: "/contact" },
] as const;

export function Navbar() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (!open) return;
    if (e.key === "Escape") {
      close();
      toggleRef.current?.focus();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = Array.from(
      headerRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
    ).filter((el) => el.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const solid = scrolled || open;

  return (
    <header
      ref={headerRef}
      onKeyDown={onKeyDown}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line bg-bg" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-6 px-6 xl:h-[72px]">
        <Logo />

        <nav aria-label={t("main")} className="hidden items-center gap-6 xl:flex">
          {links.map((l) => (
            <Link key={l.key} href={l.href} className="link-text whitespace-nowrap">
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/login" className="link-text px-2">
            {t("login")}
          </Link>
          <Link href="/signup" className="btn btn-primary">
            {t("getStarted")}
          </Link>
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="relative inline-flex size-10 items-center justify-center rounded-sm hover:bg-surface"
          >
            <span
              aria-hidden="true"
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={overlayRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("main")}
          className="fixed inset-0 -z-10 flex flex-col overflow-y-auto bg-bg px-6 pb-10 pt-24 xl:hidden"
        >
          <nav aria-label={t("main")} className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={close}
                className="border-b border-line py-4 font-display text-4xl font-semibold tracking-tight"
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-6 pt-10">
            <LanguageSwitcher onSwitch={close} className="text-base" />
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login" onClick={close} className="btn btn-secondary">
                {t("login")}
              </Link>
              <Link href="/signup" onClick={close} className="btn btn-primary">
                {t("getStarted")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
