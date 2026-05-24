/**
 * Single source of truth for Stripe charges (EUR, cents).
 *
 * Free test mode: FREE_CHECKOUT=1, NEXT_PUBLIC_FREE_CHECKOUT=1 (see env.example).
 */

import type { SiteLocale } from '@/lib/locale'

export type AnalysisTier = 'basic' | 'detailed' | 'comprehensive'

export const CHARGE_CURRENCY = 'eur' as const

/** Amount charged in Stripe (cents, EUR). */
export const CHARGE_AMOUNT_CENTS: Record<AnalysisTier, number> = {
  basic: 1900,
  detailed: 2900,
  comprehensive: 3900,
}

/** List prices shown on site (EUR, not cents). */
export const LIST_PRICE_EUR: Record<AnalysisTier, number> = {
  basic: 19,
  detailed: 29,
  comprehensive: 39,
}

/** Strikethrough / "compare at" (EUR). */
export const COMPARE_AT_EUR: Record<AnalysisTier, number> = {
  basic: 29,
  detailed: 39,
  comprehensive: 49,
}

/** @deprecated use LIST_PRICE_EUR */
export const LIST_PRICE_USD = LIST_PRICE_EUR

export function isFreeCheckoutEnabled(): boolean {
  const v = process.env.FREE_CHECKOUT
  return v === '1' || v?.toLowerCase() === 'true'
}

export function isFreeCheckoutDisplayEnabled(): boolean {
  const pub = process.env.NEXT_PUBLIC_FREE_CHECKOUT
  return pub === '1' || pub?.toLowerCase() === 'true'
}

export function getChargeAmountCents(tier: AnalysisTier): number {
  if (isFreeCheckoutEnabled()) return 0
  return CHARGE_AMOUNT_CENTS[tier]
}

export function getMarketingPriceDisplay(tier: AnalysisTier): { current: number; compareAt: number } {
  if (isFreeCheckoutDisplayEnabled()) {
    return { current: 0, compareAt: LIST_PRICE_EUR[tier] }
  }
  return { current: LIST_PRICE_EUR[tier], compareAt: COMPARE_AT_EUR[tier] }
}

export function formatEur(amount: number): string {
  return `€${amount.toFixed(2)}`
}

/** EUR list price shown in UI (whole euros); matches `LIST_PRICE_EUR` / free-checkout display. */
export function formatMarketingListPriceEUR(tier: AnalysisTier, locale: SiteLocale): string {
  const { current } = getMarketingPriceDisplay(tier)
  if (current === 0) {
    return locale === 'bg' ? 'Безплатно' : 'Free'
  }
  const n = Math.round(current)
  return locale === 'bg' ? `${n} €` : `€${n}`
}
