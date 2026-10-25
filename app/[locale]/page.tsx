import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/hero";
import { IntroLoader } from "@/components/intro-loader";
import { AddonsSection } from "@/components/sections/addons";
import { Faq } from "@/components/sections/faq";
import { Intro } from "@/components/sections/intro";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { packages } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { asLocale, localizedUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const locale = asLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    ...pageMetadata({ locale, path: "/", title: t("title"), description: t("description") }),
    title: { absolute: t("title") },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = asLocale((await params).locale);
  setRequestLocale(locale);
  const meta = await getTranslations({ locale, namespace: "Meta" });
  const pricing = await getTranslations({ locale, namespace: "Pricing" });
  const url = localizedUrl(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#org`,
        name: siteConfig.displayName,
        url: siteConfig.url,
        email: siteConfig.contact.email,
        areaServed: ["DE", "GR"],
        knowsLanguage: ["en", "de", "el"],
      },
      { "@type": "WebSite", "@id": `${url}#site`, url, name: siteConfig.displayName, inLanguage: locale, publisher: { "@id": `${siteConfig.url}/#org` } },
      {
        "@type": "ProfessionalService",
        name: siteConfig.displayName,
        url,
        description: meta("description"),
        areaServed: ["DE", "GR"],
        provider: { "@id": `${siteConfig.url}/#org` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: pricing("title"),
          itemListElement: packages.map((p) => ({
            "@type": "Offer",
            name: pricing(`packages.${p.id}.name`),
            price: p.price,
            priceCurrency: "EUR",
            url: `${url}#pricing`,
          })),
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <IntroLoader />
      <main id="main">
        <Hero />
        <Intro />
        <Process />
        <Pricing />
        <AddonsSection />
        <Faq />
      </main>
    </>
  );
}
