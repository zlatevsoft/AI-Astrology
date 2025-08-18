import { Metadata } from 'next'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Zodiac Signs Personality Traits: Complete AI Astrology Guide | AstroHoroscope.online',
  description: 'Discover your zodiac sign personality traits with AI astrology. Learn how your astro horoscope reveals your unique character at AstroHoroscope.online.',
  keywords: [
    'zodiac signs personality',
    'astrological traits',
    'AI astrology zodiac',
    'astro horoscope personality',
    'zodiac characteristics',
    'birth chart personality',
    'astrological signs meaning',
    'zodiac compatibility traits'
  ],
  openGraph: {
    title: 'Zodiac Signs Personality Traits: Complete AI Astrology Guide',
    description: 'Discover your zodiac sign personality traits with AI astrology. Learn how your astro horoscope reveals your unique character.',
    type: 'article',
    publishedTime: '2024-01-14T00:00:00.000Z',
    authors: ['AstroHoroscope.online Team'],
  }
}

const zodiacSigns = [
  {
    sign: 'Aries',
    symbol: '♈',
    element: 'Fire',
    dates: 'March 21 - April 19',
    traits: ['Courageous', 'Energetic', 'Pioneering', 'Independent', 'Impulsive'],
    description: 'Aries individuals are natural leaders with boundless energy and courage. They approach life with enthusiasm and are always ready for new challenges.'
  },
  {
    sign: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    dates: 'April 20 - May 20',
    traits: ['Reliable', 'Patient', 'Practical', 'Loyal', 'Stubborn'],
    description: 'Taurus natives are grounded and reliable, valuing stability and comfort. They are patient and determined in achieving their goals.'
  },
  {
    sign: 'Gemini',
    symbol: '♊',
    element: 'Air',
    dates: 'May 21 - June 20',
    traits: ['Adaptable', 'Versatile', 'Communicative', 'Witty', 'Curious'],
    description: 'Gemini individuals are versatile and adaptable, with excellent communication skills and a natural curiosity about the world.'
  },
  {
    sign: 'Cancer',
    symbol: '♋',
    element: 'Water',
    dates: 'June 21 - July 22',
    traits: ['Nurturing', 'Protective', 'Intuitive', 'Emotional', 'Caring'],
    description: 'Cancer natives are deeply emotional and intuitive, with strong nurturing instincts and a protective nature towards loved ones.'
  },
  {
    sign: 'Leo',
    symbol: '♌',
    element: 'Fire',
    dates: 'July 23 - August 22',
    traits: ['Confident', 'Creative', 'Generous', 'Loyal', 'Dramatic'],
    description: 'Leo individuals are natural performers with confidence and creativity. They are generous and loyal to those they care about.'
  },
  {
    sign: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    dates: 'August 23 - September 22',
    traits: ['Analytical', 'Practical', 'Diligent', 'Modest', 'Perfectionist'],
    description: 'Virgo natives are analytical and practical, with attention to detail and a strong work ethic. They strive for perfection in everything.'
  },
  {
    sign: 'Libra',
    symbol: '♎',
    element: 'Air',
    dates: 'September 23 - October 22',
    traits: ['Diplomatic', 'Fair-minded', 'Social', 'Peaceful', 'Indecisive'],
    description: 'Libra individuals are diplomatic and fair-minded, seeking balance and harmony in all aspects of life and relationships.'
  },
  {
    sign: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    dates: 'October 23 - November 21',
    traits: ['Passionate', 'Determined', 'Magnetic', 'Mysterious', 'Intense'],
    description: 'Scorpio natives are passionate and determined, with magnetic personalities and deep emotional intensity.'
  },
  {
    sign: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    dates: 'November 22 - December 21',
    traits: ['Optimistic', 'Adventurous', 'Philosophical', 'Honest', 'Freedom-loving'],
    description: 'Sagittarius individuals are optimistic and adventurous, with a love for freedom and philosophical thinking.'
  },
  {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    dates: 'December 22 - January 19',
    traits: ['Responsible', 'Disciplined', 'Ambitious', 'Patient', 'Practical'],
    description: 'Capricorn natives are responsible and disciplined, with strong ambition and practical approach to achieving their goals.'
  },
  {
    sign: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    dates: 'January 20 - February 18',
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual'],
    description: 'Aquarius individuals are progressive and original thinkers, valuing independence and humanitarian causes.'
  },
  {
    sign: 'Pisces',
    symbol: '♓',
    element: 'Water',
    dates: 'February 19 - March 20',
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Dreamy'],
    description: 'Pisces natives are compassionate and artistic, with strong intuition and a gentle, dreamy nature.'
  }
]

