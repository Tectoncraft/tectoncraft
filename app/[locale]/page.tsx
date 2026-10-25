import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Hero");

  return (
    <main className="mx-auto max-w-site px-6 py-40">
      <h1 className="text-hero font-semibold">{t("title")}</h1>
      <p className="mt-8 max-w-2xl text-muted">{t("sub")}</p>
    </main>
  );
}
