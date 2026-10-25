/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        'on-primary': '#FFFFFF',
        secondary: '#334155',
        'on-secondary': '#FFFFFF',
        accent: '#0369A1',
        'on-accent': '#FFFFFF',
        background: '#F8FAFC',
        foreground: '#020617',
        card: '#FFFFFF',
        'card-foreground': '#020617',
        muted: '#E8ECF1',
        'muted-foreground': '#475569',
        border: '#E2E8F0',
        destructive: '#DC2626',
        'on-destructive': '#FFFFFF',
        ring: '#0F172A',
        alabaster: '#FBFBFB',
        'warm-white': '#F4F4F0',
        obsidian: '#0A0A0C',
        'obsidian-light': '#121214',
        charcoal: '#111111',
      },
      fontFamily: {
        display: ['var(--font-satoshi)', 'var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.03em',
      },
      animation: {
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
    },
  },
  plugins: [],
}
