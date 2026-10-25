"use client";

import { useState } from "react";

export type SubmitStatus = "idle" | "sending" | "success" | "validation" | "rate_limited" | "captcha" | "not_configured" | "server";

/** POSTs JSON and maps the API's error codes to a status the form can render. */
export function useSubmit(url: string) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [resetKey, setResetKey] = useState(0);

  async function submit(payload: unknown): Promise<{ ok: boolean; account?: boolean }> {
    setStatus("sending");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: SubmitStatus; account?: boolean };
      if (res.ok && data.ok) {
        setStatus("success");
        return { ok: true, account: data.account };
      }
      setStatus(data.error ?? "server");
    } catch {
      setStatus("server");
    }
    setResetKey((k) => k + 1);
    return { ok: false };
  }

  return { status, submit, resetKey, reset: () => setStatus("idle") };
}
