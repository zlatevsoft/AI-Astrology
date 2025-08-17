'use client'

import { motion } from 'framer-motion'
import { CheckIcon, StarIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline'

const benefits = [
  "Accurate birth chart calculations",
  "AI-powered personality analysis",
  "Comprehensive life path insights",
  "Beautiful visual charts",
  "Instant results delivery",
  "Secure data protection"
]

const trustIndicators = [
  { icon: ShieldCheckIcon, text: "100% Secure" },
  { icon: BoltIcon, text: "Instant Results" },
  { icon: StarIcon, text: "4.9/5 Rating" }
]

export function CTASection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-cosmic-900 via-purple-900 to-cosmic-800 relative overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
        
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Nebula effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-glow"></div>
      </div>

      {/* Floating zodiac symbols */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-32 left-10 text-4xl text-white/20 animate-float"
        >
          ♐
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute top-48 right-20 text-3xl text-white/20 animate-float-delayed"
        >
          ♑
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute bottom-32 left-20 text-3xl text-white/20 animate-float"
        >
          ♒
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute bottom-48 right-10 text-4xl text-white/20 animate-float-delayed"
        >
          ♓
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 mb-6">
              ⭐ Limited Time Offer
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Your
              <br />
              <span className="text-gradient-cosmic">Cosmic Blueprint</span>
              <br />
              Today
            </h2>
            
            <p className="text-xl text-cosmic-200 mb-8 leading-relaxed">
              Get your personalized birth chart with AI-powered insights starting at $9.99. Understand your personality, life lessons, and cosmic guidance in minutes.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-cosmic-100">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <indicator.icon className="w-5 h-5 text-cosmic-300" />
                  <span className="text-cosmic-300 text-sm">{indicator.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Pricing card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md w-full relative overflow-hidden">
              {/* Cosmic pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Premium Analysis
                  </h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    $9.99
                  </div>
                  <p className="text-cosmic-200">One-time payment</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-cosmic-100">Complete birth chart</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-cosmic-100">AI personality analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-cosmic-100">Life path insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-cosmic-100">Planetary positions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-cosmic-100">Aspect interpretations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-cosmic-100">Lifetime access</span>
                  </div>
                </div>

                <a href="/pricing" className="block w-full bg-gradient-to-r from-cosmic-500 to-purple-500 hover:from-cosmic-600 hover:to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                  Choose Your Plan
                </a>


              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
