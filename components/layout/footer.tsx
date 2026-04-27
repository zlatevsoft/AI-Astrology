'use client'

import { useMemo } from 'react'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { siteNav, footerLocale } from '@/lib/dictionaries'
import { getPlanRowsForLocale } from '@/lib/plan-locale'
import { useSiteLocale } from '@/lib/use-site-locale'

const socialLinks = [
  { name: 'Facebook', href: '#', icon: '📘' },
  { name: 'Twitter', href: '#', icon: '🐦' },
  { name: 'Instagram', href: '#', icon: '📷' },
  { name: 'YouTube', href: '#', icon: '📺' },
]

export function Footer() {
  const locale = useSiteLocale()
  const t = siteNav[locale]
  const f = footerLocale[locale]

  const planLinks = useMemo(() => {
    const rows = getPlanRowsForLocale(locale)
    return [
      ...rows.map((p) => ({ name: p.name, href: '/pricing' })),
      { name: t.features, href: '/#features' },
    ]
  }, [locale, t.features])

  const supportLinks = useMemo(
    () => [
      { name: f.faq, href: '/faq' },
      { name: f.privacy, href: '/privacy-policy' },
      { name: f.terms, href: '/terms-of-service' },
      { name: f.contact, href: 'mailto:contact@zlatevsoft.com' },
    ],
    [f]
  )

  return (
    <footer className="bg-cosmic-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cosmic-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <span className="text-2xl font-bold">AstroHoroscope.online</span>
            </div>
            <p className="text-cosmic-300 mb-6 max-w-md">{f.tagline}</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-cosmic-400" />
                <span className="text-cosmic-300">contact@zlatevsoft.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{f.plansHeading}</h3>
            <ul className="space-y-3">
              {planLinks.map((item) => (
                <li key={`${item.name}-${item.href}`}>
                  <a href={item.href} className="text-cosmic-300 hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{f.importantHeading}</h3>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-cosmic-300 hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cosmic-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-cosmic-400">{f.rights}</span>
              <div className="flex items-center space-x-2">
                <LockClosedIcon className="w-4 h-4 text-cosmic-400" />
                <span className="text-cosmic-400 text-sm">{f.ssl}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-cosmic-800 hover:bg-cosmic-700 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
