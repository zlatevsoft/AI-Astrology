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
        toast.success('Account created. Please sign in above.')
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
    <div className="mt-8 border-t border-white/20 pt-6">
      <h2 className="mb-1 text-lg font-semibold text-amber-100">One-time: first administrator</h2>
      <p className="mb-4 text-sm text-amber-100/80">
        Only shown while no super admin exists. Enter the same <strong>SETUP_SECRET</strong> as in your server
        environment (Vercel). This block disappears after the first account is created.
      </p>
      <form onSubmit={onSubmit} className="space-y-3" autoComplete="off">
        <div>
          <label className="mb-1 block text-xs text-white/90">Setup key (SETUP_SECRET)</label>
          <input
            type="password"
            className="w-full rounded-lg border border-amber-400/30 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
            value={setupKey}
            onChange={(e) => setSetupKey(e.target.value)}
            required
            name="setupKey"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/90">Username</label>
          <input
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            name="regUsername"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/90">Password (min. 8)</label>
          <input
            type="password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            name="regPassword"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/90">Confirm password</label>
          <input
            type="password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
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
          className="w-full border border-amber-400/40 bg-amber-500/20 text-amber-50 hover:bg-amber-500/30"
        >
          {loading ? 'Creating…' : 'Create master admin'}
        </Button>
      </form>
    </div>
  )
}
