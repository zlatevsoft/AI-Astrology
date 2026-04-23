'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StarIcon, HeartIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

// Optimize animations for better performance
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950 pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                About AI Astrology
              </h1>
              <p className="text-xl text-cosmic-700 dark:text-cosmic-300">
                Bridging ancient wisdom with modern technology
              </p>
            </div>

            {/* Mission Section */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50 mb-12"
            >
              <div className="text-center mb-8">
                <StarIcon className="w-16 h-16 text-cosmic-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-cosmic-900 dark:text-white mb-4">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-cosmic-700 dark:text-cosmic-300 leading-relaxed text-center">
                We believe that everyone deserves access to personalized astrological insights that can guide their life journey. 
                By combining the ancient wisdom of astrology with cutting-edge AI technology, we provide accurate, 
                meaningful, and accessible birth chart readings that help people understand themselves better and make 
                informed decisions about their future.
              </p>
            </motion.div>

            {/* Values Section */}
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            >
              <motion.div
                {...fadeInUp}
                className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cosmic-200/50 dark:border-cosmic-700/50 text-center"
              >
                <SparklesIcon className="w-12 h-12 text-cosmic-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-cosmic-900 dark:text-white mb-3">
                  Innovation
                </h3>
                <p className="text-cosmic-700 dark:text-cosmic-300">
                  We leverage the latest AI technology to provide accurate and personalized astrological insights.
                </p>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cosmic-200/50 dark:border-cosmic-700/50 text-center"
              >
                <HeartIcon className="w-12 h-12 text-cosmic-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-cosmic-900 dark:text-white mb-3">
                  Compassion
                </h3>
                <p className="text-cosmic-700 dark:text-cosmic-300">
                  We approach every reading with empathy and understanding, recognizing the deeply personal nature of astrology.
                </p>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cosmic-200/50 dark:border-cosmic-700/50 text-center"
              >
                <ShieldCheckIcon className="w-12 h-12 text-cosmic-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-cosmic-900 dark:text-white mb-3">
                  Trust
                </h3>
                <p className="text-cosmic-700 dark:text-cosmic-300">
                  We maintain the highest standards of accuracy and privacy in all our astrological calculations and readings.
                </p>
              </motion.div>
            </motion.div>

            {/* Story Section */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50 mb-12"
            >
              <h2 className="text-3xl font-bold text-cosmic-900 dark:text-white mb-6 text-center">
                Our Story
              </h2>
              <div className="prose prose-cosmic dark:prose-invert max-w-none">
                <p className="text-lg text-cosmic-700 dark:text-cosmic-300 leading-relaxed mb-6">
                  AI Astrology was born from a simple yet powerful idea: what if we could make the ancient wisdom of astrology 
                  accessible to everyone through modern technology? Our team of astrologers, developers, and AI specialists 
                  came together to create a platform that combines the precision of astronomical calculations with the 
                  insight of artificial intelligence.
                </p>
                <p className="text-lg text-cosmic-700 dark:text-cosmic-300 leading-relaxed mb-6">
                  We understand that astrology is more than just a tool for prediction—it's a language for understanding 
                  the self, a framework for personal growth, and a way to connect with the cosmic rhythms that influence 
                  our lives. That's why we've built our platform with both accuracy and accessibility in mind.
                </p>
                <p className="text-lg text-cosmic-700 dark:text-cosmic-300 leading-relaxed">
                  Today, we're proud to serve thousands of users worldwide, helping them discover their cosmic blueprint 
                  and navigate their life's journey with greater clarity and confidence.
                </p>
              </div>
            </motion.div>

            {/* Team Section */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50"
            >
              <h2 className="text-3xl font-bold text-cosmic-900 dark:text-white mb-8 text-center">
                Our Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-cosmic-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">A</span>
                  </div>
                  <h3 className="text-xl font-bold text-cosmic-900 dark:text-white mb-2">
                    Astrology Experts
                  </h3>
                  <p className="text-cosmic-700 dark:text-cosmic-300">
                    Certified astrologers with decades of experience
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-cosmic-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">I</span>
                  </div>
                  <h3 className="text-xl font-bold text-cosmic-900 dark:text-white mb-2">
                    AI Specialists
                  </h3>
                  <p className="text-cosmic-700 dark:text-cosmic-300">
                    Machine learning experts and data scientists
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-cosmic-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">D</span>
                  </div>
                  <h3 className="text-xl font-bold text-cosmic-900 dark:text-white mb-2">
                    Developers
                  </h3>
                  <p className="text-cosmic-700 dark:text-cosmic-300">
                    Full-stack engineers and UX designers
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
