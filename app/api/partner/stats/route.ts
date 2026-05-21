import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/database-url'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'INFLUENCER' || !isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = session.user.id
  const [count, sum, codes, recentOrders] = await Promise.all([
    prisma.order.count({ where: { influencerId: id, status: 'PAID' } }),
    prisma.order.aggregate({
      where: { influencerId: id, status: 'PAID' },
      _sum: { amountTotal: true, commissionAmount: true },
    }),
    prisma.promoCode.findMany({
      where: { influencerId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        code: true,
        discountPercent: true,
        commissionPercent: true,
        active: true,
        validUntil: true,
      },
    }),
    prisma.order.findMany({
      where: { influencerId: id, status: 'PAID' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        amountTotal: true,
        commissionAmount: true,
        currency: true,
        productName: true,
        customerEmail: true,
        createdAt: true,
        promoCode: { select: { code: true } },
      },
    }),
  ])
  return NextResponse.json({
    orderCount: count,
    totalPaidCents: sum._sum.amountTotal ?? 0,
    yourCommissionCents: sum._sum.commissionAmount ?? 0,
    currency: 'eur',
    codes,
    recentOrders,
  })
}
