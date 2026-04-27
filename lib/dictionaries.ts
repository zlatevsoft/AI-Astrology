import type { SiteLocale } from '@/lib/locale'

export const siteNav = {
  en: {
    home: 'Home',
    features: 'Features',
    blog: 'Blog',
    pricing: 'Pricing',
    faq: 'FAQ',
    testStripe: 'Test Stripe',
    choosePlan: 'Choose Plan',
  },
  bg: {
    home: 'Начало',
    features: 'Функции',
    blog: 'Блог',
    pricing: 'Цени',
    faq: 'Въпроси',
    testStripe: 'Test Stripe',
    choosePlan: 'Избери план',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>
