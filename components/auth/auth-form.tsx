"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter as useNextRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Field, inputCls } from "@/components/forms/fields";
import { Turnstile } from "@/components/forms/turnstile";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/validation";

type Mode = "login" | "signup";
type Notice = { kind: "error" | "info"; key: "invalid" | "generic" | "notConfigured" | "linkSent" | "confirmEmail" | "link" };

const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function AuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useNextRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"), `/${locale}/dashboard`);
  const [busy, setBusy] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(
    params.get("error") === "link" ? { kind: "error", key: "link" } : null,
  );

  const callback = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  const captchaToken = token || undefined;

  async function run(fn: () => Promise<Notice | null>) {
    if (!configured) return setNotice({ kind: "error", key: "notConfigured" });
    setBusy(true);
    setNotice(null);
    try {
      setNotice(await fn());
    } catch {
      setNotice({ kind: "error", key: "generic" });
    }
    setBusy(false);
    setResetKey((k) => k + 1);
  }

  const creds = (form: HTMLFormElement) => {
    const d = new FormData(form);
    return { email: String(d.get("email") ?? ""), password: String(d.get("password") ?? ""), name: String(d.get("name") ?? "") };
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password, name } = creds(e.currentTarget);
    void run(async () => {
      const supabase = createClient();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } });
        if (error) return { kind: "error", key: error.status === 400 ? "invalid" : "generic" };
        router.replace(next);
        router.refresh();
        return null;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callback(), captchaToken, data: { locale, ...(name ? { name } : {}) } },
      });
      if (error) return { kind: "error", key: "generic" };
      if (data.session) {
        router.replace(next);
        router.refresh();
        return null;
      }
      return { kind: "info", key: "confirmEmail" };
    });
  }

  function magicLink() {
    const form = document.getElementById("auth-form") as HTMLFormElement | null;
    const email = form ? creds(form).email : "";
    if (!email || !form?.reportValidity()) return;
    void run(async () => {
      const { error } = await createClient().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callback(), shouldCreateUser: mode === "signup", captchaToken, data: { locale } },
      });
      return error ? { kind: "error", key: "generic" } : { kind: "info", key: "linkSent" };
    });
  }

  function google() {
    void run(async () => {
      const { error } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback() },
      });
      return error ? { kind: "error", key: "generic" } : null;
    });
  }

  const login = mode === "login";

  return (
    <div className="mx-auto w-full max-w-md">
      <form id="auth-form" onSubmit={onSubmit} onFocus={() => setEngaged(true)} className="space-y-5">
        {!login && (
          <Field label={t("name")} htmlFor="auth-name" hint={t("optional")}>
            <input id="auth-name" name="name" autoComplete="name" className={inputCls} />
          </Field>
        )}
        <Field label={t("email")} htmlFor="auth-email">
          <input id="auth-email" name="email" type="email" required autoComplete="email" className={inputCls} />
        </Field>
        <Field label={t("password")} htmlFor="auth-password" hint={login ? undefined : t("passwordHint")}>
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            minLength={login ? undefined : 8}
            autoComplete={login ? "current-password" : "new-password"}
            className={inputCls}
          />
        </Field>

        {engaged && <Turnstile onToken={setToken} resetKey={resetKey} />}

        <div role="status" aria-live="polite">
          {notice && (
            <p className={`text-sm ${notice.kind === "error" ? "font-medium" : "text-muted"}`} role={notice.kind === "error" ? "alert" : undefined}>
              {t(`notices.${notice.key}`)}
            </p>
          )}
        </div>

        <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
          {login ? t("submitLogin") : t("submitSignup")}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-sm text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        {t("or")}
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-3">
        <button type="button" onClick={magicLink} disabled={busy} className="btn btn-secondary w-full disabled:opacity-60">
          {t("magic")}
        </button>
        <button type="button" onClick={google} disabled={busy} className="btn btn-secondary w-full disabled:opacity-60">
          {t("google")}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        {login ? t("noAccount") : t("haveAccount")}{" "}
        <Link
          href={{ pathname: login ? "/signup" : "/login", query: params.get("next") ? { next } : {} }}
          className="font-medium text-fg underline"
        >
          {login ? t("signupLink") : t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
