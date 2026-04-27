'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckIcon, StarIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { getMarketingPriceDisplay, type AnalysisTier } from '@/lib/pricing'
import { getPlanRowsForLocale, pricingSection, isBasicProductName, type PlanProductName } from '@/lib/plan-locale'
import { getClientLocale, LOCALE_CHANGE_EVENT, type SiteLocale } from '@/lib/locale'

const PlanIcon: Record<AnalysisTier, typeof StarIcon> = {
  basic: StarIcon,
  detailed: SparklesIcon,
  comprehensive: HeartIcon,
}

function formatEur(n: number): string {
  return `€${n.toFixed(2)}`
}

type Props = {
  /** 'home' = features section on landing; 'page' = full /pricing */
  layout?: 'home' | 'page'
}

export function PlanPricingCards({ layout = 'home' }: Props) {
  const router = useRouter()
  const [locale, setLocale] = useState<SiteLocale>('en')
  useEffect(() => {
    setLocale(getClientLocale())
    const sync = () => setLocale(getClientLocale())
    window.addEventListener(LOCALE_CHANGE_EVENT, sync)
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, sync)
  }, [])

  const t = pricingSection[locale]
  const plans = getPlanRowsForLocale(locale)

  const handlePlanSelect = (productName: PlanProductName) => {
    sessionStorage.setItem('selectedPlan', productName)
    router.push('/birth-chart')
  }

  return (
    <section className={layout === 'home' ? 'py-20 relative overflow-hidden' : ''}>
      {layout === 'home' && <div className="absolute inset-0 cosmic-bg-pattern opacity-20" />}

      <div className={`container mx-auto px-4 relative z-10 ${layout === 'page' ? '' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {layout === 'page' ? (
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">{t.title}</h1>
          ) : (
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">{t.title}</h2>
          )}
          <p className="text-xl text-cosmic-700 dark:text-cosmic-300 mb-8 max-w-3xl mx-auto">{t.subtitle}</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-sm text-cosmic-600 dark:text-cosmic-400">{t.oneTimeLine}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const { current: listPrice, compareAt } = getMarketingPriceDisplay(plan.tier)
            const Icon = PlanIcon[plan.tier]
            return (
              <motion.div
                key={plan.productName}
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
                      {t.popular}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.gradient} mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-cosmic-800 dark:text-cosmic-200 mb-2">{plan.name}</h3>
                  <p className="text-cosmic-600 dark:text-cosmic-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-cosmic-800 dark:text-cosmic-200">
                        {listPrice === 0 ? t.free : formatEur(listPrice)}
                      </span>
                      {compareAt > listPrice && (
                        <span className="text-lg text-cosmic-500 line-through">{formatEur(compareAt)}</span>
                      )}
                    </div>
                    <p className="text-sm text-cosmic-600 dark:text-cosmic-400">{t.oneTimePayment}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-cosmic-700 dark:text-cosmic-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan.productName)}
                  variant={plan.buttonVariant}
                  size="lg"
                  className={`w-full border-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-purple-500/30'
                      : isBasicProductName(plan.productName)
                        ? 'border-blue-500/30 hover:border-blue-500/50'
                        : 'border-pink-500/30 hover:border-pink-500/50'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {layout === 'home' && (
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
                <span className="text-sm">{t.trustSsl}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm">{t.trustNoRecurring}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
