import { useTranslations } from "next-intl";
import { Reveal, RevealHeading } from "@/components/reveal";

const pillars = ["fixed", "languages", "motion", "gdpr"] as const;

export function Intro() {
  const t = useTranslations("Intro");

  return (
    <section id="about" className="mx-auto max-w-site px-6 py-24 md:py-40">
      <RevealHeading as="p" className="max-w-5xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        {t("statement")}
      </RevealHeading>
      <div id="services" className="mt-20 grid gap-px border border-line bg-line md:mt-28 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((key, i) => (
          <Reveal key={key} delay={i * 80} className="bg-bg p-8 transition-colors hover:bg-surface">
            <h3 className="text-xl font-semibold tracking-tight">{t(`${key}.title`)}</h3>
            <p className="mt-4 text-base text-muted">{t(`${key}.text`)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
