'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StarIcon, SparklesIcon, RocketLaunchIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AnalysisOption {
  id: 'basic' | 'detailed' | 'comprehensive'
  title: string
  description: string
  price: number
  features: string[]
  popular?: boolean
  icon: React.ComponentType<any>
}

const analysisOptions: AnalysisOption[] = [
  {
    id: 'basic',
    title: 'Basic Analysis',
    description: 'Essential insights about your personality and life path',
    price: 24,
    features: [
      'Core personality traits',
      'Life purpose overview',
      'Key strengths & challenges',
      'Basic relationship insights',
      'Career guidance',
      'PDF report included',
    ],
    icon: StarIcon,
  },
  {
    id: 'detailed',
    title: 'Detailed Analysis',
    description: 'Comprehensive reading with deeper psychological insights',
    price: 49,
    features: [
      'Everything in Basic',
      'Detailed house interpretations',
      'Planetary aspects analysis',
      'Life timing insights',
      'Spiritual lessons',
      'Personal development advice',
      'Compatibility overview',
      'Priority support',
    ],
    popular: true,
    icon: SparklesIcon,
  },
  {
    id: 'comprehensive',
    title: 'Comprehensive Analysis',
    description: 'Complete astrological blueprint with personalized guidance',
    price: 99,
    features: [
      'Everything in Detailed',
      'House-by-house breakdown',
      'Major life themes',
      'Karmic lessons',
      'Shadow work guidance',
      'Timing for decisions',
      'Specific growth recommendations',
      'Follow-up consultation',
      'Lifetime updates',
    ],
    icon: RocketLaunchIcon,
  },
]

export default function AnalysisOptionsPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [birthChartData, setBirthChartData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get birth chart data from session storage
    const storedData = sessionStorage.getItem('birthChartData')
    if (!storedData) {
      toast.error('No birth chart data found. Please start over.')
      router.push('/birth-chart')
      return
    }

    try {
      setBirthChartData(JSON.parse(storedData))
    } catch (error) {
      toast.error('Invalid birth chart data. Please start over.')
      router.push('/birth-chart')
    }
  }, [router])

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const handleContinue = async () => {
    if (!selectedOption || !birthChartData) {
      toast.error('Please select an analysis option')
      return
    }

    setIsLoading(true)

    try {
      // Store analysis type in session storage
      sessionStorage.setItem('selectedAnalysisType', selectedOption)

      // For testing: directly generate AI analysis without payment
      const requestBody: any = {
        birthChart: birthChartData,
        analysisType: selectedOption,
      }

      // Add partner birth chart data if available (for comprehensive plan)
      if (birthChartData.partnerChartData) {
        requestBody.partnerBirthChart = birthChartData.partnerChartData
      }

      const analysisResponse = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const analysisResult = await analysisResponse.json()
      console.log('Analysis result:', analysisResult)

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Failed to generate analysis')
      }

      // Store analysis data
      sessionStorage.setItem('analysisData', JSON.stringify(analysisResult.data))
      console.log('Analysis data stored:', analysisResult.data)

      // Redirect to success page
      router.push('/payment-success?session_id=test_session_' + Date.now())

    } catch (error) {
      console.error('Error generating analysis:', error)
      toast.error('Failed to generate analysis. Please try again.')
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
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Choose Your Analysis
              </h1>
              <p className="text-xl text-cosmic-700 dark:text-cosmic-300 mb-4">
                Select the level of insight that resonates with your journey
              </p>
              
              {/* Test Mode Indicator */}
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-6 inline-block">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  🧪 <strong>Test Mode:</strong> All analyses are free for testing. No payment required.
                </p>
              </div>
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-sm text-cosmic-700 dark:text-cosmic-300">
                  <strong>Birth Chart Ready:</strong> {birthChartData.userData?.name} • {new Date(birthChartData.userData?.birthDate).toLocaleDateString()} • {birthChartData.userData?.location}
                </p>
              </div>
            </div>

            {/* Analysis Options */}
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
                    className={`relative cursor-pointer ${
                      isSelected ? 'ring-2 ring-cosmic-500' : ''
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-cosmic-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className={`bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50 h-full transition-all ${
                      isSelected ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                    }`}>
                      {/* Icon */}
                      <div className="text-center mb-6">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                          isSelected ? 'bg-gradient-to-r from-cosmic-500 to-purple-500' : 'bg-cosmic-100 dark:bg-cosmic-700'
                        }`}>
                          <IconComponent className={`w-8 h-8 ${
                            isSelected ? 'text-white' : 'text-cosmic-600 dark:text-cosmic-300'
                          }`} />
                        </div>
                        <h3 className="text-2xl font-bold text-cosmic-900 dark:text-white mb-2">
                          {option.title}
                        </h3>
                        <p className="text-cosmic-600 dark:text-cosmic-400 mb-4">
                          {option.description}
                        </p>
                        <div className="text-3xl font-bold text-cosmic-900 dark:text-white">
                          {option.price === 0 ? 'FREE' : `$${option.price}`}
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {option.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckIcon className="w-5 h-5 text-cosmic-500 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-sm text-cosmic-700 dark:text-cosmic-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Selection Indicator */}
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

            {/* Continue Button */}
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
                    Processing...
                  </div>
                ) : (
                  `Generate ${selectedOption ? analysisOptions.find(opt => opt.id === selectedOption)?.title : 'Analysis'}`
                )}
              </Button>

              {selectedOption && (
                <p className="mt-4 text-sm text-cosmic-600 dark:text-cosmic-400">
                  AI will generate your personalized analysis instantly
                </p>
              )}
            </motion.div>

            {/* Guarantee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-6 inline-block">
                <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  🔒 Secure & Guaranteed
                </h3>
                <p className="text-sm text-cosmic-700 dark:text-cosmic-300">
                  SSL encrypted • No recurring charges
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
