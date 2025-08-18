import { Metadata } from 'next'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Career Astrology: Best Professions for Each Zodiac Sign | AstroHoroscope.online',
  description: 'Discover the best career paths for your zodiac sign with AI astrology. Learn how your astro horoscope reveals your professional strengths at AstroHoroscope.online.',
  keywords: [
    'career astrology',
    'zodiac career paths',
    'AI astrology professions',
    'astro horoscope career',
    'zodiac work compatibility',
    'birth chart career',
    'astrological career guide',
    'zodiac job matches'
  ],
  openGraph: {
    title: 'Career Astrology: Best Professions for Each Zodiac Sign',
    description: 'Discover the best career paths for your zodiac sign with AI astrology. Learn how your astro horoscope reveals your professional strengths.',
    type: 'article',
    publishedTime: '2024-01-12T00:00:00.000Z',
    authors: ['AstroHoroscope.online Team'],
  }
}

const careerMatches = [
  {
    sign: 'Aries',
    professions: ['Entrepreneur', 'Sales Manager', 'Athlete', 'Military Officer', 'Emergency Responder'],
    strengths: ['Leadership', 'Courage', 'Energy', 'Pioneering spirit'],
    description: 'Natural leaders who thrive in dynamic, challenging environments.'
  },
  {
    sign: 'Taurus',
    professions: ['Financial Advisor', 'Chef', 'Real Estate Agent', 'Banker', 'Gardener'],
    strengths: ['Reliability', 'Patience', 'Practical skills', 'Financial acumen'],
    description: 'Stable and practical workers who excel in secure, tangible fields.'
  },
  {
    sign: 'Gemini',
    professions: ['Journalist', 'Teacher', 'Marketing Specialist', 'Translator', 'Sales Representative'],
    strengths: ['Communication', 'Adaptability', 'Versatility', 'Intellectual curiosity'],
    description: 'Excellent communicators who thrive in information-rich environments.'
  },
  {
    sign: 'Cancer',
    professions: ['Nurse', 'Counselor', 'Social Worker', 'Chef', 'Real Estate Agent'],
    strengths: ['Nurturing', 'Intuition', 'Emotional intelligence', 'Protective nature'],
    description: 'Caring professionals who excel in helping and nurturing roles.'
  },
  {
    sign: 'Leo',
    professions: ['Actor', 'Manager', 'Public Relations', 'Event Planner', 'Teacher'],
    strengths: ['Creativity', 'Leadership', 'Charisma', 'Generosity'],
    description: 'Natural performers who shine in creative and leadership positions.'
  },
  {
    sign: 'Virgo',
    professions: ['Accountant', 'Editor', 'Researcher', 'Quality Control', 'Healthcare Professional'],
    strengths: ['Attention to detail', 'Analytical thinking', 'Perfectionism', 'Practical skills'],
    description: 'Meticulous workers who excel in precision and analysis.'
  },
  {
    sign: 'Libra',
    professions: ['Lawyer', 'Diplomat', 'HR Manager', 'Interior Designer', 'Mediator'],
    strengths: ['Diplomacy', 'Fairness', 'Social skills', 'Aesthetic sense'],
    description: 'Diplomatic professionals who excel in balanced, harmonious environments.'
  },
  {
    sign: 'Scorpio',
    professions: ['Detective', 'Psychologist', 'Surgeon', 'Researcher', 'Financial Analyst'],
    strengths: ['Intensity', 'Determination', 'Intuition', 'Analytical depth'],
    description: 'Deep thinkers who excel in investigative and transformative work.'
  },
  {
    sign: 'Sagittarius',
    professions: ['Travel Guide', 'Professor', 'Writer', 'Entrepreneur', 'International Business'],
    strengths: ['Optimism', 'Adventure', 'Philosophical thinking', 'Honesty'],
    description: 'Freedom-loving professionals who thrive in expansive, educational fields.'
  },
  {
    sign: 'Capricorn',
    professions: ['CEO', 'Engineer', 'Architect', 'Financial Manager', 'Government Official'],
    strengths: ['Responsibility', 'Discipline', 'Ambition', 'Practical leadership'],
    description: 'Ambitious professionals who excel in structured, achievement-oriented careers.'
  },
  {
    sign: 'Aquarius',
    professions: ['Scientist', 'Technology Innovator', 'Social Activist', 'Engineer', 'Humanitarian'],
    strengths: ['Innovation', 'Originality', 'Humanitarianism', 'Intellectual independence'],
    description: 'Visionary professionals who excel in cutting-edge and humanitarian fields.'
  },
  {
    sign: 'Pisces',
    professions: ['Artist', 'Musician', 'Counselor', 'Nurse', 'Spiritual Guide'],
    strengths: ['Creativity', 'Compassion', 'Intuition', 'Artistic talent'],
    description: 'Creative and compassionate professionals who excel in artistic and healing fields.'
  }
]

export default function CareerAstrologyPage() {
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
              Career & Professional Life
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-cosmic-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Career Astrology: Best Professions for Each Zodiac Sign
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8 max-w-4xl mx-auto">
            Discover the best career paths for your zodiac sign with AI astrology. Learn how your astro horoscope reveals your professional strengths and ideal work environment.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              AstroHoroscope.online Team
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              January 12, 2024
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              8 min read
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-cosmic-700">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Understanding Career Astrology with AI
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Your zodiac sign reveals much about your professional strengths, work style, and ideal career path. At <strong>AstroHoroscope.online</strong>, 
                our AI astrology technology analyzes your birth chart to identify the careers where you'll naturally excel and find fulfillment.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Whether you're choosing a career path, considering a job change, or seeking to maximize your professional potential, 
                AI astrology provides insights that can guide your career decisions and help you find work that aligns with your cosmic blueprint.
              </p>
            </section>

            {/* Career Matches Grid */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                Zodiac Signs & Their Ideal Professions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careerMatches.map((career) => (
                  <div key={career.sign} className="bg-gradient-to-br from-cosmic-50 to-purple-50 dark:from-cosmic-700 dark:to-purple-700 rounded-xl p-6 border border-cosmic-200 dark:border-cosmic-600 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="text-center mb-4">
                      <BriefcaseIcon className="w-8 h-8 text-cosmic-600 dark:text-cosmic-300 mx-auto mb-2" />
                      <h3 className="text-xl font-bold text-cosmic-700 dark:text-cosmic-300">{career.sign}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Top Professions:</h4>
                      <div className="flex flex-wrap gap-1">
                        {career.professions.map((profession) => (
                          <span key={profession} className="px-2 py-1 bg-white dark:bg-cosmic-600 text-cosmic-700 dark:text-cosmic-300 text-xs rounded-full">
                            {profession}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Strengths:</h4>
                      <div className="flex flex-wrap gap-1">
                        {career.strengths.map((strength) => (
                          <span key={strength} className="px-2 py-1 bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-300 text-xs rounded-full">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {career.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-cosmic-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Discover Your Career Path
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Get your personalized AI astrology career analysis at AstroHoroscope.online. 
                  Find the perfect profession that aligns with your cosmic strengths.
                </p>
                <Link href="/pricing" className="inline-flex items-center px-8 py-4 bg-white text-cosmic-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                  Start Your Career Analysis
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
