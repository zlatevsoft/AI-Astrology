import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  ensurePricingDefaultsRow,
  getPricingSnapshot,
  getSiteRuntimeSettings,
  snapshotToPublicJson,
} from '@/lib/pricing-settings'
import { isDatabaseConfigured } from '@/lib/database-url'

/** Coerce from JSON numbers or numeric strings so validation never fails silently in production. */
const centsField = z.coerce.number().int().min(50).max(9_999_999)

const PutBody = z.object({
  basicCents: centsField,
  detailedCents: centsField,
  comprehensiveCents: centsField,
  compareBasicCents: centsField,
  compareDetailedCents: centsField,
  compareComprehensiveCents: centsField,
  freeCheckoutEnabled: z.boolean().optional().default(false),
})

async function requireSuperAdmin(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: 'Базата не е конфигурирана (задайте DATABASE_URL или POSTGRES_PRISMA_URL на хостинг).' },
        { status: 503 }
      ),
    }
  }
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    return { ok: false as const, response: NextResponse.json({ error: 'NEXTAUTH_SECRET не е зададен' }, { status: 503 }) }
  }
  const token = await getToken({ req: request, secret })
  const role = token?.role as string | undefined
  if (!token || role !== 'SUPER_ADMIN') {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Нямате достъп. Влезте отново като главен админ.' }, { status: 401 }),
    }
  }
  return { ok: true as const }
}

export async function GET(request: NextRequest) {
  const gate = await requireSuperAdmin(request)
  if (!gate.ok) return gate.response

  await ensurePricingDefaultsRow()
  const snap = await getPricingSnapshot()
  const settings = await getSiteRuntimeSettings()
  return NextResponse.json({ cents: snap, public: snapshotToPublicJson(snap), settings })
}

export async function PUT(request: NextRequest) {
  const gate = await requireSuperAdmin(request)
  if (!gate.ok) return gate.response

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалидно JSON тяло' }, { status: 400 })
  }

  const parsed = PutBody.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Има невалидни суми. Всяка положителна стойност трябва да е поне €0,50.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const d = parsed.data

  try {
    await prisma.pricingSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...d },
      update: { ...d },
    })
  } catch (e) {
    console.error('admin/pricing PUT:', e)
    const msg =
      e instanceof Error && e.message
        ? `Базата отхвърли записа (${e.message}). Изпълнете prisma db push върху production DB.`
        : 'Неуспешен запис в базата. Провери Prisma/table PricingSettings.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const snap = await getPricingSnapshot()
  const settings = await getSiteRuntimeSettings()
  return NextResponse.json({ ok: true, cents: snap, public: snapshotToPublicJson(snap), settings })
}
