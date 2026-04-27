export type SiteLocale = 'en' | 'bg'

export function getClientLocale(): SiteLocale {
  if (typeof document === 'undefined') return 'en'
  const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)
  const v = m ? decodeURIComponent(m[1]).trim() : ''
  return v === 'bg' ? 'bg' : 'en'
}
