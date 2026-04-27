import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ – AI Astrology',
  description: 'Questions and answers about AI astrology readings, privacy, and payments in EUR.',
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
