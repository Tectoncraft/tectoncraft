import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

interface Mail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/** Returns false (and logs) when Resend isn't configured or the send fails; callers decide if that matters. */
export async function sendMail({ to, subject, html, replyTo }: Mail): Promise<boolean> {
  if (!env.resendKey || !env.resendFrom || !to) {
    console.warn("[email] Resend not configured; skipped:", subject);
    return false;
  }
  try {
    const { error } = await new Resend(env.resendKey).emails.send({
      from: env.resendFrom,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) throw new Error(error.message);
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

/** key/value table for the team notification. Values are escaped. */
export function detailsTable(rows: [string, string | undefined | null][]): string {
  const body = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#6b6b6b;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");
  return `<table style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">${body}</table>`;
}
