1. Brand
Name: tectoncraft (lowercase in logo, "Tectoncraft" in running text)
Idea: tectonic plates + craft. Solid ground for a business online. Visual metaphor: heavy monochrome slabs that drift, lift and lock together into a finished website.
Tone: confident, calm, precise. Short sentences. No buzzword soup.
Logo mark: a simple "T" built from two interlocking slabs. Wordmark in the display font.
2. Language detection & switching

Goal: the visitor sees their language on the very first paint, with no flicker.

Keyboard layout can't be read by a server, and the browser Keyboard API is Chromium-only and runs after the page loads (that would cause a flash). So detection uses what the browser sends with the request:

Resolution order in proxy.ts / middleware.ts (runs on the server before render):

URL already has a locale (/de/...) → use it.
NEXT_LOCALE cookie (set whenever the user picks a language) → redirect to that locale.
Accept-Language header (the browser/OS language list, q-weighted) → best match among en, de, el. Match by base language (de-AT → de, el-CY → el).
IP country header from the host (e.g. x-vercel-ip-country, Cloudflare cf-ipcountry): DE, AT, CH, LI, LU → de; GR, CY → el.
Fallback: en.

Why this order: a Greek person living in Munich has a Greek browser — their language beats their location.

Redirect with 307, never 301 (detection result can change).
Do not redirect search-engine bots by Accept-Language; serve x-default → /en.
Language switcher in navbar: shows EN · DE · ΕΛ (text, not flags). Switching keeps the current path (/de/pricing → /el/pricing), sets the cookie for 1 year.
<html lang> set per locale (en, de, el).
Fonts must include Greek glyphs (subset greek + latin + latin-ext).
3. Design system
Color tokens (monochrome only)
Token	Light	Dark
--bg	
#FFFFFF	
#0A0A0A
--fg	
#0A0A0A	
#FFFFFF
--muted	
#6B6B6B	
#A3A3A3
--line	
#E6E6E6	
#262626
--surface	
#F6F6F6	
#141414
--btn-bg	
#0A0A0A	
#FFFFFF
--btn-fg	
#FFFFFF	
#0A0A0A

Default theme: light. The toggle switches and persists the choice. (Option: follow OS on first visit — keep a single flag in config/site.ts.) Tailwind v4: @custom-variant dark (&:where(.dark, .dark *)); and map tokens with @theme.

Typography
Display: a geometric grotesk with Greek support (e.g. Inter Tight or Manrope), tight tracking, very large sizes (clamp 48–128 px for H1).
Body: Inter (Greek subset), 16–18 px, line-height 1.6.
Self-host with next/font.
Layout
12-column grid, max width 1280 px, generous whitespace (sections ≥ 160 px vertical on desktop).
Corners: 0 or 4 px (sharp, architectural). 1 px --line borders instead of shadows.
Buttons: primary = solid --btn-bg; secondary = 1 px outline. Hover: subtle fill-swap animation.
4. Navbar

Sticky, transparent over hero, becomes solid --bg with bottom --line after 24 px scroll. Height 72 px desktop / 64 px mobile.

Left: logo → home. Center links: Work · Services · Pricing · Add-ons · Process · FAQ · Contact (Pricing / Add-ons / Process / FAQ are anchor links on home; Work and Contact are pages.) Right: Language switcher · Theme toggle (sun/moon icon, animated) · Log in (text button) · Get started (primary button → signup).

Mobile: logo + theme toggle + hamburger. Full-screen overlay menu with large links, then language switcher and auth buttons at the bottom. Focus trap, Esc closes.

5. Motion & generated media
Loader (first visit only)
1.2 s max. Slabs snap together into the "T" mark, then the screen splits horizontally to reveal the hero.
Built as a short frame sequence (~36 frames) on <canvas>, or as a muted WebM with an MP4 fallback.
Show only if the hero isn't ready; set sessionStorage flag so it doesn't replay. Skip on prefers-reduced-motion.
Scroll-scrubbed 3D sequences

Workflow: generate a start-frame image + end-frame image → image-to-video (5–8 s) → extract frames → scrub on scroll.

