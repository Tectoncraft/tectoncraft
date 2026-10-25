'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send } from 'lucide-react'

type ProjectType = 'website' | 'ecommerce' | 'platform' | 'redesign' | 'other'
type Budget = '< €1k' | '€1k - €3k' | '€3k - €10k' | '€10k+' | 'Not sure'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '' as ProjectType | '',
    budget: '' as Budget | '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section id="contact" className="relative bg-alabaster dark:bg-alabaster py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-mono text-xs tracking-widest uppercase text-muted-foreground dark:text-muted-foreground mb-4">
            Get Started
          </span>
          <h2 className="font-display font-semibold text-4xl lg:text-6xl tracking-tight text-charcoal dark:text-charcoal mb-6">
            Let's build something exceptional
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Share your project details and we'll respond within 24 hours with a tailored proposal.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-card dark:bg-card p-8 lg:p-12 rounded-2xl border border-border dark:border-border shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal dark:text-charcoal mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-border dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white dark:bg-white text-charcoal dark:text-charcoal"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal dark:text-charcoal mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-border dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white dark:bg-white text-charcoal dark:text-charcoal"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="company" className="block text-sm font-medium text-charcoal dark:text-charcoal mb-2">
              Company / Organization
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-border dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white dark:bg-white text-charcoal dark:text-charcoal"
              placeholder="Acme Inc."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-charcoal dark:text-charcoal mb-2">
                Project Type *
              </label>
              <select
                id="projectType"
                required
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value as ProjectType })}
                className="w-full px-4 py-3 border border-border dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 cursor-pointer bg-white dark:bg-white text-charcoal dark:text-charcoal"
              >
                <option value="">Select type</option>
                <option value="website">Marketing Website</option>
                <option value="ecommerce">E-commerce Platform</option>
                <option value="platform">Custom Web Platform</option>
                <option value="redesign">Redesign / Rebuild</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-charcoal dark:text-charcoal mb-2">
                Budget Range *
              </label>
              <select
                id="budget"
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value as Budget })}
                className="w-full px-4 py-3 border border-border dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 cursor-pointer bg-white dark:bg-white text-charcoal dark:text-charcoal"
              >
                <option value="">Select range</option>
                <option value="< €1k">Less than €1,000</option>
                <option value="€1k - €3k">€1,000 - €3,000</option>
                <option value="€3k - €10k">€3,000 - €10,000</option>
                <option value="€10k+">€10,000+</option>
                <option value="Not sure">Not sure yet</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-charcoal dark:text-charcoal mb-2">
              Project Details *
            </label>
            <textarea
              id="message"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-border dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-white text-charcoal dark:text-charcoal"
              placeholder="Tell us about your project goals, timeline, and any specific requirements..."
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-obsidian dark:bg-obsidian text-on-primary dark:text-on-primary font-semibold rounded-lg transition-all duration-200 hover:bg-obsidian-light dark:hover:bg-obsidian-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
          >
            Send Project Inquiry
            <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>

          <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-4 text-center">
            We typically respond within 24 hours during business days.
          </p>
        </motion.form>
      </div>
    </section>
  )
}
