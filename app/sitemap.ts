import type { MetadataRoute } from "next";
import { locales } from "@/config/site";
import { localizedUrl } from "@/lib/seo";

const paths = ["/", "/work", "/contact", "/impressum", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)])),
      },
    })),
  );
}
