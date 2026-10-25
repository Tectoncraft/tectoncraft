import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { Configurator } from "@/components/configurator/configurator";
import { RevealHeading } from "@/components/reveal";

export function AddonsSection() {
  const t = useTranslations("Addons");
  return (
    <section id="add-ons" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-site px-6 py-24 md:py-40">
        <RevealHeading className="max-w-3xl text-5xl font-semibold md:text-7xl">{t("title")}</RevealHeading>
        <p className="mt-6 max-w-xl text-muted">{t("sub")}</p>
        {/* useSearchParams needs a Suspense boundary on static pages. */}
        <Suspense fallback={<div className="mt-16 min-h-[60svh] md:mt-24" />}>
          <Configurator />
        </Suspense>
      </div>
    </section>
  );
}
