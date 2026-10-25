/** Which backend services are configured. Nothing throws at import time, so builds work without keys. */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  resendKey: process.env.RESEND_API_KEY ?? "",
  resendFrom: process.env.RESEND_FROM_EMAIL ?? "",
  notifyEmail: process.env.QUOTE_NOTIFY_EMAIL ?? "",
  turnstileSite: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY ?? "",
};

export const hasSupabaseAuth = () => !!env.supabaseUrl && !!env.supabaseAnonKey;
export const hasSupabaseAdmin = () => hasSupabaseAuth() && !!env.serviceRoleKey;
