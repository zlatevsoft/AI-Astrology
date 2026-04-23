import { NextResponse } from 'next/server'
import { isFreeCheckoutEnabled } from '@/lib/pricing'

/** Runtime flag so client UI can show test mode with only FREE_CHECKOUT (no NEXT_PUBLIC rebuild quirks). */
export function GET() {
  return NextResponse.json({
    freeCheckout: isFreeCheckoutEnabled(),
  })
}
