'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Row = {
  id: string
  code: string
  discountPercent: number
  commissionPercent: number
  active: boolean
  orderCount: number
  revenueCents: number
  commissionCents: number
  influencer: { id: string; name: string | null; username: string | null; email: string | null }
}

export default function AdminAffiliatesPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    code: '',
    discountPercent: 10,
    commissionPercent: 10,
    validUntil: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/affiliates')
      const d = (await r.json()) as { items?: Row[]; error?: string }
      if (!r.ok) {
        throw new Error(d.error || 'Failed to load')
      }
      setItems(d.items || [])
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

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const body: Record<string, unknown> = {
      name: form.name.trim(),
      username: form.username.trim(),
      password: form.password,
      code: form.code.trim(),
      discountPercent: form.discountPercent,
      commissionPercent: form.commissionPercent,
    }
    if (form.validUntil) {
      const d = new Date(form.validUntil)
      if (!Number.isNaN(d.getTime())) {
        body.validUntil = d.toISOString()
      }
    }
    const r = await fetch('/api/admin/affiliates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const d = await r.json()
    if (!r.ok) {
      toast.error((d as { error?: string }).error || 'Create failed')
      return
    }
    toast.success('Influencer and promo code created')
    setForm({
      name: '',
      username: '',
      password: '',
      code: '',
      discountPercent: 10,
      commissionPercent: 10,
      validUntil: '',
    })
    void load()
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
          <Link
            href="/auth/signin?callbackUrl=/admin/affiliates"
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
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-cosmic-900 dark:text-white">Affiliates & promo codes</h1>
            <Button variant="outline" onClick={() => void signOut({ callbackUrl: '/' })}>
              Sign out
            </Button>
          </div>

          <div className="mb-10 rounded-2xl border border-cosmic-200 bg-white p-6 shadow dark:border-cosmic-700 dark:bg-cosmic-900">
            <h2 className="mb-4 text-lg font-semibold text-cosmic-800 dark:text-white">Add influencer + code</h2>
            <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Display name</label>
                <input
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Username (login)</label>
                <input
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Promo code (unique)</label>
                <input
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Discount %</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.discountPercent}
                  onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Commission % of order (after discount)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.commissionPercent}
                  onChange={(e) => setForm((f) => ({ ...f, commissionPercent: Number(e.target.value) }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Valid until (optional, local time)</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={form.validUntil}
                  onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="bg-cosmic-600 hover:bg-cosmic-700">
                  Create
                </Button>
              </div>
            </form>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-cosmic-200 bg-white dark:border-cosmic-700 dark:bg-cosmic-900">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cosmic-200 dark:border-cosmic-700">
                  <th className="p-3 font-semibold">Code</th>
                  <th className="p-3 font-semibold">Influencer</th>
                  <th className="p-3 font-semibold">Disc. %</th>
                  <th className="p-3 font-semibold">Comm. %</th>
                  <th className="p-3 font-semibold">Orders</th>
                  <th className="p-3 font-semibold">Revenue</th>
                  <th className="p-3 font-semibold">Comm. owed</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-cosmic-100 dark:border-cosmic-800">
                    <td className="p-3 font-mono text-cosmic-800 dark:text-cosmic-100">{it.code}</td>
                    <td className="p-3">
                      {it.influencer.name || it.influencer.username}
                      {it.influencer.email ? (
                        <span className="block text-xs text-cosmic-500">{it.influencer.email}</span>
                      ) : null}
                    </td>
                    <td className="p-3">{it.discountPercent}</td>
                    <td className="p-3">{it.commissionPercent}</td>
                    <td className="p-3">{it.orderCount}</td>
                    <td className="p-3">€{(it.revenueCents / 100).toFixed(2)}</td>
                    <td className="p-3">€{(it.commissionCents / 100).toFixed(2)}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-cosmic-500">
                      No codes yet. Create the first one above, or set DATABASE_URL and bootstrap an admin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
