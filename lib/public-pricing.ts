import type { AnalysisTier } from '@/lib/pricing'

/** JSON from GET /api/pricing */
export type PublicPricingPayload = {
  listEur: Record<AnalysisTier, number>
  compareEur: Record<AnalysisTier, number>
}
