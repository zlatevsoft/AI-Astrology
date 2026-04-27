import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { normalizePromoCode } from '@/lib/promo'

const Create = z.object({
  code: z.string().min(2).max(32),
  name: z.string().min(1),
  username: z.string().min(2).max(32),
  password: z.string().min(8),
  discountPercent: z.number().int().min(1).max(90),
  commissionPercent: z.number().int().min(0).max(100),
  validUntil: z.string().datetime().optional().nullable(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'SUPER_ADMIN' || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const codes = await prisma.promoCode.findMany({
    orderBy: { createdAt: 'desc' },
    include: { influencer: { select: { id: true, name: true, username: true, email: true } } },
  })
  const summary = await Promise.all(
    codes.map(async (c) => {
      const [orders, revenue] = await Promise.all([
        prisma.order.count({ where: { promoCodeId: c.id, status: 'PAID' } }),
        prisma.order.aggregate({
          where: { promoCodeId: c.id, status: 'PAID' },
          _sum: { amountTotal: true, commissionAmount: true },
        }),
      ])
      return {
        ...c,
        orderCount: orders,
        revenueCents: revenue._sum.amountTotal ?? 0,
        commissionCents: revenue._sum.commissionAmount ?? 0,
      }
    })
  )
  return NextResponse.json({ items: summary })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'SUPER_ADMIN' || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const json = await request.json()
  const d = Create.parse(json)
  const code = normalizePromoCode(d.code)
  const existingCode = await prisma.promoCode.findUnique({ where: { code } })
  if (existingCode) {
    return NextResponse.json({ error: 'Code already used' }, { status: 409 })
  }
  const existingUser = await prisma.user.findFirst({
    where: { username: { equals: d.username, mode: 'insensitive' } },
  })
  if (existingUser) {
    return NextResponse.json({ error: 'Username taken' }, { status: 409 })
  }
  const passwordHash = await bcrypt.hash(d.password, 12)
  const user = await prisma.user.create({
    data: {
      username: d.username,
      name: d.name,
      passwordHash,
      role: 'INFLUENCER',
    },
  })
  const validUntil = d.validUntil ? new Date(d.validUntil) : null
  const promo = await prisma.promoCode.create({
    data: {
      code,
      discountPercent: d.discountPercent,
      commissionPercent: d.commissionPercent,
      influencerId: user.id,
      validUntil,
      active: true,
    },
  })
  return NextResponse.json({ ok: true, userId: user.id, promoId: promo.id, code: promo.code })
}
