const hits = new Map<string, number[]>();

/**
 * Sliding-window limiter, in memory. Good enough to blunt bursts on a single
 * instance; on serverless each instance has its own counter, so swap in a shared
 * store (Upstash, Supabase) if abuse shows up.
 * Returns true when the call is allowed.
 */
export function rateLimit(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

export const clientIp = (headers: Headers) =>
  headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
