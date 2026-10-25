import { useFormatter, useTranslations } from "next-intl";
import { Reveal, RevealHeading } from "@/components/reveal";
import { packages, pricesInclude, smallBusinessExemption } from "@/config/pricing";
import { Link } from "@/i18n/navigation";

export function Pricing() {
  const t = useTranslations("Pricing");
  const format = useFormatter();
  const eur = (n: number) =>
    format.number(n, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const card = "flex h-full w-full flex-col border border-line bg-bg p-7 transition-colors hover:border-fg";
  const slot = "w-[82%] shrink-0 snap-center sm:w-[46%] md:w-auto";

  return (
    <section id="pricing" className="mx-auto max-w-site px-6 py-24 md:py-40">
      <RevealHeading className="max-w-3xl text-5xl font-semibold md:text-7xl">{t("title")}</RevealHeading>
      <p className="mt-6 max-w-xl text-muted">{t("sub")}</p>

      <div className="-mx-6 mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:mt-24 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-5">
        {packages.map((pkg, i) => {
          const name = t(`packages.${pkg.id}.name`);
          const features = t.raw(`packages.${pkg.id}.features`) as string[];
          return (
            <Reveal key={pkg.id} delay={i * 60} className={slot}>
              <article className={`${card} relative ${pkg.popular ? "border-fg" : ""}`}>
                {pkg.popular && (
                  <span className="absolute -top-3 left-7 bg-btn-bg px-2 py-1 text-xs font-medium uppercase tracking-widest text-btn-fg">
                    {t("popular")}
                  </span>
                )}
                <h3 className="text-2xl font-semibold tracking-tight">{name}</h3>
                <p className="mt-6 font-display text-5xl font-semibold tracking-tighter">{eur(pkg.price)}</p>
                <p className="mt-3 text-sm text-muted">{t(`packages.${pkg.id}.bestFor`)}</p>
                <ul className="mt-6 flex-1 space-y-2 border-t border-line pt-6 text-sm">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-muted">{t("delivery", { days: pkg.days })}</p>
                <Link
                  href={`/?pkg=${pkg.id}#add-ons`}
                  className={`btn mt-5 ${pkg.popular ? "btn-primary" : "btn-secondary"}`}
                >
                  {t("choose", { name })}
                </Link>
              </article>
            </Reveal>
          );
        })}

        <Reveal delay={packages.length * 60} className={`${slot} md:col-span-3 xl:col-span-5`}>
          <article className={`${card} justify-between gap-8 bg-surface md:flex-row md:items-center xl:p-10`}>
            <div className="max-w-2xl">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("custom.title")}</h3>
              <p className="mt-3 text-base text-muted">{t("custom.text")}</p>
            </div>
            {/* Opens the NegotiateDialog in Phase 5; links to the contact page until then. */}
            <Link href="/contact" className="btn btn-primary">
              {t("custom.cta")}
            </Link>
          </article>
        </Reveal>
      </div>

      <p className="mt-8 text-sm text-muted">
        {smallBusinessExemption ? t("vat.small") : t(`vat.${pricesInclude}`)}
      </p>
    </section>
  );
}
