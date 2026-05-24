import { cookies, headers } from 'next/headers'
import type { SiteLocale } from '@/lib/locale'

/**
 * Locale for SSR (matches middleware when `NEXT_LOCALE` cookie is not set yet).
 */
export function getServerPreferredLocale(): SiteLocale {
  const c = cookies().get('NEXT_LOCALE')?.value
  if (c === 'bg' || c === 'en') return c
  const h = headers()
  const al = (h.get('accept-language') || '').toLowerCase()
  const country = h.get('x-vercel-ip-country') || ''
  if (al.startsWith('bg') || country === 'BG') return 'bg'
  return 'en'
}
