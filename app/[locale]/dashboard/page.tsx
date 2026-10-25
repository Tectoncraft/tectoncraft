import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { packageById } from "@/config/pricing";
import { hasSupabaseAuth } from "@/lib/env";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { serializeSelection } from "@/lib/pricing";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata = { robots: { index: false, follow: false } };
// Reads the session cookie on every request; never prerender (a build-time redirect would be baked in).
export const dynamic = "force-dynamic";

interface QuoteRow {
  id: string;
  kind: "quote" | "negotiate";
  package_id: string | null;
  addons: Record<string, number> | null;
  totals: { oneTime: number; monthly: number } | null;
  budget_range: string | null;
  status: "new" | "in_review" | "sent" | "accepted" | "declined";
  created_at: string;
}

const steps = ["briefing", "design", "build", "review", "live"] as const;

export default async function DashboardPage({ params }: PageProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Dashboard");
  const p = await getTranslations("Pricing");
  const format = await getFormatter();
  const eur = (n: number) => format.number(n, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  // Protected: no session, no dashboard.
  if (!hasSupabaseAuth()) return redirect({ href: "/login", locale });
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect({ href: { pathname: "/login", query: { next: `/${locale}/dashboard` } }, locale });

  // RLS limits this to the signed-in user's own rows.
  const { data } = await supabase
    .from("quotes")
    .select("id, kind, package_id, addons, totals, budget_range, status, created_at")
    .order("created_at", { ascending: false });
  const quotes = (data ?? []) as QuoteRow[];

  const card = "border border-line p-6 md:p-8";

  return (
    <main className="mx-auto max-w-site px-6 pb-32 pt-36 md:pt-44">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-semibold md:text-7xl">{t("title")}</h1>
          <p className="mt-4 text-muted">{t("signedInAs", { email: user.email ?? "" })}</p>
        </div>
        <form action="/auth/signout" method="post">
          <input type="hidden" name="locale" value={locale} />
          <button type="submit" className="btn btn-secondary">
            {t("signOut")}
          </button>
        </form>
      </div>

      <section className="mt-20" aria-labelledby="quotes-h">
        <h2 id="quotes-h" className="text-3xl font-semibold tracking-tight">
          {t("quotes")}
        </h2>
        {quotes.length === 0 ? (
          <p className="mt-6 text-muted">
            {t("noQuotes")}{" "}
            <Link href="/#add-ons" className="underline">
              {t("openConfigurator")}
            </Link>
          </p>
        ) : (
          <ul className="mt-8 grid gap-4">
            {quotes.map((q) => {
              const pkg = q.package_id ? packageById(q.package_id) : undefined;
              return (
                <li key={q.id} className={`${card} flex flex-wrap items-center justify-between gap-6`}>
                  <div>
                    <p className="text-xl font-semibold tracking-tight">
                      {pkg ? p(`packages.${pkg.id}.name`) : t("custom")}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {format.dateTime(new Date(q.created_at), { dateStyle: "medium" })} ·{" "}
                      {Object.keys(q.addons ?? {}).length > 0 && t("addonCount", { count: Object.keys(q.addons ?? {}).length })}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    {q.totals ? (
                      <>
                        <p className="font-display text-2xl font-semibold tabular-nums">{eur(q.totals.oneTime)}</p>
                        {q.totals.monthly > 0 && <p className="text-muted">+ {eur(q.totals.monthly)}/{t("month")}</p>}
                      </>
                    ) : (
                      q.budget_range && <p className="text-muted">{t("budget", { range: q.budget_range })}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="border border-fg px-2 py-1 text-xs font-medium uppercase tracking-widest">
                      {t(`status.${q.status}`)}
                    </span>
                    {pkg && (
                      <Link
                        href={`/?${serializeSelection({ pkg: pkg.id, items: q.addons ?? {} })}#add-ons`}
                        className="link-text underline"
                      >
                        {t("openConfigurator")}
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-20" aria-labelledby="project-h">
        <h2 id="project-h" className="text-3xl font-semibold tracking-tight">
          {t("project")}
        </h2>
        <ol className="mt-8 grid grid-cols-5 gap-2">
          {steps.map((s, i) => (
            <li key={s} className="border-t-2 border-line pt-3 text-sm">
              <span className="text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="block font-medium">{t(`steps.${s}`)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">{t("noProject")}</p>
      </section>

      <div className="mt-20 grid gap-6 md:grid-cols-2">
        <section className={card}>
          <h2 className="text-2xl font-semibold tracking-tight">{t("messages")}</h2>
          <p className="mt-3 text-muted">{t("messagesSoon")}</p>
        </section>
        <section className={card}>
          <h2 className="text-2xl font-semibold tracking-tight">{t("invoices")}</h2>
          <p className="mt-3 text-muted">{t("invoicesSoon")}</p>
        </section>
      </div>
    </main>
  );
}
