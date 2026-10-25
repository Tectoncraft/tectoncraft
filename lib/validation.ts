import { z } from "zod";
import { budget, packages, type PackageId } from "@/config/pricing";
import { locales } from "@/config/site";

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  text(max)
    .optional()
    .transform((v) => v || undefined);

/** Fields every public form carries. `website` is the honeypot: humans never fill it. */
const base = {
  locale: z.enum(locales),
  token: z.string().optional(),
  website: z.string().optional(),
};

export const selectionSchema = z.object({
  pkg: z.enum(packages.map((p) => p.id) as [PackageId, ...PackageId[]]),
  items: z.record(z.string().max(40), z.number().int().min(1).max(100)),
});

export const negotiateSchema = z.object({
  ...base,
  kind: z.literal("negotiate"),
  name: text(120).min(2),
  email: z.email().max(200),
  company: optionalText(160),
  country: z.enum(["DE", "GR", "other"]),
  phone: optionalText(40),
  budget: z.number().int().min(budget.min).max(budget.max),
  description: text(4000).min(10),
  launchDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  contact: z.enum(["email", "phone", "whatsapp"]),
  consent: z.literal(true),
});

/** Quote from the configurator. Visitors give name + email; signed-in users need neither. */
export const quoteSchema = z.object({
  ...base,
  kind: z.literal("quote"),
  name: optionalText(120),
  email: z.email().max(200).optional(),
  message: optionalText(2000),
  selection: selectionSchema,
  consent: z.boolean().optional(),
});

export const quoteRequestSchema = z.discriminatedUnion("kind", [negotiateSchema, quoteSchema]);

export const newsletterSchema = z.object({
  ...base,
  email: z.email().max(200),
});

export type NegotiateInput = z.infer<typeof negotiateSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** Only same-site relative paths; blocks open redirects through `?next=`. */
export function safeNext(next: string | null | undefined, fallback: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : fallback;
}
