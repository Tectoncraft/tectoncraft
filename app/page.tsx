'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProofStrip from '@/components/ProofStrip'
import WorkGrid from '@/components/WorkGrid'
import Pricing from '@/components/Pricing'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'

const BackgroundCanvas = dynamic(() => import('@/components/BackgroundCanvas'), { ssr: false })

export default function Home() {
  return (
    <SmoothScrollProvider>
      <BackgroundCanvas />
      <Navbar />
      <main className="relative">
        <Hero />
        <ProofStrip />
        <WorkGrid />
        <Pricing />
        <ContactForm />
        <Footer />
      </main>
    </SmoothScrollProvider>
  )
}
