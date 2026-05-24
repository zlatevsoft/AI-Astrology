import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ – Astro Horoscope',
  description: 'Questions and answers about natal-chart readings, privacy, and EUR payments.',
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
