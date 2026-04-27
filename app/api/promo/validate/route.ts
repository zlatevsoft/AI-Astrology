import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findActivePromoByCode, amountAfterDiscountCents, commissionCentsForOrder } from '@/lib/promo'

const Body = z.object({
  code: z.string().min(1),
  baseAmountCents: z.number().int().positive(),
})

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ valid: false, error: 'Promo system not configured' }, { status: 503 })
    }
    const json = await request.json()
    const { code, baseAmountCents } = Body.parse(json)
    const promo = await findActivePromoByCode(code)
    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired code' })
    }
    const finalCents = amountAfterDiscountCents(baseAmountCents, promo.discountPercent)
    const commission = commissionCentsForOrder(finalCents, promo.commissionPercent)
    return NextResponse.json({
      valid: true,
      promoCodeId: promo.id,
      influencerId: promo.influencerId,
      discountPercent: promo.discountPercent,
      finalAmountCents: finalCents,
      commissionCents: commission,
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ valid: false, error: 'Invalid request' }, { status: 400 })
    }
    console.error('promo/validate', e)
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
}
