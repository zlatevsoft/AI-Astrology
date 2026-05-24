'use client'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getClientLocale, LOCALE_CHANGE_EVENT, type SiteLocale } from '@/lib/locale'

type SiteLocaleContextValue = {
  locale: SiteLocale
}

const SiteLocaleContext = createContext<SiteLocaleContextValue | null>(null)

export function SiteLocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: SiteLocale
  children: ReactNode
}) {
  const [locale, setLocale] = useState<SiteLocale>(initialLocale)

  useLayoutEffect(() => {
    const sync = () => setLocale(getClientLocale())
    sync()
    window.addEventListener(LOCALE_CHANGE_EVENT, sync)
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, sync)
  }, [])

  const value = useMemo(() => ({ locale }), [locale])

  return <SiteLocaleContext.Provider value={value}>{children}</SiteLocaleContext.Provider>
}

export function useSiteLocaleFromContext(): SiteLocale {
  const ctx = useContext(SiteLocaleContext)
  if (!ctx) {
    throw new Error('Missing SiteLocaleProvider')
  }
  return ctx.locale
}
