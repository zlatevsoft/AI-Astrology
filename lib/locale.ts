export type SiteLocale = 'en' | 'bg'

/** Fired after locale cookie changes (e.g. language switcher) so client sections can re-read `getClientLocale`. */
export const LOCALE_CHANGE_EVENT = 'astro:locale-change'

export function getClientLocale(): SiteLocale {
  if (typeof document === 'undefined') return 'en'
  const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)
  const v = m ? decodeURIComponent(m[1]).trim() : ''
  return v === 'bg' ? 'bg' : 'en'
}
