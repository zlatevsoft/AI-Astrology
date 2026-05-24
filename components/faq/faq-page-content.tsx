'use client'

import { useEffect, useState } from 'react'
import { faqPage, getFaqItems } from '@/lib/faq-locale'
import type { PublicPricingPayload } from '@/lib/public-pricing'
import { useSiteLocale } from '@/lib/use-site-locale'

export function FAQPageContent() {
  const locale = useSiteLocale()
  const t = faqPage[locale]
  const [items, setItems] = useState(() => getFaqItems(locale))

  useEffect(() => {
    let cancelled = false
    setItems(getFaqItems(locale))
    fetch('/api/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((p: PublicPricingPayload | null) => {
        if (!cancelled && p?.listEur) setItems(getFaqItems(locale, p.listEur))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [locale])

  return (
    <main className="relative min-h-screen overflow-hidden pt-page-header-safe pb-20">
      {/* Deep cosmic gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-[#10081e] to-slate-950" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_70%_-20%,rgba(139,92,246,0.42),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_15%_40%,rgba(244,114,182,0.22),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(30,58,138,0.35),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/40 via-transparent to-black/35" />

      <div className="container relative z-10 mx-auto max-w-4xl px-4">
        <div className="rounded-3xl border border-white/[0.18] bg-slate-900/55 p-6 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-10">
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-white drop-shadow-md md:text-5xl">
            {t.title}
          </h1>
          <p className="mb-12 text-center text-base text-purple-100/85 md:text-lg">{t.intro}</p>

          <div className="flex flex-col gap-5">
            {items.map((item, i) => (
              <section
                key={i}
                className="group rounded-2xl border border-white/[0.16] bg-slate-950/40 p-5 shadow-inner shadow-black/20 transition-colors hover:border-fuchsia-400/35 hover:bg-slate-900/55 md:p-6"
              >
                <h2 className="mb-3 text-lg font-semibold leading-snug text-white md:text-xl">{item.q}</h2>
                  <div
                  className={`faq-rich-text text-[0.965rem] leading-relaxed text-slate-50 md:text-base [&_br]:leading-normal [&_a]:underline [&_a]:decoration-purple-300 [&_a]:underline-offset-2 [&_a]:hover:text-white [&_strong]:font-semibold`}
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-white/10 bg-purple-950/35 px-6 py-8 text-center backdrop-blur-sm">
            <p className="mb-5 text-purple-50/95">{t.still}</p>
            <a
              href="mailto:contact@zlatevsoft.com"
              className="inline-block rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-10 py-3.5 font-semibold text-white shadow-lg shadow-purple-900/45 transition hover:from-fuchsia-400 hover:to-indigo-400"
            >
              {t.contact}
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
