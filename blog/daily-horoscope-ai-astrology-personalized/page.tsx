import { Metadata } from 'next'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, SunIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Daily Horoscope: AI Astrology Personalized Predictions | AstroHoroscope.online',
  description: 'Get your personalized daily horoscope with AI astrology. Discover how your astro horoscope provides daily guidance at AstroHoroscope.online.',
  keywords: [
    'daily horoscope',
    'AI astrology predictions',
    'personalized horoscope',
    'astro horoscope daily',
    'zodiac daily reading',
    'birth chart daily',
    'astrological daily guide',
    'daily zodiac predictions'
  ],
  openGraph: {
    title: 'Daily Horoscope: AI Astrology Personalized Predictions',
    description: 'Get your personalized daily horoscope with AI astrology. Discover how your astro horoscope provides daily guidance.',
    type: 'article',
    publishedTime: '2024-01-11T00:00:00.000Z',
    authors: ['AstroHoroscope.online Team'],
  }
}

export default function DailyHoroscopePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-cosmic-600 dark:text-cosmic-400 hover:text-cosmic-700 dark:hover:text-cosmic-300">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="text-center mb-8">
            <span className="px-4 py-2 bg-cosmic-100 dark:bg-cosmic-700 text-cosmic-700 dark:text-cosmic-300 text-sm font-medium rounded-full">
              Daily Predictions
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-cosmic-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Daily Horoscope: AI Astrology Personalized Predictions
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8 max-w-4xl mx-auto">
            Get your personalized daily horoscope with AI astrology. Discover how your astro horoscope provides daily guidance and cosmic insights for every aspect of your life.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              AstroHoroscope.online Team
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              January 11, 2024
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              6 min read
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-cosmic-700">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Why Daily Horoscopes Matter in AI Astrology
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Daily horoscopes provide valuable guidance for navigating life's daily challenges and opportunities. At <strong>AstroHoroscope.online</strong>, 
                our AI astrology technology creates personalized daily predictions based on your unique birth chart and current planetary transits.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Unlike generic horoscope readings, AI-powered daily predictions consider your specific planetary positions, aspects, and life circumstances 
                to provide truly personalized guidance for love, career, health, and personal growth.
              </p>
            </section>

            {/* Benefits Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Benefits of AI-Powered Daily Horoscopes
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-cosmic-50 to-purple-50 dark:from-cosmic-700 dark:to-purple-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-cosmic-700 dark:text-cosmic-300">
                    🌟 Personalized Guidance
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Get daily insights tailored specifically to your birth chart, not generic predictions based only on your sun sign.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-700 dark:to-indigo-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">
                    📅 Daily Planning
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Plan your day with cosmic wisdom, knowing which activities align with current planetary energies.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-cosmic-50 dark:from-indigo-700 dark:to-cosmic-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
                    🔮 Future Preparation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Anticipate challenges and opportunities, allowing you to make informed decisions throughout your day.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-cosmic-50 dark:from-pink-700 dark:to-cosmic-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-pink-700 dark:text-pink-300">
                    💫 Cosmic Alignment
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Align your actions with cosmic energies for better outcomes and personal fulfillment.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-cosmic-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Get Your Daily Horoscope
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Start your day with personalized AI astrology guidance at AstroHoroscope.online. 
                  Receive daily predictions tailored to your unique cosmic blueprint.
                </p>
                <Link href="/pricing" className="inline-flex items-center px-8 py-4 bg-white text-cosmic-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                  Start Your Daily Reading
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
