import { z } from 'zod'
import type { SiteLocale } from '@/lib/locale'

const timeRe = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

export const birthChartCopy = {
  en: {
    h1: 'Your Birth Chart',
    subtitle: 'Enter your birth details to discover your cosmic blueprint',
    selectedPlan: 'Selected plan',
    nameLabel: 'Full name',
    namePlaceholder: 'Enter your full name',
    birthDate: 'Birth date',
    birthTime: 'Birth time',
    timeHint1: "If you don't know the exact time, use 12:00",
    timeHint2: 'Tip: check a birth certificate, ask family, or use 12:00 as default',
    location: 'Place of birth',
    locationPlaceholder: 'City, country (e.g. Sofia, Bulgaria)',
    locationHint: 'Tip: use format "City, Country" (e.g. Sofia, Bulgaria or New York, USA)',
    partnerBlock: 'Partner details',
    partnerName: "Partner's full name",
    partnerNamePh: "Partner's full name",
    partnerBirthDate: "Partner's birth date",
    partnerBirthTime: "Partner's birth time",
    partnerLocation: "Partner's place of birth",
    partnerLocationPh: "Partner's city and country",
    btnCompLoading: 'Calculating charts...',
    btnSingleLoading: 'Calculating your chart...',
    btnComp: 'Calculate charts and continue',
    btnSingle: 'Calculate chart and continue',
    whyTimeTitle: 'Why birth time matters',
    whyTimeBody:
      'The birth time sets houses and the chart wheel. It is important for a precise reading of themes and transits.',
    toastNoPlan: 'Please choose a plan first',
    toastPartner: 'Please fill in all partner fields for compatibility analysis',
    toastOkSingle: 'Birth chart created successfully!',
    toastOkComp: 'Birth charts created successfully!',
    toastErr: 'Could not create the chart. Check your data and try again.',
    errNameMin: 'Name must be at least 2 characters',
    errBirthDate: 'Birth date is required',
    errBirthTime: 'Enter a valid time (HH:MM, 24h)',
    errLocation: 'Place of birth is required',
    errPartnerName: "Partner's name must be at least 2 characters",
  },
  bg: {
    h1: 'Твоята натална карта',
    subtitle: 'Въведи данните си за раждане, за да отключиш космическия си почерк',
    selectedPlan: 'Избран план',
    nameLabel: 'Пълно име',
    namePlaceholder: 'Твоето пълно име',
    birthDate: 'Рождена дата',
    birthTime: 'Рожден час',
    timeHint1: 'Ако не знаеш точния час, използвай 12:00',
    timeHint2: 'Съвет: удостоверение за раждане, близки или по подразбиране 12:00',
    location: 'Място на раждане',
    locationPlaceholder: 'Град, държава (напр. София, България)',
    locationHint: 'Формат „Град, държава“ (напр. София, България или New York, USA)',
    partnerBlock: 'Данни за партньор',
    partnerName: 'Пълно име на партньор',
    partnerNamePh: 'Пълно име на партньор',
    partnerBirthDate: 'Рождена дата на партньор',
    partnerBirthTime: 'Рожден час на партньор',
    partnerLocation: 'Място на раждане на партньор',
    partnerLocationPh: 'Град и държава на партньор',
    btnCompLoading: 'Изчисляваме картите...',
    btnSingleLoading: 'Изчисляваме картата...',
    btnComp: 'Изчисли картите и продължи',
    btnSingle: 'Изчисли картата и продължи',
    whyTimeTitle: 'Защо е важен рождаеният час',
    whyTimeBody:
      'Часът определя домовете и ъглите в картата. Той е важен за по-прецизен анализ на теми и аспекти.',
    toastNoPlan: 'Първо избери план',
    toastPartner: 'Попълни всички полета за партньор за съвместимост',
    toastOkSingle: 'Наталната карта е създадена!',
    toastOkComp: 'Картите за двама са създадени!',
    toastErr: 'Неуспех при създаване на картата. Провери данните и опитай отново.',
    errNameMin: 'Името трябва да е поне 2 знака',
    errBirthDate: 'Рождена дата е задължителна',
    errBirthTime: 'Валиден час (ЧЧ:ММ, 24ч)',
    errLocation: 'Място на раждане е задължително',
    errPartnerName: 'Името на партньор трябва да е поне 2 знака',
  },
} as const

export type BirthChartCopy = (typeof birthChartCopy)['en']

export function getBirthChartCopy(locale: SiteLocale): BirthChartCopy {
  return birthChartCopy[locale] as BirthChartCopy
}

export function buildBirthChartSchema(t: BirthChartCopy) {
  return z.object({
    name: z.string().min(2, t.errNameMin),
    birthDate: z.string().min(1, t.errBirthDate),
    birthTime: z.string().regex(timeRe, t.errBirthTime),
    location: z.string().min(1, t.errLocation),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    partnerName: z.union([z.string().min(2, t.errPartnerName), z.literal('')]).optional(),
    partnerBirthDate: z.string().optional(),
    partnerBirthTime: z
      .union([z.string().regex(timeRe, t.errBirthTime), z.literal('')])
      .optional(),
    partnerLocation: z.string().optional(),
    partnerLatitude: z.number().min(-90).max(90).optional(),
    partnerLongitude: z.number().min(-180).max(180).optional(),
  })
}

export type BirthChartFormValues = z.infer<ReturnType<typeof buildBirthChartSchema>>
