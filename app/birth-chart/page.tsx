'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useSiteLocale } from '@/lib/use-site-locale'
import { getClientLocale, type SiteLocale } from '@/lib/locale'
import {
  buildBirthChartSchema,
  getBirthChartCopy,
  type BirthChartFormValues,
} from '@/lib/birth-chart-locale'
import { getPlanRowsForLocale, type PlanProductName } from '@/lib/plan-locale'

export default function BirthChartPage() {
  const locale = useSiteLocale()
  return <BirthChartForm key={locale} locale={locale} />
}

function BirthChartForm({ locale }: { locale: SiteLocale }) {
  const t = getBirthChartCopy(locale)
  const schema = useMemo(() => buildBirthChartSchema(t), [t])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BirthChartFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      birthTime: '12:00',
      latitude: 42.4833,
      longitude: 26.5167,
      /** Same defaults as main chart — avoids NaN from hidden inputs with valueAsNumber */
      partnerLatitude: 42.4833,
      partnerLongitude: 26.5167,
      partnerBirthTime: '12:00',
    },
  })

  useEffect(() => {
    const plan = sessionStorage.getItem('selectedPlan')
    if (!plan) {
      const loc = getClientLocale()
      toast.error(getBirthChartCopy(loc).toastNoPlan)
      router.push('/pricing')
      return
    }
    setSelectedPlan(plan)
  }, [router])

  const planProduct = selectedPlan as PlanProductName | null
  const planRow = planProduct
    ? getPlanRowsForLocale(locale).find((p) => p.productName === planProduct)
    : undefined
  const planTitle = planRow?.name ?? selectedPlan ?? ''

  const onSubmit = async (data: BirthChartFormValues) => {
    setIsLoading(true)
    try {
      sessionStorage.removeItem('analysisData')
      sessionStorage.removeItem('partnerChartData')

      if (selectedPlan === 'Comprehensive Reading') {
        if (!data.partnerName || !data.partnerBirthDate) {
          toast.error(t.toastPartner)
          setIsLoading(false)
          return
        }
      }

      const latitude = data.latitude ?? 42.4833
      const longitude = data.longitude ?? 26.5167

      const requestData = {
        birthDate: new Date(data.birthDate + 'T' + data.birthTime).toISOString(),
        birthTime: data.birthTime,
        latitude,
        longitude,
        location: data.location,
      }

      const chartResponse = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })

      const chartResult = await chartResponse.json()

      if (!chartResult.success) {
        throw new Error(chartResult.error || 'Failed to create birth chart')
      }

      let partnerChartData = null
      if (selectedPlan === 'Comprehensive Reading' && data.partnerName && data.partnerBirthDate) {
        const partnerLatitude = data.partnerLatitude ?? 42.4833
        const partnerLongitude = data.partnerLongitude ?? 26.5167

        const partnerRequestData = {
          birthDate: new Date(
            data.partnerBirthDate + 'T' + (data.partnerBirthTime || '12:00')
          ).toISOString(),
          birthTime: data.partnerBirthTime || '12:00',
          latitude: partnerLatitude,
          longitude: partnerLongitude,
          location: data.partnerLocation || 'Unknown',
        }

        const partnerChartResponse = await fetch('/api/chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partnerRequestData),
        })

        const partnerChartResult = await partnerChartResponse.json()

        if (!partnerChartResult.success) {
          throw new Error(partnerChartResult.error || 'Partner chart calculation failed')
        }

        partnerChartData = {
          ...partnerChartResult.data,
          userData: {
            name: data.partnerName,
            birthDate: data.partnerBirthDate,
            birthTime: data.partnerBirthTime || '12:00',
            location: data.partnerLocation || 'Unknown',
          },
        }
      }

      sessionStorage.setItem(
        'birthChartData',
        JSON.stringify({
          ...chartResult.data,
          userData: {
            name: data.name,
            birthDate: data.birthDate,
            birthTime: data.birthTime,
            location: data.location,
          },
          partnerChartData,
        })
      )

      toast.success(
        selectedPlan === 'Comprehensive Reading' ? t.toastOkComp : t.toastOkSingle
      )

      const analysisType =
        selectedPlan === 'Basic Reading'
          ? 'basic'
          : selectedPlan === 'Detailed Analysis'
            ? 'detailed'
            : 'comprehensive'
      sessionStorage.setItem('selectedAnalysisType', analysisType)

      if (partnerChartData) {
        sessionStorage.setItem('partnerChartData', JSON.stringify(partnerChartData))
      }

      router.push('/payment-checkout')
    } catch (error) {
      console.error('Error creating birth chart:', error)
      toast.error(t.toastErr)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 pt-page-header-safe dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{t.h1}</h1>
              <p className="text-xl text-cosmic-700 dark:text-cosmic-300 mb-2">{t.subtitle}</p>
              <p className="text-sm text-cosmic-600 dark:text-cosmic-400 mb-4 max-w-xl mx-auto">{t.formOrderHint}</p>

              {selectedPlan && (
                <div className="inline-block bg-gradient-to-r from-cosmic-500 to-purple-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
                  {t.selectedPlan}: {planTitle}
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                    placeholder={t.namePlaceholder}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-2" />
                    {t.birthDate}
                  </label>
                  <input
                    type="date"
                    {...register('birthDate')}
                    className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.birthDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                    <ClockIcon className="w-4 h-4 inline mr-2" />
                    {t.birthTime}
                  </label>
                  <input
                    type="time"
                    {...register('birthTime')}
                    className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                  />
                  {errors.birthTime && (
                    <p className="mt-1 text-sm text-red-500">{errors.birthTime.message}</p>
                  )}
                  <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">{t.timeHint1}</p>
                  <p className="mt-1 text-sm text-cosmic-500 dark:text-cosmic-400">{t.timeHint2}</p>
                </div>

                <div className="p-4 bg-cosmic-50 dark:bg-cosmic-700/50 rounded-lg border border-cosmic-200 dark:border-cosmic-600">
                  <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">💫 {t.whyTimeTitle}</h3>
                  <p className="text-sm text-cosmic-700 dark:text-cosmic-300">{t.whyTimeBody}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                    <MapPinIcon className="w-4 h-4 inline mr-2" />
                    {t.location}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('location')}
                      className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                      placeholder={t.locationPlaceholder}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                    )}
                    <p className="mt-1 text-sm text-cosmic-500 dark:text-cosmic-400">{t.locationHint}</p>
                  </div>
                </div>

                <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
                <input type="hidden" {...register('longitude', { valueAsNumber: true })} />

                {selectedPlan === 'Comprehensive Reading' && (
                  <>
                    <div className="border-t border-cosmic-200 dark:border-cosmic-600 pt-8 mt-8">
                      <h3 className="text-xl font-bold text-cosmic-800 dark:text-cosmic-200 mb-6 text-center">
                        💕 {t.partnerBlock}
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                          <UserIcon className="w-4 h-4 inline mr-2" />
                          {t.partnerName}
                        </label>
                        <input
                          type="text"
                          {...register('partnerName')}
                          className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                          placeholder={t.partnerNamePh}
                        />
                        {errors.partnerName && (
                          <p className="mt-1 text-sm text-red-500">{errors.partnerName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                          <CalendarIcon className="w-4 h-4 inline mr-2" />
                          {t.partnerBirthDate}
                        </label>
                        <input
                          type="date"
                          {...register('partnerBirthDate')}
                          className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                        />
                        {errors.partnerBirthDate && (
                          <p className="mt-1 text-sm text-red-500">{errors.partnerBirthDate.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                          <ClockIcon className="w-4 h-4 inline mr-2" />
                          {t.partnerBirthTime}
                        </label>
                        <input
                          type="time"
                          {...register('partnerBirthTime')}
                          className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                        />
                        {errors.partnerBirthTime && (
                          <p className="mt-1 text-sm text-red-500">{errors.partnerBirthTime.message}</p>
                        )}
                        <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">{t.timeHint1}</p>
                        <p className="mt-1 text-sm text-cosmic-500 dark:text-cosmic-400">{t.timeHint2}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                          <MapPinIcon className="w-4 h-4 inline mr-2" />
                          {t.partnerLocation}
                        </label>
                        <input
                          type="text"
                          {...register('partnerLocation')}
                          className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                          placeholder={t.partnerLocationPh}
                        />
                        {errors.partnerLocation && (
                          <p className="mt-1 text-sm text-red-500">{errors.partnerLocation.message}</p>
                        )}
                        <p className="mt-1 text-sm text-cosmic-500 dark:text-cosmic-400">{t.locationHint}</p>
                      </div>

                      <input type="hidden" {...register('partnerLatitude', { valueAsNumber: true })} />
                      <input type="hidden" {...register('partnerLongitude', { valueAsNumber: true })} />
                    </div>
                  </>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    size="lg"
                    variant="gradient"
                    className="w-full text-lg py-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {selectedPlan === 'Comprehensive Reading' ? t.btnCompLoading : t.btnSingleLoading}
                      </div>
                    ) : selectedPlan === 'Comprehensive Reading' ? (
                      t.btnComp
                    ) : (
                      t.btnSingle
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
