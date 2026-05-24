'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { SiteLocaleProvider } from '@/components/site-locale-provider'
import type { SiteLocale } from '@/lib/locale'

interface ProvidersProps {
  children: ReactNode
  /** Must match server `html` lang + middleware cookie logic (see `getServerPreferredLocale`). */
  initialLocale: SiteLocale
}

export function Providers({ children, initialLocale }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SiteLocaleProvider initialLocale={initialLocale}>{children}</SiteLocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
