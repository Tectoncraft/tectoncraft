import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("Pages");
  return (
    <main id="main" className="mx-auto max-w-site px-6 pb-40 pt-40">
      <p className="font-display text-8xl font-semibold tracking-tighter text-muted">404</p>
      <h1 className="mt-4 text-4xl font-semibold md:text-6xl">{t("notFound")}</h1>
      <p className="mt-6 max-w-xl text-muted">{t("notFoundText")}</p>
      <Link href="/" className="btn btn-primary mt-10">
        {t("home")}
      </Link>
    </main>
  );
}
