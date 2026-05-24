'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CreditCardIcon, CheckCircleIcon, StarIcon, SparklesIcon, HeartIcon, ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { LIST_PRICE_EUR, COMPARE_AT_EUR, formatEur } from '@/lib/pricing'
import type { PublicPricingPayload } from '@/lib/public-pricing'
import { paymentCheckout } from '@/lib/dictionaries'
import { getPlanRowsForLocale, type PlanProductName } from '@/lib/plan-locale'
import { getClientLocale } from '@/lib/locale'
import { useSiteLocale } from '@/lib/use-site-locale'

const PLAN_ICONS: Record<PlanProductName, typeof StarIcon> = {
  'Basic Reading': StarIcon,
  'Detailed Analysis': SparklesIcon,
  'Comprehensive Reading': HeartIcon,
}

type PromoPreview =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'valid'; discountPercent: number; finalAmountCents: number }
  | { status: 'invalid'; error: string }

export default function PaymentCheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [birthChartData, setBirthChartData] = useState<Record<string, unknown> | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoPreview, setPromoPreview] = useState<PromoPreview>({ status: 'idle' })
  const [freeFromServer, setFreeFromServer] = useState<boolean | null>(null)
  const [apiPrices, setApiPrices] = useState<PublicPricingPayload | null>(null)
  const locale = useSiteLocale()
  const router = useRouter()
  const t = paymentCheckout[locale]

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => r.json())
      .then((d: { freeCheckout?: boolean }) => setFreeFromServer(!!d.freeCheckout))
      .catch(() => setFreeFromServer(false))
  }, [])

  useEffect(() => {
    fetch('/api/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((p: PublicPricingPayload | null) => {
        if (p?.listEur && p?.compareEur) setApiPrices(p)
      })
      .catch(() => {})
  }, [])
  useEffect(() => {
    const plan = sessionStorage.getItem('selectedPlan')
    const birthChart = sessionStorage.getItem('birthChartData')
    const analysisType = sessionStorage.getItem('selectedAnalysisType')
    const loc = getClientLocale()

    if (!plan || !birthChart || !analysisType) {
      toast.error(paymentCheckout[loc].toastMissing)
      router.push('/pricing')
      return
    }

    setSelectedPlan(plan)
    setBirthChartData(JSON.parse(birthChart) as Record<string, unknown>)
  }, [router])

  const userData = birthChartData?.userData as
    | { name?: string; birthDate?: string; birthTime?: string; location?: string }
    | undefined
  const partnerChartData = birthChartData?.partnerChartData as
    | { userData?: { name?: string; birthDate?: string } }
    | undefined

  useEffect(() => {
    const code = promoCode.trim()
    if (!selectedPlan || !code) {
      setPromoPreview({ status: 'idle' })
      return
    }
    const planRow = getPlanRowsForLocale(locale).find((r) => r.productName === selectedPlan)
    if (!planRow) return

    const timeout = window.setTimeout(async () => {
      setPromoPreview({ status: 'checking' })
      try {
        const r = await fetch('/api/promo/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            baseAmountCents: Math.round(
              (apiPrices?.listEur[planRow.tier] ?? LIST_PRICE_EUR[planRow.tier]) * 100
            ),
          }),
        })
        const d = (await r.json()) as {
          valid?: boolean
          error?: string
          discountPercent?: number
          finalAmountCents?: number
        }
        if (d.valid && typeof d.discountPercent === 'number' && typeof d.finalAmountCents === 'number') {
          setPromoPreview({
            status: 'valid',
            discountPercent: d.discountPercent,
            finalAmountCents: d.finalAmountCents,
          })
        } else {
          setPromoPreview({ status: 'invalid', error: d.error || 'Invalid code' })
        }
      } catch {
        setPromoPreview({ status: 'invalid', error: 'Could not validate code' })
      }
    }, 450)

    return () => window.clearTimeout(timeout)
  }, [promoCode, selectedPlan, locale, apiPrices])

  const handlePayment = async () => {
    if (!selectedPlan) return

    setIsProcessing(true)
    const strings = paymentCheckout[locale]

    try {
      const savedConfig = localStorage.getItem('stripeConfig')
      let stripeConfig = savedConfig ? JSON.parse(savedConfig) : null

      if (!stripeConfig) {
        stripeConfig = {
          mode: 'test',
          testPublishableKey: '',
          testSecretKey: '',
          livePublishableKey: '',
          liveSecretKey: '',
        }
      } else {
        const savedMode = localStorage.getItem('stripeMode')
        stripeConfig.mode = savedMode || 'test'
        if (!savedMode) {
          if (stripeConfig.liveSecretKey && stripeConfig.livePublishableKey) {
            stripeConfig.mode = 'live'
          } else if (stripeConfig.testSecretKey && stripeConfig.testPublishableKey) {
            stripeConfig.mode = 'test'
          }
        }
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedPlan,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment-checkout`,
          stripeConfig,
          promoCode: promoCode.trim() || undefined,
        }),
      })

      const result = (await response.json()) as {
        url?: string
        isMock?: boolean
        freeCheckout?: boolean
        error?: string
      }

      if (result.url) {
        if (result.isMock) {
          toast.success(result.freeCheckout ? strings.toastMockFree : strings.toastMockDev)
        }
        window.location.href = result.url
      } else {
        console.error('Failed to create checkout session:', result.error)
        toast.error(strings.toastSessionError)
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error(strings.toastNetwork)
      } else {
        toast.error(strings.toastPaymentError)
      }
      setIsProcessing(false)
    }
  }

  if (!selectedPlan || !birthChartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    )
  }

  const planName = selectedPlan as PlanProductName
  const planRow = getPlanRowsForLocale(locale).find((r) => r.productName === planName)
  if (!planRow) {
    return null
  }

  const PlanIcon = PLAN_ICONS[planName]
  /** What the product costs in the price list (always shown; independent of test/free-charge mode). */
  const listPriceEur = apiPrices?.listEur[planRow.tier] ?? LIST_PRICE_EUR[planRow.tier]
  const compareAtEur = apiPrices?.compareEur[planRow.tier] ?? COMPARE_AT_EUR[planRow.tier]
  const finalPriceEur =
    promoPreview.status === 'valid' ? promoPreview.finalAmountCents / 100 : listPriceEur
  /** Only server env FREE_CHECKOUT=1 (via /api/site-config). Do not use NEXT_PUBLIC here — old builds would stay on "free" UI after env changes without redeploy. */
  const isFreeUI = freeFromServer === true

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.title}</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{t.subtitle}</p>
            {isFreeUI && (
              <p className="mt-4 inline-block rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-2 text-amber-100 text-sm text-left max-w-2xl">
                {t.testModeBanner}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{t.orderSummary}</h2>

              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${planRow.gradient} flex items-center justify-center`}
                  >
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{planRow.name}</h3>
                    <p className="text-white/70 text-sm">{planRow.description}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {planRow.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{t.total}</span>
                    <div className="text-right">
                      <span className="mr-2 text-sm text-white/50 line-through">
                        {formatEur(compareAtEur)}
                      </span>
                      {promoPreview.status === 'valid' && (
                        <span className="mr-2 text-sm text-white/50 line-through">
                          {formatEur(listPriceEur)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-white">{formatEur(finalPriceEur)}</span>
                    </div>
                  </div>
                  {promoPreview.status === 'valid' && (
                    <p className="mt-2 text-right text-sm text-emerald-300">
                      Promo code applied: -{promoPreview.discountPercent}%
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{t.yourInfo}</h3>
                <div className="space-y-2 text-white/80">
                  <p>
                    <strong>{t.labelName}</strong> {userData?.name}
                  </p>
                  <p>
                    <strong>{t.labelBirthDate}</strong>{' '}
                    {userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString() : ''}
                  </p>
                  <p>
                    <strong>{t.labelBirthTime}</strong> {userData?.birthTime}
                  </p>
                  <p>
                    <strong>{t.labelLocation}</strong> {userData?.location}
                  </p>
                  {partnerChartData?.userData && (
                    <>
                      <p>
                        <strong>{t.labelPartnerName}</strong> {partnerChartData.userData.name}
                      </p>
                      <p>
                        <strong>{t.labelPartnerBirth}</strong>{' '}
                        {partnerChartData.userData.birthDate
                          ? new Date(partnerChartData.userData.birthDate).toLocaleDateString()
                          : ''}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{t.securePayment}</h2>

              <div className="space-y-6">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">{t.securityTitle}</span>
                  </div>
                  <p className="text-white/80 text-sm">{t.securityBody}</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/90">{t.promoLabel}</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-cosmic-300 focus:outline-none focus:ring-1 focus:ring-cosmic-400"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={t.promoPlaceholder}
                    autoComplete="off"
                  />
                  {promoPreview.status === 'checking' && (
                    <p className="mt-2 text-xs text-white/60">Checking promo code...</p>
                  )}
                  {promoPreview.status === 'valid' && (
                    <p className="mt-2 text-xs text-emerald-300">
                      Code applied: -{promoPreview.discountPercent}% · final price {formatEur(finalPriceEur)}
                    </p>
                  )}
                  {promoPreview.status === 'invalid' && (
                    <p className="mt-2 text-xs text-red-200">{promoPreview.error}</p>
                  )}
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full bg-gradient-to-r from-cosmic-500 to-purple-600 hover:from-cosmic-600 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t.processing}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="w-5 h-5" />
                      {isFreeUI
                        ? t.continueFree
                        : t.payButtonTemplate.replace('%s', formatEur(finalPriceEur))}
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      <span>{t.trustSsl}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      <span>{t.trustInstant}</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs">{t.termsNote}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
