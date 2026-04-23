'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PlayIcon, StarIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Starry night sky background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient for night sky */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
        
        {/* Stars layer */}
        <div className="absolute inset-0">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 3}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Planets layer */}
        <div className="absolute inset-0">
          {/* Large planet */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-full opacity-60 blur-md animate-float shadow-2xl shadow-orange-500/30"></div>
          
          {/* Medium planet */}
          <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 rounded-full opacity-50 blur-md animate-float-delayed shadow-2xl shadow-blue-500/30"></div>
          
          {/* Small planet */}
          <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-green-400 via-teal-500 to-cyan-600 rounded-full opacity-40 blur-md animate-float shadow-2xl shadow-green-500/30"></div>
          
          {/* Additional small planets */}
          <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 blur-sm animate-float-delayed"></div>
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-25 blur-sm animate-float"></div>
        </div>
        
        {/* Nebula effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-pink-500/15"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/10 via-transparent to-cosmic-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-slate-900/20"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cosmic-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-glow"></div>
      </div>

      {/* Floating zodiac symbols */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-32 left-10 text-4xl text-cosmic-400/30 animate-float"
        >
          ♈
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute top-48 right-20 text-3xl text-purple-400/30 animate-float-delayed"
        >
          ♉
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute bottom-32 left-20 text-3xl text-pink-400/30 animate-float"
        >
          ♊
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute bottom-48 right-10 text-4xl text-indigo-400/30 animate-float-delayed"
        >
          ♋
        </motion.div>
      </div>

      <div className="relative z-30 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-cosmic-500/20 to-purple-500/20 backdrop-blur-md text-white border border-cosmic-400/30 shadow-lg">
            <span className="animate-pulse mr-2">✨</span>
            AstroHoroscope.online - AI Astrology
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
        >
          <span className="bg-gradient-to-r from-cosmic-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Professional Astro</span>
          <br />
          <span className="text-white drop-shadow-2xl">Horoscope Birth Chart</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto drop-shadow-lg leading-relaxed"
        >
          Get your personalized AI astrology birth chart reading at AstroHoroscope.online. Professional astro horoscope analysis with cosmic insights starting at $9.99.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mb-12"
        >
          <a href="/pricing">
            <Button size="lg" variant="gradient" className="text-lg px-10 py-5 bg-gradient-to-r from-cosmic-500 via-purple-500 to-indigo-500 hover:from-cosmic-600 hover:via-purple-600 hover:to-indigo-600 shadow-2xl hover:shadow-cosmic-500/25 transition-all duration-300 hover:scale-105">
              Choose Your Plan
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-cosmic-500/20 to-purple-500/20 backdrop-blur-md rounded-xl p-4 border border-cosmic-400/30 hover:border-cosmic-300/50 transition-all duration-300 hover:scale-105">
            <BoltIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">Accurate Calculations</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-md rounded-xl p-4 border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 hover:scale-105">
            <StarIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">AI Analysis</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-500/20 to-cosmic-500/20 backdrop-blur-md rounded-xl p-4 border border-indigo-400/30 hover:border-indigo-300/50 transition-all duration-300 hover:scale-105">
            <ShieldCheckIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">Instant Results</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center justify-center space-x-8 text-sm text-white bg-gradient-to-r from-cosmic-500/20 via-purple-500/20 to-indigo-500/20 backdrop-blur-md rounded-xl p-4 border border-cosmic-400/30"
        >
          <span className="font-semibold flex items-center space-x-2">
            <span className="animate-pulse">✨</span>
            <span>10,000+ Charts Generated</span>
          </span>
          <span className="font-semibold flex items-center space-x-2">
            <span className="animate-pulse">⭐</span>
            <span>4.9/5 Rating</span>
          </span>
          <span className="font-semibold flex items-center space-x-2">
            <span className="animate-pulse">🔒</span>
            <span>100% Secure</span>
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div className="w-6 h-10 border-2 border-cosmic-300/50 dark:border-cosmic-600/50 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-cosmic-400/70 dark:bg-cosmic-500/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  )
}
