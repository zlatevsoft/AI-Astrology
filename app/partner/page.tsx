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
  codes: {
    code: string
    discountPercent: number
    commissionPercent: number
    active: boolean
    validUntil: string | null
  }[]
  recentOrders: {
    id: string
    amountTotal: number
    commissionAmount: number
    currency: string
    productName: string | null
    customerEmail: string | null
    createdAt: string
    promoCode: { code: string } | null
  }[]
}

function money(cents: number, currency = 'eur') {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
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
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-cosmic-900 dark:text-white">Your stats</h1>
            <Button variant="outline" onClick={() => void signOut({ callbackUrl: '/' })}>
              Sign out
            </Button>
          </div>
          {err && <p className="mb-4 text-red-600">{err}</p>}
          {stats && (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
                  <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Paid orders</p>
                  <p className="text-2xl font-bold text-cosmic-900 dark:text-white">{stats.orderCount}</p>
                </div>
                <div className="rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
                  <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Gross sales (your codes)</p>
                  <p className="text-2xl font-bold text-cosmic-900 dark:text-white">
                    {money(stats.totalPaidCents, stats.currency)}
                  </p>
                </div>
                <div className="rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
                  <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Your commission</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {money(stats.yourCommissionCents, stats.currency)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
                <h2 className="mb-4 text-xl font-semibold text-cosmic-900 dark:text-white">Your promo codes</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {stats.codes.map((c) => (
                    <div key={c.code} className="rounded-xl border border-cosmic-100 p-4 dark:border-cosmic-700">
                      <p className="font-mono text-lg font-bold text-cosmic-900 dark:text-white">{c.code}</p>
                      <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">
                        Client discount: {c.discountPercent}% · Your commission: {c.commissionPercent}%
                      </p>
                      <p className="mt-1 text-xs text-cosmic-500">
                        Status: {c.active ? 'active' : 'inactive'}
                        {c.validUntil ? ` · valid until ${new Date(c.validUntil).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  ))}
                  {stats.codes.length === 0 && (
                    <p className="text-sm text-cosmic-500">No promo codes assigned yet.</p>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-cosmic-200 bg-white shadow dark:border-cosmic-700 dark:bg-cosmic-900">
                <div className="border-b border-cosmic-200 p-6 dark:border-cosmic-700">
                  <h2 className="text-xl font-semibold text-cosmic-900 dark:text-white">Recent paid orders</h2>
                </div>
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-cosmic-200 dark:border-cosmic-700">
                      <th className="p-3 font-semibold">Date</th>
                      <th className="p-3 font-semibold">Code</th>
                      <th className="p-3 font-semibold">Product</th>
                      <th className="p-3 font-semibold">Sale</th>
                      <th className="p-3 font-semibold">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o) => (
                      <tr key={o.id} className="border-b border-cosmic-100 dark:border-cosmic-800">
                        <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-mono">{o.promoCode?.code || '-'}</td>
                        <td className="p-3">{o.productName || 'Astrology reading'}</td>
                        <td className="p-3">{money(o.amountTotal, o.currency)}</td>
                        <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                          {money(o.commissionAmount, o.currency)}
                        </td>
                      </tr>
                    ))}
                    {stats.recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-cosmic-500">
                          No paid orders yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
