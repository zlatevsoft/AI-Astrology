'use client'

import { useState, useLayoutEffect } from 'react'
import { getClientLocale, LOCALE_CHANGE_EVENT, type SiteLocale } from '@/lib/locale'

/**
 * One source of truth for on-page locale (cookie + localStorage, syncs on language switch).
 */
export function useSiteLocale(): SiteLocale {
  const [locale, setLocale] = useState<SiteLocale>('en')

  useLayoutEffect(() => {
    setLocale(getClientLocale())

    const onChange = (e: Event) => {
      const d = (e as CustomEvent<{ locale?: SiteLocale }>).detail
      if (d?.locale === 'bg' || d?.locale === 'en') {
        setLocale(d.locale)
        return
      }
      setLocale(getClientLocale())
    }

    window.addEventListener(LOCALE_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, onChange)
  }, [])

  return locale
}
