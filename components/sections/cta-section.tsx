'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CheckIcon, StarIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline'
import { ctaHome } from '@/lib/dictionaries'
import {
  formatListPriceForFaq,
  formatMarketingListPriceEUR,
  isFreeCheckoutDisplayEnabled,
  type AnalysisTier,
} from '@/lib/pricing'
import type { PublicPricingPayload } from '@/lib/public-pricing'
import { useSiteLocale } from '@/lib/use-site-locale'

const trustMeta = [ShieldCheckIcon, BoltIcon, StarIcon] as const

/** Mid tier "Premium stellar analysis" preview — aligns with Detailed Analysis checkout. */
const HOME_PREMIUM_PREVIEW_TIER: AnalysisTier = 'detailed'

export function CTASection() {
  const router = useRouter()
  const locale = useSiteLocale()
  const t = ctaHome[locale]
  const benefits = t.benefits as unknown as string[]
  const cardBullets = t.cardBullets as unknown as string[]
  const trustLabels = [t.trust1, t.trust2, t.trust3]
  const [premiumPrice, setPremiumPrice] = useState(() =>
    formatMarketingListPriceEUR(HOME_PREMIUM_PREVIEW_TIER, locale)
  )

  useEffect(() => {
    if (isFreeCheckoutDisplayEnabled()) {
      setPremiumPrice(formatMarketingListPriceEUR(HOME_PREMIUM_PREVIEW_TIER, locale))
      return
    }
    let cancelled = false
    fetch('/api/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((p: PublicPricingPayload | null) => {
        if (cancelled || p?.listEur?.detailed == null) return
        setPremiumPrice(formatListPriceForFaq(p.listEur.detailed, locale))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [locale])

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-cosmic-900 via-purple-900 to-cosmic-800 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
      </div>

      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-glow"></div>
      </div>

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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 mb-6">
              {t.badge}
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t.title1 || t.title3 ? (
                <>
                  {t.title1 ? (
                    <>
                      {t.title1}
                      <br />
                    </>
                  ) : null}
                  {t.title2 ? (
                    <span className="bg-gradient-to-r from-fuchsia-200 via-purple-100 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(0,0,0,.5)]">
                      {t.title2}
                    </span>
                  ) : null}
                  {t.title3 ? (
                    <>
                      <br />
                      {t.title3}
                    </>
                  ) : null}
                </>
              ) : t.title2 ? (
                <span className="bg-gradient-to-r from-fuchsia-200 via-purple-100 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(0,0,0,.5)]">
                  {t.title2}
                </span>
              ) : null}
            </h2>

            <p className="mb-8 text-xl leading-relaxed text-purple-50/96 drop-shadow-sm">{t.body}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-cosmic-100">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              {trustMeta.map((Icon, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-cosmic-300" />
                  <span className="text-cosmic-300 text-sm">{trustLabels[index]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md w-full relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{t.cardTitle}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{premiumPrice}</div>
                  <p className="text-cosmic-200">{t.oneTime}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {cardBullets.map((line, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-400" />
                      <span className="text-cosmic-100">{line}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('selectedPlan', 'Detailed Analysis')
                    }
                    router.push('/birth-chart')
                  }}
                  className="block w-full bg-gradient-to-r from-cosmic-500 to-purple-500 hover:from-cosmic-600 hover:to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                >
                  {t.button}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
