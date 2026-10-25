import { NextResponse } from "next/server";

export type ApiError = "validation" | "rate_limited" | "captcha" | "not_configured" | "server";

export const ok = (extra: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...extra });

export const fail = (error: ApiError, status: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, error, ...extra }, { status });
