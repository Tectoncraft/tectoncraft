import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { env, hasSupabaseAuth } from "@/lib/env";

/** Keeps the auth cookies fresh. Called from proxy.ts on auth-related pages only. */
export async function refreshSession(request: NextRequest, response: NextResponse) {
  if (!hasSupabaseAuth() || !request.cookies.getAll().some((c) => c.name.startsWith("sb-"))) {
    return response;
  }
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}
