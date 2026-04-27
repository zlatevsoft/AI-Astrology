'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Stats = {
  orderCount: number
  totalPaidCents: number
  yourCommissionCents: number
  currency: string
}

export default function PartnerPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (status !== 'authenticated' || session?.user?.role !== 'INFLUENCER') return
    void (async () => {
      const r = await fetch('/api/partner/stats')
      const d = await r.json()
      if (!r.ok) {
        setErr((d as { error?: string }).error || 'Failed to load')
        return
      }
      setStats(d as Stats)
    })()
  }, [status, session])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cosmic-500 border-t-transparent" />
      </div>
    )
  }

  if (status !== 'authenticated' || session?.user?.role !== 'INFLUENCER') {
    return (
      <>
        <Header />
        <div className="container mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Partner dashboard</h1>
          <p className="mt-2 text-cosmic-600 dark:text-cosmic-300">Sign in with your influencer account.</p>
          <Link
            href="/login?callbackUrl=/partner"
            className={cn(buttonVariants(), 'mt-6 inline-flex')}
          >
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
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-cosmic-900 dark:text-white">Your stats</h1>
            <Button variant="outline" onClick={() => void signOut({ callbackUrl: '/' })}>
              Sign out
            </Button>
          </div>
          {err && <p className="mb-4 text-red-600">{err}</p>}
          {stats && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Paid orders</p>
                <p className="text-2xl font-bold text-cosmic-900 dark:text-white">{stats.orderCount}</p>
              </div>
              <div className="rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Gross (your codes)</p>
                <p className="text-2xl font-bold text-cosmic-900 dark:text-white">
                  €{(stats.totalPaidCents / 100).toFixed(2)}
                </p>
              </div>
              <div className="rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Your commission</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  €{(stats.yourCommissionCents / 100).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
