import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoMark } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

const digits = (s: string) => s.replace(/[^\d+]/g, "");

export function Footer() {
  const t = useTranslations("Footer");
  const { contact, socials } = siteConfig;

  const columns = [
    {
      title: t("studio"),
      links: [
        { label: t("about"), href: "/#about" },
        { label: t("work"), href: "/work" },
        { label: t("process"), href: "/#process" },
        { label: t("contact"), href: "/contact" },
      ],
    },
    {
      title: t("services"),
      links: [
        { label: t("packages"), href: "/#pricing" },
        { label: t("addons"), href: "/#add-ons" },
        { label: t("care"), href: "/#add-ons" },
        { label: t("negotiate"), href: "/#pricing" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("impressum"), href: "/impressum" },
        { label: t("privacy"), href: "/privacy" },
        { label: t("terms"), href: "/terms" },
      ],
      cookieSettings: true,
    },
  ] as const;

  const linkCls = "text-base text-bg/70 transition-colors hover:text-bg";

  return (
    <footer className="bg-fg text-bg">
      <div className="mx-auto max-w-site px-6 py-24 lg:py-40">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-bg/20 pb-16 md:flex-row md:items-end">
          <h2 className="font-display text-5xl font-semibold md:text-8xl">{t("cta")}</h2>
          <Link href="/signup" className="btn btn-inverse">
            {t("getStarted")}
          </Link>
        </div>

        <div className="grid gap-12 pt-16 sm:grid-cols-2 lg:grid-cols-12">
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="font-sans text-sm font-medium uppercase tracking-widest text-bg/50">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                {"cookieSettings" in col && (
                  <li>
                    {/* Wired to the consent banner in Phase 6. */}
                    <button type="button" data-cookie-settings className={linkCls}>
                      {t("cookies")}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3">
            <h3 className="font-sans text-sm font-medium uppercase tracking-widest text-bg/50">
              {t("contact")}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`mailto:${contact.email}`} className={linkCls}>
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${digits(contact.phone)}`} className={linkCls}>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${digits(contact.whatsapp).replace("+", "")}`}
                  className={linkCls}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp
                </a>
              </li>
              <li className="text-base text-bg/70">{t("areas")}</li>
            </ul>
          </div>

        </div>

        <div className="mt-16">
          <NewsletterForm />
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-bg/20 pt-8 text-sm text-bg/70 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3">
            <LogoMark className="size-4" />
            <span>
              © 2026 {siteConfig.displayName} · {siteConfig.vatId}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <LanguageSwitcher />
            <ThemeToggle className="hover:bg-bg/10" />
            <ul className="flex items-center gap-4">
              <li>
                <a href={socials.instagram} rel="noopener noreferrer" target="_blank" className="hover:text-bg">
                  Instagram
                </a>
              </li>
              <li>
                <a href={socials.linkedin} rel="noopener noreferrer" target="_blank" className="hover:text-bg">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={socials.behance} rel="noopener noreferrer" target="_blank" className="hover:text-bg">
                  Behance
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
