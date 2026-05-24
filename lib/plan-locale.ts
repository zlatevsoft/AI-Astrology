import type { SiteLocale } from '@/lib/locale'
import type { AnalysisTier } from '@/lib/pricing'

/** Must match Stripe / sessionStorage / validation (English only). */
export type PlanProductName = 'Basic Reading' | 'Detailed Analysis' | 'Comprehensive Reading'

export const pricingSection = {
  en: {
    title: 'Choose Your Astrological Journey',
    subtitle:
      'Discover your cosmic blueprint with a personalized astrological analysis. Choose the plan that fits your journey.',
    oneTimeLine: 'One-time payment • Instant access • PDF download included',
    popular: 'Most Popular',
    oneTimePayment: 'one-time payment',
    trustSsl: 'SSL encrypted',
    trustNoRecurring: 'No recurring charges',
  },
  bg: {
    title: 'Какво разкриват звездите за теб?',
    subtitle:
      'Получи персонална астрологична прогноза за любовта, характера и бъдещите възможности в живота ти!',
    oneTimeLine: 'Еднократно плащане • Мигновен достъп • Включен PDF',
    popular: 'Най-популярен',
    oneTimePayment: 'еднократно плащане',
    trustSsl: 'SSL криптиране',
    trustNoRecurring: 'Без абонамент',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

type PlanLocaleFields = {
  name: string
  description: string
  features: string[]
  buttonText: string
  popular: boolean
  buttonVariant: 'outline' | 'default'
  /** Overrides `pricingSection.popular` on the ribbon (e.g. BG marketing copy). */
  popularLabel?: string
  emotionalLine?: string
}

export type PlanRow = PlanLocaleFields & {
  productName: PlanProductName
  tier: AnalysisTier
  gradient: string
  borderColor: string
}

const gradients: Record<AnalysisTier, { gradient: string; borderColor: string }> = {
  basic: { gradient: 'from-blue-500 to-purple-600', borderColor: 'border-blue-500/30' },
  detailed: { gradient: 'from-purple-500 to-pink-600', borderColor: 'border-purple-500/30' },
  comprehensive: { gradient: 'from-pink-500 to-red-600', borderColor: 'border-pink-500/30' },
}

const planContent: Record<SiteLocale, Record<AnalysisTier, PlanLocaleFields>> = {
  en: {
    basic: {
      name: 'Basic Reading',
      description: 'Discover your core personality and life path',
      features: [
        '🌟 Complete birth chart analysis',
        '💫 Core personality insights',
        '🎯 Life purpose & destiny guidance',
        '💕 Relationship patterns revealed',
        '💼 Career inclinations & strengths',
        '📊 Detailed planetary influences',
        '🔮 Key life lessons & challenges',
        '📱 Instant PDF download',
        '✨ Beautiful, shareable report',
      ],
      buttonText: 'Get Basic Reading',
      popular: false,
      buttonVariant: 'outline',
    },
    detailed: {
      name: 'Detailed Analysis',
      description: "Deep dive into your soul's journey",
      features: [
        '✨ Everything in Basic, plus:',
        '🧠 Complete personality profile',
        '🌙 Soul mission & karmic patterns',
        '💝 Advanced relationship blueprint',
        '🚀 Complete career & life path',
        '🏠 Detailed house analysis',
        '⭐ All planetary aspects explained',
        '⏰ Life cycles & timing insights',
        '🔄 Shadow work & healing guidance',
        '📋 15+ practical recommendations',
        '🔮 Future guidance & predictions',
        '📱 Premium PDF download',
        '🎨 Stunning visual report',
      ],
      buttonText: 'Get Detailed Analysis',
      popular: true,
      buttonVariant: 'default',
    },
    comprehensive: {
      name: 'Comprehensive Reading',
      description: 'Complete relationship compatibility analysis',
      features: [
        '💕 Astrological synastry analysis',
        '❤️ Relationship compatibility insights',
        '🗣️ Communication patterns revealed',
        '🔥 Emotional & intimate connection',
        '🌟 Long-term potential assessment',
        '⚡ Challenges & growth opportunities',
        '✨ Harmonious aspects identification',
        '🛡️ Conflict resolution strategies',
        '🛤️ Shared life path analysis',
        '⏰ Timing for important decisions',
        '📱 Ultimate PDF download',
        '🎭 Interactive compatibility report',
        '💎 Exclusive relationship insights',
      ],
      buttonText: 'Get Compatibility Analysis',
      popular: false,
      buttonVariant: 'outline',
    },
  },
  bg: {
    basic: {
      name: 'Лична астрологична прогноза',
      description:
        'Разбери какво разкриват звездите за твоя характер, любов и бъдещи възможности.',
      features: [
        'Анализ на личността и силните страни',
        'Любов и взаимоотношения',
        'Кариера и житейски насоки',
        'Скрит потенциал и таланти',
        'Важни планетарни влияния',
        'Персонален PDF доклад',
        'Мигновен достъп след поръчка',
      ],
      buttonText: 'Вземи своята прогноза',
      popular: false,
      buttonVariant: 'outline',
    },
    detailed: {
      name: 'Премиум звезден анализ',
      description:
        'Детайлен персонален анализ, който разкрива любовта, бъдещето и важните периоди в живота ти.',
      popularLabel: '🔥 Най-предпочитан избор',
      features: [
        'Всичко от основната прогноза',
        'Подробен психологически профил',
        'Любов, връзки и емоционални модели',
        'Кариера и финансов потенциал',
        'Предстоящи възможности и промени',
        'Силни и слаби периоди',
        'Анализ на житейски цикли',
        'Персонални насоки и препоръки',
        'Premium PDF доклад',
        'По-задълбочен и детайлен анализ',
      ],
      emotionalLine:
        '✨ Хиляди хора вече откриха нов поглед към живота си чрез своята прогноза.',
      buttonText: 'Разкрий какво ти предстои',
      popular: true,
      buttonVariant: 'default',
    },
    comprehensive: {
      name: 'Любовна съвместимост',
      description:
        'Разбери истинската динамика между вас и какво показват звездите за връзката ви.',
      features: [
        'Сравнение между две натални карти',
        'Любовна и емоционална съвместимост',
        'Комуникация и привличане',
        'Силни страни на връзката',
        'Потенциални конфликти',
        'Дългосрочен потенциал',
        'Подходящи периоди за развитие',
        'Подробен PDF анализ',
      ],
      emotionalLine:
        '❤️ Научи какво ви свързва, какво ви разделя и какъв е потенциалът на връзката ви.',
      buttonText: 'Провери вашата съвместимост',
      popular: false,
      buttonVariant: 'outline',
    },
  },
}

const productNameByTier: Record<AnalysisTier, PlanProductName> = {
  basic: 'Basic Reading',
  detailed: 'Detailed Analysis',
  comprehensive: 'Comprehensive Reading',
}

const tiers: AnalysisTier[] = ['basic', 'detailed', 'comprehensive']

export function getPlanRowsForLocale(locale: SiteLocale): PlanRow[] {
  const src = planContent[locale]
  return tiers.map((tier) => ({
    productName: productNameByTier[tier],
    tier,
    ...src[tier],
    ...gradients[tier],
  }))
}

export function isBasicProductName(name: string): boolean {
  return name === 'Basic Reading'
}
