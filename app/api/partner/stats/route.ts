import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'INFLUENCER' || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = session.user.id
  const [count, sum] = await Promise.all([
    prisma.order.count({ where: { influencerId: id, status: 'PAID' } }),
    prisma.order.aggregate({
      where: { influencerId: id, status: 'PAID' },
      _sum: { amountTotal: true, commissionAmount: true },
    }),
  ])
  return NextResponse.json({
    orderCount: count,
    totalPaidCents: sum._sum.amountTotal ?? 0,
    yourCommissionCents: sum._sum.commissionAmount ?? 0,
    currency: 'usd',
  })
}
