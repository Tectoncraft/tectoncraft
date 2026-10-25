import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense, use } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { asLocale, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">) {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Auth" });
  return pageMetadata({ locale, path: "/login", title: t("loginTitle"), noindex: true });
}

export default function Page({ params }: PageProps<"/[locale]/login">) {
  setRequestLocale(use(params).locale);
  const t = useTranslations("Auth");

  return (
    <main id="main" className="mx-auto max-w-site px-6 pb-32 pt-36 md:pt-44">
      <h1 className="mx-auto max-w-md text-center text-4xl font-semibold md:text-6xl">{t("loginTitle")}</h1>
      <p className="mx-auto mb-12 mt-4 max-w-md text-center text-muted">{t("loginSub")}</p>
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  );
}
