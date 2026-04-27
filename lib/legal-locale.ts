import type { SiteLocale } from '@/lib/locale'

export const legalSeo = {
  privacy: {
    en: {
      title: 'Privacy Policy - AI Astrology',
      description: 'Privacy Policy for AI Astrology: how we collect, use, and protect your data (GDPR).',
    },
    bg: {
      title: 'Политика за поверителност - AI Astrology',
      description: 'Политика за поверителност: как съхраняваме и защитаваме личните данни (GDPR).',
    },
  },
  terms: {
    en: {
      title: 'Terms of Service - AI Astrology',
      description: 'Terms and conditions of use, payments in EUR, and disclaimers for AstroHoroscope.online.',
    },
    bg: {
      title: 'Общи условия - AI Astrology',
      description: 'Общи условия, плащания в евро (EUR) и откази от отговорност за AstroHoroscope.online.',
    },
  },
} as const

export type LegalSection = { heading: string; blocks: string[] }

export const privacyByLocale: Record<SiteLocale, { h1: string; lastUpdated: string; sections: LegalSection[] }> = {
  en: {
    h1: 'Privacy Policy',
    lastUpdated: 'Last updated:',
    sections: [
      {
        heading: '1. Information We Collect',
        blocks: [
          '**Personal information:** we collect your name, birth date, birth time, and place of birth to generate your astrological analysis.',
          '**Payment information:** processing is done securely by Stripe. We do not store your full card details.',
          '**Usage data:** we may collect data about how you use the service to improve experience and performance.',
        ],
      },
      {
        heading: '2. How We Use Your Information',
        blocks: [
          'To generate a personalized astrological analysis',
          'To process payments and provide support',
          'To improve our services',
          'To meet legal obligations',
        ],
      },
      {
        heading: '3. Data Protection Rights (GDPR)',
        blocks: [
          'If you are in the EEA, you have the right to: access, rectification, erasure, restriction, portability, and objection, as provided by the GDPR. You may also lodge a complaint with a supervisory authority.',
        ],
      },
      {
        heading: '4. Data Security',
        blocks: [
          'We use SSL/TLS, secure payment processing, and access controls. No method of transmission is 100% secure.',
        ],
      },
      {
        heading: '5. Data Retention',
        blocks: [
          'Birth chart inputs may be processed for the live session; retention of records follows legal and accounting requirements where applicable.',
        ],
      },
      {
        heading: '6. Third-Party Services',
        blocks: [
          '**Stripe** — payments',
          '**OpenAI** — AI text generation, subject to their policies',
          '**Hosting / analytics** — e.g. Vercel, as applicable',
        ],
      },
      {
        heading: '7. International Users',
        blocks: [
          'If you access the service from outside the EU, your data may be processed in the EU/EEA or other locations where our processors operate, with appropriate safeguards where required.',
        ],
      },
      {
        heading: '8. Contact',
        blocks: [
          'For privacy requests: **contact@zlatevsoft.com**',
          'We aim to respond within a reasonable time.',
        ],
      },
      {
        heading: '9. Changes to This Policy',
        blocks: [
          'We may update this policy. The “last updated” date will change. Material changes will be communicated as appropriate (e.g. on this page).',
        ],
      },
    ],
  },
  bg: {
    h1: 'Политика за поверителност',
    lastUpdated: 'Последна актуализация:',
    sections: [
      {
        heading: '1. Какви данни събираме',
        blocks: [
          '**Лични данни:** име, дата, час и място на раждане, необходими за натална карта и анализ.',
          '**Плащане:** обработва се чрез Stripe; не съхраняваме пълни данни от картата.',
          '**Ползване:** при нужда – информация за използване на сайта, за подобряване на услугата и сигурността.',
        ],
      },
      {
        heading: '2. Как използваме данните',
        blocks: [
          'За генериране на персонализиран астрологичен анализ',
          'За обработка на плащания и отговор на запитвания',
          'За подобряване на продукта',
          'За спазване на законови задължения',
        ],
      },
      {
        heading: '3. Права по GDPR',
        blocks: [
          'Приложимо е правото на достъп, коригиране, изтриване, ограничаване, преносимост и възражение според GDPR. Може да подадете жалба до компетентен надзорен орган.',
        ],
      },
      {
        heading: '4. Сигурност',
        blocks: [
          'Ползваме криптиране, сигурни доставчици и ограничен достъп. Няма пълна гаранция срещу всички рискове.',
        ],
      },
      {
        heading: '5. Съхранение',
        blocks: [
          'Данните се пазят толкова дълго, колкото е необходимо за услугата и законовите срокове (напр. счетоводство), където е приложимо.',
        ],
      },
      {
        heading: '6. Трети страни',
        blocks: [
          '**Stripe** – плащания',
          '**OpenAI** – генериране на текст, според техните политики',
          '**Хостинг/аналитика** – при нужда (напр. Vercel)',
        ],
      },
      {
        heading: '7. Международен достъп',
        blocks: [
          'При достъп извън ЕС обработката може да включва доставчици в ЕС/ЕИП или с подходящи гаранции по закон.',
        ],
      },
      {
        heading: '8. Контакт',
        blocks: [
          'За въпроси: **contact@zlatevsoft.com**',
          'Отговаряме в разумен срок.',
        ],
      },
      {
        heading: '9. Промени',
        blocks: [
          'Можем да актуализираме политиката. Промяна на датата и съдържанието на тази страница съществуват с цел уведомяване.',
        ],
      },
    ],
  },
}

