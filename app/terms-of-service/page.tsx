import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Terms of Service - AI Astrology',
  description: 'Terms of Service for AI Astrology - Read our terms and conditions',
}

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <div className="text-white/80 space-y-3">
                  <p>By accessing and using AI Astrology ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                <div className="text-white/80 space-y-3">
                  <p>AI Astrology provides AI-powered astrological analysis services including:</p>
                  <p>• Basic Reading: Core personality and life path analysis</p>
                  <p>• Detailed Analysis: Comprehensive personality and soul journey analysis</p>
                  <p>• Comprehensive Reading: Relationship compatibility analysis</p>
                  <p>• PDF report generation and download</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
                <div className="text-white/80 space-y-3">
                  <p>You agree to:</p>
                  <p>• Provide accurate birth information</p>
                  <p>• Use the service for personal, non-commercial purposes only</p>
                  <p>• Not attempt to reverse engineer or copy our technology</p>
                  <p>• Not use the service for any illegal or harmful purposes</p>
                  <p>• Maintain the confidentiality of your account information</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">4. Payment Terms</h2>
                <div className="text-white/80 space-y-3">
                  <p>• All prices are in USD and include applicable taxes</p>
                  <p>• Payment is processed securely through Stripe</p>
                  <p>• All sales are final - no refunds</p>
                  <p>• Prices may change with notice</p>
                  <p>• One-time payment - no recurring charges</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                <div className="text-white/80 space-y-3">
                  <p>• All content and technology are owned by Zlatev Soft</p>
                  <p>• Generated reports are for personal use only</p>
                  <p>• You may not redistribute or sell the analysis</p>
                  <p>• Trademarks and logos are protected</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimers</h2>
                <div className="text-white/80 space-y-3">
                  <p><strong>Astrological Analysis:</strong> Results are for entertainment and self-reflection purposes only. We do not guarantee accuracy or outcomes.</p>
                  <p><strong>No Medical Advice:</strong> Our service is not a substitute for professional medical, psychological, or legal advice.</p>
                  <p><strong>Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee uninterrupted service.</p>
                  <p><strong>Data Accuracy:</strong> Analysis quality depends on the accuracy of birth information provided.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                <div className="text-white/80 space-y-3">
                  <p>To the maximum extent permitted by law:</p>
                  <p>• We are not liable for any indirect, incidental, or consequential damages</p>
                  <p>• Our total liability shall not exceed the amount paid for the service</p>
                  <p>• We are not responsible for decisions made based on our analysis</p>
                  <p>• We do not guarantee specific life outcomes or predictions</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">8. Privacy and Data Protection</h2>
                <div className="text-white/80 space-y-3">
                  <p>• Your privacy is protected as outlined in our Privacy Policy</p>
                  <p>• We comply with GDPR and CCPA requirements</p>
                  <p>• Personal data is processed securely and minimally</p>
                  <p>• You have rights to access, correct, and delete your data</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
                <div className="text-white/80 space-y-3">
                  <p>We may terminate or suspend access to our service immediately, without prior notice, for any reason including:</p>
                  <p>• Violation of these terms</p>
                  <p>• Fraudulent or illegal activity</p>
                  <p>• Non-payment of fees</p>
                  <p>• Service discontinuation</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">10. Governing Law</h2>
                <div className="text-white/80 space-y-3">
                  <p>• These terms are governed by the laws of Bulgaria</p>
                  <p>• Any disputes will be resolved in Bulgarian courts</p>
                  <p>• EU consumers may have additional rights under EU law</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
                <div className="text-white/80 space-y-3">
                  <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of new terms.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
                <div className="text-white/80 space-y-3">
                  <p>For questions about these terms:</p>
                  <p><strong>Email:</strong> contact@zlatevsoft.com</p>
                  <p><strong>Response Time:</strong> We will respond within 5 business days</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
