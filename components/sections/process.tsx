import { useTranslations } from "next-intl";
import { Reveal, RevealHeading } from "@/components/reveal";
import { Link } from "@/i18n/navigation";

const steps = ["call", "design", "build", "launch"] as const;

export function Process() {
  const t = useTranslations("Process");
  const p = useTranslations("Portfolio");

  return (
    <section id="process" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-site px-6 py-24 md:py-40">
        <RevealHeading className="max-w-3xl text-5xl font-semibold md:text-7xl">{t("title")}</RevealHeading>
        <ol className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((key, i) => (
            <Reveal key={key} delay={i * 80}>
              <li className="h-full border border-line bg-bg p-8 transition-colors hover:border-fg">
                <span className="font-display text-6xl font-semibold tracking-tighter text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-10 text-2xl font-semibold tracking-tight">{t(`${key}.title`)}</h3>
                <p className="mt-1 text-sm font-medium uppercase tracking-widest text-muted">{t(`${key}.time`)}</p>
                <p className="mt-4 text-base text-muted">{t(`${key}.text`)}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-24 flex items-end justify-between gap-6 md:mt-32">
          <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{p("title")}</h3>
          <Link href="/work" className="link-text whitespace-nowrap">
            {p("all")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={n * 80}>
              <Link href="/work" className="group block border border-line bg-bg transition-colors hover:border-fg">
                <div className="aspect-[4/3] bg-line/40" aria-hidden="true" />
                <div className="p-5">
                  <p className="font-medium">{p("project", { n })}</p>
                  <p className="text-sm text-muted">{p("soon")}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
