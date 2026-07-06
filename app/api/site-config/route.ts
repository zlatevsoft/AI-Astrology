import { NextResponse } from 'next/server'
import { getSiteRuntimeSettings } from '@/lib/pricing-settings'

/** Runtime flags so client UI can react without NEXT_PUBLIC rebuild quirks. */
export async function GET() {
  const settings = await getSiteRuntimeSettings()
  return NextResponse.json({
    freeCheckout: settings.freeCheckoutEnabled,
  })
}
