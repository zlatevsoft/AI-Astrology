'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  StarIcon, 
  SparklesIcon, 
  HeartIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  getMarketingPriceDisplay,
  isFreeCheckoutDisplayEnabled,
  LIST_PRICE_USD,
  type AnalysisTier,
} from '@/lib/pricing'

export default function PaymentCheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [birthChartData, setBirthChartData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  /** True when Vercel has FREE_CHECKOUT=1 (read at runtime via /api/site-config). */
  const [freeFromServer, setFreeFromServer] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => r.json())
      .then((d: { freeCheckout?: boolean }) => setFreeFromServer(!!d.freeCheckout))
      .catch(() => setFreeFromServer(false))
  }, [])

  useEffect(() => {
    // Get stored data
    const plan = sessionStorage.getItem('selectedPlan')
    const birthChart = sessionStorage.getItem('birthChartData')
    const analysisType = sessionStorage.getItem('selectedAnalysisType')

    if (!plan || !birthChart || !analysisType) {
      toast.error('Missing required data. Please start over.')
      router.push('/pricing')
      return
    }

    setSelectedPlan(plan)
    setBirthChartData(JSON.parse(birthChart))
  }, [router])

  const plans = {
    'Basic Reading': {
      icon: StarIcon,
      tier: 'basic' as AnalysisTier,
      description: 'Discover your core personality and life path',
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
      gradient: 'from-blue-500 to-purple-600'
    },
    'Detailed Analysis': {
      icon: SparklesIcon,
      tier: 'detailed' as AnalysisTier,
      description: 'Deep dive into your soul\'s journey',
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
      gradient: 'from-purple-500 to-pink-600'
    },
    'Comprehensive Reading': {
      icon: HeartIcon,
      tier: 'comprehensive' as AnalysisTier,
      description: 'Complete relationship compatibility analysis',
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
      gradient: 'from-pink-500 to-red-600'
    }
  }

  const handlePayment = async () => {
    if (!selectedPlan) return

    setIsProcessing(true)

    try {
      // Get Stripe config from localStorage
      const savedConfig = localStorage.getItem('stripeConfig')
      let stripeConfig = savedConfig ? JSON.parse(savedConfig) : null
      
             // Fallback to mock config if localStorage is not available
       if (!stripeConfig) {
         console.log('localStorage not available, using mock config')
         stripeConfig = {
           mode: 'test',
           testPublishableKey: '',
           testSecretKey: '',
           livePublishableKey: '',
           liveSecretKey: '',
         }
       } else {
        // Add mode information to config from localStorage
        const savedMode = localStorage.getItem('stripeMode')
        stripeConfig.mode = savedMode || 'test' // Default to test mode
        
        // Determine mode based on which keys are present if no saved mode
        if (!savedMode) {
          if (stripeConfig.liveSecretKey && stripeConfig.livePublishableKey) {
            stripeConfig.mode = 'live'
          } else if (stripeConfig.testSecretKey && stripeConfig.testPublishableKey) {
            stripeConfig.mode = 'test'
          }
        }
      }
      
      console.log('Using Stripe config:', stripeConfig)

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: selectedPlan,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment-checkout`,
          stripeConfig: stripeConfig
        }),
      })

             const result = await response.json() as {
               url?: string
               isMock?: boolean
               freeCheckout?: boolean
               error?: string
             }

       if (result.url) {
         // Check if it's a mock session
         if (result.isMock) {
           console.log('Using mock payment session')
           toast.success(
             result.freeCheckout
               ? 'Test mode: no charge — opening your report flow'
               : 'Development mode: Proceeding to analysis generation'
           )
         }
         
         // Redirect to success page (either Stripe or mock)
         window.location.href = result.url
       } else {
         console.error('Failed to create checkout session:', result.error)
         toast.error('Failed to create payment session. Please try again.')
         setIsProcessing(false)
       }
         } catch (error) {
       console.error('Error creating checkout session:', error)
       
       // Check if it's a network error or localStorage issue
       if (error instanceof TypeError && error.message.includes('fetch')) {
         toast.error('Network error. Please check your connection and try again.')
       } else {
         toast.error('Payment system error. Please try again.')
       }
       
       setIsProcessing(false)
     }
  }

  if (!selectedPlan || !birthChartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const plan = plans[selectedPlan as keyof typeof plans]
  const PlanIcon = plan.icon
  const baseDisplay = getMarketingPriceDisplay(plan.tier)
  const useFreeUI =
    freeFromServer === true || isFreeCheckoutDisplayEnabled()
  const displayPrice = useFreeUI ? 0 : baseDisplay.current
  const displayCompare = useFreeUI
    ? LIST_PRICE_USD[plan.tier]
    : baseDisplay.compareAt
  const isFreeUI = useFreeUI

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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Complete Your Purchase
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              You're just one step away from discovering your cosmic blueprint. 
              Complete your payment to receive your personalized AI astrological analysis.
            </p>
            {isFreeUI && (
              <p className="mt-4 inline-block rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-2 text-amber-100">
                Test mode: checkout is free (Vercel env <code className="mx-0.5">FREE_CHECKOUT=1</code>; remove for production).
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              {/* Selected Plan */}
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}>
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedPlan}</h3>
                    <p className="text-white/70 text-sm">{plan.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total:</span>
                    <div className="text-right">
                      {isFreeUI && displayPrice === 0 && (
                        <span className="mr-2 text-sm text-white/50 line-through">
                          ${displayCompare.toFixed(2)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-white">
                        {displayPrice === 0 ? 'Free' : `$${displayPrice.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Information</h3>
                <div className="space-y-2 text-white/80">
                  <p><strong>Name:</strong> {birthChartData.userData?.name}</p>
                  <p><strong>Birth Date:</strong> {new Date(birthChartData.userData?.birthDate).toLocaleDateString()}</p>
                  <p><strong>Birth Time:</strong> {birthChartData.userData?.birthTime}</p>
                  <p><strong>Location:</strong> {birthChartData.userData?.location}</p>
                  {birthChartData.partnerChartData && (
                    <>
                      <p><strong>Partner Name:</strong> {birthChartData.partnerChartData.userData?.name}</p>
                      <p><strong>Partner Birth Date:</strong> {new Date(birthChartData.partnerChartData.userData?.birthDate).toLocaleDateString()}</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Secure Payment</h2>
              
              <div className="space-y-6">
                {/* Security Info */}
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Secure Payment</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    Your payment is processed securely by Stripe. We never store your payment information.
                  </p>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full bg-gradient-to-r from-cosmic-500 to-purple-600 hover:from-cosmic-600 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="w-5 h-5" />
                      {displayPrice === 0 && isFreeUI
                        ? 'Continue — get your analysis'
                        : `Pay $${displayPrice.toFixed(2)} & get your analysis`}
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                {/* Trust Indicators */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      <span>SSL Encrypted</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      <span>Instant Access</span>
                    </div>
                  </div>
                  
                  <p className="text-white/50 text-xs">
                    By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                  </p>
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
