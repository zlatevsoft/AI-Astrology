'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PlanPricingCards } from '@/components/sections/plan-pricing-cards'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950 pt-page-header-safe">
        <div className="container mx-auto px-4 py-12">
          <PlanPricingCards layout="page" />
        </div>
      </main>
      <Footer />
    </>
  )
}
