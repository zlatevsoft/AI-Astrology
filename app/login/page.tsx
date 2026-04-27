import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SignInForm } from '@/components/auth/sign-in-form'
import { getAllowFirstAdminSetup } from '@/lib/admin-setup'

export const metadata: Metadata = {
  title: 'Staff login',
  robots: { index: false, follow: false },
}

function LoginFormShell({ allowFirstAdminSetup }: { allowFirstAdminSetup: boolean }) {
  return <SignInForm title="Staff login" allowFirstAdminSetup={allowFirstAdminSetup} />
}

export default async function LoginPage() {
  const allowFirstAdminSetup = await getAllowFirstAdminSetup()
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
          <LoginFormShell allowFirstAdminSetup={allowFirstAdminSetup} />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
