'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CentsPayload = {
  basicCents: number
  detailedCents: number
  comprehensiveCents: number
  compareBasicCents: number
  compareDetailedCents: number
  compareComprehensiveCents: number
}

export default function AdminPricingPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    basicEur: 19,
    detailedEur: 29,
    comprehensiveEur: 39,
    compareBasicEur: 29,
    compareDetailedEur: 39,
    compareComprehensiveEur: 49,
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/pricing', { credentials: 'include' })
      const d = (await r.json()) as { cents?: CentsPayload; error?: string }
      if (!r.ok) throw new Error(d.error || 'Failed to load pricing')
      const c = d.cents!
      setForm({
        basicEur: c.basicCents / 100,
        detailedEur: c.detailedCents / 100,
        comprehensiveEur: c.comprehensiveCents / 100,
        compareBasicEur: c.compareBasicCents / 100,
        compareDetailedEur: c.compareDetailedCents / 100,
        compareComprehensiveEur: c.compareComprehensiveCents / 100,
      })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'authenticated' && session?.user?.role === 'SUPER_ADMIN') {
      void load()
    } else {
      setLoading(false)
    }
  }, [status, session, load])

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const toCent = (n: number) => Math.round(n * 100)
    const body: CentsPayload = {
      basicCents: toCent(form.basicEur),
      detailedCents: toCent(form.detailedEur),
      comprehensiveCents: toCent(form.comprehensiveEur),
      compareBasicCents: toCent(form.compareBasicEur),
      compareDetailedCents: toCent(form.compareDetailedEur),
      compareComprehensiveCents: toCent(form.compareComprehensiveEur),
    }
    if (
      Object.values(body).some(
        (x) => typeof x !== 'number' || !Number.isFinite(x) || !Number.isInteger(x) || x < 50
      )
    ) {
      toast.error('Всяка сума трябва да е поне €0,50 и да е валидно число.')
      return
    }
    setSaving(true)
    try {
      const r = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const d = (await r.json().catch(() => ({}))) as {
        error?: string
        details?: Record<string, string[] | undefined>
      }
      if (!r.ok) {
        const extra =
          d.details && Object.keys(d.details).length
            ? ` ${JSON.stringify(d.details)}`
            : ''
        throw new Error((d.error || 'Записът се провали.') + extra)
      }
      toast.success('Pricing updated. Homepage and checkout use these amounts.')
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || (status === 'authenticated' && session?.user?.role === 'SUPER_ADMIN' && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cosmic-50 dark:bg-cosmic-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cosmic-500 border-t-transparent" />
      </div>
    )
  }

  if (status !== 'authenticated' || session?.user?.role !== 'SUPER_ADMIN') {
    return (
      <>
        <Header />
        <div className="container mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Admin access</h1>
          <p className="mt-2 text-cosmic-600 dark:text-cosmic-300">Sign in as a super admin to continue.</p>
          <Link href="/login?callbackUrl=/admin/pricing" className={cn(buttonVariants(), 'mt-6 inline-flex')}>
            Sign in
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-cosmic-50 to-white py-20 dark:from-cosmic-950 dark:to-cosmic-900">
        <div className="container mx-auto max-w-xl px-4">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cosmic-900 dark:text-white">Plan pricing (EUR)</h1>
              <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">
                Charged amounts (Stripe). Saved in Postgres; homepage, FAQ and checkout load them via `/api/pricing`.
                Dev only: set <code className="text-xs">PRICING_FORCE_CODE=1</code> to ignore the database and pin repo constants.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/affiliates" className={cn(buttonVariants({ variant: 'outline' }), 'text-sm')}>
                Affiliates
              </Link>
              <Button variant="outline" onClick={() => void signOut({ callbackUrl: '/' })}>
                Sign out
              </Button>
            </div>
          </div>

          <form onSubmit={(e) => void onSave(e)} className="space-y-6 rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-cosmic-900 dark:text-white">Amount charged at checkout</legend>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Basic Reading (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0.5}
                  required
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.basicEur}
                  onChange={(e) => setForm((f) => ({ ...f, basicEur: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Detailed Analysis (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0.5}
                  required
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.detailedEur}
                  onChange={(e) => setForm((f) => ({ ...f, detailedEur: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Comprehensive Reading (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0.5}
                  required
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.comprehensiveEur}
                  onChange={(e) => setForm((f) => ({ ...f, comprehensiveEur: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-cosmic-900 dark:text-white">Compare-at (strikethrough on cards)</legend>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Basic compare (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0.5}
                  required
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.compareBasicEur}
                  onChange={(e) => setForm((f) => ({ ...f, compareBasicEur: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Detailed compare (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0.5}
                  required
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.compareDetailedEur}
                  onChange={(e) => setForm((f) => ({ ...f, compareDetailedEur: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Comprehensive compare (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0.5}
                  required
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.compareComprehensiveEur}
                  onChange={(e) => setForm((f) => ({ ...f, compareComprehensiveEur: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </fieldset>

            <Button type="submit" disabled={saving} className="w-full bg-cosmic-600 hover:bg-cosmic-700">
              {saving ? 'Saving…' : 'Save pricing'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
