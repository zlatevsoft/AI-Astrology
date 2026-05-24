'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { privacyByLocale, termsByLocale } from '@/lib/legal-locale'
import { useSiteLocale } from '@/lib/use-site-locale'

import { LegalBlocks } from './legal-blocks'

type Doc = 'privacy' | 'terms'

export function LegalDocument({ doc }: { doc: Doc }) {
  const locale = useSiteLocale()
  const data = doc === 'privacy' ? privacyByLocale[locale] : termsByLocale[locale]
  const dateStr = new Date().toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pt-page-header-safe pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8">{data.h1}</h1>
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                <strong>{data.lastUpdated}</strong> {dateStr}
              </p>
              {data.sections.map((section, index) => (
                <section key={index} className="mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">{section.heading}</h2>
                  <LegalBlocks lines={section.blocks} />
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
