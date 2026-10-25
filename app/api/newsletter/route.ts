import { z } from "zod";
import type { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";
import { fail, ok } from "@/lib/api";
import { escapeHtml, sendMail } from "@/lib/email";
import { newsletterMail } from "@/lib/email-copy";
import { hasSupabaseAdmin } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createAdminSupabase } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { newsletterSchema } from "@/lib/validation";

/** Double opt-in: stores the address unconfirmed and mails a confirmation link. */
export async function POST(req: NextRequest) {
  if (!hasSupabaseAdmin()) return fail("not_configured", 503);

  const ip = clientIp(req.headers);
  if (!rateLimit(`newsletter:${ip}`, 5, 10 * 60_000)) return fail("rate_limited", 429);

  const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return fail("validation", 400, { fields: Object.keys(z.flattenError(parsed.error).fieldErrors) });
  }
  const { email, locale, token, website } = parsed.data;
  if (website) return ok();
  if (!(await verifyTurnstile(token, ip))) return fail("captcha", 400);

  const admin = createAdminSupabase();
  const address = email.toLowerCase();
  const { data: existing } = await admin
    .from("newsletter")
    .select("confirmed_at")
    .eq("email", address)
    .maybeSingle();

  // Same response whether or not the address is already subscribed.
  if (existing?.confirmed_at) return ok();

  const { data, error } = await admin
    .from("newsletter")
    .upsert({ email: address, locale }, { onConflict: "email" })
    .select("confirm_token")
    .single();
  if (error || !data) {
    console.error("[newsletter] upsert failed:", error?.message);
    return fail("server", 500);
  }

  const copy = newsletterMail[locale];
  const link = `${siteConfig.url}/api/newsletter/confirm?token=${data.confirm_token}&locale=${locale}`;
  await sendMail({
    to: address,
    subject: copy.subject,
    html: `<p style="font-family:system-ui,sans-serif;font-size:15px">${escapeHtml(copy.body)}</p><p><a href="${link}" style="font-family:system-ui,sans-serif;font-size:15px">${escapeHtml(copy.cta)}</a></p>`,
  });
  return ok();
}
