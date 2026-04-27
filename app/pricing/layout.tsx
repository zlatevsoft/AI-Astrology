import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing – AI Astrology',
  description: 'Choose your AI astrology plan. One-time payment in EUR. Basic, detailed, and comprehensive readings.',
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
