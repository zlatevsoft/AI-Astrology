import { Metadata } from 'next'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Love Compatibility: Zodiac Signs & AI Astrology Guide | AstroHoroscope.online',
  description: 'Discover love compatibility between zodiac signs with AI astrology. Learn how your astro horoscope reveals relationship harmony at AstroHoroscope.online.',
  keywords: [
    'love compatibility zodiac',
    'astrological compatibility',
    'AI astrology love',
    'astro horoscope relationships',
    'zodiac love matches',
    'birth chart compatibility',
    'astrological love guide',
    'relationship astrology'
  ],
  openGraph: {
    title: 'Love Compatibility: Zodiac Signs & AI Astrology Guide',
    description: 'Discover love compatibility between zodiac signs with AI astrology. Learn how your astro horoscope reveals relationship harmony.',
    type: 'article',
    publishedTime: '2024-01-13T00:00:00.000Z',
    authors: ['AstroHoroscope.online Team'],
  }
}

const compatibilityMatrix = [
  {
    sign1: 'Aries',
    sign2: 'Leo',
    compatibility: 95,
    description: 'A passionate fire sign combination with intense chemistry and mutual understanding.',
    strengths: ['Passion', 'Adventure', 'Leadership', 'Loyalty'],
    challenges: ['Ego clashes', 'Competitiveness']
  },
  {
    sign1: 'Taurus',
    sign2: 'Virgo',
    compatibility: 90,
    description: 'A stable earth sign pairing with practical love and shared values.',
    strengths: ['Stability', 'Loyalty', 'Practicality', 'Growth'],
    challenges: ['Routine', 'Stubbornness']
  },
  {
    sign1: 'Gemini',
    sign2: 'Libra',
    compatibility: 88,
    description: 'An intellectual air sign match with excellent communication and mental connection.',
    strengths: ['Communication', 'Intellectual bond', 'Social harmony', 'Adaptability'],
    challenges: ['Indecisiveness', 'Overthinking']
  },
  {
    sign1: 'Cancer',
    sign2: 'Scorpio',
    compatibility: 92,
    description: 'A deep water sign connection with emotional intensity and intuitive understanding.',
    strengths: ['Emotional depth', 'Intuition', 'Loyalty', 'Protection'],
    challenges: ['Moodiness', 'Jealousy']
  },
  {
    sign1: 'Sagittarius',
    sign2: 'Aquarius',
    compatibility: 85,
    description: 'A freedom-loving combination with shared ideals and adventurous spirit.',
    strengths: ['Freedom', 'Adventure', 'Idealism', 'Independence'],
    challenges: ['Commitment issues', 'Detachment']
  },
  {
    sign1: 'Capricorn',
    sign2: 'Pisces',
    compatibility: 87,
    description: 'A complementary earth-water pairing with practical dreams and emotional support.',
    strengths: ['Stability', 'Dreams', 'Support', 'Growth'],
    challenges: ['Different approaches', 'Communication']
  }
]

const elementCompatibility = [
  {
    elements: 'Fire + Fire',
    compatibility: 'Excellent',
    description: 'Passionate and dynamic relationships with high energy and mutual understanding.',
    examples: 'Aries-Leo, Leo-Sagittarius, Aries-Sagittarius'
  },
  {
    elements: 'Earth + Earth',
    compatibility: 'Very Good',
    description: 'Stable and practical relationships built on shared values and goals.',
    examples: 'Taurus-Virgo, Virgo-Capricorn, Taurus-Capricorn'
  },
  {
    elements: 'Air + Air',
    compatibility: 'Excellent',
    description: 'Intellectual and communicative relationships with mental stimulation.',
    examples: 'Gemini-Libra, Libra-Aquarius, Gemini-Aquarius'
  },
  {
    elements: 'Water + Water',
    compatibility: 'Very Good',
    description: 'Deep emotional connections with intuitive understanding and empathy.',
    examples: 'Cancer-Scorpio, Scorpio-Pisces, Cancer-Pisces'
  },
  {
    elements: 'Fire + Air',
    compatibility: 'Good',
    description: 'Dynamic relationships with passion and intellectual growth.',
    examples: 'Aries-Gemini, Leo-Libra, Sagittarius-Aquarius'
  },
  {
    elements: 'Earth + Water',
    compatibility: 'Good',
    description: 'Nurturing relationships with practical support and emotional depth.',
    examples: 'Taurus-Cancer, Virgo-Scorpio, Capricorn-Pisces'
  }
]

