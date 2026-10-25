import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Hero } from "@/components/hero";
import { IntroLoader } from "@/components/intro-loader";
import { AddonsAnchor } from "@/components/sections/addons-anchor";
import { Faq } from "@/components/sections/faq";
import { Intro } from "@/components/sections/intro";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  setRequestLocale(use(params).locale);

  return (
    <>
      <IntroLoader />
      <main>
        <Hero />
        <Intro />
        <Process />
        <Pricing />
        <AddonsAnchor />
        <Faq />
      </main>
    </>
  );
}
