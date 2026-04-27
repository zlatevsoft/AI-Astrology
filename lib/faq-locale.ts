import type { SiteLocale } from '@/lib/locale'

export const faqPage = {
  en: {
    title: 'Frequently Asked Questions',
    still: 'Still have questions?',
    contact: 'Contact Us',
  },
  bg: {
    title: 'Често задавани въпроси',
    still: 'Още въпроси?',
    contact: 'Свържи се с нас',
  },
} as const satisfies Record<SiteLocale, Record<string, string>>

type Qa = { q: string; a: string }

const enQa: Qa[] = [
  {
    q: 'What is AI Astrology?',
    a: 'AI Astrology combines traditional astrological principles with advanced artificial intelligence to provide personalized cosmic insights. Our AI analyzes your birth chart data to generate detailed personality profiles, life path guidance, and relationship compatibility insights.',
  },
  {
    q: 'How accurate are the readings?',
    a: 'Our AI-powered analysis provides insights based on established astrological principles and patterns. While we strive for accuracy, results should be used for self-reflection and entertainment purposes. The quality of analysis depends on the accuracy of birth information provided.',
  },
  {
    q: 'What information do I need to provide?',
    a: "You'll need your full name, exact birth date, birth time, and birth location. The more accurate this information is, the more precise your analysis will be. If you don't know your exact birth time, you can use 12:00 PM as a default.",
  },
  {
    q: "What's the difference between the three plans?",
    a: '<strong>Basic Reading (€19):</strong> Core personality insights and life path guidance.<br/><strong>Detailed Analysis (€29):</strong> Everything in Basic plus a comprehensive personality profile, soul mission, and advanced insights.<br/><strong>Comprehensive Reading (€39):</strong> Relationship compatibility for two people, including synastry and compatibility insights.',
  },
  {
    q: 'How do I get my PDF report?',
    a: 'After payment and analysis generation, you will see a "Download PDF" button on the results page. Click it to download your personalized report. The PDF includes your complete analysis and can be saved or shared.',
  },
  {
    q: 'Is my personal data secure?',
    a: 'Yes. All data transmission is encrypted with SSL, payments are processed securely through Stripe, and we comply with GDPR requirements. Your birth data is used only for analysis and is not sold to third parties.',
  },
  {
    q: 'Can I get a refund?',
    a: 'All sales are final as the service is delivered immediately upon payment. If you experience technical issues, contact us at contact@zlatevsoft.com and we will help.',
  },
  {
    q: 'How long does the analysis take?',
    a: 'Generation typically takes 30–60 seconds. You will see a progress indicator during generation.',
  },
  {
    q: 'Can I use this for relationship advice?',
    a: 'The Comprehensive Reading offers compatibility insights, but it does not replace professional counseling or therapy. Use insights for self-reflection, not as the sole basis for major decisions.',
  },
  {
    q: "What if I don't know my birth time?",
    a: 'You can use 12:00 (noon) as an estimate. Some house details may be less precise, but the core reading remains useful.',
  },
  {
    q: 'Is this service available worldwide?',
    a: 'Yes. We use Stripe; prices are shown in euro (€), and your bank may convert the charge to your local currency.',
  },
  {
    q: 'Can I share my analysis with others?',
    a: 'Your analysis is for personal use. You may share the PDF with friends or family, but you may not resell it or use it commercially.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email contact@zlatevsoft.com. We usually respond within 24 hours on business days. Include your order details if relevant.',
  },
]

const bgQa: Qa[] = [
  {
    q: 'Какво е AI Astrology?',
    a: 'AI Astrology съчетава класическа астрология с изкуствен интелект, за да даде персонализирани космически инсайти. Моделът анализира наталната ти карта – личност, път и съвместимост.',
  },
  {
    q: 'Колко са точни отчетите?',
    a: 'Анализът следва общоприети астрологични принципи. Резултатите са за самопознание и забавление; за по-добра точност подайте точна рождена дата, час и място.',
  },
  {
    q: 'Каква информация трябва да подам?',
    a: 'Пълно име, дата, час и място на раждане. Колкото е по-точна, толкова по-добър е анализът. Ако няма час, използвайте 12:00 ч. като приближение.',
  },
  {
    q: 'С какво се различават трите плана?',
    a: '<strong>Базов (19 €):</strong> личност и житейски фокус.<br/><strong>Задълбочен (29 €):</strong> всичко от Базов + душевни теми, по-пълен профил.<br/><strong>Пълна съвместимост (39 €):</strong> анализ за двама, синастрия и партньорство.',
  },
  {
    q: 'Как да сваля PDF отчета?',
    a: 'След плащане и генериране ще видите бутон „Изтегли PDF“ на страницата с резултата. Може да го споделите с близки за лична употреба.',
  },
  {
    q: 'Сигурни ли са моите данни?',
    a: 'Да. Каналът е SSL, плащанията – чрез Stripe, спазваме GDPR. Данните за раждане се ползват само за анализа.',
  },
  {
    q: 'Има ли връщане на пари?',
    a: 'Услугата се доставя веднага след плащане, затова възстановяване не е стандартно. При технически проблем пишете на contact@zlatevsoft.com.',
  },
  {
    q: 'Колко време отнема анализът?',
    a: 'Обикновено 30–60 секунди; има индикатор за напредък.',
  },
  {
    q: 'Може ли за партньорски съвети?',
    a: 'Планът за съвместимост дава ориентири, но не замества психолог или терапевт. Ползвайте го за осъзнатост, не като единствен източник за важни решения.',
  },
  {
    q: 'Ако нямам рожден час?',
    a: 'Използвайте 12:00 ч. Домовете може да са по-неточни, но основните акценти остават полезни.',
  },
  {
    q: 'Достъпно ли е навсякъде?',
    a: 'Да. Цените са в евро (€); банката може да конвертира в местна валута чрез Stripe.',
  },
  {
    q: 'Може ли да споделя анализа?',
    a: 'Личен е; PDF с приятел е ок, без търговска употреба или препродажба.',
  },
  {
    q: 'Как да пиша за поддръжка?',
    a: 'contact@zlatevsoft.com – в рамките на около 24 ч в работни дни. Включете детайли за поръчката, ако има такава.',
  },
]

export function getFaqItems(locale: SiteLocale): Qa[] {
  return locale === 'bg' ? bgQa : enQa
}
