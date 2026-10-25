import { useTranslations } from "next-intl";
import { RevealHeading } from "@/components/reveal";

/** Anchor target for #add-ons; the configurator itself lands in Phase 4. */
export function AddonsAnchor() {
  const t = useTranslations("Addons");
  return (
    <section id="add-ons" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-site px-6 py-24 md:py-40">
        <RevealHeading className="max-w-3xl text-5xl font-semibold md:text-7xl">{t("title")}</RevealHeading>
        <p className="mt-6 max-w-xl text-muted">{t("sub")}</p>
      </div>
    </section>
  );
}
