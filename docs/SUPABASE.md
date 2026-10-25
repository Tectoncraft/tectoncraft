# Supabase, Resend and Turnstile setup

1. **Database.** Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor (or `supabase db push`).
   It creates `profiles`, `quotes` and `newsletter` with row-level security, and a trigger that creates a profile per user.
   - Public forms never write to the database directly: `/api/quotes` and `/api/newsletter` do, using the
     service-role key after checking Turnstile, the honeypot and the rate limit. So `quotes` has only a
     `select own rows` policy for signed-in users and `newsletter` has no client policies at all.
2. **Auth → URL configuration.** Site URL = your domain. Add redirect URLs
   `https://<domain>/auth/callback` and `http://localhost:3000/auth/callback`.
3. **Auth → Providers.** Enable Email (password + magic link) and Google (create an OAuth client in Google Cloud,
   authorised redirect URI = the callback URL shown in the Supabase Google provider settings).
4. **Auth → Attack protection (optional).** Enable CAPTCHA with Cloudflare Turnstile and the same secret;
   the login/signup forms already send the token.
5. **Localized auth emails.** Sign-up and magic-link calls pass `data.locale`. In *Auth → Email templates* branch on it:

   ```
   {{ if eq .Data.locale "de" }}Bitte bestätigen Sie Ihre E-Mail-Adresse …
   {{ else if eq .Data.locale "el" }}Επιβεβαιώστε το email σας …
   {{ else }}Please confirm your email …{{ end }}
   ```
6. **Env.** Copy `.env.example` to `.env.local` and fill it in. Resend needs a verified sending domain.
