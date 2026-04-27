import type { SiteLocale } from '@/lib/locale'

export const blogIndexCopy = {
  en: {
    h1: 'Astro Horoscope Blog',
    h2: 'AI Astrology Insights & Birth Chart Analysis',
    intro:
      'Discover expert astro horoscope articles, AI astrology insights, and professional birth chart analysis tips. Learn how cosmic forces shape your destiny at AstroHoroscope.online.',
    featured: 'Featured Article',
    cardHint: 'Astro Horoscope',
    readFull: 'Read Full Article',
    readMore: 'Read More',
    ctaTitle: 'Get Your Personal AI Astrology Birth Chart',
    ctaText: 'Ready to discover your cosmic blueprint? Personalized analysis from €19.',
    ctaButton: 'Start Your Birth Chart Analysis',
  },
  bg: {
    h1: 'Блог Astro Horoscope',
    h2: 'AI астрология и натална карта',
    intro:
      'Статии за астрологичен хороскоп, AI анализ и натална карта. Как космическите влияния оформят пътя ти – на AstroHoroscope.online.',
    featured: 'Избрана статия',
    cardHint: 'Astro Horoscope',
    readFull: 'Прочети цялата статия',
    readMore: 'Още',
    ctaTitle: 'Персонална натална карта с AI',
    ctaText: 'Готови ли сте за космическия си чертеж? Анализ от 19 €.',
    ctaButton: 'Започни наталния анализ',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

export type BlogListPost = {
  id: number
  slug: string
  date: string
  image: string
  featured: boolean
  title: string
  excerpt: string
  category: string
  readTime: string
  author: string
}

const teamEn = 'AstroHoroscope.online Team'
const teamBg = 'Екип AstroHoroscope.online'

const raw: Array<{
  id: number
  slug: string
  date: string
  image: string
  featured: boolean
  en: { title: string; excerpt: string; category: string; read: string }
  bg: { title: string; excerpt: string; category: string; read: string }
}> = [
  {
    id: 1,
    slug: 'understanding-birth-chart-ai-astrology-guide',
    date: '2024-01-15',
    image: '/blog/birth-chart-guide.jpg',
    featured: true,
    en: {
      title: 'Understanding Your Birth Chart: Complete AI Astrology Guide',
      excerpt:
        'Learn how to interpret your birth chart with AI astrology. Discover what your horoscope reveals about your personality and life path.',
      category: 'Birth Chart Analysis',
      read: '8 min read',
    },
    bg: {
      title: 'Наталната ти карта: пълен AI астрологичен пътеводител',
      excerpt:
        'Как да четеш картата си с AI астрология. Какви черти и път разкрива хороскопът ти.',
      category: 'Натална карта',
      read: '8 мин четене',
    },
  },
  {
    id: 2,
    slug: 'zodiac-signs-personality-traits-ai-astrology',
    date: '2024-01-14',
    image: '/blog/zodiac-traits.jpg',
    featured: false,
    en: {
      title: 'Zodiac Signs Personality Traits: AI Astrology Insights',
      excerpt: 'Personality patterns of each zodiac sign through AI astrology at AstroHoroscope.online.',
      category: 'Zodiac Analysis',
      read: '6 min read',
    },
    bg: {
      title: 'Зодиакални типове: AI поглед върху личността',
      excerpt: 'Характерни черти на зодиакалните знаци чрез AI анализ.',
      category: 'Зодии',
      read: '6 мин четене',
    },
  },
  {
    id: 3,
    slug: 'love-compatibility-zodiac-signs-ai-astrology',
    date: '2024-01-13',
    image: '/blog/love-compatibility.jpg',
    featured: false,
    en: {
      title: 'Love Compatibility: Zodiac Signs AI Guide',
      excerpt: 'Explore love compatibility with AI astrology. Find your cosmic match.',
      category: 'Love & Relationships',
      read: '7 min read',
    },
    bg: {
      title: 'Любов и съвместимост между зодии (AI)',
      excerpt: 'Как зодиакалните комбинации влияят на връзката – с AI поглед.',
      category: 'Любов',
      read: '7 мин четене',
    },
  },
  {
    id: 4,
    slug: 'career-astrology-zodiac-signs-professions',
    date: '2024-01-12',
    image: '/blog/career-astrology.jpg',
    featured: false,
    en: {
      title: 'Career Astrology: Best Professions for Each Sign',
      excerpt: 'Career paths that fit your zodiac sign with AI astrology.',
      category: 'Career Guidance',
      read: '6 min read',
    },
    bg: {
      title: 'Кариера и зодия: кои посоки подхождат',
      excerpt: 'Професионални тенденции по зодия с AI астрология.',
      category: 'Кариера',
      read: '6 мин четене',
    },
  },
  {
    id: 5,
    slug: 'daily-horoscope-ai-astrology-personalized',
    date: '2024-01-11',
    image: '/blog/daily-horoscope.jpg',
    featured: false,
    en: {
      title: 'Daily Horoscope: AI Personalized Predictions',
      excerpt: 'Personalized daily guidance with AI astrology at AstroHoroscope.online.',
      category: 'Daily Predictions',
      read: '5 min read',
    },
    bg: {
      title: 'Дневен хороскоп: персонален с AI',
      excerpt: 'Кратки прогнози и акценти за деня чрез AI анализ.',
      category: 'Дневен хороскоп',
      read: '5 мин четене',
    },
  },
  {
    id: 6,
    slug: 'planetary-transits-ai-astrology-guide',
    date: '2024-01-10',
    image: '/blog/planetary-transits.jpg',
    featured: false,
    en: {
      title: 'Planetary Transits: Guide to Cosmic Influences',
      excerpt: 'How transits affect your life with AI-assisted astrology.',
      category: 'Planetary Analysis',
      read: '7 min read',
    },
    bg: {
      title: 'Планетарни транзити: космически влияния',
      excerpt: 'Промени в небето и отражение върху теб – обяснено с AI астрология.',
      category: 'Планети',
      read: '7 мин четене',
    },
  },
  {
    id: 7,
    slug: 'astrological-aspects-ai-astrology-guide',
    date: '2024-01-09',
    image: '/blog/astrological-aspects.jpg',
    featured: false,
    en: {
      title: 'Astrological Aspects: Planetary Relationships',
      excerpt: 'Major aspects in your chart and what they mean for your life.',
      category: 'Aspect Analysis',
      read: '6 min read',
    },
    bg: {
      title: 'Астрологични аспекти: ъгли между планетите',
      excerpt: 'Съчетания между планети в картата ти – смисъл и акценти.',
      category: 'Аспекти',
      read: '6 мин четене',
    },
  },
  {
    id: 8,
    slug: 'astrological-houses-ai-astrology-guide',
    date: '2024-01-08',
    image: '/blog/astrological-houses.jpg',
    featured: false,
    en: {
      title: 'Astrological Houses: Life Areas in Your Chart',
      excerpt: 'Twelve houses and how they color love, work, and growth.',
      category: 'House Analysis',
      read: '7 min read',
    },
    bg: {
      title: 'Астрологични домове: житейски сфери',
      excerpt: 'Дванадесетте дома в картата – къде се разиграват темите в живота ти.',
      category: 'Домове',
      read: '7 мин четене',
    },
  },
  {
    id: 9,
    slug: 'astrological-elements-ai-astrology-guide',
    date: '2024-01-07',
    image: '/blog/astrological-elements.jpg',
    featured: false,
    en: {
      title: 'Elements: Fire, Earth, Air & Water in Your Chart',
      excerpt: 'How the four elements shape temperament and life themes.',
      category: 'Elemental Analysis',
      read: '5 min read',
    },
    bg: {
      title: 'Огън, Земя, Въздух и Вода в картата',
      excerpt: 'Четирите елемента – темперамент и стил в AI астрологията.',
      category: 'Елементи',
      read: '5 мин четене',
    },
  },
  {
    id: 10,
    slug: 'astrological-modalities-ai-astrology-guide',
    date: '2024-01-06',
    image: '/blog/astrological-modalities.jpg',
    featured: false,
    en: {
      title: 'Modalities: Cardinal, Fixed & Mutable Signs',
      excerpt: 'Initiative, stability, and adaptability across the zodiac.',
      category: 'Modality Analysis',
      read: '5 min read',
    },
    bg: {
      title: 'Кръстни, фиксирани и подвижни знаци',
      excerpt: 'Трите мода – как започваме, крепим и се променяме (AI обзор).',
      category: 'Модалности',
      read: '5 мин четене',
    },
  },
  {
    id: 11,
    slug: 'retrograde-planets-ai-astrology-guide',
    date: '2024-01-05',
    image: '/blog/retrograde-planets.jpg',
    featured: false,
    en: {
      title: 'Retrograde Planets: Mercury, Venus, Mars and More',
      excerpt: 'What retrograde motion means in your chart and daily life.',
      category: 'Retrograde Analysis',
      read: '5 min read',
    },
    bg: {
      title: 'Ретроградни планети: какво значи за теб',
      excerpt: 'Меркурий, Венера, Марс и др. – ретроградност, обяснена накратко.',
      category: 'Ретроград',
      read: '5 мин четене',
    },
  },
]

export function getBlogListPosts(locale: SiteLocale): BlogListPost[] {
  return raw.map((p) => {
    const s = locale === 'bg' ? p.bg : p.en
    return {
      id: p.id,
      slug: p.slug,
      date: p.date,
      image: p.image,
      featured: p.featured,
      title: s.title,
      excerpt: s.excerpt,
      category: s.category,
      readTime: s.read,
      author: locale === 'bg' ? teamBg : teamEn,
    }
  })
}
