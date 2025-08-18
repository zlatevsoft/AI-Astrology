import { Metadata } from 'next'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Astro Horoscope Blog - AI Astrology Insights & Birth Chart Analysis',
  description: 'Read expert astro horoscope articles, AI astrology insights, and birth chart analysis tips at AstroHoroscope.online. Discover your cosmic destiny.',
  keywords: [
    'astro horoscope blog',
    'AI astrology articles',
    'birth chart analysis',
    'zodiac horoscope reading',
    'astrological insights',
    'cosmic guidance',
    'astrology tips',
    'horoscope predictions'
  ],
}

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Your Birth Chart: Complete AI Astrology Guide',
    excerpt: 'Learn how to interpret your birth chart with AI astrology technology. Discover what your astro horoscope reveals about your personality and life path.',
    slug: 'understanding-birth-chart-ai-astrology-guide',
    category: 'Birth Chart Analysis',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-15',
    readTime: '8 min read',
    featured: true,
    image: '/blog/birth-chart-guide.jpg'
  },
  {
    id: 2,
    title: 'Zodiac Signs Personality Traits: AI Astrology Insights',
    excerpt: 'Discover the unique personality traits of each zodiac sign through AI astrology analysis. Understand your cosmic character at AstroHoroscope.online.',
    slug: 'zodiac-signs-personality-traits',
    category: 'Zodiac Analysis',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-14',
    readTime: '6 min read',
    featured: false,
    image: '/blog/zodiac-traits.jpg'
  },
  {
    id: 3,
    title: 'Love Compatibility: Zodiac Signs AI Astrology Guide',
    excerpt: 'Explore love compatibility between zodiac signs with AI astrology. Find your perfect cosmic match at AstroHoroscope.online.',
    slug: 'love-compatibility-zodiac-signs-ai-astrology-guide',
    category: 'Love & Relationships',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-13',
    readTime: '7 min read',
    featured: false,
    image: '/blog/love-compatibility.jpg'
  },
  {
    id: 4,
    title: 'Career Astrology: Best Professions for Each Zodiac Sign',
    excerpt: 'Discover the best career paths for your zodiac sign with AI astrology. Find your cosmic calling at AstroHoroscope.online.',
    slug: 'career-astrology-best-professions-for-each-zodiac-sign',
    category: 'Career Guidance',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-12',
    readTime: '6 min read',
    featured: false,
    image: '/blog/career-astrology.jpg'
  },
  {
    id: 5,
    title: 'Daily Horoscope: AI Astrology Personalized Predictions',
    excerpt: 'Get personalized daily horoscope predictions with AI astrology. Discover your cosmic guidance at AstroHoroscope.online.',
    slug: 'daily-horoscope-ai-astrology-personalized-predictions',
    category: 'Daily Predictions',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-11',
    readTime: '5 min read',
    featured: false,
    image: '/blog/daily-horoscope.jpg'
  },
  {
    id: 6,
    title: 'Planetary Transits: AI Astrology Guide to Cosmic Influences',
    excerpt: 'Understand planetary transits and their influence on your life with AI astrology. Navigate cosmic changes at AstroHoroscope.online.',
    slug: 'planetary-transits-ai-astrology-guide-to-cosmic-influences',
    category: 'Planetary Analysis',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-10',
    readTime: '7 min read',
    featured: false,
    image: '/blog/planetary-transits.jpg'
  },
  {
    id: 7,
    title: 'Astrological Aspects: AI Astrology Guide to Planetary Relationships',
    excerpt: 'Learn about astrological aspects and their influence on your personality with AI astrology. Understand cosmic relationships at AstroHoroscope.online.',
    slug: 'astrological-aspects-ai-astrology-guide-to-planetary-relationships',
    category: 'Aspect Analysis',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-09',
    readTime: '6 min read',
    featured: false,
    image: '/blog/astrological-aspects.jpg'
  },
  {
    id: 8,
    title: 'Astrological Houses: AI Astrology Guide to Life Areas',
    excerpt: 'Explore astrological houses and their influence on different life areas with AI astrology. Understand your cosmic life map at AstroHoroscope.online.',
    slug: 'astrological-houses-ai-astrology-guide-to-life-areas',
    category: 'House Analysis',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-08',
    readTime: '7 min read',
    featured: false,
    image: '/blog/astrological-houses.jpg'
  },
  {
    id: 9,
    title: 'Astrological Elements: AI Astrology Guide to Fire, Earth, Air & Water',
    excerpt: 'Learn about astrological elements with AI astrology. Understand Fire, Earth, Air & Water in your astro horoscope at AstroHoroscope.online.',
    slug: 'astrological-elements-ai-astrology-guide',
    category: 'Elemental Analysis',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-07',
    readTime: '5 min read',
    featured: false,
    image: '/blog/astrological-elements.jpg'
  },
  {
    id: 10,
    title: 'Astrological Modalities: AI Astrology Guide to Cardinal, Fixed & Mutable',
    excerpt: 'Learn about astrological modalities with AI astrology. Understand Cardinal, Fixed & Mutable signs in your astro horoscope at AstroHoroscope.online.',
    slug: 'astrological-modalities-ai-astrology-guide',
    category: 'Modality Analysis',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-06',
    readTime: '5 min read',
    featured: false,
    image: '/blog/astrological-modalities.jpg'
  },
  {
    id: 11,
    title: 'Retrograde Planets: AI Astrology Guide to Planetary Retrogrades',
    excerpt: 'Learn about retrograde planets with AI astrology. Understand Mercury, Venus, Mars retrogrades in your astro horoscope at AstroHoroscope.online.',
    slug: 'retrograde-planets-ai-astrology-guide',
    category: 'Retrograde Analysis',
    author: 'AstroHoroscope.online Team',
    date: '2024-01-05',
    readTime: '5 min read',
    featured: false,
    image: '/blog/retrograde-planets.jpg'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cosmic-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Astro Horoscope Blog
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            AI Astrology Insights & Birth Chart Analysis
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover expert astro horoscope articles, AI astrology insights, and professional birth chart analysis tips. 
            Learn how cosmic forces shape your destiny at AstroHoroscope.online.
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map(post => (
          <div key={post.id} className="mb-16">
            <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-cosmic-700">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-cosmic-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">🌟</div>
                      <div className="text-sm opacity-80">Featured Article</div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="px-3 py-1 bg-cosmic-100 dark:bg-cosmic-700 text-cosmic-700 dark:text-cosmic-300 text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cosmic-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cosmic-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                  >
                    Read Full Article
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.filter(post => !post.featured).map(post => (
            <article key={post.id} className="bg-white dark:bg-cosmic-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-cosmic-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-cosmic-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">✨</div>
                  <div className="text-xs opacity-80">Astro Horoscope</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="px-2 py-1 bg-cosmic-100 dark:bg-cosmic-700 text-cosmic-700 dark:text-cosmic-300 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-cosmic-600 dark:text-cosmic-400 font-semibold text-sm hover:text-cosmic-700 dark:hover:text-cosmic-300 transition-colors"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-cosmic-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Get Your Personal AI Astrology Birth Chart
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Ready to discover your cosmic blueprint? Get your personalized astro horoscope analysis starting at $9.99.
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
        </div>
      </div>
    </div>
  )
}
