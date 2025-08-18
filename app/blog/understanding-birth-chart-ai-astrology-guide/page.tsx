import { Metadata } from 'next'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Understanding Your Birth Chart: Complete AI Astrology Guide | AstroHoroscope.online',
  description: 'Learn how to interpret your birth chart with AI astrology technology. Discover what your astro horoscope reveals about your personality and life path at AstroHoroscope.online.',
  keywords: [
    'birth chart interpretation',
    'AI astrology guide',
    'astro horoscope analysis',
    'natal chart reading',
    'astrological personality',
    'cosmic blueprint',
    'birth chart houses',
    'planetary positions',
    'zodiac signs meaning'
  ],
  openGraph: {
    title: 'Understanding Your Birth Chart: Complete AI Astrology Guide',
    description: 'Learn how to interpret your birth chart with AI astrology technology. Discover what your astro horoscope reveals about your personality and life path.',
    type: 'article',
    publishedTime: '2024-01-15T00:00:00.000Z',
    authors: ['AstroHoroscope.online Team'],
  }
}

export default function BirthChartGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-cosmic-600 dark:text-cosmic-400 hover:text-cosmic-700 dark:hover:text-cosmic-300"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="text-center mb-8">
            <span className="px-4 py-2 bg-cosmic-100 dark:bg-cosmic-700 text-cosmic-700 dark:text-cosmic-300 text-sm font-medium rounded-full">
              Birth Chart Analysis
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-cosmic-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Understanding Your Birth Chart: A Complete AI Astrology Guide
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8 max-w-4xl mx-auto">
            Learn how to interpret your birth chart with AI astrology technology. Discover what your astro horoscope reveals about your personality and life path.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              AstroHoroscope.online Team
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              January 15, 2024
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              8 min read
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-cosmic-700">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                What is a Birth Chart in AI Astrology?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Your birth chart, also known as a natal chart, is a cosmic snapshot of the exact moment you were born. 
                At <strong>AstroHoroscope.online</strong>, our AI astrology technology analyzes this celestial blueprint 
                to reveal your unique personality traits, life lessons, and cosmic guidance.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Think of your birth chart as your cosmic DNA - it contains the positions of all planets, the Sun, Moon, 
                and other celestial bodies at the precise moment of your birth. This astro horoscope analysis provides 
                insights that traditional horoscope readings simply cannot match.
              </p>
            </section>

            {/* Key Components */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Key Components of Your AI Astrology Birth Chart
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-cosmic-50 to-purple-50 dark:from-cosmic-700 dark:to-purple-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-cosmic-700 dark:text-cosmic-300">
                    🌟 Zodiac Signs
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your Sun sign represents your core personality, while your Moon sign reveals your emotional nature. 
                    AI astrology analyzes how these signs interact to create your unique astro horoscope profile.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-700 dark:to-indigo-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">
                    🌙 Planetary Positions
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Each planet in your birth chart influences different aspects of your life. Our AI astrology system 
                    examines these positions to provide detailed birth chart analysis and predictions.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-cosmic-50 dark:from-indigo-700 dark:to-cosmic-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
                    🏠 Astrological Houses
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    The 12 houses in your birth chart represent different areas of life - from career and relationships 
                    to spirituality and personal growth. AI astrology interprets each house for comprehensive insights.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-cosmic-50 dark:from-pink-700 dark:to-cosmic-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-pink-700 dark:text-pink-300">
                    ⚡ Aspects & Relationships
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    The angles between planets create aspects that influence your personality and life experiences. 
                    Our AI astrology technology calculates and interprets these complex relationships.
                  </p>
                </div>
              </div>
            </section>

            {/* AI Astrology Benefits */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Why Choose AI Astrology for Birth Chart Analysis?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-cosmic-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Precision & Accuracy
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      AI astrology eliminates human error in calculations and interpretations. Every birth chart analysis 
                      at <strong>AstroHoroscope.online</strong> is mathematically precise and scientifically accurate.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Comprehensive Analysis
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Our AI astrology system analyzes thousands of data points simultaneously, providing insights that 
                      would take traditional astrologers weeks to calculate manually.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Personalized Insights
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Unlike generic horoscope readings, AI astrology provides personalized birth chart analysis tailored 
                      specifically to your unique cosmic blueprint.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Read Your Chart */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                How to Read Your AI Astrology Birth Chart
              </h2>
              
              <div className="bg-gradient-to-r from-cosmic-500 to-purple-600 rounded-xl p-8 text-white mb-8">
                <h3 className="text-2xl font-bold mb-4">
                  Step-by-Step Guide to Understanding Your Astro Horoscope
                </h3>
                <ol className="space-y-4 text-lg">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-cosmic-600 rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">1</span>
                    <span>Start with your Sun sign - this represents your core identity and life purpose</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-cosmic-600 rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">2</span>
                    <span>Examine your Moon sign - this reveals your emotional nature and inner world</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-cosmic-600 rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">3</span>
                    <span>Analyze your Rising sign (Ascendant) - this shows how others perceive you</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-cosmic-600 rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">4</span>
                    <span>Study planetary positions - each planet influences different life areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-cosmic-600 rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">5</span>
                    <span>Interpret house placements - these show where life themes manifest</span>
                  </li>
                </ol>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-cosmic-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Discover Your Cosmic Blueprint?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Get your personalized AI astrology birth chart analysis at AstroHoroscope.online. 
                  Professional astro horoscope reading starting at $9.99.
                </p>
                <Link 
                  href="/pricing"
                  className="inline-flex items-center px-8 py-4 bg-white text-cosmic-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Start Your Birth Chart Analysis
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
