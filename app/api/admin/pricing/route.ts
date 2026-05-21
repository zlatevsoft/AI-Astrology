import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { ensurePricingDefaultsRow, getPricingSnapshot, snapshotToPublicJson } from '@/lib/pricing-settings'

const cents = z.number().int().min(50).max(9_999_999)

const PutBody = z.object({
  basicCents: cents,
  detailedCents: cents,
  comprehensiveCents: cents,
  compareBasicCents: cents,
  compareDetailedCents: cents,
  compareComprehensiveCents: cents,
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'SUPER_ADMIN' || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await ensurePricingDefaultsRow()
  const snap = await getPricingSnapshot()
  return NextResponse.json({ cents: snap, public: snapshotToPublicJson(snap) })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'SUPER_ADMIN' || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PutBody.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const d = parsed.data

  await prisma.pricingSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...d },
    update: { ...d },
  })

  const snap = await getPricingSnapshot()
  return NextResponse.json({ ok: true, cents: snap, public: snapshotToPublicJson(snap) })
}