export const termsByLocale: Record<SiteLocale, { h1: string; lastUpdated: string; sections: LegalSection[] }> = {
  en: {
    h1: 'Terms of Service',
    lastUpdated: 'Last updated:',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        blocks: [
          'By using AI Astrology and AstroHoroscope.online (“Service”), you agree to these terms. If you do not agree, do not use the Service.',
        ],
      },
      {
        heading: '2. Description of Service',
        blocks: [
          'We offer AI-assisted astrological analysis (e.g. basic, detailed, comprehensive options), PDF or on-screen delivery, in **euro (EUR)** as shown at checkout. Astrology is for self-reflection and entertainment, not a substitute for professional, medical, or legal advice.',
        ],
      },
      {
        heading: '3. Your Responsibilities',
        blocks: [
          'You provide accurate birth data where possible.',
          'You use the Service in compliance with law and you do not abuse, scrape, or reverse engineer the system beyond permitted use.',
        ],
      },
      {
        heading: '4. Payment Terms',
        blocks: [
          '**All prices are in euro (EUR).** We do not price in US dollars; any reference in older materials to USD is superseded by EUR pricing on the site and at Stripe checkout.',
          '**Taxes:** VAT or other applicable taxes may be shown or added at checkout as required by law.',
          '**Stripe:** card payments are processed by Stripe; their terms also apply.',
          '**Refunds:** digital goods are generally final once delivered unless mandatory consumer law in your country requires otherwise.',
          '**One-time** purchase unless clearly stated otherwise (no automatic subscription for the standard product flow).',
        ],
      },
      {
        heading: '5. Intellectual Property',
        blocks: [
          'The platform, branding, and generated layout are protected. Personal use of your report is allowed; resale or large-scale redistribution of our materials is not allowed without permission.',
        ],
      },
      {
        heading: '6. Disclaimers',
        blocks: [
          '**Astrology:** for reflection and entertainment; no guarantee of results.',
          '**Not medical/legal advice.**',
          '**Availability** of the site is “as available” without guarantee of uninterrupted access.',
        ],
      },
      {
        heading: '7. Limitation of Liability',
        blocks: [
          'To the maximum extent allowed by law, we are not liable for indirect damages; total liability is limited to what you paid for the specific order, except where such limits are prohibited.',
        ],
      },
      {
        heading: '8. Privacy',
        blocks: [
          'Our Privacy Policy explains data processing, including GDPR rights where applicable.',
        ],
      },
      {
        heading: '9. Termination',
        blocks: [
          'We may suspend access for abuse, fraud, or legal requirements.',
        ],
      },
      {
        heading: '10. Governing Law',
        blocks: [
          'These terms are subject to **Bulgarian law** where contractually allowed; EU consumer protections may also apply to EU users.',
        ],
      },
      {
        heading: '11. Changes',
        blocks: [
          'We may update these terms; continued use after changes can mean acceptance. Check this page for updates.',
        ],
      },
      {
        heading: '12. Contact',
        blocks: [
          '**Email:** contact@zlatevsoft.com',
        ],
      },
    ],
  },
  bg: {
    h1: 'Общи условия',
    lastUpdated: 'Последна актуализация:',
    sections: [
      {
        heading: '1. Приемане на условията',
        blocks: [
          'С използване на AI Astrology / AstroHoroscope.online („Услугата“) приемате настоящите общи условия. Ако не сте съгласни, не използвайте Услугата.',
        ],
      },
      {
        heading: '2. Описание на услугата',
        blocks: [
          'Предлагаме AI-подпомогнат астрологичен анализ (базов, задълбочен, пълен и др. варианти, видими на сайта) с отчет на екрана или PDF. **Цените са в евро (EUR).** Анализът е за личен размисъл и забавление, **не** замества медицински, психологичен или правен съвет.',
        ],
      },
      {
        heading: '3. Задължения на потребителя',
        blocks: [
          'Да въвеждате възможно най-точни данни за раждането.',
          'Да не злоупотребявате със системата, да не копирате или обръщате протоколите незаконно, да спазвате закона.',
        ],
      },
      {
        heading: '4. Плащане',
        blocks: [
          '**Всички цени са в евро (EUR).** Не държаме US долар като валута; при разминаване със стари материали важи цената в **EUR** на сайта и в Stripe при плащане.',
          '**ДДС и такси:** прилагането и показването в „checkout“ следва приложимите законови изисквания.',
          '**Stripe:** плащанията с карта преминават чрез Stripe; важат и техните условия.',
          '**Възстановяване:** дигиталните продукти обикновено са окончателни след доставка, **освен** ако задължителното потребителско право във Вашата държава изисква друго.',
          '**Еднократно** плащане, освен ако изрично не е друго (без стандартен абонамент за този продукт).',
        ],
      },
      {
        heading: '5. Интелектуална собственост',
        blocks: [
          'Софтуерът, марката и оформлението на отчети са защитени. Лично ползване на Вашия отчет – да; препродажба или мащабно разпространение без разрешение – не.',
        ],
      },
      {
        heading: '6. Откази от отговорност',
        blocks: [
          'Астрологията е за размисъл и удоволствие, без гаранция за резултат.',
          'Услугата **не** е медицински, психологичен или правен съвет.',
          'Достъпността на сайта е „както е“ без гаранция за непрекъсната работа.',
        ],
      },
      {
        heading: '7. Ограничаване на отговорност',
        blocks: [
          'Доколкото законът позволява, не носим косвени щети. Общата отговорност е ограничена до платената за конкретната поръчка сума, освен ако такова ограничение е забранено.',
        ],
      },
      {
        heading: '8. Поверителност',
        blocks: [
          'Обработката на лични данни е в Политиката за поверителност, включително права по GDPR, където е приложимо.',
        ],
      },
      {
        heading: '9. Прекратяване',
        blocks: [
          'Можем да ограничим достъп при злоупотреба, измама или по законово изискване.',
        ],
      },
      {
        heading: '10. Приложимо право',
        blocks: [
          'С подходящи ограничения, приложимо е **българското право**; на потребители от ЕС се прилагат и задължителните **европейски** норми, където е уместно.',
        ],
      },
      {
        heading: '11. Промени',
        blocks: [
          'Актуализираме условията; продълженото използване може да означава съгласие. Следете тази страница.',
        ],
      },
      {
        heading: '12. Контакт',
        blocks: [
          '**Имейл:** contact@zlatevsoft.com',
        ],
      },
    ],
  },
}
