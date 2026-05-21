import { prisma } from '@/lib/prisma'
import type { AnalysisTier } from '@/lib/pricing'

export type PricingSnapshot = {
  basicCents: number
  detailedCents: number
  comprehensiveCents: number
  compareBasicCents: number
  compareDetailedCents: number
  compareComprehensiveCents: number
}

export const PRICING_DEFAULTS: PricingSnapshot = {
  basicCents: 1900,
  detailedCents: 2900,
  comprehensiveCents: 3900,
  compareBasicCents: 2900,
  compareDetailedCents: 3900,
  compareComprehensiveCents: 4900,
}

/** English product titles as used in sessionStorage / Stripe metadata. */
export function analysisTierFromProductName(productName: string): AnalysisTier | null {
  const k = productName.trim().toLowerCase()
  if (k.includes('basic')) return 'basic'
  if (k.includes('detailed')) return 'detailed'
  if (k.includes('comprehensive')) return 'comprehensive'
  return null
}

export async function ensurePricingDefaultsRow(): Promise<void> {
  if (!process.env.DATABASE_URL) return
  try {
    await prisma.pricingSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...PRICING_DEFAULTS },
      update: {},
    })
  } catch {
    /* ignore offline DB */
  }
}

export async function getPricingSnapshot(): Promise<PricingSnapshot> {
  if (!process.env.DATABASE_URL) return { ...PRICING_DEFAULTS }
  await ensurePricingDefaultsRow()
  try {
    const row = await prisma.pricingSettings.findUnique({ where: { id: 1 } })
    if (!row) return { ...PRICING_DEFAULTS }
    return {
      basicCents: row.basicCents,
      detailedCents: row.detailedCents,
      comprehensiveCents: row.comprehensiveCents,
      compareBasicCents: row.compareBasicCents,
      compareDetailedCents: row.compareDetailedCents,
      compareComprehensiveCents: row.compareComprehensiveCents,
    }
  } catch {
    return { ...PRICING_DEFAULTS }
  }
}

export async function getChargeCentsForTier(tier: AnalysisTier): Promise<number> {
  const p = await getPricingSnapshot()
  if (tier === 'basic') return p.basicCents
  if (tier === 'detailed') return p.detailedCents
  return p.comprehensiveCents
}

export async function getChargeCentsForProductName(productName: string): Promise<number | null> {
  const tier = analysisTierFromProductName(productName)
  if (!tier) return null
  return getChargeCentsForTier(tier)
}

export function snapshotToPublicJson(p: PricingSnapshot) {
  return {
    listEur: {
      basic: p.basicCents / 100,
      detailed: p.detailedCents / 100,
      comprehensive: p.comprehensiveCents / 100,
    },
    compareEur: {
      basic: p.compareBasicCents / 100,
      detailed: p.compareDetailedCents / 100,
      comprehensive: p.compareComprehensiveCents / 100,
    },
  }
}
