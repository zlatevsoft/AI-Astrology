'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckCircleIcon, ArrowDownTrayIcon, ShareIcon, StarIcon } from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

function PaymentSuccessContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [birthChartData, setBirthChartData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    // Get stored data
    const storedBirthChart = sessionStorage.getItem('birthChartData')
    const selectedAnalysisType = sessionStorage.getItem('selectedAnalysisType')
    const storedAnalysisData = sessionStorage.getItem('analysisData')

    if (!storedBirthChart || !selectedAnalysisType) {
      toast.error('Missing birth chart data')
      router.push('/birth-chart')
      return
    }

    try {
      const birthChart = JSON.parse(storedBirthChart)
      setBirthChartData(birthChart)

      // If we already have analysis data (from test mode), use it
      if (storedAnalysisData) {
        const analysis = JSON.parse(storedAnalysisData)
        console.log('Using stored analysis data:', analysis)
        setAnalysisData(analysis)
        setIsLoading(false)
        return
      }

      // Otherwise, generate analysis
      if (sessionId) {
        generateAnalysis(birthChart, selectedAnalysisType, sessionId)
      } else {
        toast.error('Invalid session')
        router.push('/birth-chart')
      }
    } catch (error) {
      console.error('Error parsing stored data:', error)
      toast.error('Invalid stored data')
      router.push('/birth-chart')
    }
  }, [searchParams, router])

  const generateAnalysis = async (birthChart: any, analysisType: string, sessionId: string) => {
    setIsGenerating(true)

    try {
      // Check if this is a test session
      const isTestSession = sessionId.startsWith('test_session_')
      
      if (!isTestSession) {
        // Get Stripe config from localStorage
        const savedConfig = localStorage.getItem('stripeConfig')
        const stripeConfig = savedConfig ? JSON.parse(savedConfig) : null
        
        // Add mode information to config
        if (stripeConfig) {
          const savedMode = localStorage.getItem('stripeMode')
          stripeConfig.mode = savedMode || 'test'
        }
        
        // Verify Stripe payment
        const paymentResponse = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId, stripeConfig }),
        })

        const paymentResult = await paymentResponse.json()

        if (!paymentResult.success) {
          throw new Error('Payment verification failed: ' + (paymentResult.error || 'Unknown error'))
        }
      }

      // Get partner data if available
      const partnerChartData = sessionStorage.getItem('partnerChartData')
      let partnerData = null
      if (partnerChartData) {
        partnerData = JSON.parse(partnerChartData)
      }

              // Generate AI analysis
        const requestBody: any = {
          birthChart: {
            id: birthChart.id || `chart_${Date.now()}`,
            birthData: {
              name: birthChart.userData?.fullName || birthChart.fullName || 'User',
              date: birthChart.userData?.birthDate || birthChart.birthDate,
              time: birthChart.userData?.birthTime || birthChart.birthTime,
              latitude: birthChart.latitude || 42.4833,
              longitude: birthChart.longitude || 26.5167,
              location: birthChart.userData?.location || birthChart.location,
            },
            planetaryPositions: birthChart.planetaryPositions,
            houses: birthChart.houses,
            aspects: birthChart.aspects,
          },
          analysisType,
        }

        // Add partner data if available (for comprehensive plan)
        if (partnerData) {
          requestBody.partnerBirthChart = {
            id: partnerData.id || `partner_chart_${Date.now()}`,
            birthData: {
              name: partnerData.userData?.partnerName || partnerData.partnerName || 'Partner',
              date: partnerData.userData?.birthDate || partnerData.birthDate,
              time: partnerData.userData?.birthTime || partnerData.birthTime,
              latitude: partnerData.latitude || 42.4833,
              longitude: partnerData.longitude || 26.5167,
              location: partnerData.userData?.location || partnerData.location,
            },
            planetaryPositions: partnerData.planetaryPositions,
            houses: partnerData.houses,
            aspects: partnerData.aspects,
          }
        }

        console.log('Sending request body to AI analysis:', JSON.stringify(requestBody, null, 2))
        
        const analysisResponse = await fetch('/api/ai-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

      const analysisResult = await analysisResponse.json()

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Failed to generate analysis')
      }

      console.log('Analysis result:', analysisResult)
      setAnalysisData(analysisResult.data)
      setIsLoading(false)

      // Store analysis data
      sessionStorage.setItem('analysisData', JSON.stringify(analysisResult.data))

    } catch (error) {
      console.error('Error generating analysis:', error)
      toast.error('Failed to generate your analysis. Please contact support.')
      router.push('/birth-chart')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-generation' })
      
      // Create a temporary div for PDF content
      const pdfContainer = document.createElement('div')
      pdfContainer.style.position = 'absolute'
      pdfContainer.style.left = '-9999px'
      pdfContainer.style.top = '0'
      pdfContainer.style.width = '800px'
      pdfContainer.style.padding = '40px'
      pdfContainer.style.backgroundColor = 'white'
      pdfContainer.style.color = '#1a1a1a'
      pdfContainer.style.fontFamily = 'Arial, sans-serif'
      pdfContainer.style.fontSize = '12px'
      pdfContainer.style.lineHeight = '1.6'
      
      // Create PDF content with proper formatting
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; font-size: 24px; margin-bottom: 10px;">🌟 AI Astrology Analysis Report</h1>
          <div style="border-top: 2px solid #6366f1; width: 100px; margin: 0 auto;"></div>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
          <h3 style="color: #6366f1; margin-bottom: 10px;">📋 Analysis Details</h3>
          <p><strong>Analysis Type:</strong> ${analysisData.analysisType.charAt(0).toUpperCase() + analysisData.analysisType.slice(1)}</p>
          <p><strong>Generated:</strong> ${new Date(analysisData.generatedAt).toLocaleString()}</p>
          <p><strong>For:</strong> ${birthChartData.userData?.name}</p>
          <p><strong>Birth Date:</strong> ${new Date(birthChartData.userData?.birthDate).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${birthChartData.userData?.location}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          ${(analysisData.content || 'No analysis content available')
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #6366f1;">$1</strong>')
            .replace(/## (.*?)/g, '<h2 style="color: #6366f1; font-size: 18px; margin: 25px 0 15px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">$1</h2>')
            .replace(/##/g, '')
            .replace(/\n/g, '<br>')
            .replace(/- (.*?)(?=<br>|$)/g, '<li style="margin: 5px 0;">$1</li>')
            .replace(/(\d+\.) (.*?)(?=<br>|$)/g, '<li style="margin: 5px 0;">$1 $2</li>')
          }
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #6366f1; text-align: center; color: #6b7280;">
          <p style="margin: 0;">Generated by Professional Astro Horoscope Birth Chart</p>
          <p style="margin: 5px 0;">Visit: https://astrohoroscope.online/</p>
        </div>
      `
      
      document.body.appendChild(pdfContainer)
      
      // Convert to canvas
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Remove temporary container
      document.body.removeChild(pdfContainer)
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Download PDF
      pdf.save(`professional-astro-horoscope-${analysisData.analysisType}-${Date.now()}.pdf`)
      
      toast.success('PDF downloaded successfully!', { id: 'pdf-generation' })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF', { id: 'pdf-generation' })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My AI Astrology Reading',
        text: 'Check out my personalized astrological analysis!',
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (isLoading || isGenerating) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                  Payment Successful!
                </h1>
                <p className="text-xl text-cosmic-700 dark:text-cosmic-300 mb-8">
                  Thank you for your purchase. We're generating your personalized analysis...
                </p>

              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cosmic-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  Generating Your Analysis
                </h3>
                <p className="text-cosmic-600 dark:text-cosmic-400">
                  Our AI is crafting your personalized astrological insights...
                </p>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!analysisData || !birthChartData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-cosmic-600 dark:text-cosmic-400">No analysis data found</p>
          <Button onClick={() => router.push('/birth-chart')} className="mt-4">
            Start Over
          </Button>
        </div>
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
            className="max-w-4xl mx-auto"
          >
            {/* Success Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                  Your Analysis is Ready!
                </h1>
                <p className="text-xl text-cosmic-700 dark:text-cosmic-300">
                  Discover your cosmic blueprint and unlock your potential
                </p>

              </motion.div>

              {/* User Info */}
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-4 inline-block mb-8">
                <p className="text-sm text-cosmic-700 dark:text-cosmic-300">
                  <strong>Analysis for:</strong> {birthChartData.userData?.name} • {new Date(birthChartData.userData?.birthDate).toLocaleDateString()} • {birthChartData.userData?.location}
                </p>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                                 <Button
                   size="lg"
                   variant="gradient"
                   className="text-lg px-8 py-4"
                   onClick={handleDownloadPDF}
                 >
                   <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                   Download PDF Report
                 </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  onClick={handleShare}
                >
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Share Results
                </Button>
              </motion.div>
            </div>

            {/* Analysis Content */}
                         <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.5 }}
               className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50 max-h-none overflow-visible"
             >
               <div className="prose prose-cosmic dark:prose-invert max-w-none analysis-content">
                 <div 
                   className="text-cosmic-800 dark:text-cosmic-200 leading-relaxed whitespace-pre-wrap"
                   dangerouslySetInnerHTML={{ 
                     __html: (analysisData.content || 'No analysis content available').replace(/\n/g, '<br>') 
                   }}
                 />
                 {!analysisData.content && (
                   <div className="text-red-500 text-center p-4">
                     <p>Debug: Analysis data structure:</p>
                     <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
                       {JSON.stringify(analysisData, null, 2)}
                     </pre>
                   </div>
                 )}
               </div>
             </motion.div>

            {/* Additional Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-6 text-center">
                <StarIcon className="w-8 h-8 text-cosmic-500 mx-auto mb-3" />
                <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  Save Your Reading
                </h3>
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                  Access your analysis anytime from your account
                </p>
              </div>
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-6 text-center">
                <StarIcon className="w-8 h-8 text-cosmic-500 mx-auto mb-3" />
                <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  Get Updates
                </h3>
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                  Receive personalized insights and cosmic guidance
                </p>
              </div>
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-6 text-center">
                <StarIcon className="w-8 h-8 text-cosmic-500 mx-auto mb-3" />
                <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  Share Journey
                </h3>
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                  Connect with others on their spiritual path
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-12 text-center"
            >
              <Button
                size="lg"
                variant="gradient"
                className="text-lg px-12 py-4"
                onClick={() => router.push('/')}
              >
                Explore More Features
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
