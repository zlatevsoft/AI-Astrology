'use client'

import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import {
  getTestimonialsList,
  statsRow,
  testimonialsHead,
  testimonialsBottom,
} from '@/lib/home-sections-locale'
import { useSiteLocale } from '@/lib/use-site-locale'

export function TestimonialsSection() {
  const locale = useSiteLocale()
  const head = testimonialsHead[locale]
  const stats = statsRow[locale]
  const bottom = testimonialsBottom[locale]
  const testimonials = getTestimonialsList(locale)

  return (
    <section className="py-20 bg-gradient-to-b from-cosmic-50 to-white dark:from-cosmic-800 dark:to-cosmic-900 relative overflow-hidden">
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
            {head.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{head.line1}</span>
            <br />
            <span className="text-cosmic-900 dark:text-white">{head.line2}</span>
          </h2>
          <p className="text-xl text-cosmic-600 dark:text-cosmic-300 max-w-3xl mx-auto">{head.intro}</p>
        </motion.div>

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
              <div className="text-3xl md:text-4xl font-bold text-cosmic-600 dark:text-cosmic-300 mb-2">{stat.value}</div>
              <div className="text-sm text-cosmic-500 dark:text-cosmic-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

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
              <div className="text-4xl text-cosmic-300 dark:text-cosmic-600 mb-4">"</div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-cosmic-600 dark:text-cosmic-300 mb-6 leading-relaxed">{testimonial.content}</p>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-500 to-purple-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">{testimonial.initial}</span>
                </div>
                <div>
                  <div className="font-semibold text-cosmic-900 dark:text-white">{testimonial.author}</div>
                  <div className="text-sm text-cosmic-500 dark:text-cosmic-400">
                    {testimonial.role} • {testimonial.zodiac}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-cosmic-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{bottom.title}</h3>
              <p className="text-lg text-cosmic-100 mb-8 max-w-2xl mx-auto">{bottom.body}</p>
              <a href="/pricing">
                <button className="bg-white text-cosmic-600 hover:bg-cosmic-50 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {bottom.button}
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
