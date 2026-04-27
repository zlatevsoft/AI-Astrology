import type { SiteLocale } from '@/lib/locale'

export const analysisOptionsPage = {
  en: {
    h1: 'Choose your analysis',
    subtitle: 'Select the depth of insight that fits your journey',
    testMode: 'Test mode:',
    testModeBody: 'Analyses run for testing. Configure production flow separately.',
    birthReady: 'Birth chart ready:',
    popular: 'Most popular',
    continue: 'Continue',
    processing: 'Processing...',
    generate: 'Generate',
    analysis: 'analysis',
    instant: 'AI will generate your personalized analysis',
    guaranteeTitle: 'Secure',
    guaranteeBody: 'SSL encryption • No subscription',
    toastNoData: 'No chart data. Please start from the beginning.',
    toastInvalid: 'Invalid data. Please start from the beginning.',
    toastSelect: 'Please select an analysis option',
    toastFail: 'Could not generate analysis. Try again.',
  },
  bg: {
    h1: 'Избери анализ',
    subtitle: 'Избери дълбочината на интерпретацията',
    testMode: 'Тестов режим:',
    testModeBody: 'Анализите се пускат за тест. Продукционният поток се настройва отделно.',
    birthReady: 'Картата е готова:',
    popular: 'Най-популярен',
    continue: 'Продължи',
    processing: 'Обработка...',
    generate: 'Генерирай',
    analysis: 'анализ',
    instant: 'AI ще генерира персонализиран анализ',
    guaranteeTitle: 'Сигурност',
    guaranteeBody: 'SSL • Без абонамент',
    toastNoData: 'Няма данни за карта. Започни отначало.',
    toastInvalid: 'Невалидни данни. Започни отначало.',
    toastSelect: 'Избери вид анализ',
    toastFail: 'Неуспешна генерация. Опитай отново.',
  },
} as const

type Tier = 'basic' | 'detailed' | 'comprehensive'

const optionsByLocale: Record<
  SiteLocale,
  Record<
    Tier,
    {
      title: string
      description: string
      features: string[]
    }
  >
> = {
  en: {
    basic: {
      title: 'Basic analysis',
      description: 'Essential insight into personality and life path',
      features: [
        'Core personality traits',
        'Life purpose overview',
        'Strengths & challenges',
        'Relationship patterns',
        'Career hints',
        'PDF report',
      ],
    },
    detailed: {
      title: 'Detailed analysis',
      description: 'Deeper psychological and astrological insight',
      features: [
        'Everything in Basic',
        'House interpretations',
        'Planetary aspects',
        'Timing themes',
        'Spiritual lessons',
        'Growth tips',
        'Compatibility overview',
        'Priority flow',
      ],
    },
    comprehensive: {
      title: 'Full analysis',
      description: 'Complete blueprint and personalized guidance',
      features: [
        'Everything in Detailed',
        'House-by-house',
        'Major life themes',
        'Karmic focus',
        'Shadow work',
        'Decision timing',
        'Practical next steps',
        'Updates where offered',
      ],
    },
  },
  bg: {
    basic: {
      title: 'Базов анализ',
      description: 'Основен поглед върху личност и житейски път',
      features: [
        'Ключови черти',
        'Предназначение – обзор',
        'Силни и слаби страни',
        'Партньорски модели',
        'Кариера',
        'PDF отчет',
      ],
    },
    detailed: {
      title: 'Задълбочен анализ',
      description: 'По-детайлна астрологична и психологична картина',
      features: [
        'Всичко от Базов',
        'Домове',
        'Аспекти',
        'Време и периоди',
        'Духовни уроци',
        'Съвети за растеж',
        'Съвместимост – обзор',
        'Приоритетен поток',
      ],
    },
    comprehensive: {
      title: 'Пълен анализ',
      description: 'Цялостна карта и персонални ориентири',
      features: [
        'Всичко от Задълбочен',
        'Дом по дом',
        'Големи житейски теми',
        'Карма и фокус',
        'Работа с „сенки“',
        'Време за решения',
        'Следващи стъпки',
        'Актуализации, когато са включени',
      ],
    },
  },
}

export function getAnalysisOptionContent(
  locale: SiteLocale,
  tier: Tier
): (typeof optionsByLocale)['en']['basic'] {
  return optionsByLocale[locale][tier]
}

export const analysisTiers: Tier[] = ['basic', 'detailed', 'comprehensive']

export type { Tier }
