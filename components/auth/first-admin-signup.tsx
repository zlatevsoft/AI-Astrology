'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export function FirstAdminSignup() {
  const router = useRouter()
  const [setupKey, setSetupKey] = useState('')
  const [username, setUsername] = useState('zlatevsoft')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const r = await fetch('/api/admin/register-first-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupKey, username: username.trim(), password, name: username.trim() }),
      })
      const d = (await r.json().catch(() => ({}))) as { error?: string; ok?: boolean }
      if (r.status === 401) {
        toast.error('Invalid setup key.')
        return
      }
      if (r.status === 409) {
        toast.error(d.error || 'Account already exists or server already configured.')
        return
      }
      if (!r.ok || !d?.ok) {
        toast.error(d.error || 'Could not create account. Try again.')
        return
      }
      toast.success('Account created. Signing you in…')
      const res = await signIn('credentials', {
        username: username.trim(),
        password,
        redirect: false,
        callbackUrl: '/admin/affiliates',
      })
      if (res?.error) {
        toast.success('Account created. Please sign in on /login.')
        return
      }
      if (res?.ok) {
        await router.refresh()
        await getSession()
        router.push('/admin/affiliates')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-white/70">
        All fields are required. The setup key is checked on the server and is not stored in the browser.
      </p>
      <form onSubmit={onSubmit} className="space-y-3" autoComplete="off">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/80">
            Setup key (same as SETUP_SECRET in Vercel)
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-amber-400/30 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            value={setupKey}
            onChange={(e) => setSetupKey(e.target.value)}
            required
            name="setupKey"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/80">Username</label>
          <input
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            name="regUsername"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/80">
            Password (min. 8 characters)
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            name="regPassword"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/80">
            Confirm password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            name="regConfirm"
            autoComplete="new-password"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 w-full border border-amber-400/50 bg-gradient-to-r from-amber-500/90 to-amber-600/90 py-6 text-base font-semibold text-white shadow-lg hover:from-amber-500 hover:to-amber-600"
        >
          {loading ? 'Creating…' : 'Create super administrator'}
        </Button>
      </form>
    </div>
  )
}
