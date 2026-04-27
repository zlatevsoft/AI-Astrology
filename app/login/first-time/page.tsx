import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { FirstAdminSignup } from '@/components/auth/first-admin-signup'
import { getFirstAdminSetupState, type FirstAdminBlockReason } from '@/lib/admin-setup'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'First-time administrator',
  robots: { index: false, follow: false },
}

function blockMessage(r: FirstAdminBlockReason) {
  const m: Record<FirstAdminBlockReason, { title: string; body: string }> = {
    no_setup_secret: {
      title: 'Setup key not configured',
      body: 'Add the environment variable SETUP_SECRET in Vercel (a long random string), then redeploy. It must match the key you will enter on this form — not the Stripe key and not NEXTAUTH_SECRET.',
    },
    no_database_url: {
      title: 'Database not connected',
      body: 'Set DATABASE_URL in your hosting environment to your PostgreSQL connection string, then redeploy.',
    },
    form_disabled: {
      title: 'This flow is turned off',
      body: 'ALLOW_FIRST_ADMIN_FORM is set to 0. Remove it or set it to 1, redeploy, or use the standard admin APIs.',
    },
    super_admin_exists: {
      title: 'Administrator already exists',
      body: 'Sign in on the main staff login page. This one-time form is no longer available.',
    },
    database_error: {
      title: 'Could not reach the database',
      body: 'Check DATABASE_URL, network access to Postgres, and Vercel logs. Fix the connection and try again.',
    },
  }
  return m[r]
}

export default async function FirstTimeAdminPage() {
  const state = await getFirstAdminSetupState()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 px-4 py-16">
        <div className="mx-auto max-w-lg">
          <Link
            href="/login"
            className="mb-6 inline-block text-sm text-indigo-200/90 underline-offset-2 hover:underline"
          >
            ← Back to sign in
          </Link>

          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-md">
            <h1 className="text-2xl font-bold text-white">First-time super administrator</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Use this page once to create the first <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">SUPER_ADMIN</code>{' '}
              account. You need the same <strong>SETUP_SECRET</strong> value as in your server environment.
            </p>

            {state.ok ? (
              <FirstAdminSignup />
            ) : (
              <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
                <h2 className="font-semibold text-amber-100">{blockMessage(state.reason).title}</h2>
                <p className="mt-2 text-sm text-amber-100/90">{blockMessage(state.reason).body}</p>
                {state.reason === 'super_admin_exists' && (
                  <Link
                    href="/login"
                    className="mt-4 inline-block rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
                  >
                    Go to sign in
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
