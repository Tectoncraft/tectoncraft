import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { defaultLocale, locales } from "@/config/site";
import { hasSupabaseAdmin } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createAdminSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const localeParam = searchParams.get("locale");
  const locale = locales.find((l) => l === localeParam) ?? defaultLocale;
  const done = (status: "ok" | "invalid") => {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/newsletter/confirmed`;
    url.search = `?status=${status}`;
    return NextResponse.redirect(url, 303);
  };

  const token = z.uuid().safeParse(searchParams.get("token"));
  if (!token.success || !hasSupabaseAdmin() || !rateLimit(`confirm:${clientIp(req.headers)}`, 20, 10 * 60_000)) {
    return done("invalid");
  }

  const { data } = await createAdminSupabase()
    .from("newsletter")
    .update({ confirmed_at: new Date().toISOString() })
    .eq("confirm_token", token.data)
    .is("confirmed_at", null)
    .select("email");

  return done(data && data.length > 0 ? "ok" : "invalid");
}
