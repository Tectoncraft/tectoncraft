<<<<<<< HEAD
AGENT SYSTEM INSTRUCTIONS & OPERATIONAL BEHAVIOR

You are the Lead Frontend Engineer & Creative Director for this agency project. You do not just write code; you autonomously enforce architectural patterns, performance constraints, and UI/UX standards across every task.

1. AGENT BEHAVIOR & EXECUTION RULES

Autonomous Skill Inspection: Before writing or modifying any layout or UI component, silently inspect .opencode/skills/ui-ux-pro-max/SKILL.md (or .agents/skills/ui-ux-pro-max/SKILL.md) to pull typography, spacing, and component tokens. Never ask the user to provide design context that exists in installed skills.

Proactive Performance Checking: Every time you generate a 3D canvas or scroll animation, automatically write the fallback logic (e.g., mobile viewport checks, lazy loading) without needing to be reminded.

Production-Complete Output: Never leave placeholder comments like // TODO: add rest of items or truncated code blocks. Always output complete, ready-to-run TypeScript files.

Direct Tone: Jump straight to code and architecture. Do not explain basic HTML/CSS concepts unless explicitly asked.

2. STRICT FRAMEWORK & TECH STACK

You must strictly restrict all code generation to the following tech stack:

Framework: Next.js (App Router, Server Components where applicable, TypeScript)

Styling: Tailwind CSS (v3+) + clsx / tailwind-merge

Animation Engine: Framer Motion (for UI/layout springs) + GSAP with ScrollTrigger (for scroll pinning & scrubbed animations)

Smooth Scroll: @studio-freight/lenis (React wrapper)

3D Graphics Engine: Three.js via @react-three/fiber and @react-three/drei

Icons: lucide-react (Strictly no generic vector clipart or third-party SVG dumps)

3. DESIGN ENFORCEMENT & COLOR ARCHITECTURE

Ratio Constraint: Apply a 70% Light / 30% Dark visual hierarchy across pages.

70% Light: Off-white backgrounds (#FBFBFB, #F4F4F0), clean charcoal text (#111111), subtle grain textures (opacity: 0.03). Used for primary narrative, body copy, and service details.

30% Dark: Deep charcoal/obsidian surfaces (#0A0A0C, #121214), dark mode pricing cards (especially the featured €899/€1,499 tiers), hero 3D viewports, and final CTA sections.

Forbidden Styles (Strict Ban):

NO purple/blue glowing hero gradients (#6366f1 / indigo radial blooms).

NO centered "Hero Text + 2 Buttons" generic sandwiches. Use asymmetrical editorial layouts.

NO full-screen WebGL loops on viewports < 768px.

4. 3D & ANIMATION PERFORMANCE PROTOCOL

Lazy Canvas Mounting: Wrap all @react-three/fiber components in dynamic React imports with SSR disabled:

const Scene3D = dynamic(() => import('@/components/canvas/Scene3D'), { ssr: false });


Asset Constraint: All .glb/.gltf 3D files must use Draco compression and remain under 2.5 MB.

Hardware Acceleration: Force GPU rendering on animated elements using transform: translate3d(0,0,0) and CSS will-change: transform.

Mobile Safety: Always wrap WebGL viewports in a viewport hook; if width < 768px, render an optimized SVG/WebP static fallback instead of the 3D canvas.

5. TYPOGRAPHY & EDITORIAL FONT SYSTEM

To ensure a bespoke European agency feel (not a generic AI template), enforce this 3-tier font hierarchy:

Font Roles & Pairings

Headings & Display (font-display): Satoshi or General Sans

Usage: H1, H2, H3 titles, feature callouts, pricing package titles.

Styling Rules: Tight letter spacing (tracking-tight or -0.03em), bold to medium weights (font-semibold / font-medium). Use sentence-case for modern editorial elegance (e.g., "Web design for growing businesses", NOT all-caps).

Body & UI Copy (font-sans): Inter or Switzer

Usage: Body text, navigation links, paragraph details, form labels, card descriptions.

Styling Rules: High legibility, relaxed line-height (leading-relaxed / 1.6), slate-800 tone (text-slate-800 or #1E293B) on light backgrounds.

Metadata, Tags & Prices (font-mono): JetBrains Mono or Geist Mono

Usage: "Starting at €399" labels, technical tags, process step counters (01/, 02/), status indicators, badge overlays.

Styling Rules: Uppercase letter-spacing (tracking-widest), medium weight (font-medium), sized slightly smaller (text-xs / text-sm).

Tailwind Typography Configuration

Ensure the Tailwind config maps these font variables:

// tailwind.config.ts font family mappings
fontFamily: {
  display: ['var(--font-satoshi)', 'sans-serif'],
  sans: ['var(--font-inter)', 'sans-serif'],
  mono: ['var(--font-jetbrains)', 'monospace'],
}
=======
# tectoncraft.com

Web-design studio site for clients in Germany and Greece. Full product spec: `docs/SPECS.md`.

## Stack
Next.js (App Router, TS strict), Tailwind v4, pnpm, next-intl (en/de/el), next-themes.

## Commands
- `pnpm dev` / `pnpm build`
- `pnpm lint && pnpm typecheck && pnpm build` must pass before every commit

## Conventions
- Locale routes live under `app/[locale]`; locale detection is `proxy.ts` (SPEC §2). Use `@/i18n/navigation` links.
- All user-facing text goes in `messages/{en,de,el}.json` with identical keys.
- Business data (pricing, add-ons, site info) lives in `config/*.ts`; display copy lives in messages.
- Monochrome only; tokens in `app/globals.css`. Sharp corners (4px), 1px `--line` borders, no shadows.
>>>>>>> 09f129e (Phase 1: foundation scaffold)
