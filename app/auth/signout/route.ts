import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/config/site";
import { hasSupabaseAuth } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const value = form.get("locale");
  const locale = locales.find((l) => l === value) ?? defaultLocale;
  if (hasSupabaseAuth()) await (await createServerSupabase()).auth.signOut();
  return NextResponse.redirect(new URL(`/${locale}`, req.nextUrl.origin), 303);
}