Component ImageSequenceCanvas({ name, frameCount, pinFor }): pins the section with ScrollTrigger and draws frame n to canvas based on scroll progress.
Frames: WebP (AVIF optional), desktop 1920 px wide 16:9, mobile 1080×1920 9:16 (generate a separate vertical video — don't crop).
90–150 frames per sequence; target ≤ 4 MB total desktop, ≤ 2.5 MB mobile.
Loading: draw frame 1 immediately (it's also the LCP poster image, preloaded), then load every 8th frame, then fill gaps; scrub uses the nearest loaded frame.
Dark mode: render all media on pure white; in dark mode apply filter: invert(1) to the canvas. If a sequence looks wrong inverted, provide a separate dark/ set.
Reduced motion: static poster, no pinning.

scripts/extract-frames.sh:

bash
ffmpeg -i "$1" -vf "fps=24,scale=1920:-2" -c:v libwebp -quality 72 "public/sequences/$2/desktop/%04d.webp"
Other motion
Section headings: words rise 12 px + fade, staggered 40 ms.
Cards: reveal on enter, hover lifts border to --fg.
Everything respects reduced motion.
6. Home page sections
6.1 Hero — "Plates in motion"
Full viewport, pinned for ~200% scroll height.
Visual: scroll-scrubbed sequence. Start: monochrome stone/matte slabs floating apart in white space. As the user scrolls they drift, rotate and lock together, forming a clean browser window with a website layout inside. Final frame holds still as the pin releases.
Copy (left / overlaid, fades out as plates assemble):
EN H1: "Websites, built on solid ground."
DE H1: „Websites mit festem Fundament."
EL H1: «Ιστοσελίδες με γερά θεμέλια.»
Sub (EN): "Design, development and 3D motion for businesses in Germany and Greece. Live in weeks, built to last."
DE: „Design, Entwicklung und 3D-Animation für Unternehmen in Deutschland und Griechenland. In wenigen Wochen online – gebaut für Jahre."
EL: «Σχεδιασμός, ανάπτυξη και 3D animation για επιχειρήσεις σε Γερμανία και Ελλάδα. Online σε λίγες εβδομάδες, φτιαγμένες να διαρκούν.»
Buttons: See packages (primary → #pricing) · Book a free call (secondary → contact)
Trust line under buttons: "From €399 · Fixed prices · EN / DE / EL" (localized).
Scroll cue: thin animated line + "Scroll".
6.2 Intro / value section (below hero)

Large statement, then 3–4 columns:

Statement (EN): "We craft fast, multilingual websites that look sharp, rank well and turn visitors into customers."
Columns:
Fixed prices — you know the cost before we start.
Three languages — English, German and Greek, written by humans.
Motion that sells — 3D scroll animations that make you memorable.
GDPR-ready — EU hosting, cookie consent and legal pages set up.
Then a Process strip (id process), 4 numbered steps: Call → Design → Build → Launch, with typical timeline.
Optional: 3 portfolio teasers (id links to /work) — placeholder cards until real projects exist.
6.3 Pricing (id pricing)

Five cards in a row on desktop (horizontal scroll-snap on mobile), plus a sixth "Custom" card. "Most popular" badge on Professional. One-time price, VAT notice under the grid (see §9).

Data lives in config/pricing.ts:

id	Name	Price	Includes
starter	Starter	€399	1-page site, up to 5 sections, responsive, 1 language, contact form, basic SEO, SSL, 2 revision rounds, ~7 days
business	Business	€899	Up to 5 pages, 1 language, contact form + Google Maps, Google Business Profile link, basic SEO, analytics (consent-based), 2 revisions, ~14 days
professional ★	Professional	€1,399	Up to 10 pages, 2 languages, blog/CMS so you edit content yourself, 2D scroll animations, advanced on-page SEO, cookie consent, 3 revisions, ~21 days
commerce	Commerce	€1,999	Online shop up to 50 products, payments (Stripe, PayPal, Klarna, Viva Wallet), shipping & VAT setup, 2 languages, CMS, 3 revisions, ~28 days
signature	Signature	€2,499	Up to 15 pages, all 3 languages, custom AI-generated 3D scroll-animation hero, branded loader, advanced SEO, accessibility (WCAG AA), 3 months priority support, 4 revisions, ~35 days

Each card: name, price, one-line "best for", feature list (✓), timeline, CTA Choose {name} → scrolls to add-ons with that package preselected.

Custom card — "Need more than Signature?" Text: "Larger platforms, portals, integrations or a bigger budget — let's find the right price together." Button Let's negotiate → opens NegotiateDialog:

Fields: name, email, company, country (DE/GR/other), phone (optional), budget range slider (€2,500 – €25,000+), project description, desired launch date, preferred contact (email/phone/WhatsApp), consent checkbox.
Saves to Supabase quotes table, emails the team via Resend, shows a localized success state.
6.4 Add-on configurator (id add-ons)

Two-column on desktop: left = grouped add-ons, right = sticky summary panel.

Package selector at top (tabs or segmented control, prefilled from the pricing CTA).
Add-ons as toggle cards; some have a quantity stepper.
Summary: package price + add-ons = one-time total; separate monthly total; "Rush delivery" applied as a %; VAT note.
Selection is stored in the URL query (?pkg=professional&a=blog,booking&qty=extra-page:3) so it's shareable and survives login.
CTA Request this quote → if logged in, saves to their account; if not, opens a short form (or signup) with the configuration attached.
Search box + category filter chips on top (there are many add-ons).

Add-on list (config/addons.ts; prices are starting points the owners can edit — type: "one-time" | "monthly" | "percent", optional qty):

Pages & content

id	Add-on	Price
extra-page	Extra page	€79 / page (qty)
extra-language	Extra language (EN/DE/EL)	€149 / language (qty)
copywriting	Professional copywriting	€49 / page (qty)
translation	Human translation	€39 / page (qty)
blog	Blog / CMS	€249
portfolio	Portfolio / gallery	€129
faq	FAQ section	€49
testimonials	Testimonials / reviews section	€69
events	Events calendar	€149
careers	Careers / job listings page	€129

Design & motion

id	Add-on	Price
logo	Logo design	€249
brand-kit	Brand identity kit (logo, colors, type, guide)	€599
3d-sequence	3D scroll-animation sequence	€499 each (qty)
loader	Custom loading animation	€199
video-bg	Video background section	€149
illustrations	Custom icons / illustrations set	€199
micro	Micro-interactions pack	€149
dark-mode	Light/dark mode for your site	€99

Shop & bookings

id	Add-on	Price
booking	Online booking / appointments	€249
shop	Online shop (up to 25 products)	€599
products-50	+50 shop products	€149 (qty)
payment	Extra payment provider	€99 each (qty)
vouchers	Gift cards / vouchers	€149
menu-qr	Restaurant menu + QR code	€129
listings	Real-estate / rental listings	€399
members	Members area with login	€349
quote-form	Multi-step quote / request form	€149

Marketing & SEO

id	Add-on	Price
seo-pro	Advanced SEO setup	€299
local-seo	Local SEO + Google Business Profile	€149
newsletter	Newsletter signup & integration	€129
social-feed	Instagram / social feed	€79
chat	WhatsApp / live-chat button	€59
ai-chat	AI chatbot trained on your content	€399 + €29/mo
pixels	Google / Meta tracking (consent-gated)	€99
analytics	Privacy-friendly analytics dashboard	€99
popup	Lead popup / discount banner	€79

Legal & accessibility

id	Add-on	Price
cookie	GDPR cookie consent	€99
legal-pages	Legal pages setup (Impressum, privacy, terms — client provides or uses a generator; not legal advice)	€79
a11y	Accessibility upgrade (WCAG 2.2 AA)	€399

Technical

id	Add-on	Price
domain-email	Domain + business email setup	€49 (+ provider cost)
migration	Migration from old website	€199
speed	Speed optimization	€149
pwa	Installable app (PWA)	€249
integration	API / CRM integration	€299
staging	Staging / preview environment	€79

Care plans (monthly)

id	Add-on	Price
hosting	Hosting + SSL + backups (EU)	€19/mo
maintenance	Updates & security monitoring	€49/mo
content-care	Content updates (2 h/month)	€79/mo
seo-report	Monthly SEO report	€99/mo
priority	Priority support	€39/mo

Service

id	Add-on	Price
rush	Rush delivery (half the timeline)	+25% of package
revision	Extra revision round	€79 (qty)
training	1-hour training session	€59 (qty)

Rules: hide add-ons already included in the selected package (e.g. blog for Professional+, shop for Commerce, cookie for Professional+), and show them as "Included".

6.5 FAQ (id faq)

Accordion, 6–8 questions: timeline, what I need to provide, who owns the site, payment terms (e.g. 50% upfront / 50% at launch), hosting, changes after launch, languages, VAT.

6.6 Footer

Inverted block (--fg background, --bg text) for strong ending.

Top: big CTA line "Ready to build?" + Get started button.
Columns: Studio (About, Work, Process, Contact) · Services (Packages, Add-ons, Care plans, Negotiate) · Legal (Impressum, Privacy / Datenschutz, Terms / AGB, Cookie settings) · Contact (email, phone, WhatsApp, offices/areas: Germany · Greece).
Newsletter field (double opt-in).
Bottom bar: © 2026 Tectoncraft · VAT ID placeholder · language switcher · theme toggle · socials (Instagram, LinkedIn, Behance).
7. Other pages
/work — project grid (placeholders at first).
/contact — form + calendar booking link.
/login, /signup — Supabase Auth: email + password, magic link, Google. Localized emails.
/dashboard (protected) — saved quotes/configurations, project status (Briefing → Design → Build → Review → Live), messages, invoices placeholder.
/impressum, /privacy, /terms — localized; content supplied by the owners.
8. Data (Supabase)
profiles (id, name, company, country, locale)
quotes (id, user_id nullable, email, package_id, addons jsonb, totals jsonb, budget_range, message, locale, status, created_at)
newsletter (email, locale, confirmed_at) Row-level security on all tables. Rate-limit public forms; honeypot field + Cloudflare Turnstile.
9. Legal & pricing display (decide before launch)
Germany requires an Impressum; both markets need a privacy policy and cookie consent.
Consumers in DE/GR must see gross prices incl. VAT. Business customers can be shown net. Keep a flag in config/pricing.ts: pricesInclude: "net" | "gross" and show the matching note ("plus VAT" / "incl. VAT"). If the business uses the small-business exemption, show that note instead. Confirm with your accountant.
10. Definition of done (MVP)
All sections above render in EN/DE/EL with no missing keys.
Locale detection works as in §2 (test with browser language set to de, el, en, fr).
Theme toggle with no flash; works with JS disabled (falls back to light).
Lighthouse mobile ≥ 90 in all four categories.
Configurator totals are correct (unit test for the pricing math).
Negotiate and quote forms save and email.