import type { SiteLocale } from '@/lib/locale'

export const featuresSection = {
  en: {
    badge: '✨ Features',
    line1: 'Everything You Need',
    line2: 'for Your Astrological Journey',
    intro:
      'Rich tools for your birth chart—a clear interpretation flow, trusted calculations, and a secure checkout.',
    bottomLine: 'Ready to explore your cosmic blueprint?',
    bottomCta: 'Get Started Now',
  },
  bg: {
    badge: '',
    line1: 'Повече от обикновен хороскоп',
    line2: '',
    intro:
      'Персонален анализ, създаден специално според твоите рождени данни и житейски периоди.',
    bottomLine: 'Разбери какво ти подготвят звездите!',
    bottomCta: 'Започни анализа',
  },
} as const

export const featureCards = {
  en: [
    { title: 'Accurate Birth Charts', description: 'Precise natal charts with Swiss Ephemeris: planets and aspects.' },
    { title: 'Personal interpretation', description: 'Guidance framed around personality, recurring themes, and direction.' },
    { title: 'Privacy & Security', description: 'Your data is protected; we take privacy seriously.' },
    { title: 'Instant Results', description: 'Full chart and interpretation in moments, not days.' },
    { title: 'Personalized Insights', description: 'Written for your unique planetary picture.' },
    { title: 'Global Compatibility', description: 'Accurate for births anywhere, correct time zones.' },
    { title: 'Mobile Optimized', description: 'Works great on phone, tablet, and desktop; PWA-ready.' },
    { title: 'Secure Payments', description: 'Stripe and SSL for safe checkout in EUR.' },
  ],
  bg: [
    { title: 'Точни натални карти', description: 'Планети и аспекти с надеждни изчисления (Swiss Ephemeris).' },
    { title: 'Персонална интерпретация', description: 'Текст, който обобщава картата в разбираеми акценти.' },
    { title: 'Поверителност', description: 'Данните ти са защитени; доверието е приоритет.' },
    { title: 'Мигновен резултат', description: 'Карта и анализ за секунди, не дни.' },
    { title: 'Персонализация', description: 'Тълкуване според твоята планетна картина.' },
    { title: 'Цял свят', description: 'Точен часови пояс и координати отвсякъде.' },
    { title: 'Мобилен дизайн', description: 'Удобно на всички устройства; PWA възможност.' },
    { title: 'Сигурно плащане', description: 'Stripe и SSL; плащане в евро (€).' },
  ],
} as const

export const howItWorksSection = {
  en: {
    badge: '🚀 How It Works',
    line1: 'Simple 4-Step Process',
    line2: 'to Your Cosmic Insights',
    intro: 'Get your chart and written reading in four quick steps.',
    steps: [
      { title: 'Enter Your Details', description: 'Birth date, time, and place for accurate math.' },
      { title: 'Generate Birth Chart', description: 'We compute planetary positions and aspects.' },
      { title: 'Written reading', description: 'Your chart is turned into structured, readable guidance.' },
      { title: 'Get Your Report', description: 'Read online and download your PDF.' },
    ],
    ctaTitle: 'Ready to Start Your Journey?',
    ctaBody:
      'Join many others who use their chart to see personality patterns and life themes more clearly.',
    ctaButton: 'Get Your Birth Chart Now',
  },
  bg: {
    badge: '🚀 Как работи',
    line1: '4 прости стъпки',
    line2: 'към твоите инсайти',
    intro: 'Попълваш данни, изчисляваме картата и ти даваме структуриран текст – бързо и нагледно.',
    steps: [
      { title: 'Въведи данните', description: 'Дата, час и място на раждане за точна карта.' },
      { title: 'Генерира се картата', description: 'Изчисляваме планети и аспекти.' },
      { title: 'Ясна текстова интерпретация', description: 'Обобщаваме картата в разбираем отчет.' },
      { title: 'Получаваш отчет', description: 'Четеш в браузъра и теглиш PDF.' },
    ],
    ctaTitle: 'Разбери какво ти подготвят звездите!',
    ctaBody:
      'Хиляди потребители вече ползват картата си за по-добро самопознание и ориентир.',
    ctaButton: 'Започни анализа',
  },
} as const

type Testimonial = {
  content: string
  author: string
  role: string
  zodiac: string
  initial: string
  rating: number
}

