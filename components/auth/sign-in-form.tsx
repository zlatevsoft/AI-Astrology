'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { StaffLoginExtras } from '@/components/auth/staff-login-extras'

type Props = {
  /** e.g. "Staff login" for /login, "Sign in" for legacy */
  title?: string
  /** e.g. error=forbidden from URL */
  showForbiddenNote?: boolean
  /** Show link to /login/first-time (main staff page only) */
  showFirstTimeLink?: boolean
}

export function SignInForm({ title = 'Sign in', showForbiddenNote = true, showFirstTimeLink = true }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useSearchParams()
  const router = useRouter()
  const callbackParam = params.get('callbackUrl')
  const callbackUrl = callbackParam || '/'
  const error = params.get('error')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        username: username.trim(),
        password,
        redirect: false,
        callbackUrl,
      })
      if (res?.error) {
        toast.error('Invalid credentials or access denied.')
        return
      }
      if (res?.ok) {
        await router.refresh()
        const session = await getSession()
        let dest = callbackUrl
        if (!callbackParam || callbackUrl === '/') {
          if (session?.user?.role === 'SUPER_ADMIN') {
            dest = '/admin/affiliates'
          } else if (session?.user?.role === 'INFLUENCER') {
            dest = '/partner'
          }
        }
        router.push(dest)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-xl backdrop-blur-md">
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mb-6 text-sm text-white/80">
        Admin and influencer accounts only. If you are a customer, use the app from the home page.
      </p>
      {showForbiddenNote && error === 'forbidden' && (
        <p className="mb-4 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          You do not have access to this area.
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-4" autoComplete="on">
        <div>
          <label className="mb-1 block text-sm text-white/90">Email or username</label>
          <input
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-cosmic-300 focus:outline-none focus:ring-1 focus:ring-cosmic-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            name="username"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/90">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-cosmic-300 focus:outline-none focus:ring-1 focus:ring-cosmic-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            name="password"
            required
            minLength={8}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cosmic-500 to-purple-600 text-white"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      {showFirstTimeLink ? <StaffLoginExtras /> : null}
      <p className="mt-6 text-center text-sm text-white/60">
        <Link href="/" className="text-cosmic-200 hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  )
}
