import { describe, expect, it } from "vitest";
import { clientIp, rateLimit } from "./rate-limit";
import { negotiateSchema, newsletterSchema, quoteRequestSchema, safeNext } from "./validation";

const negotiate = {
  kind: "negotiate",
  locale: "de",
  name: "Anna Muster",
  email: "anna@example.com",
  country: "DE",
  budget: 5000,
  description: "A portal for our members.",
  contact: "email",
  consent: true,
};

describe("negotiateSchema", () => {
  it("accepts a valid request and trims optional blanks", () => {
    const r = negotiateSchema.parse({ ...negotiate, company: "  ", phone: "", launchDate: "" });
    expect(r.company).toBeUndefined();
    expect(r.phone).toBeUndefined();
    expect(r.launchDate).toBeUndefined();
  });

  it.each([
    ["bad email", { email: "nope" }],
    ["no consent", { consent: false }],
    ["budget below range", { budget: 100 }],
    ["budget above range", { budget: 99999 }],
    ["short description", { description: "short" }],
    ["unknown country", { country: "FR" }],
    ["unknown locale", { locale: "fr" }],
    ["bad date", { launchDate: "01.02.2027" }],
  ])("rejects %s", (_, patch) => {
    expect(negotiateSchema.safeParse({ ...negotiate, ...patch }).success).toBe(false);
  });
});

describe("quoteRequestSchema", () => {
  const quote = { kind: "quote", locale: "en", selection: { pkg: "starter", items: { faq: 1 } } };

  it("accepts a guest quote and a signed-in quote without contact fields", () => {
    expect(quoteRequestSchema.safeParse({ ...quote, name: "A B", email: "a@b.co", consent: true }).success).toBe(true);
    expect(quoteRequestSchema.safeParse(quote).success).toBe(true);
  });

  it("rejects unknown packages and absurd quantities", () => {
    expect(quoteRequestSchema.safeParse({ ...quote, selection: { pkg: "free", items: {} } }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...quote, selection: { pkg: "starter", items: { faq: 9999 } } }).success).toBe(false);
  });

  it("dispatches on kind", () => {
    expect(quoteRequestSchema.safeParse({ ...negotiate }).success).toBe(true);
    expect(quoteRequestSchema.safeParse({ ...negotiate, kind: "other" }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("requires a valid email and locale", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.co", locale: "el" }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "a@b", locale: "el" }).success).toBe(false);
  });
});

describe("safeNext", () => {
  it("allows same-site paths only", () => {
    expect(safeNext("/de/dashboard", "/x")).toBe("/de/dashboard");
    expect(safeNext("https://evil.com", "/x")).toBe("/x");
    expect(safeNext("//evil.com", "/x")).toBe("/x");
    expect(safeNext("/\\evil.com", "/x")).toBe("/x");
    expect(safeNext(null, "/x")).toBe("/x");
  });
});

describe("rateLimit", () => {
  it("allows up to max per window, then blocks, then recovers", () => {
    const key = "t:" + Math.random();
    expect([1, 2, 3].map((i) => rateLimit(key, 3, 1000, i))).toEqual([true, true, true]);
    expect(rateLimit(key, 3, 1000, 4)).toBe(false);
    expect(rateLimit(key, 3, 1000, 1500)).toBe(true);
  });

  it("tracks keys independently", () => {
    expect(rateLimit("a:" + 1, 1, 1000, 0)).toBe(true);
    expect(rateLimit("b:" + 1, 1, 1000, 0)).toBe(true);
  });

  it("reads the first forwarded IP", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
