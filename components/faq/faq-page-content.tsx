'use client'

import { useEffect, useState } from 'react'
import { faqPage, getFaqItems } from '@/lib/faq-locale'
import { getClientLocale, LOCALE_CHANGE_EVENT, type SiteLocale } from '@/lib/locale'

export function FAQPageContent() {
  const [locale, setLocale] = useState<SiteLocale>('en')
  useEffect(() => {
    setLocale(getClientLocale())
    const sync = () => setLocale(getClientLocale())
    window.addEventListener(LOCALE_CHANGE_EVENT, sync)
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, sync)
  }, [])

  const t = faqPage[locale]
  const items = getFaqItems(locale)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">{t.title}</h1>

          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-3">{item.q}</h2>
                <p
                  className="text-white/80 leading-relaxed [&_strong]:text-white"
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/60 mb-4">{t.still}</p>
            <a
              href="mailto:contact@zlatevsoft.com"
              className="inline-block bg-gradient-to-r from-cosmic-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cosmic-600 hover:to-purple-700 transition-all duration-300"
            >
              {t.contact}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
