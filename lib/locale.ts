export type SiteLocale = 'en' | 'bg'

const LOCALE_STORAGE_KEY = 'astro_site_locale'

/** Fired after locale changes. Prefer `detail.locale` (CustomEvent) — cookie may lag by one tick after `fetch`. */
export const LOCALE_CHANGE_EVENT = 'astro:locale-change'

export type LocaleChangeDetail = { locale: SiteLocale }

/** Client-only mirror; avoids races when the HTTP cookie is not yet visible to `document.cookie` after `POST /api/locale`. */
export function setClientLocaleCache(locale: SiteLocale) {
  if (typeof document === 'undefined') return
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // ignore
  }
}

export function getClientLocale(): SiteLocale {
  if (typeof document === 'undefined') return 'en'
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'bg' || stored === 'en') return stored
  } catch {
    // ignore
  }
  const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)
  const v = m ? decodeURIComponent(m[1] ?? '').trim() : ''
  if (v === 'bg' || v === 'en') {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, v)
    } catch {
      // ignore
    }
  }
  return v === 'bg' ? 'bg' : 'en'
}
