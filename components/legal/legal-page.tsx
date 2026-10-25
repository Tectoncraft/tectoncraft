import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

export type LegalName = "impressum" | "privacy" | "terms";

/** Shell for the legal pages: structure and headings are in place, the owners supply the text. */
export function LegalPage({ name }: { name: LegalName }) {
  const t = useTranslations("Legal");
  const p = useTranslations("Pages");
  const sections = t.raw(`${name}.sections`) as { h: string; p: string }[];
  const fill = (s: string) =>
    s.replace("{email}", siteConfig.contact.email).replace("{phone}", siteConfig.contact.phone);

  return (
    <main id="main" className="mx-auto max-w-3xl px-6 pb-40 pt-36 md:pt-44">
      <h1 className="text-5xl font-semibold md:text-7xl">{p(name)}</h1>
      <p className="mt-8 border border-line bg-surface p-4 text-sm text-muted">{t("notice")}</p>
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-2xl font-semibold tracking-tight">{s.h}</h2>
            <p className="mt-3 text-base text-muted">
              <span className="font-medium text-fg">[{t("todo")}]</span> {fill(s.p)}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
