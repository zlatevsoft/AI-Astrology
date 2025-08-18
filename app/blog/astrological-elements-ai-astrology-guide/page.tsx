import { Metadata } from 'next'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Astrological Elements: AI Astrology Guide to Fire, Earth, Air & Water | AstroHoroscope.online',
  description: 'Learn about astrological elements with AI astrology. Understand Fire, Earth, Air & Water in your astro horoscope at AstroHoroscope.online.',
  keywords: [
    'astrological elements',
    'AI astrology elements',
    'fire earth air water',
    'astro horoscope elements',
    'zodiac elements',
    'elemental astrology',
    'cosmic elements',
    'astrological energy'
  ],
  openGraph: {
    title: 'Astrological Elements: AI Astrology Guide to Fire, Earth, Air & Water',
    description: 'Learn about astrological elements with AI astrology. Understand Fire, Earth, Air & Water in your astro horoscope.',
    type: 'article',
    publishedTime: '2024-01-07T00:00:00.000Z',
    authors: ['AstroHoroscope.online Team'],
  }
}

export default function AstrologicalElementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16">
        <nav className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-cosmic-600 dark:text-cosmic-400 hover:text-cosmic-700 dark:hover:text-cosmic-300">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </nav>

        <header className="mb-12">
          <div className="text-center mb-8">
            <span className="px-4 py-2 bg-cosmic-100 dark:bg-cosmic-700 text-cosmic-700 dark:text-cosmic-300 text-sm font-medium rounded-full">
              Elemental Analysis
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-cosmic-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Astrological Elements: AI Astrology Guide to Fire, Earth, Air & Water
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8 max-w-4xl mx-auto">
            Learn about astrological elements with AI astrology. Understand how Fire, Earth, Air & Water influence your astro horoscope and personality.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              AstroHoroscope.online Team
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              January 7, 2024
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              5 min read
            </div>
          </div>
        </header>

        <article className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-cosmic-700">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Understanding Astrological Elements in AI Astrology
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                The four astrological elements - Fire, Earth, Air, and Water - represent fundamental energy types in your birth chart. At <strong>AstroHoroscope.online</strong>, 
                our AI astrology technology analyzes elemental balance to reveal your natural energy patterns and personality traits.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Understanding elements helps you recognize your natural strengths, challenges, and how to achieve balance in your life.
              </p>
            </section>

            <section className="text-center">
              <div className="bg-gradient-to-r from-cosmic-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Discover Your Elemental Balance
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Get detailed elemental analysis at AstroHoroscope.online. Understand your cosmic energy patterns.
                </p>
                <Link href="/pricing" className="inline-flex items-center px-8 py-4 bg-white text-cosmic-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                  Start Your Elemental Analysis
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  )
}
