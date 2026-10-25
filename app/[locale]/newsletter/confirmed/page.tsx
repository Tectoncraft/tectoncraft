import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata = { robots: { index: false } };

export default async function Page({ params, searchParams }: PageProps<"/[locale]/newsletter/confirmed">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Newsletter");
  const ok = (await searchParams).status === "ok";

  return (
    <main id="main" className="mx-auto max-w-site px-6 pb-40 pt-40">
      <h1 className="text-5xl font-semibold md:text-7xl">{ok ? t("confirmedTitle") : t("invalidTitle")}</h1>
      <p className="mt-8 max-w-xl text-muted">{ok ? t("confirmedText") : t("invalidText")}</p>
      <Link href="/" className="btn btn-secondary mt-10">
        {t("home")}
      </Link>
    </main>
  );
}
