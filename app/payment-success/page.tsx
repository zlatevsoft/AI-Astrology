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
import { getClientLocale } from '@/lib/locale'
import { useSiteLocale } from '@/lib/use-site-locale'
import { paymentSuccessPage } from '@/lib/payment-success-locale'
import { buildAnalysisReportHtml } from '@/lib/analysis-document'

function isStoredAnalysisForCurrentRequest(
  analysis: any,
  birthChart: any,
  analysisType: string
): boolean {
  return (
    !!analysis &&
    analysis.birthChartId === birthChart.id &&
    analysis.analysisType === analysisType &&
    typeof analysis.content === 'string' &&
    analysis.content.trim().length > 0
  )
}

function PaymentSuccessContent() {
  const locale = useSiteLocale()
  const t = paymentSuccessPage[locale]
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [birthChartData, setBirthChartData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const loc = getClientLocale()
    const tErr = paymentSuccessPage[loc]
    const sessionId = searchParams.get('session_id')

    // Get stored data
    const storedBirthChart = sessionStorage.getItem('birthChartData')
    const selectedAnalysisType = sessionStorage.getItem('selectedAnalysisType')
    const storedAnalysisData = sessionStorage.getItem('analysisData')

    if (!storedBirthChart || !selectedAnalysisType) {
      toast.error(tErr.toastMissingData)
      router.push('/birth-chart')
      return
    }

    try {
      const birthChart = JSON.parse(storedBirthChart)
      setBirthChartData(birthChart)

      // Reuse only if it was generated for exactly this chart + plan.
      // Old sessionStorage caused repeated analyses across different people/plans.
      if (storedAnalysisData) {
        const analysis = JSON.parse(storedAnalysisData)
        if (isStoredAnalysisForCurrentRequest(analysis, birthChart, selectedAnalysisType)) {
          console.log('Using stored analysis data for current chart:', analysis)
          setAnalysisData(analysis)
          setIsLoading(false)
          return
        }
        console.warn('Discarding stale analysisData from sessionStorage:', {
          storedBirthChartId: analysis?.birthChartId,
          currentBirthChartId: birthChart.id,
          storedAnalysisType: analysis?.analysisType,
          currentAnalysisType: selectedAnalysisType,
        })
        sessionStorage.removeItem('analysisData')
      }

      // Otherwise, generate analysis
      if (sessionId) {
        generateAnalysis(birthChart, selectedAnalysisType, sessionId)
      } else {
        toast.error(tErr.toastInvalidSession)
        router.push('/birth-chart')
      }
    } catch (error) {
      console.error('Error parsing stored data:', error)
      toast.error(tErr.toastInvalidStored)
      router.push('/birth-chart')
    }
  }, [searchParams, router])

  const generateAnalysis = async (birthChart: any, analysisType: string, sessionId: string) => {
    setIsGenerating(true)
    setGenerationError(null)

    try {
      // Free/admin and local mock sessions are already trusted by the server-side checkout endpoints.
      const isMockOrFreeSession =
        sessionId.startsWith('test_session_') ||
        sessionId.startsWith('free_checkout_') ||
        sessionId.startsWith('mock_session_')
      
      if (!isMockOrFreeSession) {
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
      } else if (birthChart.partnerChartData) {
        // Comprehensive readings store partner data both as a separate key and inside birthChartData.
        partnerData = birthChart.partnerChartData
      }

              // Request analysis generation
        const requestBody: any = {
          birthChart: {
            id: birthChart.id || `chart_${Date.now()}`,
            birthData: {
              name:
                birthChart.userData?.name ||
                birthChart.userData?.fullName ||
                birthChart.fullName ||
                'User',
              date:
                birthChart.userData?.birthDate ||
                birthChart.birthData?.date ||
                birthChart.birthDate,
              time:
                birthChart.userData?.birthTime ||
                birthChart.birthData?.time ||
                birthChart.birthTime,
              latitude: birthChart.birthData?.latitude ?? birthChart.latitude ?? 42.4833,
              longitude: birthChart.birthData?.longitude ?? birthChart.longitude ?? 26.5167,
              location:
                birthChart.userData?.location ||
                birthChart.birthData?.location ||
                birthChart.location,
            },
            planetaryPositions: birthChart.planetaryPositions,
            houses: birthChart.houses,
            aspects: birthChart.aspects,
          },
          analysisType,
          locale: getClientLocale(),
        }

        // Add partner data if available (for comprehensive plan)
        if (partnerData) {
          requestBody.partnerBirthChart = {
            id: partnerData.id || `partner_chart_${Date.now()}`,
            birthData: {
              name:
                partnerData.userData?.name ||
                partnerData.userData?.partnerName ||
                partnerData.partnerName ||
                'Partner',
              date:
                partnerData.userData?.birthDate ||
                partnerData.birthData?.date ||
                partnerData.birthDate,
              time:
                partnerData.userData?.birthTime ||
                partnerData.birthData?.time ||
                partnerData.birthTime,
              latitude: partnerData.birthData?.latitude ?? partnerData.latitude ?? 42.4833,
              longitude: partnerData.birthData?.longitude ?? partnerData.longitude ?? 26.5167,
              location:
                partnerData.userData?.location ||
                partnerData.birthData?.location ||
                partnerData.location,
            },
            planetaryPositions: partnerData.planetaryPositions,
            houses: partnerData.houses,
            aspects: partnerData.aspects,
          }
        }

        console.log('Sending request body to analysis API:', JSON.stringify(requestBody, null, 2))
        
        const analysisResponse = await fetch('/api/ai-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

      const analysisResult = await analysisResponse.json()

      if (!analysisResult.success) {
        console.error('Analysis API returned an error:', analysisResult)
        throw new Error(analysisResult.error || 'Failed to generate analysis')
      }

      console.log('Analysis result:', analysisResult)
      setAnalysisData(analysisResult.data)
      setIsLoading(false)

      // Store analysis data
      sessionStorage.setItem('analysisData', JSON.stringify(analysisResult.data))

    } catch (error) {
      console.error('Error generating analysis:', error)
      toast.error(paymentSuccessPage[getClientLocale()].toastAnalysisFailed)
      setGenerationError(error instanceof Error ? error.message : paymentSuccessPage[getClientLocale()].toastAnalysisFailed)
      setIsLoading(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      toast.loading(t.pdfLoading, { id: 'pdf-generation' })

      const reportHtml = buildAnalysisReportHtml(
        {
          title: t.pdfReportTitle,
          subtitle: t.readySub,
          analysisType: analysisData.analysisType,
          generatedAt: analysisData.generatedAt,
          name: birthChartData.userData?.name,
          birthDate: birthChartData.userData?.birthDate,
          location: birthChartData.userData?.location,
          labels: {
            name: t.pdfFor,
            analysisType: t.pdfAnalysisType,
            birthDate: t.pdfBirthDate,
            location: t.pdfLocation,
            generated: t.pdfGenerated,
            footer: t.pdfFooter,
          },
        },
        analysisData.content || t.pdfNoContent
      )

      const sourceContainer = document.createElement('div')
      sourceContainer.style.position = 'absolute'
      sourceContainer.style.left = '-9999px'
      sourceContainer.style.top = '0'
      sourceContainer.style.width = '800px'
      sourceContainer.style.backgroundColor = '#ffffff'
      sourceContainer.innerHTML = reportHtml
      document.body.appendChild(sourceContainer)

      const pagesContainer = document.createElement('div')
      pagesContainer.style.position = 'absolute'
      pagesContainer.style.left = '-9999px'
      pagesContainer.style.top = '0'
      pagesContainer.style.width = '800px'
      pagesContainer.style.backgroundColor = '#ffffff'
      document.body.appendChild(pagesContainer)

      const pageWidthPx = 800
      const pageWidthMm = 210
      const pageHeightMm = 297
      const pageHeightPx = Math.floor((pageHeightMm * pageWidthPx) / pageWidthMm)

      const createPage = () => {
        const page = document.createElement('div')
        page.style.width = `${pageWidthPx}px`
        page.style.minHeight = `${pageHeightPx}px`
        page.style.boxSizing = 'border-box'
        page.style.padding = '40px'
        page.style.backgroundColor = '#ffffff'
        page.style.color = '#172033'
        page.style.fontFamily = 'Inter, Arial, sans-serif'
        page.style.fontSize = '13px'
        page.style.lineHeight = '1.6'
        pagesContainer.appendChild(page)
        return page
      }

      const reportRoot = sourceContainer.firstElementChild as HTMLElement | null
      if (!reportRoot) {
        throw new Error('PDF report content could not be rendered')
      }

      let currentPage = createPage()
      const addBlockToPages = (block: Element) => {
        const clone = block.cloneNode(true) as HTMLElement
        currentPage.appendChild(clone)

        if (currentPage.scrollHeight > pageHeightPx && currentPage.children.length > 1) {
          currentPage.removeChild(clone)
          currentPage = createPage()
          currentPage.appendChild(clone)
        }
      }

      const reportBlocks = Array.from(reportRoot.children)
      const headerBlock = reportBlocks[0]
      const contentBlock = reportBlocks[1]
      const footerBlock = reportBlocks[2]

      if (headerBlock) addBlockToPages(headerBlock)
      if (contentBlock) {
        Array.from(contentBlock.children).forEach(addBlockToPages)
      }
      if (footerBlock) addBlockToPages(footerBlock)

      document.body.removeChild(sourceContainer)

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pages = Array.from(pagesContainer.children) as HTMLElement[]

      for (let i = 0; i < pages.length; i += 1) {
        if (i > 0) pdf.addPage()

        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          windowWidth: pageWidthPx,
        })
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidthMm, pageHeightMm)
      }

      document.body.removeChild(pagesContainer)

      // Download PDF
      pdf.save(`professional-astro-horoscope-${analysisData.analysisType}-${Date.now()}.pdf`)
      
      toast.success(t.pdfOk, { id: 'pdf-generation' })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error(t.pdfErr, { id: 'pdf-generation' })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t.shareTitle,
        text: t.shareText,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success(t.shareToast)
    }
  }

  if (isLoading || isGenerating) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950 pt-page-header-safe">
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
                  {t.paymentSuccessTitle}
                </h1>
                <p className="text-xl text-cosmic-700 dark:text-cosmic-300 mb-8">
                  {t.paymentSuccessSub}
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
                  {t.generatingTitle}
                </h3>
                <p className="text-cosmic-600 dark:text-cosmic-400">
                  {t.generatingSub}
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
    if (generationError && birthChartData) {
      const selectedAnalysisType = sessionStorage.getItem('selectedAnalysisType') || 'basic'
      const sessionId = searchParams.get('session_id') || ''

      return (
        <>
          <Header />
          <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950 pt-page-header-safe">
            <div className="container mx-auto px-4 py-12">
              <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl dark:border-red-900/50 dark:bg-cosmic-900">
                <h1 className="mb-3 text-2xl font-bold text-cosmic-900 dark:text-white">
                  {t.toastAnalysisFailed}
                </h1>
                <p className="mb-6 text-cosmic-700 dark:text-cosmic-300">
                  Данните са запазени. Опитай отново, без да попълваш формата повторно.
                </p>
                <Button
                  variant="gradient"
                  onClick={() => generateAnalysis(birthChartData, selectedAnalysisType, sessionId)}
                  disabled={!sessionId || isGenerating}
                >
                  {isGenerating ? t.generatingTitle : 'Опитай отново'}
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </>
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-cosmic-600 dark:text-cosmic-400">{t.noDataTitle}</p>
          <Button onClick={() => router.push('/birth-chart')} className="mt-4">
            {t.startOver}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950 pt-page-header-safe">
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
                  {t.readyTitle}
                </h1>
                <p className="text-xl text-cosmic-700 dark:text-cosmic-300">
                  {t.readySub}
                </p>

              </motion.div>

              {/* User Info */}
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-4 inline-block mb-8">
                <p className="text-sm text-cosmic-700 dark:text-cosmic-300">
                  <strong>{t.analysisFor}</strong> {birthChartData.userData?.name} • {new Date(birthChartData.userData?.birthDate).toLocaleDateString()} • {birthChartData.userData?.location}
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
                  {t.downloadPdf}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  onClick={handleShare}
                >
                  <ShareIcon className="w-5 h-5 mr-2" />
                  {t.shareResults}
                </Button>
              </motion.div>
            </div>

            {/* Analysis Content */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.5 }}
               className="overflow-hidden rounded-[2rem] border border-cosmic-200/70 bg-white p-3 shadow-2xl shadow-purple-950/10 dark:border-cosmic-700/50 dark:bg-white"
             >
               <div className="analysis-content max-w-none">
                 <div
                   dangerouslySetInnerHTML={{
                     __html: buildAnalysisReportHtml(
                       {
                         title: t.pdfReportTitle,
                         subtitle: t.readySub,
                         analysisType: analysisData.analysisType,
                         generatedAt: analysisData.generatedAt,
                         name: birthChartData.userData?.name,
                         birthDate: birthChartData.userData?.birthDate,
                         location: birthChartData.userData?.location,
                         labels: {
                           name: t.pdfFor,
                           analysisType: t.pdfAnalysisType,
                           birthDate: t.pdfBirthDate,
                           location: t.pdfLocation,
                           generated: t.pdfGenerated,
                           footer: t.pdfFooter,
                         },
                       },
                       analysisData.content || t.pdfNoContent
                     ),
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
                  {t.feature1Title}
                </h3>
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                  {t.feature1Body}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-6 text-center">
                <StarIcon className="w-8 h-8 text-cosmic-500 mx-auto mb-3" />
                <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  {t.feature2Title}
                </h3>
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                  {t.feature2Body}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-cosmic-800/60 backdrop-blur-sm rounded-lg p-6 text-center">
                <StarIcon className="w-8 h-8 text-cosmic-500 mx-auto mb-3" />
                <h3 className="font-semibold text-cosmic-800 dark:text-cosmic-200 mb-2">
                  {t.feature3Title}
                </h3>
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                  {t.feature3Body}
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
                {t.exploreCta}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function PaymentSuccessSuspenseFallback() {
  const locale = useSiteLocale()
  const t = paymentSuccessPage[locale]
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p>{t.loadingSuspense}</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <PaymentSuccessSuspenseFallback />
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
