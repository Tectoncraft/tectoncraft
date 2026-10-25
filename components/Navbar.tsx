'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, ArrowUpRight, Menu, X } from 'lucide-react'
import { clsx } from 'clsx'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Process', href: '#process' },
]

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'px-6 lg:px-12'
        )}
      >
        <nav
          className={clsx(
            'mx-auto mt-6 rounded-2xl transition-all duration-300',
            'backdrop-blur-md gpu-accelerated',
            scrolled
              ? 'bg-white/80 dark:bg-obsidian/80 border border-black/5 dark:border-white/10 shadow-lg shadow-black/5'
              : 'bg-white/60 dark:bg-obsidian/60 border border-black/5 dark:border-white/10'
          )}
        >
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-display font-bold text-lg tracking-tight text-charcoal dark:text-on-primary"
              >
                TECTONCRAFT
              </motion.a>
              <span className="font-mono text-xs text-muted-foreground dark:text-slate-400 tracking-widest">
                [01]
              </span>
            </div>

            {/* Center: Navigation Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-charcoal dark:hover:text-on-primary transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* Right: Theme Toggle + CTA */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {theme === 'light' ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 text-charcoal dark:text-on-primary" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 text-charcoal dark:text-on-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* CTA Button - Hidden on mobile */}
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2 bg-obsidian dark:bg-accent text-on-primary font-medium text-sm rounded-lg transition-all duration-200 hover:bg-obsidian-light dark:hover:bg-accent/90 hover:shadow-lg"
              >
                Start Project
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-charcoal dark:text-on-primary" />
                ) : (
                  <Menu className="w-5 h-5 text-charcoal dark:text-on-primary" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-24 left-6 right-6 z-40 lg:hidden"
          >
            <div className="bg-white/95 dark:bg-obsidian/95 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col p-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-charcoal dark:hover:text-on-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
                
                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-obsidian dark:bg-accent text-on-primary font-medium text-sm rounded-lg transition-all duration-200 hover:bg-obsidian-light dark:hover:bg-accent/90"
                >
                  Start Project
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
