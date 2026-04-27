'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

function SignInForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useSearchParams()
  const router = useRouter()
  const callbackUrl = params.get('callbackUrl') || '/'
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
        router.push(callbackUrl)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-xl backdrop-blur-md">
      <h1 className="mb-2 text-2xl font-bold">Sign in</h1>
      <p className="mb-6 text-sm text-white/80">
        Admin and influencer accounts only. If you are a customer, use the app from the home page.
      </p>
      {error === 'forbidden' && (
        <p className="mb-4 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          You do not have access to this area.
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-white/90">Email or username</label>
          <input
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-cosmic-300 focus:outline-none focus:ring-1 focus:ring-cosmic-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
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
            required
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
      <p className="mt-6 text-center text-sm text-white/60">
        <Link href="/" className="text-cosmic-200 hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  )
}

export default function SignInPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 py-24">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-md animate-pulse rounded-2xl bg-white/5 p-8 text-center text-white/60">
              Loading…
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