const testimonialsEn: Testimonial[] = [
  {
    content:
      "This app is amazing — the reading matched my life themes. It's like a thoughtful companion for reflection.",
    author: 'Sarah J.',
    role: 'Marketing',
    zodiac: 'Libra',
    rating: 5,
    initial: 'S',
  },
  {
    content: 'I doubted it at first, but the chart and interpretation helped me see myself more clearly.',
    author: 'Michael C.',
    role: 'Engineer',
    zodiac: 'Scorpio',
    rating: 5,
    initial: 'M',
  },
  {
    content: 'Classic astrology framing with modern clarity — deep but practical. I recommend it.',
    author: 'Emma R.',
    role: 'Coach',
    zodiac: 'Pisces',
    rating: 5,
    initial: 'E',
  },
  {
    content: "I've read charts for years — here the focus and phrasing are surprisingly on point.",
    author: 'David T.',
    role: 'Hobbyist',
    zodiac: 'Capricorn',
    rating: 5,
    initial: 'D',
  },
  {
    content: 'Clean design, easy flow, and results in minutes. Very smooth experience.',
    author: 'Lisa P.',
    role: 'Designer',
    zodiac: 'Gemini',
    rating: 5,
    initial: 'L',
  },
  {
    content: "I've tried other apps; this one stands out for clarity and depth.",
    author: 'Alex M.',
    role: 'Founder',
    zodiac: 'Aries',
    rating: 5,
    initial: 'A',
  },
]

const testimonialsBg: Testimonial[] = [
  {
    content:
      'Много съм доволна – текстът пасва на това, което усещам за себе си. Удобно за размисъл върху силни и слаби страни.',
    author: 'Сара Й.',
    role: 'Маркетинг',
    zodiac: 'Везни',
    rating: 5,
    initial: 'С',
  },
  {
    content: 'Първоначално бях скептик, но картата и анализът ме накараха да преосмисля няколко навици.',
    author: 'Михаил Ч.',
    role: 'ИТ',
    zodiac: 'Скорпион',
    rating: 5,
    initial: 'М',
  },
  {
    content: 'Класическа астрология, поднесена модерно – съдържателно и практично. Препоръчвам.',
    author: 'Ема Р.',
    role: 'Коуч',
    zodiac: 'Риби',
    rating: 5,
    initial: 'Е',
  },
  {
    content: 'Имам опит с карти; тук тонът и акцентите са изненадващо точни за кратък отчет.',
    author: 'Давид Т.',
    role: 'Любител',
    zodiac: 'Козирог',
    rating: 5,
    initial: 'Д',
  },
  {
    content: 'Интерфейсът е чист, стъпките ясни, резултатът идва бързо. Удобно на телефон.',
    author: 'Лилия П.',
    role: 'UX',
    zodiac: 'Близнаци',
    rating: 5,
    initial: 'Л',
  },
  {
    content: 'Пробвах няколко приложения – тук качеството на обясненията е от най-високите.',
    author: 'Алекс М.',
    role: 'Предприемач',
    zodiac: 'Овен',
    rating: 5,
    initial: 'А',
  },
]

export const testimonialsHead = {
  en: {
    badge: '⭐ Testimonials',
    line1: 'What Our Users Say',
    line2: 'About Their Experience',
    intro: 'Read how others use their birth chart to understand themselves better.',
  },
  bg: {
    badge: '⭐ Отзиви',
    line1: 'Какво казват потребителите',
    line2: 'за опита си',
    intro: 'Кратки впечатления от хора, които вече ползват анализа.',
  },
} as const

export const statsRow = {
  en: [
    { label: 'Charts generated', value: '10,000+', icon: '📊' as const },
    { label: 'Average Rating', value: '4.9/5', icon: '⭐' as const },
    { label: 'Countries', value: '50+', icon: '🌍' as const },
    { label: 'Happy Readers', value: '8,500+', icon: '😊' as const },
  ],
  bg: [
    {
      label: 'Любим избор на хиляди потребители',
      value: '★★★★★',
      icon: '⭐' as const,
    },
    { label: 'Средна оценка', value: '4,9/5', icon: '⭐' as const },
    { label: 'Държави', value: '50+', icon: '🌍' as const },
    { label: 'Доволни', value: '8 500+', icon: '😊' as const },
  ],
} as const

export const testimonialsBottom = {
  en: {
    title: 'Join Our Community',
    body: 'Start with a plan in EUR, get your reading, and keep your PDF for later.',
    button: 'Get Your Birth Chart Now',
  },
  bg: {
    title: 'Присъедини се',
    body: 'Избери план в евро, вземи анализа и запази PDF за себе си.',
    button: 'Към плановете',
  },
} as const

export function getTestimonialsList(locale: SiteLocale): Testimonial[] {
  return locale === 'bg' ? testimonialsBg : testimonialsEn
}
