import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { LegalPage } from "@/components/legal/legal-page";
import { asLocale, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">) {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Pages" });
  return pageMetadata({ locale, path: "/privacy", title: t("privacy") });
}

export default function Page({ params }: PageProps<"/[locale]/privacy">) {
  setRequestLocale(use(params).locale);
  return <LegalPage name="privacy" />;
}
