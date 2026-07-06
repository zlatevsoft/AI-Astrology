import { NextResponse } from 'next/server'
import { getSiteRuntimeSettings } from '@/lib/pricing-settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Runtime flags so client UI can react without NEXT_PUBLIC rebuild quirks. */
export async function GET() {
  const settings = await getSiteRuntimeSettings()
  return NextResponse.json(
    {
      freeCheckout: settings.freeCheckoutEnabled,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  )
}
