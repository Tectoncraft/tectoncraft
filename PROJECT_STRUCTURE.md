# Tectoncraft Homepage - Project Structure

## Quick Start

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` after running `npm run dev`.

## Project Architecture

### Design System Compliance
- **70% Light / 30% Dark ratio**: Alabaster (#FBFBFB) backgrounds for Hero, ProofStrip, WorkGrid, ContactForm. Obsidian (#0A0A0C) for Pricing and Footer.
- **Typography**: Outfit (headings), Work Sans (body), JetBrains Mono (badges/prices)
- **Performance**: WebGL lazy-loaded via `next/dynamic`, mobile fallback for <768px viewports

### File Structure

```
/app
  layout.tsx          # Root layout with font loading
  page.tsx            # Main homepage composition
  globals.css         # Tailwind + custom styles

/components
  Hero.tsx            # Asymmetrical hero with 3D canvas (right side)
  Scene3D.tsx         # Three.js/R3F rotating icosahedron
  ProofStrip.tsx      # Performance metrics strip
  WorkGrid.tsx        # 6-card capabilities grid
  Pricing.tsx         # Interactive calculator with add-ons
  ContactForm.tsx     # Multi-step project inquiry form
  Footer.tsx          # 4-column footer with social links

/tailwind.config.js   # Custom color tokens + font families
/next.config.js       # Next.js configuration
/postcss.config.js    # Tailwind CSS processing
```

## Component Details

### Hero (components/Hero.tsx)
- Left column: Headline, system status badge, dual CTAs, performance metrics
- Right column: Dynamic 3D WebGL scene (desktop) or animated SVG fallback (mobile)
- Status indicator: Live pulse animation with "DE / GR Dual-Market Online"

### Pricing (components/Pricing.tsx)
- 3 base tiers: Foundation (€399), Growth (€899), Enterprise (€2,500)
- 5 interactive add-ons (3D canvas, forms, APIs, auth, real-time)
- Live total calculator at bottom
- Click tier cards to select, click add-on cards to toggle

### 3D Scene (components/Scene3D.tsx)
- Lazy-loaded via `dynamic(() => import('./Scene3D'), { ssr: false })`
- Wireframe icosahedron with continuous rotation
- GPU-accelerated, uses `transform: translate3d(0,0,0)`

### ContactForm (components/ContactForm.tsx)
- Fields: Name, Email, Company, Project Type, Budget, Message
- Inline validation (HTML5 required attributes)
- Submit handler ready for backend integration

## Color Palette

```js
alabaster: '#FBFBFB'      // Main light background
warm-white: '#F4F4F0'      // Secondary light
obsidian: '#0A0A0C'        // Main dark background
charcoal: '#111111'        // Dark text
accent: '#0369A1'          // CTA buttons, links
```

## Typography Scale

```js
font-display: Outfit       // Headings (tracking-tight, sentence-case)
font-sans: Work Sans       // Body copy (leading-relaxed, slate-800)
font-mono: JetBrains Mono  // Badges, prices (tracking-widest, uppercase)
```

## Performance Optimizations

1. **Lazy 3D Loading**: WebGL mounted only after viewport check
2. **Mobile Fallback**: Static SVG for screens <768px
3. **Font Preloading**: Google Fonts preconnect in layout.tsx
4. **Static Generation**: Full SSG for homepage (53.5 kB route)
5. **GPU Acceleration**: `will-change: transform` on animated elements

## Build Output

```
Route (app)                  Size       First Load JS
┌ ○ /                       53.5 kB         156 kB
└ ○ /_not-found              992 B         104 kB
```

## Next Steps

1. **Add Real 3D Model**: Replace icosahedron with Draco-compressed .glb (<2.5 MB)
2. **Lenis Smooth Scroll**: Wrap app in `<ReactLenis>` provider
3. **GSAP Scroll Animations**: Add `ScrollTrigger` to WorkGrid cards
4. **Form Backend**: Connect ContactForm to API route or email service
5. **Navigation**: Add sticky nav with logo + menu
6. **Case Studies**: Create `/work` page with project showcases

## Design Constraints (from CLAUDE.md)

### Forbidden Patterns
- ❌ Purple/blue glowing gradients (#6366f1)
- ❌ Centered "Hero + 2 Buttons" sandwich layouts
- ❌ Full-screen WebGL on mobile (<768px)
- ❌ Generic AI template aesthetics

### Required Patterns
- ✅ Asymmetrical editorial layouts
- ✅ 70% light / 30% dark visual ratio
- ✅ Sentence-case headings (not all-caps)
- ✅ Hardware-accelerated animations
- ✅ Mobile-first responsive breakpoints

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion (UI), GSAP (scroll - not yet added)
- **3D**: Three.js via @react-three/fiber + @react-three/drei
- **Icons**: lucide-react
- **Smooth Scroll**: @studio-freight/lenis (installed, not yet integrated)

---

Built following the architectural specifications in `CLAUDE.md` and design tokens from `ui-ux-pro-max` skill.
