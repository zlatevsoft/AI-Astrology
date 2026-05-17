'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

type Row = {
  id: string
  code: string
  discountPercent: number
  commissionPercent: number
  active: boolean
  validUntil: string | null
  orderCount: number
  revenueCents: number
  commissionCents: number
  influencer: { id: string; name: string | null; username: string | null; email: string | null }
}

type EditFormState = {
  name: string
  username: string
  email: string
  password: string
  code: string
  discountPercent: number
  commissionPercent: number
  active: boolean
  validUntil: string
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
  const [editRow, setEditRow] = useState<Row | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>({
    name: '',
    username: '',
    email: '',
    password: '',
    code: '',
    discountPercent: 10,
    commissionPercent: 10,
    active: true,
    validUntil: '',
  })
  const [editSaving, setEditSaving] = useState(false)

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

  const openEdit = (it: Row) => {
    setEditRow(it)
    setEditForm({
      name: it.influencer.name?.trim() || '',
      username: it.influencer.username?.trim() || '',
      email: it.influencer.email?.trim() || '',
      password: '',
      code: it.code,
      discountPercent: it.discountPercent,
      commissionPercent: it.commissionPercent,
      active: it.active,
      validUntil: toDatetimeLocalValue(it.validUntil),
    })
  }

  const onSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRow) return
    if (editForm.username.trim().length < 2) {
      toast.error('Username must be at least 2 characters.')
      return
    }
    if (editForm.password.trim().length > 0 && editForm.password.trim().length < 8) {
      toast.error('New password must be at least 8 characters or leave blank.')
      return
    }
    setEditSaving(true)
    try {
      const influencer: Record<string, unknown> = {
        name: editForm.name.trim(),
        username: editForm.username.trim(),
        email: editForm.email.trim() === '' ? '' : editForm.email.trim(),
      }
      if (editForm.password.trim().length >= 8) {
        influencer.password = editForm.password
      }
      const promo: Record<string, unknown> = {
        code: editForm.code.trim(),
        discountPercent: editForm.discountPercent,
        commissionPercent: editForm.commissionPercent,
        active: editForm.active,
        validUntil: editForm.validUntil.trim()
          ? new Date(editForm.validUntil).toISOString()
          : null,
      }
      const r = await fetch(`/api/admin/affiliates/${editRow.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ influencer, promo }),
      })
      const d = (await r.json()) as { error?: string }
      if (!r.ok) {
        toast.error(d.error || 'Update failed')
        return
      }
      toast.success('Saved')
      setEditRow(null)
      void load()
    } finally {
      setEditSaving(false)
    }
  }

  const onDeleteRow = async (it: Row) => {
    const label = it.influencer.username || it.influencer.name || 'this influencer'
    const ok = window.confirm(
      `Delete influencer "${label}" and ALL their promo codes?\n\nPaid orders stay in the database but will no longer be linked to this promo/influencer.`
    )
    if (!ok) return
    const r = await fetch(`/api/admin/affiliates/${it.id}`, { method: 'DELETE' })
    const d = (await r.json()) as { error?: string }
    if (!r.ok) {
      toast.error(d.error || 'Delete failed')
      return
    }
    toast.success('Influencer removed')
    if (editRow?.influencer.id === it.influencer.id) setEditRow(null)
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
            href="/login?callbackUrl=/admin/affiliates"
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

          <p className="mb-8 rounded-xl border border-cosmic-200 bg-cosmic-50/90 p-4 text-sm text-cosmic-800 dark:border-cosmic-600 dark:bg-cosmic-900/40 dark:text-cosmic-200">
            <strong>Staff &amp; influencers</strong> sign in at the same page:{' '}
            <Link href="/login" className="text-cosmic-600 underline hover:text-cosmic-500 dark:text-cosmic-300">
              /login
            </Link>
            . You stay here to create promo codes. Influencers are redirected to{' '}
            <code className="rounded bg-cosmic-100 px-1 dark:bg-cosmic-800">/partner</code> to see paid orders, gross, and
            commission. Only super admins can edit or delete influencers from the table below.
          </p>

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
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-cosmic-100 dark:border-cosmic-800">
                    <td className="p-3 font-mono text-cosmic-800 dark:text-cosmic-100">
                      {it.code}
                      {!it.active ? (
                        <span className="ml-2 rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-800 dark:text-amber-200">
                          inactive
                        </span>
                      ) : null}
                    </td>
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
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => openEdit(it)}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 border-red-300 text-xs text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                          onClick={() => void onDeleteRow(it)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-cosmic-500">
                      No codes yet. Create the first one above, or set DATABASE_URL and bootstrap an admin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {editRow ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="presentation"
          onClick={() => !editSaving && setEditRow(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-cosmic-200 bg-white p-6 shadow-2xl dark:border-cosmic-600 dark:bg-cosmic-900"
            role="dialog"
            aria-labelledby="edit-affiliate-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="edit-affiliate-title" className="text-lg font-semibold text-cosmic-900 dark:text-white">
              Edit influencer &amp; promo
            </h2>
            <p className="mt-1 text-xs text-cosmic-600 dark:text-cosmic-400">
              Promo row ID <span className="font-mono">{editRow.id.slice(0, 12)}…</span> — deleting always removes the whole
              influencer account (see Delete in the table).
            </p>
            <form onSubmit={(e) => void onSaveEdit(e)} className="mt-4 grid gap-3">
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Display name</label>
                <input
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  minLength={1}
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Username (login)</label>
                <input
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={editForm.username}
                  onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Email (optional)</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Empty = none"
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">New password (optional)</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={editForm.password}
                  onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Leave blank to keep current"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Promo code</label>
                <input
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 font-mono dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={editForm.code}
                  onChange={(e) => setEditForm((f) => ({ ...f, code: e.target.value }))}
                  required
                  minLength={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Discount %</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                    value={editForm.discountPercent}
                    onChange={(e) => setEditForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Commission %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                    value={editForm.commissionPercent}
                    onChange={(e) => setEditForm((f) => ({ ...f, commissionPercent: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-cosmic-800 dark:text-cosmic-200">
                <input
                  type="checkbox"
                  checked={editForm.active}
                  onChange={(e) => setEditForm((f) => ({ ...f, active: e.target.checked }))}
                  className="rounded border-cosmic-300"
                />
                Promo code active (inactive codes do not apply at checkout)
              </label>
              <div>
                <label className="text-xs text-cosmic-600 dark:text-cosmic-400">Valid until (optional)</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded border border-cosmic-200 px-3 py-2 dark:border-cosmic-600 dark:bg-cosmic-800"
                  value={editForm.validUntil}
                  onChange={(e) => setEditForm((f) => ({ ...f, validUntil: e.target.value }))}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button type="submit" disabled={editSaving} className="bg-cosmic-600 hover:bg-cosmic-700">
                  {editSaving ? 'Saving…' : 'Save changes'}
                </Button>
                <Button type="button" variant="outline" disabled={editSaving} onClick={() => setEditRow(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <Footer />
    </>
  )
}