export default function LoveCompatibilityPage() {
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
              Love & Relationships
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-cosmic-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Love Compatibility: Zodiac Signs & AI Astrology Guide
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8 max-w-4xl mx-auto">
            Discover love compatibility between zodiac signs with AI astrology. Learn how your astro horoscope reveals relationship harmony and romantic potential.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              AstroHoroscope.online Team
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              January 13, 2024
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              10 min read
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-cosmic-700">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Understanding Love Compatibility in AI Astrology
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Love compatibility in astrology goes far beyond simple sun sign matches. At <strong>AstroHoroscope.online</strong>, 
                our AI astrology technology analyzes multiple factors including planetary positions, aspects, and elemental harmony 
                to provide comprehensive relationship insights.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Whether you're seeking to understand your current relationship or looking for romantic guidance, AI astrology 
                can reveal the deeper dynamics of love compatibility and help you navigate the complexities of relationships.
              </p>
            </section>

            {/* Top Compatibility Matches */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                Top Zodiac Compatibility Matches
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {compatibilityMatrix.map((match, index) => (
                  <div key={index} className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-700 dark:to-red-700 rounded-xl p-6 border border-pink-200 dark:border-pink-600">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <HeartIcon className="w-6 h-6 text-pink-600 dark:text-pink-300" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {match.sign1} + {match.sign2}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-600 dark:text-pink-300">
                          {match.compatibility}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Compatibility</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {match.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Strengths:</h4>
                      <div className="flex flex-wrap gap-1">
                        {match.strengths.map((strength) => (
                          <span key={strength} className="px-2 py-1 bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-300 text-xs rounded-full">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Challenges:</h4>
                      <div className="flex flex-wrap gap-1">
                        {match.challenges.map((challenge) => (
                          <span key={challenge} className="px-2 py-1 bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                            {challenge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Element Compatibility */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                Element Compatibility in Love
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {elementCompatibility.map((compatibility, index) => (
                  <div key={index} className="bg-gradient-to-br from-cosmic-50 to-purple-50 dark:from-cosmic-700 dark:to-purple-700 rounded-xl p-6 border border-cosmic-200 dark:border-cosmic-600">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-cosmic-700 dark:text-cosmic-300">
                        {compatibility.elements}
                      </h3>
                      <span className="px-3 py-1 bg-cosmic-100 dark:bg-cosmic-600 text-cosmic-700 dark:text-cosmic-300 text-sm font-medium rounded-full">
                        {compatibility.compatibility}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {compatibility.description}
                    </p>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Examples:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {compatibility.examples}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Astrology Benefits */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Why Use AI Astrology for Love Compatibility?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-cosmic-50 to-purple-50 dark:from-cosmic-700 dark:to-purple-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-cosmic-700 dark:text-cosmic-300">
                    🌟 Comprehensive Analysis
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    AI astrology analyzes thousands of data points including planetary positions, aspects, and house placements 
                    to provide detailed compatibility insights that go beyond simple sun sign matches.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-700 dark:to-indigo-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">
                    💕 Relationship Guidance
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Get personalized advice on how to navigate relationship challenges and strengthen your romantic connections 
                    based on your unique astrological profiles.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-cosmic-50 dark:from-indigo-700 dark:to-cosmic-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
                    🔮 Future Insights
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Understand how planetary transits and progressions will affect your relationship dynamics and prepare 
                    for upcoming challenges and opportunities.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-cosmic-50 dark:from-pink-700 dark:to-cosmic-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-pink-700 dark:text-pink-300">
                    🎯 Personalized Approach
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Every relationship is unique. AI astrology provides customized compatibility analysis tailored to your 
                    specific birth charts and relationship dynamics.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-red-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Discover Your Love Compatibility
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Get your personalized AI astrology love compatibility analysis at AstroHoroscope.online. 
                  Understand your relationship dynamics and find your perfect match.
                </p>
                <Link 
                  href="/pricing"
                  className="inline-flex items-center px-8 py-4 bg-white text-pink-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Start Your Love Analysis
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
