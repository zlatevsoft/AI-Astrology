import type { SiteLocale } from '@/lib/locale'

export const siteNav = {
  en: {
    home: 'Home',
    features: 'What you get',
    blog: 'Blog',
    pricing: 'Pricing',
    faq: 'FAQ',
    testStripe: 'Test Stripe',
    choosePlan: 'Choose Plan',
  },
  bg: {
    home: 'Начало',
    features: 'Какво получаваш',
    blog: 'Блог',
    pricing: 'Цени',
    faq: 'Въпроси',
    testStripe: 'Тест Stripe',
    choosePlan: 'Избери план',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

/** SEO lead block displayed above tier cards on landing (localized). */
export const homePlansSeoIntro = {
  en: {
    title: 'Natal astrology that reads like a blueprint—not a crossword',
    subtitle:
      'Interpret your astro horoscope and birth chart with analyst-level rigor: houses, planetary aspects, elemental balance, and timing cues—then receive a polished PDF you can revisit whenever life accelerates.',
    highlight:
      'Whether you explore love, career, or inner growth, AstroHoroscope.online turns cosmic geometry into practical language so every insight stays usable on mobile or desktop.',
  },
  bg: {
    title: 'Натална астрология, която четеш като карта към живота — не като клише',
    subtitle:
      'Персонализирана натална карта и хороскоп с фокус върху домове, аспекти, стихии и ключови житейски теми — с ясен PDF текст, който стои до теб след всяко важно решение.',
    highlight:
      'Любов, кариера или себепознание: AstroHoroscope.online превежда звездната математика в език, който веднага разбираш — на телефон или компютър, без претрупани обещания.',
  },
} as const satisfies Record<SiteLocale, { title: string; subtitle: string; highlight: string }>

export const footerLocale = {
  en: {
    plansHeading: 'Plans',
    importantHeading: 'Important Links',
    tagline:
      'Personalized astro horoscope and birth chart at AstroHoroscope.online. Professional analysis with cosmic insights. Prices in EUR.',
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
      'Персонална натална карта и професионален астрологичен анализ на AstroHoroscope.online. Цените са в евро (€).',
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
    title1: '',
    title2: 'What do the stars reveal about you?',
    title3: '',
    body:
      'Get a personal astrological forecast for love, character, and future opportunities in your life!',
    benefits: [
      'Accurate birth chart calculations',
      'Personalized written interpretation',
      'Life path highlights and themes',
      'Beautiful visual charts',
      'Instant results delivery',
      'Secure data protection',
    ],
    trust1: '100% Secure',
    trust2: 'Instant Results',
    trust3: '4.9/5 Rating',
    cardTitle: 'Premium stellar analysis',
    oneTime: 'One-time payment',
    cardBullets: [
      'Complete birth chart',
      'Detailed personality angles',
      'Life path highlights',
      'Planetary positions',
      'Aspect interpretations',
      'Lifetime access',
    ],
    button: 'Choose Your Plan',
  },
  bg: {
    badge: '⭐ Оферта за ограничено време',
    title1: '',
    title2: 'Какво разкриват звездите за теб?',
    title3: '',
    body:
      'Получи персонална астрологична прогноза за любовта, характера и бъдещите възможности в живота ти!',
    benefits: [
      'Точни изчисления на картата',
      'Персонален текстов анализ',
      'Житейски и духовни акценти',
      'Визуални схеми',
      'Бърз резултат',
      'Защита на данните',
    ],
    trust1: '100% сигурност',
    trust2: 'Мигновено',
    trust3: 'Рейтинг 4.9/5',
    cardTitle: 'Премиум звезден анализ',
    oneTime: 'Еднократно плащане',
    cardBullets: [
      'Пълна натална карта',
      'Интерпретация на личността',
      'Житейски фокус',
      'Планети',
      'Аспекти',
      'Достъп за ползване',
    ],
    button: 'Избери план',
  },
} as const

/** `/payment-checkout` page (Stripe or free test mode). */
export const paymentCheckout = {
  en: {
    title: 'Complete Your Purchase',
    subtitle:
      "You're one step away from your reading. Complete payment to receive your personalized astrological analysis.",
    testModeBanner:
      'Test mode: checkout is free (set FREE_CHECKOUT=1 on the server; remove for production).',
    orderSummary: 'Order Summary',
    total: 'Total:',
    freeLabel: 'Free',
    yourInfo: 'Your Information',
    labelName: 'Name:',
    labelBirthDate: 'Birth Date:',
    labelBirthTime: 'Birth Time:',
    labelLocation: 'Location:',
    labelPartnerName: 'Partner Name:',
    labelPartnerBirth: 'Partner Birth Date:',
    securePayment: 'Secure Payment',
    securityTitle: 'Secure Payment',
    securityBody:
      'Your payment is processed securely by Stripe. We never store your card details.',
    promoLabel: 'Promo or influencer code (optional)',
    promoPlaceholder: 'e.g. STARS20',
    payButtonTemplate: 'Pay %s & get your analysis',
    continueFree: 'Continue — get your analysis',
    processing: 'Processing...',
    trustSsl: 'SSL Encrypted',
    trustInstant: 'Instant Access',
    termsNote: 'By completing your purchase, you agree to our Terms of Service and Privacy Policy.',
    loading: 'Loading...',
    toastMissing: 'Missing required data. Please start over.',
    toastSessionError: 'Failed to create payment session. Please try again.',
    toastNetwork: 'Network error. Check your connection and try again.',
    toastPaymentError: 'Payment system error. Please try again.',
    toastMockFree: 'Test mode: no charge — opening your report',
    toastMockDev: 'Development mode: opening analysis',
  },
  bg: {
    title: 'Завърши покупката',
    subtitle:
      'Остава още една стъпка до твоя анализ. Плати, за да получиш персонализираната си астрологична интерпретация.',
    testModeBanner: 'Тестов режим: плащането е безплатно (сървър env FREE_CHECKOUT=1; махни го в продакшън).',
    orderSummary: 'Обобщение на поръчката',
    total: 'Общо:',
    freeLabel: 'Безплатно',
    yourInfo: 'Твои данни',
    labelName: 'Име:',
    labelBirthDate: 'Рождена дата:',
    labelBirthTime: 'Рожден час:',
    labelLocation: 'Място:',
    labelPartnerName: 'Партньор (име):',
    labelPartnerBirth: 'Рождена дата на партньор:',
    securePayment: 'Сигурно плащане',
    securityTitle: 'Сигурно плащане',
    securityBody: 'Плащането минава през Stripe. Не пазим данните на картата ти.',
    promoLabel: 'Промо или код на инфлуенсър (по избор)',
    promoPlaceholder: 'напр. STARS20',
    payButtonTemplate: 'Плати %s и получи анализа',
    continueFree: 'Продължи — тест, без плащане',
    processing: 'Обработка...',
    trustSsl: 'SSL',
    trustInstant: 'Веднага достъп',
    termsNote: 'С финализиране на поръчката приемаш Общите условия и Политиката за поверителност.',
    loading: 'Зареждане...',
    toastMissing: 'Липсват данни. Започни отначало.',
    toastSessionError: 'Неуспешна сесия за плащане. Опитай пак.',
    toastNetwork: 'Мрежова грешка. Провери връзката.',
    toastPaymentError: 'Грешка в плащането. Опитай пак.',
    toastMockFree: 'Тест: без плащане — пренасочваме към анализа',
    toastMockDev: 'Dev режим: отваряне на анализ',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

/** Home hero (matches `HeroSection` copy). */
export const heroHome = {
  en: {
    badge: 'AstroHoroscope.online',
    titleLine1: 'What do the stars reveal about you?',
    titleLine2: '',
    description:
      'Get a personal astrological forecast for love, character, and future opportunities in your life!',
    cta: 'Choose Your Plan',
    feat1: 'Accurate Calculations',
    feat2: 'Personalized Reading',
    feat3: 'Instant Results',
    stat1: 'Trusted by seekers worldwide',
    stat2: '4.9/5 Rating',
    stat3: '100% Secure',
  },
  bg: {
    badge: 'AstroHoroscope.online',
    titleLine1: 'Какво разкриват звездите за теб?',
    titleLine2: '',
    description:
      'Получи персонална астрологична прогноза за любовта, характера и бъдещите възможности в живота ти!',
    cta: 'Избери план',
    feat1: 'Точни изчисления',
    feat2: 'Ясен персонален анализ',
    feat3: 'Мигновени резултати',
    stat1: '⭐ Любим избор на хиляди потребители',
    stat2: 'Рейтинг 4.9/5',
    stat3: '100% сигурност',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>
