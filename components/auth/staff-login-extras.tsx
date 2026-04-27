'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useSiteLocale } from '@/lib/use-site-locale'

const copy = {
  en: {
    line: 'Need to create the first super administrator account (one-time)?',
    cta: 'Open first-time setup',
  },
  bg: {
    line: 'Трябва ли ти еднократно да създадеш първия супер администратор?',
    cta: 'Отвори първоначална настройка',
  },
} as const

/**
 * Always visible on /login so staff never “hunt” for the flow.
 */
export function StaffLoginExtras() {
  const locale = useSiteLocale()
  const t = copy[locale] ?? copy.en
  return (
    <div className="mt-8 rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-center">
      <p className="text-sm text-indigo-100/95">{t.line}</p>
      <Link
        href="/login/first-time"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline decoration-indigo-300/80 underline-offset-4 transition hover:decoration-white"
      >
        {t.cta}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  )
}
