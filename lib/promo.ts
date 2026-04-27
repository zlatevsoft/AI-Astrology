import { prisma } from '@/lib/prisma'

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase()
}

export async function findActivePromoByCode(code: string) {
  if (!process.env.DATABASE_URL) return null
  const normalized = normalizePromoCode(code)
  const p = await prisma.promoCode.findUnique({
    where: { code: normalized },
  })
  if (!p || !p.active) return null
  const now = new Date()
  if (p.validFrom && p.validFrom > now) return null
  if (p.validUntil && p.validUntil < now) return null
  return p
}

export function amountAfterDiscountCents(baseCents: number, discountPercent: number) {
  const d = Math.min(100, Math.max(0, Math.round(discountPercent)))
  return Math.max(1, Math.round((baseCents * (100 - d)) / 100))
}

export function commissionCentsForOrder(paidCents: number, commissionPercent: number) {
  const c = Math.min(100, Math.max(0, Math.round(commissionPercent)))
  return Math.max(0, Math.floor((paidCents * c) / 100))
}
