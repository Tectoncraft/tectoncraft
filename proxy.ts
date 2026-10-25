import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, LOCALE_COOKIE } from "@/config/site";
import { refreshSession } from "@/lib/supabase/refresh-session";
import { detectLocale, isBot, isLocale } from "@/lib/detect-locale";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  // 1. URL already has a locale → use it.
  if (isLocale(first)) {
    const headers = new Headers(request.headers);
    headers.set("X-NEXT-INTL-LOCALE", first);
    const response = NextResponse.next({ request: { headers } });
    const page = request.nextUrl.pathname.split("/")[2];
    return page === "dashboard" || page === "login" || page === "signup"
      ? refreshSession(request, response)
      : response;
  }

  // Bots are never redirected by Accept-Language; x-default → /en.
  const locale = isBot(request.headers.get("user-agent"))
    ? defaultLocale
    : detectLocale({
        cookie: request.cookies.get(LOCALE_COOKIE)?.value,
        acceptLanguage: request.headers.get("accept-language"),
        country:
          request.headers.get("x-vercel-ip-country") ??
          request.headers.get("cf-ipcountry"),
      });

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  // 307, never 301: the detection result can change.
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
