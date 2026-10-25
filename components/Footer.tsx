'use client'

import { motion } from 'framer-motion'
import { Mail, Link, ExternalLink, AtSign } from 'lucide-react'

const socialLinks = [
  { icon: ExternalLink, href: '#', label: 'GitHub' },
  { icon: Link, href: '#', label: 'LinkedIn' },
  { icon: AtSign, href: '#', label: 'Twitter' },
  { icon: Mail, href: 'mailto:hello@tectoncraft.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative bg-obsidian dark:bg-obsidian py-16 border-t border-slate-800 dark:border-slate-800">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-on-primary mb-4">
              Tectoncraft
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Engineering exceptional web experiences for growth-focused businesses across Europe.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-on-primary mb-4">Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-accent transition-colors duration-200">Web Development</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-200">UI/UX Design</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-200">E-commerce</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-200">CMS Integration</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-on-primary mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-accent transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-200">Case Studies</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-on-primary mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 text-slate-400 hover:bg-accent hover:text-on-accent transition-all duration-200 cursor-pointer"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Tectoncraft. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-accent transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors duration-200">Imprint</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
