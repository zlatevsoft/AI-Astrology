import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { HowItWorksSection } from '@/components/sections/how-it-works-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { CTASection } from '@/components/sections/cta-section'
import { PlansSection } from '@/components/sections/plans-section'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Professional Astro Horoscope Birth Chart',
  description: 'Get your personalized AI-powered Professional Astro Horoscope Birth Chart Discover your zodiac traits, planetary influences, and life path with our advanced astrological insights.',
  openGraph: {
    title: 'Professional Astro Horoscope Birth Chart',
    description: 'Get your personalized AI-powered Professional Astro Horoscope Birth Chart Discover your zodiac traits, planetary influences, and life path with our advanced astrological insights.',
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative">
        {/* Background cosmic pattern */}
        <div className="absolute inset-0 cosmic-bg-pattern opacity-30" />
        
        {/* Floating cosmic elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-cosmic-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-indigo-400 rounded-full animate-float opacity-50" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-pink-400 rounded-full animate-float opacity-30" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <HeroSection />
          <PlansSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  )
}

