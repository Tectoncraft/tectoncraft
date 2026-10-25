import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { loaderFlagScript } from "@/lib/loader-flag";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import "../globals.css";


const display = Inter_Tight({
  subsets: ["latin", "latin-ext", "greek"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin", "latin-ext", "greek"],
  variable: "--font-body",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s · ${siteConfig.displayName}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderFlagScript }} />
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.followSystemTheme ? "system" : "light"}
          enableSystem={siteConfig.followSystemTheme}
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <Navbar />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
