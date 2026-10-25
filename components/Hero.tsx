'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })

// Staggered reveal animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    filter: 'blur(4px)'
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
}

const headlineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
}

const letterVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
    letterSpacing: '0.1em'
  },
  visible: { 
    opacity: 1,
    y: 0,
    letterSpacing: '-0.03em',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section className="relative min-h-screen bg-[#FBFBFB] dark:bg-[#FBFBFB] grain overflow-hidden">
      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFB] via-[#F4F4F0] to-[#F4F4F0] dark:from-[#FBFBFB] dark:via-[#F4F4F0] dark:to-[#F4F4F0]" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-24 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-12rem)]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Status Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0C] text-white rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-mono font-medium tracking-widest uppercase">
                  DE / GR Dual-Market Online
                </span>
              </div>
            </motion.div>

            {/* Headline with letter-spacing spring effect */}
            <motion.div variants={itemVariants}>
              <motion.h1 
                variants={letterVariants}
                className="font-display font-semibold text-5xl lg:text-7xl leading-[1.1] text-balance text-[#111111] dark:text-[#111111]"
                style={{ letterSpacing: '-0.03em' }}
              >
                Bespoke web infrastructure engineered for growth
              </motion.h1>
            </motion.div>

            {/* Subtext */}
            <motion.p 
              variants={itemVariants}
              className="text-lg lg:text-xl text-slate-700 dark:text-slate-700 leading-relaxed max-w-xl"
            >
              We design and build custom web platforms that scale with your business. No templates, no compromises—just precision-engineered solutions for ambitious brands.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0A0A0C] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#121214] focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer gpu-accelerated"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-white text-[#111111] dark:text-[#111111] font-medium rounded-lg border-2 border-slate-200 dark:border-slate-200 transition-all duration-200 hover:border-[#111111] dark:hover:border-[#111111] focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer gpu-accelerated"
              >
                <Zap className="w-4 h-4" />
                View Capabilities
              </motion.button>
            </motion.div>

            {/* Metric Badges */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-8 pt-8 border-t border-slate-200 dark:border-slate-200"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="font-mono text-2xl font-semibold text-[#111111] dark:text-[#111111]">
                  &lt;0.4s
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-600">
                  Avg Load Time
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="font-mono text-2xl font-semibold text-[#111111] dark:text-[#111111]">
                  100/100
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-600">
                  Lighthouse Score
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <div className="font-mono text-2xl font-semibold text-[#111111] dark:text-[#111111]">
                  0%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-600">
                  AI Templates
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* 3D Canvas Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:h-[600px] h-[400px]"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute inset-0 bg-[#0A0A0C] rounded-2xl overflow-hidden shadow-2xl gpu-accelerated">
              {!isMobile ? (
                <Scene3D />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A0A0C] via-[#121214] to-[#1a1a1c]">
                  <svg
                    className="w-48 h-48 text-[#F4F4F0] opacity-50"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      d="M100 20 L180 60 L180 140 L100 180 L20 140 L20 60 Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
                      d="M100 20 L100 100 M100 100 L180 140 M100 100 L20 140"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                      cx="100"
                      cy="100"
                      r="4"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
