import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'FAQ - AI Astrology',
  description: 'Frequently Asked Questions about AI Astrology services',
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h1>
            
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What is AI Astrology?</h3>
                <p className="text-white/80">
                  AI Astrology combines traditional astrological principles with advanced artificial intelligence to provide personalized cosmic insights. Our AI analyzes your birth chart data to generate detailed personality profiles, life path guidance, and relationship compatibility insights.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How accurate are the readings?</h3>
                <p className="text-white/80">
                  Our AI-powered analysis provides insights based on established astrological principles and patterns. While we strive for accuracy, results should be used for self-reflection and entertainment purposes. The quality of analysis depends on the accuracy of birth information provided.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What information do I need to provide?</h3>
                <p className="text-white/80">
                  You'll need your full name, exact birth date, birth time, and birth location. The more accurate this information is, the more precise your analysis will be. If you don't know your exact birth time, you can use 12:00 PM as a default.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What's the difference between the three plans?</h3>
                <p className="text-white/80">
                  <strong>Basic Reading ($9.99):</strong> Core personality insights and life path guidance.<br/>
                  <strong>Detailed Analysis ($19.99):</strong> Everything in Basic plus comprehensive personality profile, soul mission, and advanced insights.<br/>
                  <strong>Comprehensive Reading ($29.99):</strong> Relationship compatibility analysis for two people, including synastry and compatibility insights.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How do I get my PDF report?</h3>
                <p className="text-white/80">
                  After payment and analysis generation, you'll see a "Download PDF" button on the results page. Click it to download your personalized report. The PDF includes your complete analysis with beautiful formatting and can be saved or shared.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Is my personal data secure?</h3>
                <p className="text-white/80">
                  Yes, we take data security seriously. All data transmission is encrypted with SSL, payments are processed securely through Stripe, and we comply with GDPR and CCPA requirements. Your birth data is used only for analysis generation and is not shared with third parties.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Can I get a refund?</h3>
                <p className="text-white/80">
                  All sales are final as the service is delivered immediately upon payment. However, if you experience technical issues, please contact us at contact@zlatevsoft.com and we'll work to resolve any problems.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How long does the analysis take?</h3>
                <p className="text-white/80">
                  Analysis generation typically takes 30-60 seconds. The AI processes your birth chart data and generates a comprehensive, personalized report. You'll see a progress indicator during generation.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Can I use this for relationship advice?</h3>
                <p className="text-white/80">
                  Our Comprehensive Reading provides relationship compatibility insights, but this should not replace professional relationship counseling or therapy. Use the insights for self-reflection and understanding, not as the sole basis for relationship decisions.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What if I don't know my birth time?</h3>
                <p className="text-white/80">
                  You can use 12:00 PM (noon) as your birth time if you don't know the exact time. While this may affect the precision of house placements, the core personality analysis will still be accurate based on your birth date and location.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Is this service available worldwide?</h3>
                <p className="text-white/80">
                  Yes, our service is available globally. We support multiple currencies and payment methods through Stripe. All prices are displayed in USD, and your bank will convert to your local currency.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Can I share my analysis with others?</h3>
                <p className="text-white/80">
                  Your analysis is for personal use only. You may share the PDF report with friends or family, but you may not redistribute, sell, or use it for commercial purposes. The analysis is copyrighted and protected by our terms of service.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">How do I contact support?</h3>
                <p className="text-white/80">
                  For any questions or support, email us at contact@zlatevsoft.com. We typically respond within 24 hours during business days. Please include your order details if you're reporting an issue.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-white/60 mb-4">Still have questions?</p>
              <a 
                href="mailto:contact@zlatevsoft.com" 
                className="inline-block bg-gradient-to-r from-cosmic-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cosmic-600 hover:to-purple-700 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
