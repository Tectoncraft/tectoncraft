import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { PageStub } from "@/components/page-stub";
import { asLocale, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Pages" });
  return pageMetadata({ locale, path: "/contact", title: t("contact") });
}

export default function Page({ params }: PageProps<"/[locale]/contact">) {
  setRequestLocale(use(params).locale);
  return <PageStub name="contact" />;
}
