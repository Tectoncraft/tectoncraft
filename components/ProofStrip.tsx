'use client'

import { motion } from 'framer-motion'
import { Zap, Award, Shield } from 'lucide-react'

const metrics = [
  {
    icon: Zap,
    value: '<0.4s',
    label: 'Average Load Time',
  },
  {
    icon: Award,
    value: '100/100',
    label: 'Lighthouse Score',
  },
  {
    icon: Shield,
    value: '0%',
    label: 'AI Templates Used',
  },
]

export default function ProofStrip() {
  return (
    <section className="relative bg-warm-white dark:bg-warm-white py-16 border-y border-border dark:border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block font-mono text-xs tracking-widest uppercase text-muted-foreground dark:text-muted-foreground mb-4">
            Performance Benchmarks
          </span>
          <h2 className="font-display font-semibold text-3xl lg:text-5xl tracking-tight text-charcoal dark:text-charcoal">
            Built for speed, designed to convert
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 dark:bg-accent/10 mb-4">
                  <Icon className="w-8 h-8 text-accent dark:text-accent" />
                </div>
                <div className="font-mono text-4xl font-bold text-charcoal dark:text-charcoal mb-2">
                  {metric.value}
                </div>
                <div className="text-muted-foreground dark:text-muted-foreground">
                  {metric.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
