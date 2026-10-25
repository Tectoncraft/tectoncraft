import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Hero } from "@/components/hero";
import { IntroLoader } from "@/components/intro-loader";
import { AddonsSection } from "@/components/sections/addons";
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
        <AddonsSection />
        <Faq />
      </main>
    </>
  );
}
