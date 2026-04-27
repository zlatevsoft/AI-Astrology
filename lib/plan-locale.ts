import type { SiteLocale } from '@/lib/locale'
import type { AnalysisTier } from '@/lib/pricing'

/** Must match Stripe / sessionStorage / validation (English only). */
export type PlanProductName = 'Basic Reading' | 'Detailed Analysis' | 'Comprehensive Reading'

export const pricingSection = {
  en: {
    title: 'Choose Your Astrological Journey',
    subtitle:
      'Discover your cosmic blueprint with our AI-powered astrological analysis. Choose the perfect plan for your spiritual journey.',
    oneTimeLine: 'One-time payment • Instant access • PDF download included',
    popular: 'Most Popular',
    oneTimePayment: 'one-time payment',
    free: 'Free',
    trustSsl: 'SSL encrypted',
    trustNoRecurring: 'No recurring charges',
  },
  bg: {
    title: 'Избери своя астрологичен път',
    subtitle:
      'Открий космическия си почерк с AI анализ. Избери плана, който подхожда на твоето духовно пътешествие.',
    oneTimeLine: 'Еднократно плащане • Мигновен достъп • Включен PDF',
    popular: 'Най-популярен',
    oneTimePayment: 'еднократно плащане',
    free: 'Безплатно',
    trustSsl: 'SSL криптиране',
    trustNoRecurring: 'Без абонамент',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

type PlanRow = {
  productName: PlanProductName
  tier: AnalysisTier
  name: string
  description: string
  features: string[]
  buttonText: string
  popular: boolean
  gradient: string
  borderColor: string
  buttonVariant: 'outline' | 'default'
}

const gradients: Record<AnalysisTier, { gradient: string; borderColor: string }> = {
  basic: { gradient: 'from-blue-500 to-purple-600', borderColor: 'border-blue-500/30' },
  detailed: { gradient: 'from-purple-500 to-pink-600', borderColor: 'border-purple-500/30' },
  comprehensive: { gradient: 'from-pink-500 to-red-600', borderColor: 'border-pink-500/30' },
}

const planContent: Record<SiteLocale, Record<AnalysisTier, Omit<PlanRow, 'tier' | 'productName' | 'gradient' | 'borderColor'>>> = {
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
      name: 'Базов анализ',
      description: 'Открий ядрото на личността и житейския си път',
      features: [
        '🌟 Пълен анализ на наталната карта',
        '💫 Ключови черти на личността',
        '🎯 Предназначение и житейска цел',
        '💕 Любовни и партньорски модели',
        '💼 Кариера и силни страни',
        '📊 Планетарни влияния',
        '🔮 Уроци и предизвикателства',
        '📱 Мигновен PDF',
        '✨ Споделим отчет',
      ],
      buttonText: 'Базов анализ',
      popular: false,
      buttonVariant: 'outline',
    },
    detailed: {
      name: 'Задълбочен анализ',
      description: 'Пътешествие в дълбините на душата ти',
      features: [
        '✨ Всичко от Базов, плюс:',
        '🧠 Пълен психологичен профил',
        '🌙 Кармични и душевни теми',
        '💝 Любов и връзки – детайлно',
        '🚀 Житейски път и кариера',
        '🏠 Домове и житейски сфери',
        '⭐ Аспекти между планетите',
        '⏰ Цикли и време',
        '🔄 Сенки и израстване',
        '📋 15+ практични съвета',
        '🔮 Перспектива напред',
        '📱 Премиум PDF',
        '🎨 Визуален отчет',
      ],
      buttonText: 'Задълбочен анализ',
      popular: true,
      buttonVariant: 'default',
    },
    comprehensive: {
      name: 'Пълен съвместимост',
      description: 'Синастрия и съвместимост за двама',
      features: [
        '💕 Синастрия и сравнение на карти',
        '❤️ Съвместимост в любовта',
        '🗣️ Комуникация и динамика',
        '🔥 Емоционална близост',
        '🌟 Дългосрочен потенциал',
        '⚡ Предизвикателства и растеж',
        '✨ Хармонични аспекти',
        '🛡️ Конфликти – как да ги срещаш',
        '🛤️ Съвместен път',
        '⏰ Подходящо време за стъпки',
        '📱 PDF за двама',
        '🎭 Отчет за връзката',
        '💎 Ексклузивни инсайти',
      ],
      buttonText: 'Съвместимост',
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
