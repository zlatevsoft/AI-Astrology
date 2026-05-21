import { NextResponse } from 'next/server'
import { ensurePricingDefaultsRow, getPricingSnapshot, snapshotToPublicJson } from '@/lib/pricing-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  await ensurePricingDefaultsRow()
  const snap = await getPricingSnapshot()
  return NextResponse.json(snapshotToPublicJson(snap))
}
