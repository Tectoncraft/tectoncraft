'use client'

import { motion } from 'framer-motion'
import { Code2, Palette, Smartphone, Rocket, Database, Lock } from 'lucide-react'

const capabilities = [
  {
    icon: Code2,
    title: 'Custom Development',
    description: 'Bespoke solutions built from the ground up with Next.js, React, and modern web technologies.',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Editorial-grade interfaces that balance aesthetics with conversion-focused interaction design.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Engineering',
    description: 'Pixel-perfect experiences across all devices, from mobile-first to ultra-wide displays.',
  },
  {
    icon: Rocket,
    title: 'Performance Optimization',
    description: 'Sub-second load times, lazy loading, and Core Web Vitals compliance as standard.',
  },
  {
    icon: Database,
    title: 'CMS Integration',
    description: 'Headless CMS setup with custom dashboards for content teams—Sanity, Contentful, or custom.',
  },
  {
    icon: Lock,
    title: 'Security & Compliance',
    description: 'GDPR-ready implementations, secure authentication, and enterprise-grade hosting architecture.',
  },
]

export default function WorkGrid() {
  return (
    <section className="relative bg-alabaster dark:bg-alabaster py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-mono text-xs tracking-widest uppercase text-muted-foreground dark:text-muted-foreground mb-4">
            Our Capabilities
          </span>
          <h2 className="font-display font-semibold text-4xl lg:text-6xl tracking-tight text-charcoal dark:text-charcoal mb-6">
            Full-stack expertise, end to end
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-700 max-w-2xl mx-auto leading-relaxed">
            From initial concept to deployment and beyond, we handle every layer of your digital infrastructure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon
            return (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group p-8 bg-card dark:bg-card rounded-xl border border-border dark:border-border hover:border-accent dark:hover:border-accent transition-all duration-200 hover:shadow-lg cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 dark:bg-accent/10 mb-4 group-hover:bg-accent/20 dark:group-hover:bg-accent/20 transition-colors duration-200">
                  <Icon className="w-6 h-6 text-accent dark:text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal dark:text-charcoal mb-3">
                  {capability.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-600 leading-relaxed">
                  {capability.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
