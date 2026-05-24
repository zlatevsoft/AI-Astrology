import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Astro Horoscope Blog - Astrology & Birth Chart',
  description: 'Astrology articles and birth chart tips at AstroHoroscope.online. Prices in EUR.',
  keywords: [
    'astro horoscope blog',
    'Astrology',
    'birth chart',
    'natal chart',
    'AstroHoroscope.online',
  ],
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
