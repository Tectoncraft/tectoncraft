'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, Plus } from 'lucide-react'

interface PricingTier {
  name: string
  basePrice: number
  description: string
  features: string[]
  featured?: boolean
}

interface Addon {
  name: string
  price: number
  description: string
}

const tiers: PricingTier[] = [
  {
    name: 'Foundation',
    basePrice: 399,
    description: 'Essential web presence for startups and small businesses',
    features: [
      'Up to 5 custom pages',
      'Responsive design (mobile + desktop)',
      'Contact form integration',
      'Basic SEO setup',
      '30-day support',
      'Fast hosting setup guidance',
    ],
  },
  {
    name: 'Growth',
    basePrice: 899,
    description: 'Advanced features for scaling businesses',
    features: [
      'Up to 15 custom pages',
      'Custom CMS integration',
      'Advanced animations (GSAP)',
      'Multi-language support',
      'Analytics dashboard',
      '90-day priority support',
      'Performance optimization',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    basePrice: 2500,
    description: 'Full-scale e-commerce and custom platforms',
    features: [
      'Unlimited pages',
      'Custom e-commerce platform',
      'Payment gateway integration',
      'Inventory management system',
      'Admin dashboard',
      '6-month dedicated support',
      'Load testing & optimization',
      'Security audit',
    ],
  },
]

const addons: Addon[] = [
  { name: '3D Interactive Canvas', price: 400, description: 'WebGL/Three.js scenes' },
  { name: 'Advanced Form Logic', price: 250, description: 'Multi-step forms with validation' },
  { name: 'Third-party API Integration', price: 350, description: 'Per integration' },
  { name: 'Custom Authentication', price: 600, description: 'User login system' },
  { name: 'Real-time Features', price: 800, description: 'WebSocket/live updates' },
]

export default function Pricing() {
  const [selectedTier, setSelectedTier] = useState<number>(1)
  const [selectedAddons, setSelectedAddons] = useState<number[]>([])

  const toggleAddon = (index: number) => {
    setSelectedAddons((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const totalPrice =
    tiers[selectedTier].basePrice +
    selectedAddons.reduce((sum, i) => sum + addons[i].price, 0)

  return (
    <section id="pricing" className="relative bg-obsidian dark:bg-obsidian py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian-light to-obsidian dark:from-obsidian dark:via-obsidian-light dark:to-obsidian opacity-50" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-mono text-xs tracking-widest uppercase text-accent mb-4">
            Transparent Pricing
          </span>
          <h2 className="font-display font-semibold text-4xl lg:text-6xl tracking-tight text-on-primary mb-6">
            Built to your exact specifications
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Select your base package, then customize with add-ons. All prices are starting points—final quotes depend on project scope.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedTier(index)}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-200 cursor-pointer gpu-accelerated ${
                selectedTier === index
                  ? 'border-accent bg-obsidian-light scale-105'
                  : tier.featured
                  ? 'border-accent/50 bg-obsidian-light hover:border-accent'
                  : 'border-slate-700 bg-obsidian hover:border-slate-600'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-on-accent text-xs font-mono font-medium tracking-widest uppercase rounded-full">
                  Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-2xl font-semibold text-on-primary mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold text-on-primary">
                    €{tier.basePrice}
                  </span>
                  <span className="text-slate-400 font-mono text-sm">starting</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {selectedTier === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl border-2 border-accent pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-obsidian-light border border-slate-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="font-display text-2xl font-semibold text-on-primary mb-6">
            Customize with add-ons
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleAddon(index)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  selectedAddons.includes(index)
                    ? 'border-accent bg-accent/10'
                    : 'border-slate-700 bg-obsidian hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-on-primary text-sm mb-1">
                      {addon.name}
                    </h4>
                    <p className="text-xs text-slate-400">{addon.description}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ml-2 transition-colors ${
                      selectedAddons.includes(index)
                        ? 'border-accent bg-accent'
                        : 'border-slate-600'
                    }`}
                  >
                    {selectedAddons.includes(index) && (
                      <Check className="w-4 h-4 text-on-accent" />
                    )}
                  </div>
                </div>
                <div className="font-mono text-sm font-semibold text-accent">
                  +€{addon.price}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-accent via-accent/90 to-accent rounded-2xl p-8 lg:p-12"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="font-mono text-sm tracking-widest uppercase text-on-accent/80 mb-2">
                Your Configuration
              </div>
              <div className="font-display text-5xl lg:text-6xl font-bold text-on-accent mb-2">
                €{totalPrice.toLocaleString()}
              </div>
              <div className="text-on-accent/90">
                {tiers[selectedTier].name} + {selectedAddons.length} add-on
                {selectedAddons.length !== 1 ? 's' : ''}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-on-accent text-accent font-semibold rounded-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-on-accent focus:ring-offset-2 focus:ring-offset-accent cursor-pointer whitespace-nowrap"
            >
              Request Detailed Quote
            </motion.button>
          </div>
        </motion.div>

        <p className="text-center text-slate-400 text-sm mt-8">
          All prices exclude VAT. Final project cost determined after scope consultation.
        </p>
      </div>
    </section>
  )
}
