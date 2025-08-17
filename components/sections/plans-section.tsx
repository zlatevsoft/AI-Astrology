'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckIcon, StarIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export function PlansSection() {
  const router = useRouter()

  const plans = [
            {
          name: 'Basic Reading',
          description: 'Discover your core personality and life path',
          price: 9.99,
          originalPrice: 19.99,
      features: [
        '🌟 Complete birth chart analysis',
        '💫 Core personality insights',
        '🎯 Life purpose & destiny guidance',
        '💕 Relationship patterns revealed',
        '💼 Career inclinations & strengths',
        '📊 Detailed planetary influences',
        '🔮 Key life lessons & challenges',
        '📱 Instant PDF download',
        '✨ Beautiful, shareable report'
      ],
      icon: StarIcon,
      popular: false,
      gradient: 'from-blue-500 to-purple-600',
      borderColor: 'border-blue-500/30',
      buttonText: 'Get Basic Reading',
      buttonVariant: 'outline' as const
    },
            {
          name: 'Detailed Analysis',
          description: 'Deep dive into your soul\'s journey',
          price: 19.99,
          originalPrice: 34.99,
      features: [
        '✨ Everything in Basic, plus:',
        '🧠 Complete personality profile',
        '🌙 Soul mission & karmic patterns',
        '💝 Advanced relationship blueprint',
        '🚀 Complete career & life path',
        '🏠 Detailed house analysis',
        '⭐ All planetary aspects explained',
        '⏰ Life cycles & timing insights',
        '🔄 Shadow work & healing guidance',
        '📋 15+ practical recommendations',
        '🔮 Future guidance & predictions',
        '📱 Premium PDF download',
        '🎨 Stunning visual report'
      ],
      icon: SparklesIcon,
      popular: true,
      gradient: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/30',
      buttonText: 'Get Detailed Analysis',
      buttonVariant: 'default' as const
    },
            {
          name: 'Comprehensive Reading',
          description: 'Complete relationship compatibility analysis',
          price: 29.99,
          originalPrice: 39.99,
      features: [
        '💕 Astrological synastry analysis',
        '❤️ Relationship compatibility insights',
        '🗣️ Communication patterns revealed',
        '🔥 Emotional & intimate connection',
        '🌟 Long-term potential assessment',
        '⚡ Challenges & growth opportunities',
        '✨ Harmonious aspects identification',
        '🛡️ Conflict resolution strategies',
        '🛤️ Shared life path analysis',
        '⏰ Timing for important decisions',
        '📱 Ultimate PDF download',
        '🎭 Interactive compatibility report',
        '💎 Exclusive relationship insights'
      ],
      icon: HeartIcon,
      popular: false,
      gradient: 'from-pink-500 to-red-600',
      borderColor: 'border-pink-500/30',
      buttonText: 'Get Compatibility Analysis',
      buttonVariant: 'outline' as const
    }
  ]

  const handlePlanSelect = (planName: string) => {
    // Store selected plan in session storage
    sessionStorage.setItem('selectedPlan', planName)
    
    // Navigate to birth chart page
    router.push('/birth-chart')
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background cosmic pattern */}
      <div className="absolute inset-0 cosmic-bg-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Choose Your Astrological Journey
          </h2>
          <p className="text-xl text-cosmic-700 dark:text-cosmic-300 mb-8 max-w-3xl mx-auto">
            Discover your cosmic blueprint with our AI-powered astrological analysis. 
            Choose the perfect plan for your spiritual journey.
          </p>

                     {/* Pricing Info */}
           <div className="flex items-center justify-center gap-4 mb-8">
             <span className="text-sm text-cosmic-600 dark:text-cosmic-400">
               One-time payment • Instant access • PDF download included
             </span>
           </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
                             className={`relative bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 ${plan.borderColor} ${
                 plan.popular ? 'ring-2 ring-cosmic-500 scale-105' : ''
               }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.gradient} mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  {plan.name}
                </h3>
                <p className="text-cosmic-600 dark:text-cosmic-400 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-cosmic-800 dark:text-cosmic-200">
                      ${plan.price}
                    </span>
                    {plan.originalPrice > plan.price && (
                      <span className="text-lg text-cosmic-500 line-through">
                        ${plan.originalPrice}
                      </span>
                    )}
                  </div>
                                     <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                     one-time payment
                   </p>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-cosmic-700 dark:text-cosmic-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
                             <Button
                 onClick={() => handlePlanSelect(plan.name)}
                 variant={plan.buttonVariant}
                 size="lg"
                 className={`w-full border-2 ${
                   plan.popular 
                     ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-purple-500/30' 
                     : plan.name === 'Basic Reading'
                     ? 'border-blue-500/30 hover:border-blue-500/50'
                     : 'border-pink-500/30 hover:border-pink-500/50'
                 }`}
               >
                 {plan.buttonText}
               </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-cosmic-600 dark:text-cosmic-400">
            
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm">SSL encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm">No recurring charges</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
