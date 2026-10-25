import { useFormatter, useTranslations } from "next-intl";
import { ImageSequenceCanvas } from "@/components/image-sequence-canvas";
import { packages } from "@/config/pricing";
import { sequences } from "@/config/sequences";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("Hero");
  const format = useFormatter();
  const from = Math.min(...packages.map((p) => p.price));
  const price = format.number(from, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const { hero } = sequences;

  return (
    <ImageSequenceCanvas {...hero}>
      {/* Copy fades out as the plates assemble (driven by --p). */}
      <div
        className="relative mx-auto flex h-full max-w-site flex-col justify-center px-6 pt-16"
        style={{ opacity: "calc(1 - var(--p) * 2.5)" }}
      >
        <h1 className="max-w-4xl text-hero font-semibold">{t("title")}</h1>
        <p className="mt-8 max-w-xl text-muted">{t("sub")}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/#pricing" className="btn btn-primary">
            {t("primary")}
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            {t("secondary")}
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted">{t("trust", { price })}</p>
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-widest text-muted"
        style={{ opacity: "calc(1 - var(--p) * 5)" }}
      >
        {t("scroll")}
        <span className="h-10 w-px origin-top animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-current" />
      </div>
    </ImageSequenceCanvas>
  );
}
