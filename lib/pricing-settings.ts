import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/database-url'
import type { AnalysisTier } from '@/lib/pricing'
import { COMPARE_AT_EUR, LIST_PRICE_EUR } from '@/lib/pricing'

export type PricingSnapshot = {
  basicCents: number
  detailedCents: number
  comprehensiveCents: number
  compareBasicCents: number
  compareDetailedCents: number
  compareComprehensiveCents: number
}

/** Single marketing + charge cents source from `LIST_PRICE_EUR` / `COMPARE_AT_EUR` (see `lib/pricing.ts`). */
export function pricingSnapshotFromCode(): PricingSnapshot {
  return {
    basicCents: Math.round(LIST_PRICE_EUR.basic * 100),
    detailedCents: Math.round(LIST_PRICE_EUR.detailed * 100),
    comprehensiveCents: Math.round(LIST_PRICE_EUR.comprehensive * 100),
    compareBasicCents: Math.round(COMPARE_AT_EUR.basic * 100),
    compareDetailedCents: Math.round(COMPARE_AT_EUR.detailed * 100),
    compareComprehensiveCents: Math.round(COMPARE_AT_EUR.comprehensive * 100),
  }
}

/** Baseline snapshot (always matches code prices). Keep DB row optional for admins who set TRUST_DATABASE_PRICES. */
export const PRICING_DEFAULTS = pricingSnapshotFromCode()

function trustDatabasePricing(): boolean {
  const v = process.env.TRUST_DATABASE_PRICES
  return typeof v !== 'undefined' && /^(1|true|yes)$/i.test(v.trim())
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
  if (!isDatabaseConfigured()) return
  try {
    const snap = pricingSnapshotFromCode()
    await prisma.pricingSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...snap },
      update: {},
    })
  } catch {
    /* ignore offline DB */
  }
}

export async function getPricingSnapshot(): Promise<PricingSnapshot> {
  const code = pricingSnapshotFromCode()
  if (!trustDatabasePricing() || !isDatabaseConfigured()) return code

  await ensurePricingDefaultsRow()
  try {
    const row = await prisma.pricingSettings.findUnique({ where: { id: 1 } })
    if (!row) return code
    return {
      basicCents: row.basicCents,
      detailedCents: row.detailedCents,
      comprehensiveCents: row.comprehensiveCents,
      compareBasicCents: row.compareBasicCents,
      compareDetailedCents: row.compareDetailedCents,
      compareComprehensiveCents: row.compareComprehensiveCents,
    }
  } catch {
    return code
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
