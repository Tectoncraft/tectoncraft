import { createBrowserClient } from "@supabase/ssr";

/** Browser client (anon key). Only call when `NEXT_PUBLIC_SUPABASE_*` is set. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
