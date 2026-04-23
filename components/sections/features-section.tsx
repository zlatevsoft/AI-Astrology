'use client'

import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  SparklesIcon, 
  ShieldCheckIcon, 
  BoltIcon,
  HeartIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: ChartBarIcon,
    title: 'Accurate Birth Charts',
    description: 'Generate precise natal charts using Swiss Ephemeris calculations with planetary positions and aspects.',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: SparklesIcon,
    title: 'AI-Powered Analysis',
    description: 'Get personalized insights about your personality, life lessons, and cosmic guidance from advanced AI.',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Privacy & Security',
    description: 'Your birth data is encrypted and never shared. We prioritize your privacy and data protection.',
    color: 'from-green-500 to-teal-600'
  },
  {
    icon: BoltIcon,
    title: 'Instant Results',
    description: 'Receive your complete birth chart and AI analysis in seconds, not hours or days.',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    icon: HeartIcon,
    title: 'Personalized Insights',
    description: 'Get tailored interpretations based on your unique planetary positions and life circumstances.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Compatibility',
    description: 'Works with birth data from anywhere in the world with accurate timezone calculations.',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile Optimized',
    description: 'Perfect experience on all devices - desktop, tablet, and mobile with PWA capabilities.',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    icon: LockClosedIcon,
    title: 'Secure Payments',
    description: 'Safe and secure payment processing with Stripe integration and SSL encryption.',
    color: 'from-emerald-500 to-green-600'
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-cosmic-50 dark:from-cosmic-900 dark:to-cosmic-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-6xl text-cosmic-400">♈</div>
        <div className="absolute top-40 right-20 text-5xl text-purple-400">♉</div>
        <div className="absolute bottom-20 left-20 text-5xl text-pink-400">♊</div>
        <div className="absolute bottom-40 right-20 text-6xl text-indigo-400">♋</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-cosmic-100 text-cosmic-800 dark:bg-cosmic-800 dark:text-cosmic-200 mb-6">
            ✨ Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Everything You Need</span>
            <br />
            <span className="text-cosmic-900 dark:text-white">for Your Astrological Journey</span>
          </h2>
          <p className="text-xl text-cosmic-600 dark:text-cosmic-300 max-w-3xl mx-auto">
            Discover the comprehensive features that make our AI astrology platform the most advanced and user-friendly solution available.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white dark:bg-cosmic-800 rounded-2xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-cosmic-100 dark:border-cosmic-700 group-hover:border-cosmic-300 dark:group-hover:border-cosmic-600 overflow-hidden">
                {/* Background gradient */}
                <div className="relative -m-6 mb-4 h-32 overflow-hidden rounded-t-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full"></div>
                </div>

                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-cosmic-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-cosmic-600 dark:text-cosmic-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-cosmic-600 dark:text-cosmic-300 mb-6">
            Ready to discover your cosmic blueprint?
          </p>
          <a href="/pricing">
            <button className="bg-gradient-to-r from-cosmic-600 to-purple-600 hover:from-cosmic-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Get Started Now
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
