import { z } from "zod";
import type { NextRequest } from "next/server";
import { budget } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { fail, ok } from "@/lib/api";
import { detailsTable, sendMail } from "@/lib/email";
import { env, hasSupabaseAdmin } from "@/lib/env";
import { computeTotals, normalizeSelection } from "@/lib/pricing";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { quoteRequestSchema } from "@/lib/validation";
import en from "@/messages/en.json";

export async function POST(req: NextRequest) {
  if (!hasSupabaseAdmin()) return fail("not_configured", 503);

  const ip = clientIp(req.headers);
  if (!rateLimit(`quotes:${ip}`, 5, 10 * 60_000)) return fail("rate_limited", 429);

  const body: unknown = await req.json().catch(() => null);
  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail("validation", 400, { fields: Object.keys(z.flattenError(parsed.error).fieldErrors) });
  }
  const data = parsed.data;

  // Honeypot: pretend it worked so bots learn nothing.
  if (data.website) return ok();

  // Signed-in users are identified by their session and skip the captcha.
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !(await verifyTurnstile(data.token, ip))) return fail("captcha", 400);

  const email = user?.email ?? data.email;
  if (!email || (!user && data.kind === "quote" && !data.consent)) {
    return fail("validation", 400, { fields: [email ? "consent" : "email"] });
  }

  const admin = createAdminSupabase();
  const common = { user_id: user?.id ?? null, email, locale: data.locale };
  const details: [string, string | undefined | null][] = [["Email", email]];
  let subject: string;
  let row: Record<string, unknown>;

  if (data.kind === "negotiate") {
    const budgetRange = data.budget >= budget.max ? `${budget.max}+` : String(data.budget);
    row = {
      ...common,
      kind: "negotiate",
      name: data.name,
      company: data.company,
      country: data.country,
      phone: data.phone,
      budget_range: budgetRange,
      message: data.description,
      desired_launch: data.launchDate,
      preferred_contact: data.contact,
    };
    subject = `Custom request from ${data.name}`;
    details.unshift(["Type", "Custom request (negotiate)"], ["Name", data.name]);
    details.push(
      ["Company", data.company],
      ["Country", data.country],
      ["Phone", data.phone],
      ["Budget (EUR)", budgetRange],
      ["Desired launch", data.launchDate],
      ["Preferred contact", data.contact],
      ["Description", data.description],
    );
  } else {
    // Totals are always recomputed here; the client's numbers are never trusted.
    const selection = normalizeSelection(data.selection);
    const totals = computeTotals(selection);
    const names = en.Addons.items as Record<string, string>;
    const lines = totals.lines.map((l) => `${names[l.id] ?? l.id}${l.qty > 1 ? ` × ${l.qty}` : ""}`).join("\n");
    const name = data.name ?? user?.user_metadata?.name;
    row = {
      ...common,
      kind: "quote",
      name,
      package_id: selection.pkg,
      addons: selection.items,
      totals,
      message: data.message,
    };
    subject = `Quote request: ${selection.pkg} (€${totals.oneTime})`;
    details.unshift(["Type", "Quote request"], ["Name", name]);
    details.push(
      ["Package", selection.pkg],
      ["Add-ons", lines || "none"],
      ["One-time total", `€${totals.oneTime}`],
      ["Monthly total", `€${totals.monthly}/mo`],
      ["Delivery", `~${totals.days} days`],
      ["Message", data.message],
      ["Account", user ? "signed in" : "guest"],
    );
  }
  details.push(["Locale", data.locale]);

  const { error } = await admin.from("quotes").insert(row);
  if (error) {
    console.error("[quotes] insert failed:", error.message);
    return fail("server", 500);
  }

  // The quote is saved either way; a failed notification is logged, not surfaced.
  await sendMail({
    to: env.notifyEmail,
    subject,
    html: detailsTable([...details, ["Site", siteConfig.url]]),
    replyTo: email,
  });

  return ok({ account: !!user });
}
