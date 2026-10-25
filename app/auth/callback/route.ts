import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "@/config/site";
import { hasSupabaseAuth } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { safeNext } from "@/lib/validation";

/** Magic-link / OAuth / email-confirmation return point: exchanges the code for a session. */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const next = safeNext(searchParams.get("next"), `/${defaultLocale}/dashboard`);
  const code = searchParams.get("code");

  if (code && hasSupabaseAuth()) {
    const { error } = await (await createServerSupabase()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }
  const locale = next.split("/")[1] || defaultLocale;
  return NextResponse.redirect(new URL(`/${locale}/login?error=link`, origin));
}
