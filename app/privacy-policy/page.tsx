import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Astrology',
  description: 'Privacy Policy for AI Astrology - Learn how we protect your personal data',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <div className="text-white/80 space-y-3">
                  <p><strong>Personal Information:</strong> We collect your name, birth date, birth time, and location to generate your astrological analysis.</p>
                  <p><strong>Payment Information:</strong> Payment processing is handled securely by Stripe. We do not store your payment details.</p>
                  <p><strong>Usage Data:</strong> We collect information about how you use our service to improve user experience.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <div className="text-white/80 space-y-3">
                  <p>• Generate personalized astrological analysis</p>
                  <p>• Process payments and provide customer support</p>
                  <p>• Improve our services and user experience</p>
                  <p>• Comply with legal obligations</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">3. Data Protection Rights (GDPR)</h2>
                <div className="text-white/80 space-y-3">
                  <p>Under GDPR, you have the right to:</p>
                  <p>• <strong>Access:</strong> Request a copy of your personal data</p>
                  <p>• <strong>Rectification:</strong> Correct inaccurate personal data</p>
                  <p>• <strong>Erasure:</strong> Request deletion of your personal data</p>
                  <p>• <strong>Portability:</strong> Receive your data in a structured format</p>
                  <p>• <strong>Objection:</strong> Object to processing of your data</p>
                  <p>• <strong>Restriction:</strong> Limit how we process your data</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                <div className="text-white/80 space-y-3">
                  <p>We implement appropriate security measures to protect your personal data:</p>
                  <p>• SSL encryption for all data transmission</p>
                  <p>• Secure payment processing through Stripe</p>
                  <p>• Regular security assessments</p>
                  <p>• Limited access to personal data</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
                <div className="text-white/80 space-y-3">
                  <p>We retain your personal data only as long as necessary:</p>
                  <p>• Birth chart data: Not stored permanently (session only)</p>
                  <p>• Payment records: As required by law (typically 7 years)</p>
                  <p>• Usage data: 2 years for analytics purposes</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">6. Third-Party Services</h2>
                <div className="text-white/80 space-y-3">
                  <p><strong>Stripe:</strong> Payment processing (see Stripe's Privacy Policy)</p>
                  <p><strong>OpenAI:</strong> AI analysis generation (see OpenAI's Privacy Policy)</p>
                  <p><strong>Vercel:</strong> Hosting and analytics (see Vercel's Privacy Policy)</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">7. California Privacy Rights (CCPA)</h2>
                <div className="text-white/80 space-y-3">
                  <p>California residents have additional rights:</p>
                  <p>• Right to know what personal information is collected</p>
                  <p>• Right to know whether personal information is sold or disclosed</p>
                  <p>• Right to say no to the sale of personal information</p>
                  <p>• Right to access your personal information</p>
                  <p>• Right to equal service and price</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                <div className="text-white/80 space-y-3">
                  <p>For privacy-related questions or to exercise your rights:</p>
                  <p><strong>Email:</strong> contact@zlatevsoft.com</p>
                  <p><strong>Response Time:</strong> We will respond within 30 days</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
                <div className="text-white/80 space-y-3">
                  <p>We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
                  <p>• Posting the new Privacy Policy on this page</p>
                  <p>• Updating the "Last updated" date</p>
                  <p>• Sending you an email notification for significant changes</p>
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
