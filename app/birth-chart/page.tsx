'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// Validation schema
const BirthChartSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  birthDate: z.string().min(1, 'Birth date is required'),
  birthTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  // Partner fields for comprehensive plan
  partnerName: z.string().min(2, 'Partner name must be at least 2 characters').optional(),
  partnerBirthDate: z.string().optional(),
  partnerBirthTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)').optional(),
  partnerLocation: z.string().optional(),
  partnerLatitude: z.number().min(-90).max(90).optional(),
  partnerLongitude: z.number().min(-180).max(180).optional(),
})

type BirthChartFormData = z.infer<typeof BirthChartSchema>

export default function BirthChartPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [locationSearch, setLocationSearch] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const router = useRouter()

  // Check if plan is selected
  React.useEffect(() => {
    const plan = sessionStorage.getItem('selectedPlan')
    if (!plan) {
      toast.error('Please select a plan first')
      router.push('/pricing')
      return
    }
    setSelectedPlan(plan)
  }, [router])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BirthChartFormData>({
    resolver: zodResolver(BirthChartSchema),
    defaultValues: {
      birthTime: '12:00',
      latitude: 42.4833, // Default for Yambol, Bulgaria
      longitude: 26.5167, // Default for Yambol, Bulgaria
    },
  })

  const watchedLocation = watch('location')

  // Mock location search (in production, use Google Places API)
  const searchLocations = async (query: string) => {
    if (query.length < 3) return []
    
    // Mock locations - replace with actual Google Places API call
    const mockLocations = [
      { name: 'New York, NY, USA', lat: 40.7128, lng: -74.0060 },
      { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
      { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
      { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
      { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    ]
    
    return mockLocations.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  const handleLocationSelect = (location: { name: string; lat: number; lng: number }) => {
    setValue('location', location.name)
    setValue('latitude', location.lat)
    setValue('longitude', location.lng)
    setLocationSearch('')
  }

  const onSubmit = async (data: BirthChartFormData) => {
    setIsLoading(true)
    
    try {
      console.log('Form data:', data)
      
      // Validate partner data for comprehensive plan
      if (selectedPlan === 'Comprehensive Reading') {
        if (!data.partnerName || !data.partnerBirthDate) {
          toast.error('Please fill in all partner information for compatibility analysis')
          setIsLoading(false)
          return
        }
      }
      
      // Set default coordinates if not provided (for Yambol, Bulgaria)
      const latitude = data.latitude || 42.4833
      const longitude = data.longitude || 26.5167
      
      const requestData = {
        birthDate: new Date(data.birthDate + 'T' + data.birthTime).toISOString(),
        birthTime: data.birthTime,
        latitude: latitude,
        longitude: longitude,
        location: data.location,
      }
      
      console.log('Request data:', requestData)
      
      // Create birth chart
      const chartResponse = await fetch('/api/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const chartResult = await chartResponse.json()
      console.log('API Response:', chartResult)

      if (!chartResult.success) {
        console.error('API Error:', chartResult)
        throw new Error(chartResult.error || 'Failed to create birth chart')
      }

      // If comprehensive plan, create partner birth chart
      let partnerChartData = null
      if (selectedPlan === 'Comprehensive Reading' && data.partnerName && data.partnerBirthDate) {
        const partnerLatitude = data.partnerLatitude || 42.4833
        const partnerLongitude = data.partnerLongitude || 26.5167
        
        const partnerRequestData = {
          birthDate: new Date(data.partnerBirthDate + 'T' + (data.partnerBirthTime || '12:00')).toISOString(),
          birthTime: data.partnerBirthTime || '12:00',
          latitude: partnerLatitude,
          longitude: partnerLongitude,
          location: data.partnerLocation || 'Unknown',
        }
        
        console.log('Partner request data:', partnerRequestData)
        
        const partnerChartResponse = await fetch('/api/chart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(partnerRequestData),
        })

        const partnerChartResult = await partnerChartResponse.json()
        console.log('Partner API Response:', partnerChartResult)

        if (partnerChartResult.success) {
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
      }

      // Store birth chart data in session storage
      sessionStorage.setItem('birthChartData', JSON.stringify({
        ...chartResult.data,
        userData: {
          name: data.name,
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          location: data.location,
        },
        partnerChartData: partnerChartData,
      }))

      toast.success(selectedPlan === 'Comprehensive Reading' ? 'Birth charts created successfully!' : 'Birth chart created successfully!')
      
      // Store analysis type for later use
      const analysisType = selectedPlan === 'Basic Reading' ? 'basic' : 
                          selectedPlan === 'Detailed Analysis' ? 'detailed' : 'comprehensive'
      sessionStorage.setItem('selectedAnalysisType', analysisType)
      
      // Store partner data if available
      if (partnerChartData) {
        sessionStorage.setItem('partnerChartData', JSON.stringify(partnerChartData))
      }
      
      // Redirect to payment page instead of generating analysis directly
      router.push('/payment-checkout')

    } catch (error) {
      console.error('Error creating birth chart:', error)
      toast.error('Failed to create birth chart. Please check your data and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Your Birth Chart
              </h1>
              <p className="text-xl text-cosmic-700 dark:text-cosmic-300 mb-4">
                Enter your birth details to discover your cosmic blueprint
              </p>
              
              {/* Selected Plan Display */}
              {selectedPlan && (
                <div className="inline-block bg-gradient-to-r from-cosmic-500 to-purple-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
                  Selected Plan: {selectedPlan}
                </div>
              )}
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-2" />
                    Birth Date
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

                {/* Birth Time */}
                <div>
                  <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                    <ClockIcon className="w-4 h-4 inline mr-2" />
                    Birth Time
                  </label>
                  <input
                    type="time"
                    {...register('birthTime')}
                    className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                  />
                  {errors.birthTime && (
                    <p className="mt-1 text-sm text-red-500">{errors.birthTime.message}</p>
                  )}
                                          <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">
                          If you don't know your exact birth time, use 12:00 PM
                        </p>
                        <p className="mt-1 text-sm text-cosmic-500 dark:text-cosmic-400">
                          💡 Tip: Check birth certificates, ask family members, or use 12:00 PM as default
                        </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                    <MapPinIcon className="w-4 h-4 inline mr-2" />
                    Birth Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('location')}
                      className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                      placeholder="Enter your birth city and country"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                    )}
                    <p className="mt-1 text-sm text-cosmic-500 dark:text-cosmic-400">
                      💡 Tip: Use format "City, Country" (e.g., "Sofia, Bulgaria" or "New York, USA")
                    </p>
                  </div>
                </div>

                {/* Hidden fields for coordinates */}
                <input type="hidden" {...register('latitude', { valueAsNumber: true, value: 42.4833 })} />
                <input type="hidden" {...register('longitude', { valueAsNumber: true, value: 26.5167 })} />

                {/* Partner Information for Comprehensive Plan */}
                {selectedPlan === 'Comprehensive Reading' && (
                  <>
                    <div className="border-t border-cosmic-200 dark:border-cosmic-600 pt-8 mt-8">
                      <h3 className="text-xl font-bold text-cosmic-800 dark:text-cosmic-200 mb-6 text-center">
                        💕 Partner Information
                      </h3>
                      
                      {/* Partner Name */}
                      <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                          <UserIcon className="w-4 h-4 inline mr-2" />
                          Partner's Full Name
                        </label>
                        <input
                          type="text"
                          {...register('partnerName')}
                          className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                          placeholder="Enter your partner's full name"
                        />
                        {errors.partnerName && (
                          <p className="mt-1 text-sm text-red-500">{errors.partnerName.message}</p>
                        )}
                      </div>

                      {/* Partner Birth Date */}
                      <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                          <CalendarIcon className="w-4 h-4 inline mr-2" />
                          Partner's Birth Date
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

                      {/* Partner Birth Time */}
                      <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                          <ClockIcon className="w-4 h-4 inline mr-2" />
                          Partner's Birth Time
                        </label>
                        <input
                          type="time"
                          {...register('partnerBirthTime')}
                          className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                        />
                        {errors.partnerBirthTime && (
                          <p className="mt-1 text-sm text-red-500">{errors.partnerBirthTime.message}</p>
                        )}
                        <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">
                          If you don't know your partner's exact birth time, use 12:00 PM
                        </p>
                        <p className="mt-1 text-sm text-cosmic-500 dark:text-cosmic-400">
                          💡 Tip: Check birth certificates, ask family members, or use 12:00 PM as default
                        </p>
                      </div>

                      {/* Partner Location */}
                      <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                          <MapPinIcon className="w-4 h-4 inline mr-2" />
                          Partner's Birth Location
                        </label>
                        <input
                          type="text"
                          {...register('partnerLocation')}
                          className="w-full px-4 py-3 rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-700 text-cosmic-900 dark:text-white focus:ring-2 focus:ring-cosmic-500 focus:border-transparent transition-all"
                          placeholder="Enter your partner's birth city and country"
                        />
                        {errors.partnerLocation && (
                          <p className="mt-1 text-sm text-red-500">{errors.partnerLocation.message}</p>
                        )}
                        <p className="mt-1 text-sm text-cosmic-500 dark:text-cosmic-400">
                          💡 Tip: Use format "City, Country" (e.g., "Sofia, Bulgaria" or "New York, USA")
                        </p>
                      </div>

                      {/* Hidden fields for partner coordinates */}
                      <input type="hidden" {...register('partnerLatitude', { valueAsNumber: true, value: 42.4833 })} />
                      <input type="hidden" {...register('partnerLongitude', { valueAsNumber: true, value: 26.5167 })} />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
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
                        {selectedPlan === 'Comprehensive Reading' ? 'Calculating Charts...' : 'Calculating Your Chart...'}
                      </div>
                    ) : (
                      selectedPlan === 'Comprehensive Reading' ? 'Calculate Charts & Continue' : 'Calculate Chart & Continue'
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-cosmic-50 dark:bg-cosmic-700/50 rounded-lg border border-cosmic-200 dark:border-cosmic-600">
                <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  💫 Why Birth Time Matters
                </h3>
                <p className="text-sm text-cosmic-700 dark:text-cosmic-300">
                  Your birth time determines the exact positions of planets in your chart and which houses they occupy. 
                  This information is crucial for accurate astrological readings and understanding your life path.
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
