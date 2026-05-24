import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing – Astro Horoscope',
  description: 'Choose your reading depth. One-time payment in EUR. Basic, detailed, and compatibility-focused options.',
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
