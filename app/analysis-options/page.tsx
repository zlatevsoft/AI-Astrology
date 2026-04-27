'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StarIcon, SparklesIcon, RocketLaunchIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getClientLocale } from '@/lib/locale'
import { useSiteLocale } from '@/lib/use-site-locale'
import {
  analysisOptionsPage,
  analysisTiers,
  getAnalysisOptionContent,
  type Tier,
} from '@/lib/analysis-options-locale'

const TIER_PRICE: Record<Tier, number> = {
  basic: 19,
  detailed: 29,
  comprehensive: 39,
}

const TIER_ICON: Record<Tier, typeof StarIcon> = {
  basic: StarIcon,
  detailed: SparklesIcon,
  comprehensive: RocketLaunchIcon,
}

interface AnalysisOption {
  id: Tier
  title: string
  description: string
  price: number
  features: string[]
  popular?: boolean
  icon: typeof StarIcon
}

export default function AnalysisOptionsPage() {
  const locale = useSiteLocale()
  const t = analysisOptionsPage[locale]
  const analysisOptions = useMemo<AnalysisOption[]>(
    () =>
      analysisTiers.map((tier) => ({
        id: tier,
        ...getAnalysisOptionContent(locale, tier),
        price: TIER_PRICE[tier],
        popular: tier === 'detailed',
        icon: TIER_ICON[tier],
      })),
    [locale]
  )

  const [selectedOption, setSelectedOption] = useState<Tier | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [birthChartData, setBirthChartData] = useState<Record<string, unknown> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedData = sessionStorage.getItem('birthChartData')
    if (!storedData) {
      const loc = getClientLocale()
      toast.error(analysisOptionsPage[loc].toastNoData)
      router.push('/birth-chart')
      return
    }

    try {
      setBirthChartData(JSON.parse(storedData) as Record<string, unknown>)
    } catch {
      const loc = getClientLocale()
      toast.error(analysisOptionsPage[loc].toastInvalid)
      router.push('/birth-chart')
    }
  }, [router])

  const handleOptionSelect = (optionId: Tier) => {
    setSelectedOption(optionId)
  }

  const handleContinue = async () => {
    if (!selectedOption || !birthChartData) {
      toast.error(t.toastSelect)
      return
    }

    setIsLoading(true)

    try {
      sessionStorage.setItem('selectedAnalysisType', selectedOption)

      const requestBody: Record<string, unknown> = {
        birthChart: birthChartData,
        analysisType: selectedOption,
        locale: getClientLocale(),
      }

      if (birthChartData.partnerChartData) {
        requestBody.partnerBirthChart = birthChartData.partnerChartData
      }

      const analysisResponse = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const analysisResult = (await analysisResponse.json()) as { success?: boolean; error?: string; data?: unknown }

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Failed to generate analysis')
      }

      sessionStorage.setItem('analysisData', JSON.stringify(analysisResult.data))
      router.push('/payment-success?session_id=test_session_' + Date.now())
    } catch (error) {
      console.error('Error generating analysis:', error)
      toast.error(t.toastFail)
    } finally {
      setIsLoading(false)
    }
  }

  if (!birthChartData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-500"></div>
      </div>
    )
  }

  const userData = birthChartData.userData as
    | { name?: string; birthDate?: string; location?: string }
    | undefined

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950 pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{t.h1}</h1>
              <p className="text-xl text-cosmic-700 dark:text-cosmic-300 mb-4">{t.subtitle}</p>

              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-6 inline-block">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  🧪 <strong>{t.testMode}</strong> {t.testModeBody}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-sm text-cosmic-700 dark:text-cosmic-300">
                  <strong>{t.birthReady}</strong> {userData?.name} •{' '}
                  {userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString() : ''} •{' '}
                  {userData?.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {analysisOptions.map((option, index) => {
                const IconComponent = option.icon
                const isSelected = selectedOption === option.id
                const isPopular = option.popular

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`relative cursor-pointer ${isSelected ? 'ring-2 ring-cosmic-500' : ''}`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-cosmic-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          {t.popular}
                        </span>
                      </div>
                    )}

                    <div
                      className={`bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50 h-full transition-all ${
                        isSelected ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                      }`}
                    >
                      <div className="text-center mb-6">
                        <div
                          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                            isSelected
                              ? 'bg-gradient-to-r from-cosmic-500 to-purple-500'
                              : 'bg-cosmic-100 dark:bg-cosmic-700'
                          }`}
                        >
                          <IconComponent
                            className={`w-8 h-8 ${
                              isSelected ? 'text-white' : 'text-cosmic-600 dark:text-cosmic-300'
                            }`}
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-cosmic-900 dark:text-white mb-2">{option.title}</h3>
                        <p className="text-cosmic-600 dark:text-cosmic-400 mb-4">{option.description}</p>
                        <div className="text-3xl font-bold text-cosmic-900 dark:text-white">
                          {option.price === 0 ? '—' : `€${option.price}`}
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {option.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckIcon className="w-5 h-5 text-cosmic-500 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-sm text-cosmic-700 dark:text-cosmic-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-cosmic-500 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <Button
                size="lg"
                variant="gradient"
                className="text-lg px-12 py-4"
                onClick={handleContinue}
                disabled={!selectedOption || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t.processing}
                  </div>
                ) : (
                  (() => {
                    const opt = selectedOption
                      ? analysisOptions.find((o) => o.id === selectedOption)
                      : null
                    return opt
                      ? `${t.generate} ${opt.title}`
                      : `${t.generate} ${t.analysis}`
                  })()
                )}
              </Button>

              {selectedOption && <p className="mt-4 text-sm text-cosmic-600 dark:text-cosmic-400">{t.instant}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-6 inline-block">
                <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">🔒 {t.guaranteeTitle}</h3>
                <p className="text-sm text-cosmic-700 dark:text-cosmic-300">{t.guaranteeBody}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
