import { useFormatter, useTranslations } from "next-intl";
import { Reveal, RevealHeading } from "@/components/reveal";
import { addonById } from "@/config/addons";

export function Faq() {
  const t = useTranslations("Faq");
  const format = useFormatter();
  const hosting = format.number(addonById("hosting")?.price ?? 0, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const items = t.raw("items") as { q: string; a: string }[];

  return (
    <section id="faq" className="mx-auto max-w-site px-6 py-24 md:py-40">
      <RevealHeading className="max-w-3xl text-5xl font-semibold md:text-7xl">{t("title")}</RevealHeading>
      <Reveal className="mt-16 max-w-3xl border-t border-line md:mt-24">
        {items.map(({ q, a }) => (
          <details key={q} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium marker:hidden [&::-webkit-details-marker]:hidden">
              {q}
              <span aria-hidden="true" className="relative size-4 shrink-0">
                <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform group-open:rotate-90" />
              </span>
            </summary>
            <p className="pb-6 pr-10 text-base text-muted">{a.replace("{hosting}", hosting)}</p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
