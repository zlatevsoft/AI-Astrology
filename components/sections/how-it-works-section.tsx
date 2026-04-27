'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { UserIcon, ChartBarIcon, SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { howItWorksSection } from '@/lib/home-sections-locale'
import { useSiteLocale } from '@/lib/use-site-locale'

const STEP_IMAGES = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
]

const STEP_ICONS = [UserIcon, ChartBarIcon, SparklesIcon, DocumentTextIcon]

export function HowItWorksSection() {
  const locale = useSiteLocale()
  const h = howItWorksSection[locale]

  const steps = useMemo(
    () =>
      h.steps.map((step, i) => ({
        title: step.title,
        description: step.description,
        image: STEP_IMAGES[i],
        icon: STEP_ICONS[i],
      })),
    [h.steps]
  )

  return (
    <section className="py-20 bg-white dark:bg-cosmic-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-6xl text-cosmic-400">☀️</div>
        <div className="absolute top-40 right-20 text-5xl text-purple-400">🌙</div>
        <div className="absolute bottom-20 left-20 text-5xl text-pink-400">⭐</div>
        <div className="absolute bottom-40 right-20 text-6xl text-indigo-400">✨</div>
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
            {h.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{h.line1}</span>
            <br />
            <span className="text-cosmic-900 dark:text-white">{h.line2}</span>
          </h2>
          <p className="text-xl text-cosmic-600 dark:text-cosmic-300 max-w-3xl mx-auto">{h.intro}</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cosmic-200 via-cosmic-300 to-cosmic-200 dark:from-cosmic-700 dark:via-cosmic-600 dark:to-cosmic-700 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cosmic-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                    {index + 1}
                  </div>

                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden">
                    <Image src={step.image} alt="" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cosmic-500/80 to-purple-500/80 flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-cosmic-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-cosmic-600 dark:text-cosmic-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-cosmic-50 to-purple-50 dark:from-cosmic-800 dark:to-purple-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Image
                src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-cosmic-900 dark:text-white mb-4">{h.ctaTitle}</h3>
              <p className="text-lg text-cosmic-600 dark:text-cosmic-300 mb-8 max-w-2xl mx-auto">{h.ctaBody}</p>
              <a href="/pricing">
                <button className="bg-gradient-to-r from-cosmic-600 to-purple-600 hover:from-cosmic-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {h.ctaButton}
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
