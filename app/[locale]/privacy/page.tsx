import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { PageStub } from "@/components/page-stub";

export default function Page({ params }: PageProps<"/[locale]/privacy">) {
  setRequestLocale(use(params).locale);
  return <PageStub name="privacy" />;
}
