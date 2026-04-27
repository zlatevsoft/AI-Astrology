import type { SiteLocale } from '@/lib/locale'

export const siteNav = {
  en: {
    home: 'Home',
    features: 'Why AI Astrology?',
    blog: 'Blog',
    pricing: 'Pricing',
    faq: 'FAQ',
    testStripe: 'Test Stripe',
    choosePlan: 'Choose Plan',
  },
  bg: {
    home: 'Начало',
    features: 'Защо AI astrology?',
    blog: 'Блог',
    pricing: 'Цени',
    faq: 'Въпроси',
    testStripe: 'Тест Stripe',
    choosePlan: 'Избери план',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

export const footerLocale = {
  en: {
    plansHeading: 'Plans',
    importantHeading: 'Important Links',
    tagline:
      'Get your personalized AI astrology birth chart. Professional analysis with cosmic insights at AstroHoroscope.online. Prices in EUR.',
    rights: '© 2024 AstroHoroscope.online. All rights reserved.',
    ssl: 'SSL Secured',
    faq: 'FAQ',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact',
  },
  bg: {
    plansHeading: 'Планове',
    importantHeading: 'Важни връзки',
    tagline:
      'Персонална натална карта с AI. Професионален анализ на AstroHoroscope.online. Цените са в евро (€).',
    rights: '© 2024 AstroHoroscope.online. Всички права запазени.',
    ssl: 'SSL защита',
    faq: 'Въпроси',
    privacy: 'Поверителност',
    terms: 'Условия',
    contact: 'Контакт',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

/** Bottom CTA on home (`CTASection`). */
export const ctaHome = {
  en: {
    badge: '⭐ Limited Time Offer',
    title1: 'Discover Your',
    title2: 'Cosmic Blueprint',
    title3: 'Today',
    body: 'Get your personalized birth chart with AI-powered insights from €19. Understand your personality, life lessons, and cosmic guidance in minutes.',
    benefits: [
      'Accurate birth chart calculations',
      'AI-powered personality analysis',
      'Comprehensive life path insights',
      'Beautiful visual charts',
      'Instant results delivery',
      'Secure data protection',
    ],
    trust1: '100% Secure',
    trust2: 'Instant Results',
    trust3: '4.9/5 Rating',
    cardTitle: 'Premium Analysis',
    price: '€19',
    oneTime: 'One-time payment',
    cardBullets: [
      'Complete birth chart',
      'AI personality analysis',
      'Life path insights',
      'Planetary positions',
      'Aspect interpretations',
      'Lifetime access',
    ],
    button: 'Choose Your Plan',
  },
  bg: {
    badge: '⭐ Оферта за ограничено време',
    title1: 'Открий',
    title2: 'космическия си почерк',
    title3: 'днес',
    body: 'Персонална натална карта с AI от 19 €. Личност, уроци и ориентири за минути.',
    benefits: [
      'Точни изчисления на картата',
      'AI анализ на личността',
      'Житейски и духовни акценти',
      'Визуални схеми',
      'Бърз резултат',
      'Защита на данните',
    ],
    trust1: '100% сигурност',
    trust2: 'Мигновено',
    trust3: 'Рейтинг 4.9/5',
    cardTitle: 'Премиум анализ',
    price: '19 €',
    oneTime: 'Еднократно плащане',
    cardBullets: [
      'Пълна натална карта',
      'AI личност',
      'Житейски фокус',
      'Планети',
      'Аспекти',
      'Достъп за ползване',
    ],
    button: 'Избери план',
  },
} as const

/** Home hero (matches `HeroSection` copy). */
export const heroHome = {
  en: {
    badge: 'AstroHoroscope.online - AI Astrology',
    titleLine1: 'Professional Astro',
    titleLine2: 'Horoscope Birth Chart',
    description:
      'Get your personalized AI astrology birth chart reading at AstroHoroscope.online. Professional astro horoscope analysis with cosmic insights from €19.',
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
      'Получете персонализирана AI интерпретация на наталната си карта на AstroHoroscope.online. Професионален анализ с космически инсайти – от 19 €.',
    cta: 'Избери план',
    feat1: 'Точни изчисления',
    feat2: 'AI анализ',
    feat3: 'Мигновени резултати',
    stat1: '10 000+ генерирани карти',
    stat2: 'Рейтинг 4.9/5',
    stat3: '100% сигурност',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>
