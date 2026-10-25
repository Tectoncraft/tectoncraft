import { useTranslations } from "next-intl";

export type StubName = "work" | "contact";

/** Placeholder until the real page lands. */
export function PageStub({ name }: { name: StubName }) {
  const t = useTranslations("Pages");
  return (
    <main id="main" className="mx-auto max-w-site px-6 pb-40 pt-40">
      <h1 className="text-5xl font-semibold md:text-8xl">{t(name)}</h1>
      <p className="mt-8 text-muted">{t("soon")}</p>
    </main>
  );
}
