/**
 * Single source of truth for what we charge in Stripe (USD, cents).
 *
 * Change amounts only here — then update marketing copy if needed (hero, FAQ use "from $X").
 *
 * Free test mode (bypasses Stripe Checkout, goes straight to success URL like mock):
 *   Server: FREE_CHECKOUT=1  (or "true")
 *   Client UI: NEXT_PUBLIC_FREE_CHECKOUT=1  (so prices show $0 on checkout)
 *   On Vercel: set both for testing, remove or set to 0/false for production.
 */

export type AnalysisTier = 'basic' | 'detailed' | 'comprehensive'

/** Amount actually charged in Stripe (cents). Comprehensive = $29.99 (was inconsistent with payment API before). */
export const CHARGE_AMOUNT_CENTS: Record<AnalysisTier, number> = {
  basic: 999,
  detailed: 1999,
  comprehensive: 2999,
}

/** Public list prices shown on site (USD, not cents) — must match CHARGE_AMOUNT_CENTS / 100. */
export const LIST_PRICE_USD: Record<AnalysisTier, number> = {
  basic: 9.99,
  detailed: 19.99,
  comprehensive: 29.99,
}

/** Strikethrough / "compare at" prices for marketing (USD). */
export const COMPARE_AT_USD: Record<AnalysisTier, number> = {
  basic: 19.99,
  detailed: 34.99,
  comprehensive: 39.99,
}

export function isFreeCheckoutEnabled(): boolean {
  const v = process.env.FREE_CHECKOUT
  return v === '1' || v?.toLowerCase() === 'true'
}

/** For client components: set NEXT_PUBLIC_FREE_CHECKOUT=1 alongside FREE_CHECKOUT. */
export function isFreeCheckoutDisplayEnabled(): boolean {
  const pub = process.env.NEXT_PUBLIC_FREE_CHECKOUT
  return pub === '1' || pub?.toLowerCase() === 'true'
}

export function getChargeAmountCents(tier: AnalysisTier): number {
  if (isFreeCheckoutEnabled()) return 0
  return CHARGE_AMOUNT_CENTS[tier]
}

/** Client-safe: uses NEXT_PUBLIC_FREE_CHECKOUT for $0 display on marketing + checkout. */
export function getMarketingPriceDisplay(tier: AnalysisTier): { current: number; compareAt: number } {
  if (isFreeCheckoutDisplayEnabled()) {
    return { current: 0, compareAt: LIST_PRICE_USD[tier] }
  }
  return { current: LIST_PRICE_USD[tier], compareAt: COMPARE_AT_USD[tier] }
}
