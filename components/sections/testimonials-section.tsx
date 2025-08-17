'use client'

import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'

const testimonials = [
  {
    content: "This AI astrology app is incredible! The insights I received about my personality and life path were spot-on. It's like having a personal astrologer available 24/7.",
    author: "Sarah Johnson",
    role: "Marketing Manager",
    zodiac: "Libra",
    rating: 5,
    initial: "S"
  },
  {
    content: "I was skeptical at first, but the accuracy of the birth chart and the AI analysis blew me away. It helped me understand myself better than any other tool I've used.",
    author: "Michael Chen",
    role: "Software Engineer",
    zodiac: "Scorpio",
    rating: 5,
    initial: "M"
  },
  {
    content: "The combination of traditional astrology with modern AI technology is brilliant. The insights are both profound and practical. Highly recommended!",
    author: "Emma Rodriguez",
    role: "Life Coach",
    zodiac: "Pisces",
    rating: 5,
    initial: "E"
  },
  {
    content: "As someone who's studied astrology for years, I'm impressed by the accuracy and depth of the analysis. The AI really understands the nuances of planetary positions.",
    author: "David Thompson",
    role: "Astrology Enthusiast",
    zodiac: "Capricorn",
    rating: 5,
    initial: "D"
  },
  {
    content: "The user experience is fantastic - beautiful design, easy to use, and the results are delivered instantly. This is the future of astrology!",
    author: "Lisa Park",
    role: "UX Designer",
    zodiac: "Gemini",
    rating: 5,
    initial: "L"
  },
  {
    content: "I've tried many astrology apps, but this one stands out for its accuracy and the quality of AI insights. It's become my go-to tool for self-reflection.",
    author: "Alex Morgan",
    role: "Entrepreneur",
    zodiac: "Aries",
    rating: 5,
    initial: "A"
  }
]

const stats = [
  { label: "Charts Generated", value: "10,000+", icon: "📊" },
  { label: "Average Rating", value: "4.9/5", icon: "⭐" },
  { label: "Countries", value: "50+", icon: "🌍" },
  { label: "Happy Users", value: "8,500+", icon: "😊" }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-cosmic-50 to-white dark:from-cosmic-800 dark:to-cosmic-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-6xl text-cosmic-400">♌</div>
        <div className="absolute top-40 right-20 text-5xl text-purple-400">♍</div>
        <div className="absolute bottom-20 left-20 text-5xl text-pink-400">♎</div>
        <div className="absolute bottom-40 right-20 text-6xl text-indigo-400">♏</div>
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
            ⭐ Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">What Our Users Say</span>
            <br />
            <span className="text-cosmic-900 dark:text-white">About Their Experience</span>
          </h2>
          <p className="text-xl text-cosmic-600 dark:text-cosmic-300 max-w-3xl mx-auto">
            Join thousands of satisfied users who have discovered their cosmic blueprint and gained valuable insights into their personality and life path.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-cosmic-600 dark:text-cosmic-300 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-cosmic-500 dark:text-cosmic-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-cosmic-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-cosmic-100 dark:border-cosmic-700 overflow-hidden"
            >
              {/* Quote icon */}
              <div className="text-4xl text-cosmic-300 dark:text-cosmic-600 mb-4">"</div>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-cosmic-600 dark:text-cosmic-300 mb-6 leading-relaxed">
                {testimonial.content}
              </p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-500 to-purple-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">{testimonial.initial}</span>
                </div>
                <div>
                  <div className="font-semibold text-cosmic-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-cosmic-500 dark:text-cosmic-400">
                    {testimonial.role} • {testimonial.zodiac}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-cosmic-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Cosmic pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Join Our Community
              </h3>
              <p className="text-lg text-cosmic-100 mb-8 max-w-2xl mx-auto">
                Be part of thousands of people discovering their cosmic blueprint and gaining valuable insights into their personality and life path.
              </p>
              <button className="bg-white text-cosmic-600 hover:bg-cosmic-50 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Get Your Birth Chart Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
