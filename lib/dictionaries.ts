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
    testStripe: 'Тест Stripe',
    choosePlan: 'Избери план',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

/** Home hero (matches `HeroSection` copy). */
export const heroHome = {
  en: {
    badge: 'AstroHoroscope.online - AI Astrology',
    titleLine1: 'Professional Astro',
    titleLine2: 'Horoscope Birth Chart',
    description:
      'Get your personalized AI astrology birth chart reading at AstroHoroscope.online. Professional astro horoscope analysis with cosmic insights starting at $9.99.',
    cta: 'Choose Your Plan',
    feat1: 'Accurate Calculations',
    feat2: 'AI Analysis',
    feat3: 'Instant Results',
    stat1: '10,000+ Charts Generated',
    stat2: '4.9/5 Rating',
    stat3: '100% Secure',
  },
  bg: {
    badge: 'AstroHoroscope.online – AI астрология',
    titleLine1: 'Професионален',
    titleLine2: 'астрологичен хороскоп и натална карта',
    description:
      'Получете персонализирана AI интерпретация на наталната си карта на AstroHoroscope.online. Професионален анализ с космически инсайти – от $9.99.',
    cta: 'Избери план',
    feat1: 'Точни изчисления',
    feat2: 'AI анализ',
    feat3: 'Мигновени резултати',
    stat1: '10 000+ генерирани карти',
    stat2: 'Рейтинг 4.9/5',
    stat3: '100% сигурност',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>