export default function ZodiacSignsPage() {
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
              Zodiac Analysis
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-cosmic-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Zodiac Signs Personality Traits: Complete AI Astrology Guide
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8 max-w-4xl mx-auto">
            Discover your zodiac sign personality traits with AI astrology. Learn how your astro horoscope reveals your unique character and life path.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              AstroHoroscope.online Team
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              January 14, 2024
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              12 min read
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-cosmic-700">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Understanding Zodiac Signs in AI Astrology
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Your zodiac sign is one of the most fundamental aspects of your astro horoscope. At <strong>AstroHoroscope.online</strong>, 
                our AI astrology technology analyzes how your zodiac sign influences your personality, behavior patterns, and life choices.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Each of the 12 zodiac signs has unique characteristics, strengths, and challenges. Understanding your sign's personality 
                traits can provide valuable insights into your relationships, career choices, and personal growth journey.
              </p>
            </section>

            {/* Zodiac Signs Grid */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                The 12 Zodiac Signs: Personality Traits & Characteristics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zodiacSigns.map((sign) => (
                  <div key={sign.sign} className="bg-gradient-to-br from-cosmic-50 to-purple-50 dark:from-cosmic-700 dark:to-purple-700 rounded-xl p-6 border border-cosmic-200 dark:border-cosmic-600 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{sign.symbol}</div>
                      <h3 className="text-xl font-bold text-cosmic-700 dark:text-cosmic-300">{sign.sign}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{sign.dates}</p>
                      <span className="inline-block px-3 py-1 bg-cosmic-100 dark:bg-cosmic-600 text-cosmic-700 dark:text-cosmic-300 text-xs font-medium rounded-full mt-2">
                        {sign.element}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Traits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {sign.traits.map((trait) => (
                          <span key={trait} className="px-2 py-1 bg-white dark:bg-cosmic-600 text-cosmic-700 dark:text-cosmic-300 text-xs rounded-full">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {sign.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Elements Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                The Four Elements in AI Astrology
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-700 dark:to-orange-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-300">
                    🔥 Fire Signs (Aries, Leo, Sagittarius)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Fire signs are passionate, energetic, and dynamic. They are natural leaders with enthusiasm and creativity. 
                    AI astrology reveals how their fiery nature influences their approach to life and relationships.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-700 dark:to-emerald-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300">
                    🌍 Earth Signs (Taurus, Virgo, Capricorn)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Earth signs are practical, reliable, and grounded. They value stability and work hard to achieve their goals. 
                    Our AI astrology system analyzes their methodical approach to life.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-700 dark:to-cyan-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                    💨 Air Signs (Gemini, Libra, Aquarius)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Air signs are intellectual, communicative, and social. They are adaptable and value mental stimulation. 
                    AI astrology examines their analytical and innovative nature.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-700 dark:to-purple-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
                    💧 Water Signs (Cancer, Scorpio, Pisces)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Water signs are emotional, intuitive, and compassionate. They are deeply connected to their feelings and others. 
                    Our AI astrology technology explores their emotional intelligence and empathy.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-cosmic-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Discover Your Complete Zodiac Profile
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Get your personalized AI astrology birth chart analysis at AstroHoroscope.online. 
                  Learn how your zodiac sign influences your personality and life path.
                </p>
                <Link 
                  href="/pricing"
                  className="inline-flex items-center px-8 py-4 bg-white text-cosmic-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Start Your Zodiac Analysis
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
