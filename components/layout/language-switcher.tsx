'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { SiteLocale } from '@/lib/locale'

type Props = {
  value: SiteLocale
  onChange: (next: SiteLocale) => void | Promise<void>
}

export function LanguageSwitcher({ value, onChange }: Props) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const select = useCallback(
    async (next: SiteLocale) => {
      if (next === value) return
      setPending(true)
      try {
        await onChange(next)
        router.refresh()
      } finally {
        setPending(false)
      }
    },
    [value, onChange, router]
  )

  return (
    <div
      className="flex items-center rounded-lg border border-cosmic-200/80 bg-white/60 p-0.5 text-xs font-semibold dark:border-cosmic-600 dark:bg-slate-800/80"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        disabled={pending}
        onClick={() => void select('en')}
        className={`rounded-md px-2 py-1 transition-colors ${
          value === 'en'
            ? 'bg-cosmic-500 text-white shadow'
            : 'text-cosmic-700 hover:bg-cosmic-100 dark:text-white/90 dark:hover:bg-white/10'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => void select('bg')}
        className={`rounded-md px-2 py-1 transition-colors ${
          value === 'bg'
            ? 'bg-cosmic-500 text-white shadow'
            : 'text-cosmic-700 hover:bg-cosmic-100 dark:text-white/90 dark:hover:bg-white/10'
        }`}
      >
        BG
      </button>
    </div>
  )
}
