import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import OpenAI from 'openai'
import { validateAndSanitizeBirthData, validateAndSanitizePartnerData } from '@/lib/validation'

export const maxDuration = 60

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_EN = `You are an expert astrologer with deep knowledge of Western astrology, planetary influences, and psychological astrology. Provide insightful, personalized interpretations that are both accurate and meaningful. Focus on practical insights that can help the person understand themselves better. Do not calculate, correct, apologize about, or discuss the client's age unless the user explicitly asks for age. Start the report directly with the first heading. Do not include conversational preambles such as "of course", "sure", "let's look", or similar setup phrases.`

const SYSTEM_BG = `Ти си опитен астролог с дълбоки познания по западната астрология, планетарните влияния и психологическата астрология. Давай уместни, персонални тълкувания, които са едновременно точни и смислени. Фокусирай се върху практични прозрения, които помагат на човека да се разбира по-добре. Не изчислявай, не поправяй, не се извинявай и не обсъждай възрастта на клиента, освен ако потребителят изрично не попита за възраст. Започвай доклада директно с първото заглавие. Не добавяй разговорни подводки като "разбира се", "нека разгледаме", "с удоволствие" или подобни фрази. Отговаряй изцяло на български език.`

const BG_COMPLETION_INSTRUCTION = `

---
ВАЖНО: Пиши целия анализ на български език. Западна астрология; използвай приети български термини. Всички заглавия, подзаглавия, списъци, етикети и препоръки трябва да са на български. Не оставяй английски фрази като "Executive Summary", "Warning sign", "Do this instead", "Action Plan", "Checklist" или други английски labels. Използвай правилен правопис, пунктуация и естествен литературен български.`

const ANALYSIS_MIN_LENGTH: Record<string, number> = {
  basic: 2400,
  detailed: 6500,
  comprehensive: 5500,
}

const REFUSAL_PATTERNS = [
  /съжалявам/i,
  /не мога да предоставя/i,
  /не мога да изготвя/i,
  /не мога да генерирам/i,
  /мога да предложа кратък/i,
  /уведомете ме как/i,
  /i'?m sorry/i,
  /i cannot provide/i,
  /i can'?t provide/i,
  /unable to provide/i,
  /as an ai/i,
]

function countMarkdownSections(content: string): number {
  return (content.match(/^#{1,3}\s+/gm) || []).length
}

function validateGeneratedAnalysis(
  content: string,
  analysisType: string,
  locale: 'en' | 'bg'
): { valid: true } | { valid: false; reason: string } {
  const normalized = content.trim()
  if (!normalized) {
    return { valid: false, reason: 'empty analysis' }
  }

  const refusal = REFUSAL_PATTERNS.find((pattern) => pattern.test(normalized))
  if (refusal) {
    return { valid: false, reason: `refusal/apology detected: ${refusal}` }
  }

  const minLength = ANALYSIS_MIN_LENGTH[analysisType] || ANALYSIS_MIN_LENGTH.basic
  if (normalized.length < minLength) {
    return {
      valid: false,
      reason: `analysis too short (${normalized.length} chars, expected at least ${minLength})`,
    }
  }

  const sections = countMarkdownSections(normalized)
  const minSections = analysisType === 'detailed' ? 10 : analysisType === 'comprehensive' ? 8 : 4
  if (sections < minSections) {
    return {
      valid: false,
      reason: `too few sections (${sections}, expected at least ${minSections})`,
    }
  }

  if (locale === 'bg') {
    const englishLabels = [
      /executive summary/i,
      /warning sign/i,
      /do this instead/i,
      /action plan/i,
      /checklist/i,
      /closing synthesis/i,
      /self-reflection questions/i,
      /relationships?:/i,
      /career/i,
      /money and security/i,
    ]
    const englishLabel = englishLabels.find((pattern) => pattern.test(normalized))
    if (englishLabel) {
      return { valid: false, reason: `English label detected in Bulgarian report: ${englishLabel}` }
    }
  }

  return { valid: true }
}

// Validation schema for AI analysis request
const AIAnalysisSchema = z.object({
  birthChart: z.object({
    id: z.string(),
    birthData: z.object({
      name: z.string(),
      date: z.string(),
      time: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      location: z.string(),
    }),
    planetaryPositions: z.record(z.object({
      sign: z.string(),
      degree: z.number(),
      house: z.number(),
    })),
    houses: z.array(z.object({
      house: z.number(),
      sign: z.string(),
      degree: z.number(),
    })),
    aspects: z.array(z.object({
      planet1: z.string(),
      planet2: z.string(),
      type: z.string(),
      orb: z.number(),
    })),
  }),
  partnerBirthChart: z.object({
    id: z.string(),
    birthData: z.object({
      name: z.string(),
      date: z.string(),
      time: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      location: z.string(),
    }),
    planetaryPositions: z.record(z.object({
      sign: z.string(),
      degree: z.number(),
      house: z.number(),
    })),
    houses: z.array(z.object({
      house: z.number(),
      sign: z.string(),
      degree: z.number(),
    })),
    aspects: z.array(z.object({
      planet1: z.string(),
      planet2: z.string(),
      type: z.string(),
      orb: z.number(),
    })),
  }).optional(),
  analysisType: z.enum(['basic', 'detailed', 'comprehensive']).default('basic'),
  locale: z.enum(['en', 'bg']).default('en'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Received request body:', JSON.stringify(body, null, 2))
    
    // Enhanced security: Validate and sanitize input
    const validatedData = AIAnalysisSchema.parse(body)
    
    // Additional security checks
    if (!validatedData.birthChart?.birthData) {
      return NextResponse.json(
        { error: 'Invalid birth chart data' },
        { status: 400 }
      )
    }
    
    // Sanitize birth data
    try {
      validateAndSanitizeBirthData(validatedData.birthChart.birthData)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid birth data format' },
        { status: 400 }
      )
    }
    
    // Sanitize partner data if present
    if (validatedData.partnerBirthChart?.birthData) {
      try {
        validateAndSanitizePartnerData(validatedData.partnerBirthChart.birthData)
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid partner birth data format' },
          { status: 400 }
        )
      }
    }
    
    const { birthChart, analysisType, locale } = validatedData

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API key is not configured. A real AI analysis cannot be generated.',
        },
        { status: 503 }
      )
    }

    // Create prompt for AI analysis
    const basePrompt = createAnalysisPrompt(birthChart, validatedData.partnerBirthChart, analysisType)
    const userPrompt = locale === 'bg' ? basePrompt + BG_COMPLETION_INSTRUCTION : basePrompt
    const systemMessage = locale === 'bg' ? SYSTEM_BG : SYSTEM_EN

    const compactPrompt = createCompactRecoveryPrompt(
      birthChart,
      validatedData.partnerBirthChart,
      analysisType,
      locale
    )
    const generationAttempts = [
      {
        label: 'full-openai-report',
        prompt: userPrompt,
        timeout: 22000,
        maxTokens: analysisType === 'comprehensive' ? 8500 : analysisType === 'detailed' ? 8500 : 4200,
        strict: true,
      },
      {
        label: 'strict-retry-openai-report',
        prompt: createRetryPrompt(userPrompt, analysisType, locale, 'first attempt did not produce a complete report'),
        timeout: 18000,
        maxTokens: analysisType === 'comprehensive' ? 7000 : analysisType === 'detailed' ? 7000 : 3600,
        strict: true,
      },
      {
        label: 'compact-openai-report',
        prompt: compactPrompt,
        timeout: 16000,
        maxTokens: analysisType === 'comprehensive' ? 5200 : analysisType === 'detailed' ? 5200 : 3000,
        strict: false,
      },
    ]

    let completion: Awaited<ReturnType<typeof openai.chat.completions.create>> | null = null
    let analysis = ''
    let lastGenerationError = ''

    for (const attempt of generationAttempts) {
      try {
        console.log(`Attempting ${attempt.label} with gpt-4o-mini...`)
        const attemptCompletion = await openai.chat.completions.create(
          {
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  systemMessage +
                  (locale === 'bg'
                    ? ' Генерирай завършен клиентски доклад сега. Не връщай грешка, не искай уточнения и не споменавай технически ограничения.'
                    : ' Generate a complete client-facing report now. Do not return an error, ask for clarification, or mention technical limitations.'),
              },
              {
                role: 'user',
                content: attempt.prompt,
              },
            ],
            max_tokens: attempt.maxTokens,
            temperature: attempt.strict ? 0.55 : 0.4,
          },
          { timeout: attempt.timeout }
        )

        const attemptAnalysis = attemptCompletion.choices[0]?.message?.content?.trim()
        if (!attemptAnalysis) {
          lastGenerationError = `${attempt.label}: empty OpenAI response`
          continue
        }

        const validation = validateGeneratedAnalysis(attemptAnalysis, analysisType, locale)
        const validationReason = validation.valid ? '' : validation.reason
        const relaxedCompactAccept =
          !attempt.strict &&
          attemptAnalysis.length >= 1200 &&
          !validationReason.includes('refusal/apology') &&
          !validationReason.includes('English label')

        if (validation.valid || relaxedCompactAccept) {
          analysis = attemptAnalysis
          completion = attemptCompletion
          break
        }

        lastGenerationError = `${attempt.label}: ${validation.reason}`
        console.error('OpenAI attempt did not pass validation:', lastGenerationError)
      } catch (attemptError) {
        lastGenerationError =
          attemptError instanceof Error ? `${attempt.label}: ${attemptError.message}` : `${attempt.label}: unknown error`
        console.error('OpenAI attempt failed:', attemptError)
      }
    }

    if (!analysis || !completion) {
      throw new Error(lastGenerationError || 'OpenAI did not return a usable analysis')
    }

    // Structure the response
    const structuredAnalysis = {
      id: `analysis_${Date.now()}`,
      birthChartId: birthChart.id,
      analysisType,
      content: analysis,
      generatedAt: new Date().toISOString(),
      model: completion.model || 'gpt-4-1106-preview',
      tokensUsed: completion.usage?.total_tokens || 0,
      cost: calculateCost(completion.usage, completion.model),
    }

    return NextResponse.json({
      success: true,
      data: structuredAnalysis,
    })

  } catch (error) {
    console.error('Analysis generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input data',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Real AI generation failed after retry. Please try again shortly.',
      },
      { status: 500 }
    )
  }
}

function calculateCost(usage: any, model: string): number {
  if (!usage) return 0;
  
  const inputTokens = usage.prompt_tokens || 0;
  const outputTokens = usage.completion_tokens || 0;
  
  // Цените са на 1K tokens (обновени за новите модели)
  const prices: { [key: string]: { input: number; output: number } } = {
    'gpt-4o': { input: 0.005, output: 0.015 }, // GPT-4o - най-новата и най-евтина версия
    'gpt-4': { input: 0.03, output: 0.06 }, // GPT-4
    'gpt-4-1106-preview': { input: 0.01, output: 0.03 }, // GPT-4 Turbo (стара версия)
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 }, // GPT-3.5 Turbo
    'gpt-3.5-turbo-1106': { input: 0.001, output: 0.002 }, // GPT-3.5 Turbo
  };
  
  const price = prices[model] || prices['gpt-4o'];
  const inputCost = (inputTokens / 1000) * price.input;
  const outputCost = (outputTokens / 1000) * price.output;
  
  return Math.round((inputCost + outputCost) * 100) / 100; // Закръгляне до 2 знака
}

function createRetryPrompt(originalPrompt: string, analysisType: string, locale: 'en' | 'bg', reason: string) {
  const requiredTone =
    locale === 'bg'
      ? `Предишният отговор беше невалиден (${reason}). Напиши ПЪЛЕН анализ с всички секции. Започни директно с първото заглавие. Не добавяй "разбира се", "нека", "с удоволствие" или друга разговорна подводка. Не се извинявай, не отказвай и не предлагай кратък вариант. Това е астрологичен развлекателен и саморефлексивен доклад, не медицинска, правна или финансова диагноза. Използвай конкретни, но недетерминистични формулировки: "може да показва", "вероятна тенденция", "ако това резонира".`
      : `The previous response was invalid (${reason}). Write the FULL analysis with all sections. Start directly with the first heading. Do not add "of course", "sure", "let's", or any conversational preamble. Do not apologize, refuse, or offer a shorter version. This is an astrology entertainment and self-reflection report, not medical, legal, or financial advice. Use concrete but non-deterministic phrasing: "may suggest", "likely tendency", "if this resonates".`

  const sectionReminder =
    locale === 'bg'
      ? analysisType === 'detailed'
        ? `Задължително включи: резюме; астрологична основа с планети, домове и аспекти; ежедневни прояви; любов и емоционални модели; кариера и финансов потенциал; житейски цикли, силни и слаби периоди; повтарящи се модели; самосаботаж; стрес и решения; семейни модели; план за действие; 12 въпроса; 10 признака извън пътя; 10 признака в синхрон; финален синтез.`
        : analysisType === 'comprehensive'
          ? `Задължително включи: сравнение на двете натални карти; любовна и емоционална съвместимост; комуникация; привличане; силни страни; конфликти; дългосрочен потенциал; подходящи периоди; практически стратегии.`
          : `Задължително включи: личност и силни страни; любов; кариера; скрит потенциал; планетарни влияния; житейски уроци; практически съвети.`
      : analysisType === 'detailed'
        ? `Must include: executive summary; astrological foundation with planets, houses, aspects; daily traits; love and emotional models; career and financial potential; life cycles, strong and weak periods; repeated patterns; self-sabotage; stress and decisions; family patterns; action plan; 12 questions; 10 off-path signs; 10 aligned signs; closing synthesis.`
        : analysisType === 'comprehensive'
          ? `Must include: comparison between both natal charts; love and emotional compatibility; communication; attraction; strengths; conflicts; long-term potential; suitable timing; practical strategies.`
          : `Must include: personality and strengths; love; career; hidden potential; planetary influences; life lessons; practical advice.`

  return `${requiredTone}

${sectionReminder}

${originalPrompt}`
}

function createCompactRecoveryPrompt(
  birthChart: z.infer<typeof AIAnalysisSchema>['birthChart'],
  partnerBirthChart: z.infer<typeof AIAnalysisSchema>['partnerBirthChart'],
  analysisType: z.infer<typeof AIAnalysisSchema>['analysisType'],
  locale: z.infer<typeof AIAnalysisSchema>['locale']
) {
  const { birthData, planetaryPositions, houses, aspects } = birthChart
  const coreChart = `
Client:
- Name: ${birthData.name}
- Date: ${birthData.date}
- Time: ${birthData.time}
- Location: ${birthData.location}

Planets:
${Object.entries(planetaryPositions)
  .map(([planet, data]) => `- ${planet}: ${data.sign} ${data.degree}° (House ${data.house})`)
  .join('\n')}

Houses:
${houses.map((house) => `- House ${house.house}: ${house.sign} ${house.degree}°`).join('\n')}

Aspects:
${aspects.map((aspect) => `- ${aspect.planet1} ${aspect.type} ${aspect.planet2} (${aspect.orb}°)`).join('\n')}`

  const partnerChart = partnerBirthChart
    ? `

Partner:
- Name: ${partnerBirthChart.birthData.name}
- Date: ${partnerBirthChart.birthData.date}
- Time: ${partnerBirthChart.birthData.time}
- Location: ${partnerBirthChart.birthData.location}

Partner planets:
${Object.entries(partnerBirthChart.planetaryPositions)
  .map(([planet, data]) => `- ${planet}: ${data.sign} ${data.degree}° (House ${data.house})`)
  .join('\n')}

Partner aspects:
${partnerBirthChart.aspects
  .map((aspect) => `- ${aspect.planet1} ${aspect.type} ${aspect.planet2} (${aspect.orb}°)`)
  .join('\n')}`
    : ''

  if (locale === 'bg') {
    const sections =
      analysisType === 'comprehensive'
        ? `1. **Обща съвместимост**
2. **Емоционална и любовна динамика**
3. **Комуникация и мислене**
4. **Привличане, близост и напрежение**
5. **Силни страни на връзката**
6. **Рискове и възможни конфликти**
7. **Дългосрочен потенциал**
8. **Подходящи периоди и решения**
9. **Практически насоки за двамата**`
        : analysisType === 'detailed'
          ? `1. **Резюме на наталната карта**
2. **Планети, домове и аспекти**
3. **Личност и ежедневни модели**
4. **Любов и емоционални потребности**
5. **Кариера, призвание и финансов потенциал**
6. **Житейски цикли, силни и чувствителни периоди**
7. **Повтарящи се модели и самосаботаж**
8. **План за действие**
9. **Въпроси за саморефлексия**
10. **Финален синтез**`
          : `1. **Личност и силни страни**
2. **Любов и взаимоотношения**
3. **Кариера и житейски насоки**
4. **Скрит потенциал и планетарни влияния**
5. **Практически съвети**`

    return `${coreChart}${partnerChart}

Създай реален астрологичен доклад според избрания план: ${analysisType}.
Пиши САМО на български език, с правилен правопис и естествен стил. Започни директно с първото заглавие. Без въведения, извинения, технически бележки, fallback обяснения или английски labels.
Докладът трябва да е завършен, професионален и практически полезен. Използвай markdown заглавия с ## и удебелявай важните изводи.

Задължителна структура:
${sections}`
  }

  const sections =
    analysisType === 'comprehensive'
      ? `1. **Overall Compatibility**
2. **Emotional and Love Dynamics**
3. **Communication**
4. **Attraction and Tension**
5. **Relationship Strengths**
6. **Risks and Conflicts**
7. **Long-Term Potential**
8. **Timing and Decisions**
9. **Practical Guidance**`
      : analysisType === 'detailed'
        ? `1. **Birth Chart Summary**
2. **Planets, Houses, and Aspects**
3. **Personality and Daily Patterns**
4. **Love and Emotional Needs**
5. **Career, Calling, and Financial Potential**
6. **Life Cycles and Sensitive Periods**
7. **Repeated Patterns and Self-Sabotage**
8. **Action Plan**
9. **Self-Reflection Questions**
10. **Closing Synthesis**`
        : `1. **Personality and Strengths**
2. **Love and Relationships**
3. **Career and Life Direction**
4. **Hidden Potential and Planetary Influences**
5. **Practical Advice**`

  return `${coreChart}${partnerChart}

Create a real astrological report for the selected plan: ${analysisType}.
Start directly with the first heading. No preamble, apology, technical note, fallback explanation, or placeholder language.
The report must be complete, professional, and practical. Use markdown headings with ## and bold the key points.

Required structure:
${sections}`
}

function createAnalysisPrompt(birthChart: any, partnerBirthChart: any, analysisType: string) {
  const { birthData, planetaryPositions, houses, aspects } = birthChart
  
  const birthDate = new Date(birthData.date)
  
  // Base chart information
  const chartInfo = `Birth Chart Data:
- Date: ${birthDate.toLocaleDateString()}
- Time: ${birthData.time}
- Location: ${birthData.location}

Key Planetary Positions:
${Object.entries(planetaryPositions).map(([planet, data]: [string, any]) => 
  `- ${planet}: ${data.sign} ${data.degree}° (House ${data.house})`
).join('\n')}

Important Aspects:
${aspects.map((aspect: any) => 
  `- ${aspect.planet1} ${aspect.type} ${aspect.planet2} (${aspect.orb}° orb)`
).join('\n')}

Houses:
${houses.map((house: any) => 
  `- House ${house.house}: ${house.sign} ${house.degree}°`
).join('\n')}`

  // Different prompts for each analysis type
  switch (analysisType) {
    case 'basic':
      return `${chartInfo}

You are an expert astrologer providing a BASIC astrological reading. Focus on essential insights that are immediately practical and actionable.

This BASIC plan must cover everything promised on the pricing card:
- personality analysis and strengths;
- love and relationships;
- career and life guidance;
- hidden potential and talents;
- important planetary influences;
- key life lessons/challenges;
- clear PDF-ready structure.

Please provide a concise, beginner-friendly analysis covering:

1. **Core Personality (2-3 paragraphs)**
   - Main character traits based on Sun, Moon, and Ascendant
   - How they naturally express themselves
   - Key personality strengths

2. **Life Purpose (1-2 paragraphs)**
   - Main life lessons and soul mission
   - What they're here to learn and share
   - Simple guidance for direction

3. **Relationships & Career (2-3 paragraphs)**
   - Basic relationship patterns and needs
   - Career inclinations and work style
   - Simple advice for improvement

4. **Current Growth (1-2 paragraphs)**
   - What they're learning now
   - 3-5 practical tips for personal development
   - Encouragement and positive reinforcement

5. **Hidden Potential & Key Lessons (1-2 paragraphs)**
   - Hidden talents and strengths they may underestimate
   - Important planetary influences in plain language
   - 3 key lessons/challenges and what to do about them

Keep the tone warm, encouraging, and easy to understand. Focus on practical insights that can be applied immediately. Use simple language and avoid complex astrological jargon.`

    case 'detailed':
      return `${chartInfo}

You are an expert astrologer and psychologically literate life-strategy guide providing a PREMIUM / DETAILED reading. The purpose is not only to describe the person, but to help them recognize patterns, make better decisions, and know what to do with the information.

This PREMIUM plan must include everything promised on the pricing card:
- everything from the Basic plan;
- complete personality and psychological profile;
- love, relationships, and emotional models;
- career and financial potential;
- upcoming opportunities and changes;
- strong and weak periods;
- life cycles and timing analysis;
- personal guidance and practical recommendations;
- premium PDF-ready structure.

IMPORTANT STYLE RULES:
- Do not present astrology as absolute fact. Use phrasing such as "this may suggest", "one useful interpretation is", "watch for", "a likely pattern is", "if this resonates".
- Do not mention, correct, apologize about, or calculate the client's age. The user enters birth data, not age, and age is not part of the report.
- For every astrological statement, explain the cause-and-effect chain: placement/aspect -> daily behavior -> advantage -> risk -> signal that the pattern is becoming unhealthy -> practical response.
- Avoid vague advice like "develop emotional intelligence". Translate every recommendation into observable behavior.
- Include concrete examples from real life.
- Use headings, bullets, short paragraphs, and checklists. The result should feel like a practical self-analysis manual, not a poetic description.
- Prioritize. Make clear what matters most and what can wait.

Please structure the analysis exactly like this:

1. **Executive Summary: What This Chart Is Really About**
   - 5-7 bullet points.
   - The strongest qualities.
   - The 3 biggest risks.
   - The one pattern they should work on first.
   - One sentence: "If you work on only one thing, work on..."

2. **Astrological Foundation: Planets, Houses, and Aspects**
   - Complete personality profile using Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, and the strongest chart themes.
   - Explain the most important houses and what life areas they activate.
   - Explain the most important aspects and their psychological meaning.
   - For every point: what it describes, how it shows in real life, advantage, risk, and practical use.

3. **How Your Main Traits Work in Daily Life**
   For the strongest Sun/Moon/Mercury/Venus/Mars themes:
   - What this looks like day to day.
   - Where it helps.
   - Where it hurts.
   - "Warning sign:" how they know they crossed the line.
   - "Do this instead:" one practical corrective action.

4. **Love, Relationships, and Emotional Models**
   - Relationship needs and attachment patterns.
   - How emotional security or insecurity appears in behavior.
   - Common romantic traps and boundary issues.
   - What kinds of people they attract, and what kinds of dynamics they should avoid.
   - 5 reflection questions.

5. **Career, Calling, and Financial Potential**
   - Career inclinations and suitable environments.
   - Unsuitable work environments.
   - Financial patterns and risks.
   - Business/entrepreneurial potential if supported by the chart.
   - Typical career mistakes and how to correct them.

6. **Life Cycles, Timing, and Strong/Weak Periods**
   - Current life phase and developmental stage.
   - Strong periods: when to act, initiate, be visible, ask, negotiate.
   - Weak/sensitive periods: when to slow down, avoid impulsive commitments, repair, observe.
   - Practical "if/then" guidance for coming years without deterministic predictions.

7. **Repeated Life Patterns**
   - Situations likely to repeat until understood.
   - Types of people/situations they may repeatedly attract.
   - What lesson may be hidden there.
   - Phrase karmic themes as hypotheses for reflection, not certainties.

8. **Self-Sabotage and Shadow Patterns**
   - How they sabotage themselves under stress.
   - What they avoid admitting.
   - What they overcompensate for.
   - Use direct "If you notice X, it may mean Y" warnings.

9. **Stress Response and Decision-Making**
   - How they react when pressured, rejected, ignored, criticized, or rushed.
   - How they make good decisions vs bad decisions.
   - Include decision rules such as "wait one night", "ask for specifics", "do not promise while emotionally activated", when astrologically appropriate.

10. **Family / Ancestral / Early Conditioning Patterns**
   - Only if supported by houses/aspects.
   - Describe as possible conditioning patterns, not factual claims.
   - How old family roles may repeat in adult relationships/career.

11. **Action Plan**
    - What to stop doing.
    - What to start doing.
    - What to protect at all costs.
    - What to practice weekly.
    - What to track for 30 days.

12. **Self-Reflection Questions**
    - At least 12 specific questions.
    - They must be uncomfortable enough to produce insight, but not shaming.

13. **Checklist: 10 Signs You Are Off Your Natural Path**
    - Concrete behavioral signs.
    - Example: "You keep proving your value through overwork", "you delay a necessary conversation for weeks", etc.

14. **Checklist: 10 Signs You Are Aligned**
    - Concrete signs of healthy expression of the chart.

15. **Closing Synthesis**
    - 2-3 paragraphs summarizing the core lesson.
    - End with grounded encouragement, not grandiose promises.

Use advanced astrological concepts, but translate them into usable psychology and everyday decisions. The final output should help the reader answer:
- What is most likely to stop me in life?
- What should I stop doing?
- What should I start doing?
- What should I never compromise on?
- How will I know I am on the right path?
- How will I know I have drifted away from myself?`

    case 'comprehensive':
      if (!partnerBirthChart) {
        throw new Error('Partner birth chart is required for comprehensive analysis')
      }

      const { birthData: partnerBirthData, planetaryPositions: partnerPlanetaryPositions, houses: partnerHouses, aspects: partnerAspects } = partnerBirthChart
      const partnerBirthDate = new Date(partnerBirthData.date)

      const partnerChartInfo = `
Partner Birth Chart Data:
- Date: ${partnerBirthDate.toLocaleDateString()}
- Time: ${partnerBirthData.time}
- Location: ${partnerBirthData.location}

Partner Key Planetary Positions:
${Object.entries(partnerPlanetaryPositions).map(([planet, data]: [string, any]) => 
  `- ${planet}: ${data.sign} ${data.degree}° (House ${data.house})`
).join('\n')}

Partner Important Aspects:
${partnerAspects.map((aspect: any) => 
  `- ${aspect.planet1} ${aspect.type} ${aspect.planet2} (${aspect.orb}° orb)`
).join('\n')}

Partner Houses:
${partnerHouses.map((house: any) => 
  `- House ${house.house}: ${house.sign} ${house.degree}°`
).join('\n')}`

      return `${chartInfo}

${partnerChartInfo}

You are a master astrologer providing a COMPREHENSIVE RELATIONSHIP COMPATIBILITY ANALYSIS (Synastry). This is the most detailed relationship analysis possible, covering every aspect of their astrological compatibility.

This COMPATIBILITY plan must cover everything promised on the pricing card:
- comparison between two natal charts;
- love and emotional compatibility;
- communication and attraction;
- strengths of the relationship;
- potential conflicts;
- long-term potential;
- suitable periods for development and important decisions;
- detailed PDF-ready analysis.

Please provide a complete, master-level relationship analysis covering:

1. **Overall Compatibility Assessment (3-4 paragraphs)**
   - Overall relationship potential and compatibility score
   - Key strengths and challenges of the partnership
   - Long-term relationship potential
   - Karmic connection and past life influences

2. **Communication & Mental Connection (3-4 paragraphs)**
   - Mercury-Mercury aspects and communication styles
   - How they think and process information together
   - Intellectual compatibility and shared interests
   - Potential communication challenges and solutions

3. **Emotional & Intimate Connection (3-4 paragraphs)**
   - Venus-Mars aspects and romantic attraction
   - Emotional compatibility and Moon aspects
   - Physical and intimate connection
   - Emotional needs and how they support each other

4. **Power Dynamics & Life Goals (3-4 paragraphs)**
   - Sun-Sun aspects and core identity compatibility
   - Power dynamics and leadership roles
   - Shared life goals and individual aspirations
   - How they inspire and challenge each other

5. **Practical & Daily Life (3-4 paragraphs)**
   - Saturn aspects and commitment potential
   - Daily life compatibility and routines
   - Financial and material security
   - Long-term stability and responsibility

6. **Spiritual & Growth Connection (3-4 paragraphs)**
   - Neptune and spiritual connection
   - Jupiter aspects and growth opportunities
   - Shared spiritual beliefs and practices
   - How they help each other evolve

7. **Challenges & Growth Areas (3-4 paragraphs)**
   - Mars aspects and potential conflicts
   - Saturn challenges and lessons to learn
   - Pluto aspects and transformation areas
   - How to work through difficulties together

8. **Harmonious Aspects & Strengths (3-4 paragraphs)**
   - Trines and sextiles for natural harmony
   - Conjunctions for strong connections
   - Beneficial planetary combinations
   - Natural talents and shared abilities

9. **Timing & Relationship Phases (3-4 paragraphs)**
   - Current relationship phase and timing
   - Important relationship milestones
   - When to make major decisions
   - Long-term relationship evolution

10. **Practical Recommendations (4-5 paragraphs)**
    - 15-20 specific recommendations for the relationship
    - Communication strategies and techniques
    - Conflict resolution approaches
    - Ways to strengthen the connection
    - Activities and practices for growth together

11. **Future Potential & Guidance (2-3 paragraphs)**
    - Long-term relationship potential
    - Upcoming challenges and opportunities
    - How to maintain and deepen the connection
    - Vision for the future together

Use advanced astrological synastry concepts while maintaining clarity. Include psychological insights, practical relationship advice, and spiritual wisdom. This should be a comprehensive relationship guide that they can reference throughout their journey together.`

    default:
      return `${chartInfo}

Please provide a basic astrological analysis covering personality, life purpose, relationships, career, and current growth opportunities.`
  }
}

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function pickVariant<T>(items: T[], seed: number, offset = 0): T {
  return items[(seed + offset) % items.length]
}

function generateBulgarianMockAnalysis(birthChart: any, analysisType: string) {
  const { birthData, planetaryPositions, houses, aspects } = birthChart
  const birthDate = new Date(birthData.date)
  const personName = birthData.name || 'потребителя'
  const sun = planetaryPositions.Sun?.sign || 'слънчевия знак'
  const moon = planetaryPositions.Moon?.sign || 'лунния знак'
  const mercury = planetaryPositions.Mercury?.sign || 'Меркурий'
  const venus = planetaryPositions.Venus?.sign || 'Венера'
  const mars = planetaryPositions.Mars?.sign || 'Марс'
  const saturn = planetaryPositions.Saturn?.sign || 'Сатурн'
  const firstHouse = houses[0]?.sign || 'първи дом'
  const fourthHouse = houses[3]?.sign || 'четвърти дом'
  const seventhHouse = houses[6]?.sign || 'седми дом'
  const tenthHouse = houses[9]?.sign || 'десети дом'
  const mainAspect = aspects[0]
    ? `${aspects[0].planet1} ${aspects[0].type} ${aspects[0].planet2}`
    : 'водещ аспект в картата'

  const header = `**Данни:** ${personName} — ${birthDate.toLocaleDateString()} в ${birthData.time}, ${birthData.location}`

  const baseSections = `## Астрологична основа

Слънцето в ${sun} описва ядрото на личността: как ${personName} търси смисъл, признание и посока. Луната в ${moon} показва емоционалния ритъм и нуждата от сигурност. Меркурий в ${mercury} описва начина на мислене и комуникация. Венера в ${venus} говори за любов, ценности и усещане за стойност. Марс в ${mars} показва как желанието става действие и как човек реагира под напрежение.

Първи дом в ${firstHouse} подсказва как човек се заявява. Четвърти дом в ${fourthHouse} насочва към корени, семейна среда и вътрешна сигурност. Седми дом в ${seventhHouse} описва уроците през партньорствата. Десети дом в ${tenthHouse} показва кариера, репутация и видимост. Аспектът ${mainAspect} добавя важна вътрешна динамика: две части на личността трябва да се интегрират, а не да се борят една с друга.`

  if (analysisType === 'basic') {
    return {
      id: `analysis_${Date.now()}`,
      birthChartId: birthChart.id,
      analysisType,
      content: `## Лична астрологична прогноза

${header}

${baseSections}

## Личност и силни страни

Основната сила е способността да се търси смисъл, а не само резултат. Когато ${personName} е в баланс, решенията идват от вътрешна яснота. Когато има напрежение, може да се появи прекалено мислене, отлагане или желание всичко да бъде сигурно предварително.

## Любов и взаимоотношения

В любовта има нужда от последователност и честност. Най-здравословни са отношенията, в които думите и действията съвпадат. Ако има постоянно гадаене, смесени сигнали или усещане, че трябва да се доказваш, това е знак за граница.

## Кариера и житейски насоки

Кариерата се развива най-добре там, където има смисъл, ясни роли и признание за усилието. Подходящи са среди с развитие, човешки контакт, анализ, комуникация, творчество, планиране или помощ към хора. Неподходящи са хаотични места с неясни очаквания.

## Скрит потенциал и житейски уроци

Скритият потенциал е в способността да се забелязват модели и да се правят зрели избори преди кризата. Сатурн в ${saturn} показва урок по дисциплина, граници и вътрешна опора. Най-важният въпрос е: "Къде вече знам истината, но още чакам доказателство?"

## Практически съвети

1. Записвай важните решения и ги преглеждай на следващия ден.
2. Не обещавай, когато си емоционално активиран.
3. Избирай хора, чиито действия съвпадат с думите.
4. Пази енергията си от среда, която постоянно изисква доказване.
5. Прави всяка седмица една малка стъпка към по-ясна посока.`,
      generatedAt: new Date().toISOString(),
      model: 'gpt-4-mock-bg-basic',
    }
  }

  if (analysisType === 'comprehensive') {
    return {
      id: `analysis_${Date.now()}`,
      birthChartId: birthChart.id,
      analysisType,
      content: `## Любовна съвместимост

${header}

## Обща оценка

Този доклад разглежда съвместимостта като динамика, не като присъда. Основната тема е как двама души могат да създадат близост, без единият да загуби личния си център.

## Сравнение между картите

${baseSections}

Сравнението между две карти показва къде хората се подкрепят естествено и къде активират чувствителни зони. Ако единият човек търси бърза яснота, а другият има нужда от време, връзката трябва да създаде ритъм, а не битка за контрол.

## Любовна и емоционална съвместимост

Лунната тема (${moon}) подсказва нужда от емоционална сигурност. Връзката се развива добре, когато има предвидимост, топлина и ясни намерения. Несигурността може да се прояви като контрол, мълчание или натрупано разочарование.

## Комуникация и привличане

Меркурий в ${mercury} показва, че разговорите трябва да са конкретни. Венера в ${venus} и Марс в ${mars} описват привличането: едновременно желание за близост и нужда от уважение към границите.

## Силни страни

- Потенциал за лоялност и подкрепа.
- Възможност за дълбоко разбиране.
- Съвместни цели, когато отговорностите са ясни.
- Емоционална дълбочина при честна комуникация.

## Потенциални конфликти

Най-рискови са предположенията. Ако нещо не се казва, то започва да се играе като поведение: дистанция, ревност, критика или пасивна съпротива. Конфликтите трябва да се превеждат в конкретни нужди.

## Дългосрочен потенциал

Дългосрочният потенциал е силен, ако има постоянство, честност и готовност за корекция. Любовта не е достатъчна без умение за конфликт и ясни граници.

## Подходящи периоди и стратегии

Силни периоди са тези, в които разговорите са спокойни и решенията не идват от страх. Чувствителни периоди са тези с умора, ревност или мълчание. Практически правила: говорете за поведение, не за характер; не използвайте мълчание като наказание; поставяйте срок за важните разговори; обещавайте само конкретни действия.`,
      generatedAt: new Date().toISOString(),
      model: 'gpt-4-mock-bg-comprehensive',
    }
  }

  return {
    id: `analysis_${Date.now()}`,
    birthChartId: birthChart.id,
    analysisType,
    content: `## Премиум звезден анализ

${header}

## Резюме: за какво говори картата

- **Най-силно качество:** устойчивост и способност да се вижда смисъл отвъд повърхността.
- **Втора сила:** чувствителност към атмосфера, тон и неизказано.
- **Трети ресурс:** потенциал за стабилни решения, когато няма натиск за доказване.
- **Риск 1:** прекалено дълго изчакване преди действие.
- **Риск 2:** поемане на чужди емоции като лична отговорност.
- **Риск 3:** смесване на лоялност със саможертва.
- **Основен фокус:** назовавай дискомфорта по-рано.

${baseSections}

## Как чертите работят в ежедневието

Когато картата е в баланс, ${personName} може да съчетава дълбочина, наблюдателност и отговорност. В ежедневието това помага при сложни ситуации, работа с хора, анализ и вземане на зрели решения. Рискът е да се чака прекалено дълго, защото човек иска пълна сигурност.

**Предупредителен знак:** казваш "трябва ми още яснота", но всъщност отлагаш следващата стъпка.

**Направи вместо това:** избери една малка обратима стъпка и провери реалността чрез действие.

## Любов, връзки и емоционални модели

Венера в ${venus} показва нужда от уважение, последователност и емоционална стойност. В любовта може да има склонност да се вижда потенциалът на човека, преди да се приеме реалното му поведение. Това е красиво като надежда, но опасно като стратегия.

**Капан:** да обичаш обещанието повече от фактите.

**Граница:** ако връзката те кара постоянно да гадаеш, това вече е информация.

## Кариера и финансов потенциал

Десети дом в ${tenthHouse} подсказва нужда от видимост и смисъл в професионалната посока. Подходящи са среди с ясни роли, развитие и уважение към труда. Финансовият урок е трудът да се оценява според стойността, която носи, а не според вина, страх или желание да се харесаш.

Типични грешки: прекалена отговорност, оставане в среда без развитие, избягване на видимост, подценяване на уменията и приемане на хаос като нормална цена за сигурност.

## Житейски цикли, силни и слаби периоди

Силните периоди са тези, в които има спокойна яснота, фокус и готовност за конкретна стъпка. Подходящи са за разговори, обучение, преговори, професионална промяна и нови инициативи. Чувствителните периоди са тези с умора, реактивност или нужда друг човек да даде сигурност. Тогава е по-добре да се планира, не да се вземат крайни решения.

## Повтарящи се модели

Възможен модел е привличане към ситуации, които изискват много от ${personName}, но не дават достатъчно яснота. Скритият урок е да се помага без самозагуба и да се обича без отказ от граници.

## Самосаботаж и сянка

- Ако доказваш стойността си чрез работа, може би търсиш признание вместо посока.
- Ако избягваш конфликт до избухване, бъркаш мира с мълчание.
- Ако оставаш там, където не растеш, страхът от промяна говори по-силно от истината.
- Ако омаловажаваш нуждите си, тялото ще ги изрази чрез напрежение.

## Стрес и решения

Под напрежение не обещавай. Ако решението засяга пари, дом, връзка или кариера, запиши го, преспи една нощ и провери дали тялото още казва "да". При критика поискай конкретика. При неяснота не гадай, а попитай.

## Семейни и ранни модели

Четвърти дом в ${fourthHouse} може да показва стара роля: да бъдеш силният, разумният или този, който издържа. Възрастният избор е да не превръщаш старата роля в доживотна идентичност.

## План за действие

**Спри:** да чакаш напрежението да стане единственият ти източник на смелост.

**Започни:** да назоваваш дискомфорта, докато е малък.

**Пази:** емоционалната яснота и правото на уважение.

**Практикувай:** един директен разговор седмично.

**Следи 30 дни:** кога казваш "да", докато тялото ти казва "не".

## Въпроси за саморефлексия

1. Коя ситуация се повтаря под различни имена?
2. Къде бъркам лоялността със самопребрегване?
3. Какво се страхувам, че ще стане, ако попитам директно?
4. Каква работа ме кара да се чувствам полезен, но изтощен?
5. Кой модел във връзките съм нормализирал?
6. Какво доказвам чрез усилие?
7. Кое решение отлагам?
8. Къде имам нужда от повече структура?
9. Къде имам нужда от повече свобода?
10. Какво би се променило, ако нуждите ми са легитимни?
11. Какво тялото ми вече знае?
12. Коя граница защитава бъдещото ми аз?

## 10 признака, че си извън естествения си път

1. Работиш прекалено, за да доказваш стойност.
2. Отлагаш важни разговори.
3. Чувстваш се отговорен за настроението на всички.
4. Оставаш там, където развитието е приключило.
5. Игнорираш тялото си.
6. Обясняваш чужда непоследователност.
7. Бъркаш интензивността с близост.
8. Харчиш или спестяваш от страх.
9. Казваш "няма проблем", докато трупаш обида.
10. Спираш да питаш какво искаш.

## 10 признака, че си в синхрон

1. Твоето "да" е спокойно.
2. Работата има смисъл и граници.
3. Връзките позволяват честност.
4. Действаш преди да се натрупа обида.
5. Почиваш без вина.
6. Избираш постоянство пред драма.
7. Задаваш директни въпроси.
8. Уважаваш темпото си.
9. Пазиш енергията си.
10. Чувстваш се честен със себе си.

## Финален синтез

Тази карта говори за превръщане на чувствителността в зрял избор. Целта не е да станеш по-студен, а да спреш да чакаш натискът да решава вместо теб. Пътят напред е повече яснота, по-добри граници и среда, в която лоялността ти е уважавана.`,
    generatedAt: new Date().toISOString(),
    model: 'gpt-4-mock-bg-detailed',
  }
}

function generateMockAnalysis(birthChart: any, analysisType: string, locale: 'en' | 'bg' = 'en') {
  const { birthData, planetaryPositions, houses, aspects } = birthChart
  const birthDate = new Date(birthData.date)
  const personName = birthData.name || 'User'

  if (locale === 'bg') {
    return generateBulgarianMockAnalysis(birthChart, analysisType)
  }
  const profileSeed = hashString(
    `${personName}|${birthData.date}|${birthData.time}|${birthData.location}|${analysisType}`
  )
  const tone = pickVariant(
    [
      'focused, practical and self-directed',
      'sensitive, observant and emotionally intelligent',
      'curious, adaptive and naturally communicative',
      'steady, loyal and oriented toward long-term growth',
      'intuitive, creative and drawn to meaningful change',
    ],
    profileSeed
  )
  const lifeTheme = pickVariant(
    [
      'building confidence without losing empathy',
      'turning inner sensitivity into clear decisions',
      'balancing freedom with reliable structure',
      'transforming pressure into mature leadership',
      'choosing relationships and work that respect your rhythm',
    ],
    profileSeed,
    2
  )
  const growthAction = pickVariant(
    [
      'write down one concrete intention every morning',
      'track emotional patterns after important conversations',
      'protect focused time before taking on new obligations',
      'practice saying no early instead of overextending',
      'review major choices against your long-term values',
    ],
    profileSeed,
    4
  )
  const personalizedIntro = `**Personal focus for ${personName}:** Based on the submitted birth data (${birthDate.toLocaleDateString()} at ${birthData.time}, ${birthData.location}), this reading emphasizes a ${tone} pattern. The strongest growth theme in this profile is ${lifeTheme}. A practical anchor for the coming period is to ${growthAction}.`
  
  // Different mock content based on analysis type
  switch (analysisType) {
    case 'basic':
      const basicContent = `🌟 **Professional Astrological Analysis - Basic Reading**

**Birth Details:** ${personName} — ${birthDate.toLocaleDateString()} at ${birthData.time} in ${birthData.location}

${personalizedIntro}

## 🌟 Core Personality

Your ${planetaryPositions.Sun?.sign || 'Sun sign'} placement reveals a natural leader with strong determination. Combined with your ${planetaryPositions.Moon?.sign || 'Moon sign'}, you have a unique blend of confidence and emotional sensitivity that makes you both inspiring and approachable. For ${personName}, the test signature leans toward ${tone}, so the advice below should be read through that lens.

You naturally express yourself through ${planetaryPositions.Mercury?.sign || 'communication'}, making you excellent at connecting with others and sharing your ideas. Your key personality strength is your ability to adapt to different situations while staying true to your core values.

## 🎯 Life Purpose

Your soul has chosen this incarnation to learn important lessons about ${planetaryPositions.Saturn?.sign || 'responsibility'} and ${planetaryPositions.Jupiter?.sign || 'expansion'}. You're here to develop your communication skills and share your wisdom with others, particularly in areas related to helping people grow and develop.

Your main life lesson is learning to balance your natural leadership qualities with humility and service to others. You're meant to inspire and guide, but always from a place of love and understanding.

## 💕 Relationships & Career

In relationships, your ${planetaryPositions.Venus?.sign || 'Venus'} placement shows you seek harmony and mutual respect. You value deep connections and are naturally romantic and caring. You need partners who appreciate your emotional depth and support your growth.

For career, your ${planetaryPositions.Mars?.sign || 'Mars'} energy drives you toward dynamic work environments where you can make a difference. You excel in roles that combine leadership with helping others, such as teaching, coaching, or management positions.

## 🌱 Current Growth

This is a time of significant personal development. Focus on:
- Building self-confidence and trusting your intuition
- Developing better communication skills
- Learning to set healthy boundaries
- Embracing your unique gifts and talents
- Practicing self-care and emotional balance

**Practical Tips:**
1. Start each day with 10 minutes of meditation
2. Journal your thoughts and feelings regularly
3. Practice active listening in conversations
4. Set clear goals and take small steps toward them
5. Surround yourself with supportive people

Remember, you have everything you need within you to create the life you desire. Trust the journey and embrace your growth! ✨`

      return {
        id: `analysis_${Date.now()}`,
        birthChartId: birthChart.id,
        analysisType,
        content: basicContent,
        generatedAt: new Date().toISOString(),
        model: 'gpt-4-mock-basic',
      }

    case 'detailed':
      const detailedContent = `🌟 **Professional Astrological Analysis - Detailed Reading**

**Birth Details:** ${personName} — ${birthDate.toLocaleDateString()} at ${birthData.time} in ${birthData.location}

${personalizedIntro}

## 1. Executive Summary: What This Chart Is Really About

- **Strongest quality:** You can stay with complex situations long enough to understand them, especially when the goal feels meaningful.
- **Second strength:** Your chart suggests emotional perception; you may notice shifts in tone, silence, or tension before others name them.
- **Third strength:** You can build trust when you act consistently and do not rush your process.
- **Biggest risk 1:** Waiting too long before acting, then reacting with more force than the situation requires.
- **Biggest risk 2:** Taking responsibility for other people's emotions and calling it loyalty.
- **Biggest risk 3:** Confusing endurance with wisdom.
- **If you work on only one thing:** act earlier when your body already knows a situation is wrong.

## 2. Astrological Foundation: Planets, Houses, and Aspects

Your ${planetaryPositions.Sun?.sign || 'Sun sign'} points to the core way you seek identity and purpose. Your ${planetaryPositions.Moon?.sign || 'Moon sign'} describes the emotional climate underneath your choices. Your ${planetaryPositions.Mercury?.sign || 'Mercury'} shows how the mind processes information, argues, learns, and explains itself. Your ${planetaryPositions.Venus?.sign || 'Venus'} gives clues about love, values, taste, and what feels worthy. Your ${planetaryPositions.Mars?.sign || 'Mars'} shows how desire becomes action.

The house emphasis also matters. The ${houses[0]?.sign || '1st house'} tone points to identity and personal initiative. The ${houses[4]?.sign || '4th house'} area speaks to home, emotional roots, and family conditioning. The ${houses[7]?.sign || '7th house'} area describes partnership lessons, while the ${houses[10]?.sign || '10th house'} area shows career, reputation, and visible responsibility.

Important aspects such as ${aspects[0]?.planet1 || 'Sun'}-${aspects[0]?.planet2 || 'Moon'} and ${aspects[1]?.planet1 || 'Venus'}-${aspects[1]?.planet2 || 'Mars'} describe inner dialogues: what part of you wants safety, what part wants action, what part seeks connection, and what part resists vulnerability. In practical terms, aspects show where life asks for integration rather than one-sided behavior.

**Practical use:** do not read these placements as fixed destiny. Read them as a map of tendencies. The value is in noticing when a tendency is helping you and when it is quietly running your decisions.

## 3. How Your Main Traits Work in Daily Life

Your ${planetaryPositions.Sun?.sign || 'Sun sign'} creates a core identity that wants direction and meaning. In daily life this may show as wanting to know why something matters before fully committing. When healthy, this gives you purpose. When distorted, you may reject good opportunities because they do not feel perfectly aligned yet.

**Warning sign:** you keep saying "I need more clarity" while avoiding the next practical step.  
**Do this instead:** choose one reversible action and test reality instead of waiting for total certainty.

Your ${planetaryPositions.Moon?.sign || 'Moon sign'} may suggest that emotional safety matters more than you admit. This can look like needing predictable contact, clear answers, and emotional consistency. It helps you build loyalty, but it can become anxiety when another person is vague or unavailable.

**Warning sign:** you start monitoring someone's mood more than your own needs.  
**Do this instead:** ask directly for the information you need instead of interpreting silence.

Your ${planetaryPositions.Mars?.sign || 'Mars'} describes how you act under pressure. If this energy is slow and steady, the advantage is endurance. The risk is delayed action. You may tolerate discomfort until resentment has built up.

**Warning sign:** "I will wait a little longer" becomes a pattern, not a conscious choice.  
**Do this instead:** set a deadline for action before resentment takes over.

## 4. Love, Relationships, and Emotional Models

Your relationship pattern may combine loyalty with a strong need for emotional clarity. You may be drawn to people who feel deep, complex, or unfinished. This can create meaningful intimacy, but it can also pull you into rescuing, waiting, or explaining away inconsistency.

**What you likely need:** steadiness, honesty, predictable emotional presence, and enough space to keep your own center.  
**What can hurt you:** vague promises, intermittent attention, relationships where you become the emotional manager, or partners who require you to shrink your needs to keep peace.

## 5. Career, Calling, and Financial Potential

Career-wise, this chart favors environments where your effort matters and your sensitivity is not treated as weakness. You may do well where psychology, guidance, analysis, beauty, teaching, planning, healing, or meaningful service are involved. You are less likely to thrive where chaos is constant, leadership is vague, or speed is valued more than depth.

Financially, watch the link between emotion and security. Sometimes the issue is not money itself but the feeling of being safe, valued, or in control. This is why a money decision may need both numbers and emotional honesty.

## 6. Life Cycles, Timing, and Strong/Weak Periods

Strong periods are those in which you feel clear, grounded, and able to act without proving anything. Use those windows to start projects, negotiate, make visible commitments, or ask for what you need.

Sensitive periods are those in which you feel reactive, resentful, rushed, or emotionally dependent on another person's response. Use those windows for review, repair, and planning rather than dramatic decisions.

## 7. Repeated Life Patterns

A useful karmic interpretation is that you may repeatedly meet situations where you must choose between comfort and growth. This does not mean fate is forcing you. It means similar emotional lessons may appear through different people: the unavailable partner, the demanding boss, the family member who needs too much, or the project that asks you to carry everyone.

The lesson may be: **support others without abandoning your own center**.

## 8. Self-Sabotage and Shadow Patterns

- If you constantly prove your value through work, you may be seeking recognition rather than purpose.
- If you avoid conflict until it explodes, you may be confusing peace with avoidance.
- If you over-give in relationships, you may be trying to secure love by being indispensable.
- If you dismiss your own needs as "not important", resentment will eventually speak for you.

## 9. Stress Response and Decision-Making

Under stress you may become either too fixed or too emotionally absorbent. The practical rule is simple: do not make a major promise while activated. If you feel anger, first ask: "Is there hurt, rejection, or fear under this?" If the answer is yes, wait one night before responding.

**Decision rule:** if the choice affects money, home, relationship, or career, write down the decision, sleep once, then review whether the body still says yes.

## 10. Relationships: Needs, Traps, and Boundaries

You likely need consistency, emotional honesty, and respect for your rhythm. This may look like wanting regular contact, clear intentions, and behavior that matches words.

**Most common traps:**
- idealizing potential instead of seeing current behavior;
- giving too much before trust is proven;
- staying loyal to someone who is not emotionally present;
- becoming overly self-sufficient and then feeling unseen.

**Non-negotiable:** do not compromise on emotional respect. If someone repeatedly makes you doubt your reality, that is not depth; it is instability.

**Reflection questions:**
1. Where do I give more than I receive?
2. What do I tolerate because I fear losing connection?
3. When do I call avoidance "patience"?
4. What kind of distance triggers me?
5. What boundary would immediately make my relationships healthier?

## 11. Career and Work Environment

You are likely to function best in environments where responsibility is clear, values matter, and your effort is visible. You may struggle in chaotic teams, vague leadership, or workplaces where emotional labor is expected but not respected.

**Typical career mistakes:**
- accepting too much responsibility because you can handle it;
- delaying a necessary conversation with a manager;
- staying in a role after growth has stopped;
- undervaluing your work because it comes naturally.

**Real-life scenarios:**
- If you are fired, do not read it as personal failure. Ask what structure was no longer compatible with you.
- If you conflict with a boss, ask for specific expectations in writing.
- If you start a business, do not build only from inspiration; build a repeatable weekly system.
- If changing career, you are most likely to succeed when the change is chosen by you, not forced by accumulated resentment.

## 12. Money and Security

Your financial pattern may move between caution and emotional spending. Watch whether purchases are solving a real need or regulating a feeling.

**Money rules:**
- wait 24 hours before non-essential spending;
- price your work by value, not by guilt;
- keep one "security fund" untouched;
- do not lend money to preserve emotional closeness.

## 13. Practical Forecast and Timing Guidance

If an opportunity for relocation, study, or a new professional environment appears, do not reject it automatically. Ask whether it expands your life or simply scares the familiar part of you.

If a relationship requires constant guessing, treat that as information. If a career change keeps returning as an idea, give it a structured experiment rather than an immediate leap.

## 14. Action Plan

**Stop doing:** waiting until resentment becomes your only source of courage.  
**Start doing:** naming discomfort while it is still small.  
**Protect:** your emotional clarity and your right to steady respect.  
**Practice weekly:** one direct conversation you would normally postpone.  
**Track for 30 days:** when you say yes while your body says no.

## 15. Self-Reflection Questions

1. What situation keeps repeating in my life under different names?
2. Where do I confuse loyalty with self-abandonment?
3. What do I fear would happen if I asked directly?
4. What kind of work makes me feel useful but drained?
5. Which relationship pattern have I normalized?
6. What am I trying to prove through effort?
7. What decision am I postponing because the next step is uncomfortable?
8. Where do I need more structure?
9. Where do I need more freedom?
10. What would change if I believed my needs were legitimate?
11. What is my body already telling me?
12. What boundary would protect my future self?

## 16. Checklist: 10 Signs You Are Off Your Natural Path

1. You overwork to prove your value.
2. You delay necessary conversations for weeks.
3. You feel responsible for everyone's mood.
4. You stay where growth has clearly stopped.
5. You ignore your body but call it discipline.
6. You keep explaining someone's inconsistency.
7. You confuse emotional intensity with intimacy.
8. You spend or save from fear rather than clarity.
9. You say "it's fine" while building resentment.
10. You stop asking what you actually want.

## 17. Checklist: 10 Signs You Are Aligned

1. Your yes feels calm, not forced.
2. Your work has both meaning and boundaries.
3. Your relationships allow honesty without punishment.
4. You act before resentment takes over.
5. You can rest without guilt.
6. You choose consistency over drama.
7. You ask direct questions.
8. You respect your pace without using it as avoidance.
9. You protect your energy.
10. You feel more honest with yourself than impressive to others.

## 18. Closing Synthesis

This chart can be read as a lesson in turning sensitivity and endurance into conscious choice. The goal is not to become harder or more detached, but to stop waiting until pressure makes decisions for you.

Your growth path is practical: notice earlier, name things sooner, choose environments where your loyalty is respected, and build a life where responsibility does not require self-abandonment. ✨`

      return {
        id: `analysis_${Date.now()}`,
        birthChartId: birthChart.id,
        analysisType,
        content: detailedContent,
        generatedAt: new Date().toISOString(),
        model: 'gpt-4-mock-detailed',
      }

    case 'comprehensive':
      const comprehensiveContent = `🌟 **Professional Astrological Analysis - Comprehensive Reading**

**Birth Details:** ${personName} — ${birthDate.toLocaleDateString()} at ${birthData.time} in ${birthData.location}

${personalizedIntro}

## 🌟 Complete Personality Profile

Your ${planetaryPositions.Sun?.sign || 'Sun sign'} creates a powerful core identity that radiates leadership, creativity, and spiritual awareness. This placement suggests you're here to be a light for others, showing them the way through your own example of growth and transformation. For ${personName}, the dominant test pattern is ${tone}, so the relationship and life-path guidance should be interpreted around ${lifeTheme}.

Your ${planetaryPositions.Moon?.sign || 'Moon sign'} reveals an emotional nature that is deeply intuitive, sensitive, and connected to the collective unconscious. You process emotions through your psychic abilities, often knowing things before they happen or understanding people's feelings without them speaking.

Your ${planetaryPositions.Mercury?.sign || 'Mercury'} placement shows a mind that operates on multiple levels simultaneously. You can think analytically while also accessing intuitive insights, making you excellent at bridging the gap between logic and spirituality.

Your cognitive processes are characterized by depth, complexity, and a natural ability to see patterns and connections that others miss. You learn best through experience and emotional engagement rather than rote memorization.

Your emotional intelligence is exceptionally high, allowing you to navigate complex social situations with grace and understanding. You have a natural ability to hold space for others' emotions while maintaining your own center.

## 🎯 Soul Mission & Karmic Patterns

Your soul has chosen this incarnation to complete profound karmic lessons related to ${planetaryPositions.Saturn?.sign || 'responsibility'}, ${planetaryPositions.Jupiter?.sign || 'expansion'}, and ${planetaryPositions.Neptune?.sign || 'spiritual awakening'}. You're here to learn about the balance between structure and flow, between serving others and honoring your own needs.

Your past life influences suggest you've been a healer, teacher, or spiritual guide in previous incarnations. You carry wisdom and knowledge that you're meant to share with others, but first you must learn to trust and develop your own gifts.

Your evolutionary purpose centers around becoming a bridge between the spiritual and material worlds. You're meant to help others awaken to their own spiritual nature while maintaining practical wisdom and groundedness.

You're here to heal deep wounds related to trust, worthiness, and belonging. Your journey involves learning to love yourself unconditionally and recognizing your inherent value and gifts.

Your spiritual gifts include heightened intuition, psychic abilities, energy healing, and the ability to see through illusions to the truth of situations and people.

## 💕 Relationship Blueprint

Your ${planetaryPositions.Venus?.sign || 'Venus'} placement reveals a soul-level approach to love and relationships. You're not interested in casual connections - you seek partnerships that support your spiritual growth and allow you to be your authentic self.

In relationships, you bring emotional depth, spiritual awareness, loyalty, and a natural ability to nurture and heal your partner. You have the capacity for unconditional love and deep emotional intimacy.

Your partnership compatibility factors include spiritual awareness, emotional maturity, intellectual depth, and a willingness to grow and evolve together. You're attracted to people who are on their own spiritual journey and can meet you at your level of consciousness.

Your family dynamics have created both challenges and opportunities for growth. You may have been the emotional caretaker or the "different" one in your family, which has given you unique insights into human nature and relationships.

Your social circles tend to include other spiritual seekers, healers, and people who are committed to personal growth. You naturally attract people who need healing or guidance, which can sometimes be overwhelming.

Your approach to love involves deep emotional investment, spiritual connection, and a commitment to mutual growth. You give love freely but also need to receive it in the same way.

Relationship timing shows that you're currently in a period where deep, meaningful connections are possible. The next few years will bring opportunities for soul-level partnerships that support your growth and evolution.

## 🚀 Career & Life Purpose

Your ${planetaryPositions.Mars?.sign || 'Mars'} energy drives you toward careers that combine creativity, healing, and helping others. You excel in fields like psychology, counseling, energy healing, spiritual teaching, or any role that allows you to use your intuitive and healing abilities.

Your professional strengths include emotional intelligence, intuitive insight, healing abilities, teaching skills, and the ability to see patterns and connections that others miss. You have a natural talent for helping others transform and grow.

Your work style is characterized by deep focus, emotional investment, and a commitment to excellence. You don't just do a job - you pour your heart and soul into it, which makes you highly effective but can also lead to burnout if you don't maintain boundaries.

Financial patterns show a tendency to undervalue your worth and give away your services. You're learning to recognize the value of your gifts and charge appropriately for your time and expertise.

Your business and entrepreneurial potential is high, particularly in fields related to healing, teaching, or spiritual services. You have the ability to create something unique that serves others while supporting your own growth.

Your public image and reputation management involves being authentic and transparent about your spiritual journey. People are drawn to your genuine nature and willingness to be vulnerable about your own growth process.

## 🏠 Complete House Analysis

Your ${houses[0]?.sign || '1st house'} placement emphasizes the importance of self-identity and personal development. You're constantly evolving and redefining who you are, which is part of your soul's journey toward self-realization.

The ${houses[4]?.sign || '4th house'} shows your deep connection to family, home, and ancestral patterns. You may have strong karmic family ties or past life connections that influence your current relationships and emotional patterns.

The ${houses[7]?.sign || '7th house'} reveals your approach to partnerships and how you relate to others. You seek relationships that support your growth and allow you to be your authentic self.

The ${houses[10]?.sign || '10th house'} shows your career aspirations and public image. You're meant to be seen and recognized for your unique gifts, particularly in the areas of healing and spiritual guidance.

The ${houses[12]?.sign || '12th house'} indicates your spiritual gifts and connection to the collective unconscious. This placement enhances your intuitive abilities and spiritual awareness.

## ⭐ Advanced Aspect Analysis

Your ${aspects[0]?.planet1 || 'Sun'}-${aspects[0]?.planet2 || 'Moon'} aspect creates a powerful dynamic between your conscious and unconscious mind. This gives you unique insights into human nature and makes you naturally intuitive and empathetic.

Your ${aspects[1]?.planet1 || 'Venus'}-${aspects[1]?.planet2 || 'Mars'} aspect shows a strong drive for passionate, meaningful relationships. You're not afraid of intensity in love, but you need to learn to balance passion with stability and spiritual connection.

Your ${aspects[2]?.planet1 || 'Jupiter'}-${aspects[2]?.planet2 || 'Saturn'} aspect indicates a need to balance expansion and contraction, optimism and realism. This aspect helps you maintain groundedness while pursuing your spiritual goals.

Your ${aspects[3]?.planet1 || 'Mercury'}-${aspects[3]?.planet2 || 'Uranus'} aspect gives you unique insights and innovative thinking. You can see solutions and connections that others miss, making you excellent at problem-solving and creative thinking.

## ⏰ Life Cycles & Timing

You're currently in a period of profound spiritual awakening and transformation. This is a time of:
- Deep inner work and self-discovery
- Releasing old patterns and beliefs
- Embracing your spiritual gifts and abilities
- Building authentic relationships
- Stepping into your power as a healer and guide

Major life transitions are occurring in the areas of relationships, career, and spiritual development. The next few years will bring opportunities for deep healing and transformation.

Your Saturn return (if applicable) is bringing lessons about responsibility, structure, and building a solid foundation for your spiritual work. This is a time to get serious about your gifts and how you want to serve others.

Important decisions about relationships, career, and spiritual path should be made with careful consideration and intuitive guidance. Trust your inner wisdom and don't rush into major changes.

## 🎨 Shadow Work & Healing

Your shadow side may manifest as:
- Perfectionism and self-criticism
- Fear of vulnerability and rejection
- Tendency to overanalyze situations
- Difficulty trusting the unknown
- Codependent patterns in relationships
- Undervaluing your worth and gifts

Healing opportunities include:
- Developing self-compassion and self-love
- Learning to trust your intuition and inner wisdom
- Setting healthy boundaries while staying open to love
- Embracing imperfection as part of your growth journey
- Recognizing and valuing your unique gifts and abilities

Your healing approach involves:
- Regular spiritual practices and meditation
- Energy healing and intuitive development
- Therapy or counseling to work through past trauma
- Creative expression as a form of healing
- Building supportive relationships with other healers

## 🎯 Practical Application

**Daily Practices (15-20 recommendations):**
1. **Morning Ritual:** 30 minutes of meditation focusing on self-love and spiritual connection
2. **Energy Work:** Practice energy healing techniques on yourself and others
3. **Journaling:** Write about your spiritual experiences and insights
4. **Intuitive Development:** Practice trusting and following your intuitive guidance
5. **Boundary Setting:** Learn to say no without guilt and protect your energy
6. **Creative Expression:** Express yourself through art, writing, music, or dance
7. **Nature Connection:** Spend time in nature to ground and recharge
8. **Spiritual Study:** Read spiritual texts and study with teachers who resonate
9. **Healing Work:** Consider training in energy healing, counseling, or spiritual coaching
10. **Community Building:** Connect with other spiritual seekers and healers
11. **Self-Care:** Prioritize rest, emotional processing, and spiritual practices
12. **Service Work:** Find ways to serve others using your gifts and abilities
13. **Financial Abundance:** Learn to value and charge appropriately for your services
14. **Relationship Healing:** Work on healing past relationship wounds and patterns
15. **Life Purpose Alignment:** Ensure your work and relationships support your soul mission

**Long-term Growth Strategy:**
- Develop your healing and intuitive abilities through training and practice
- Build a community of supportive spiritual seekers and healers
- Create a sustainable business or career that allows you to serve others
- Continue your own healing and spiritual development
- Share your wisdom and gifts with others through teaching, writing, or healing work

## 🔮 Future Guidance

The next few years will bring:
- Deep spiritual awakening and transformation
- Opportunities for meaningful relationships and partnerships
- Career growth and recognition for your gifts
- Healing of past wounds and patterns
- Stepping into your power as a healer and guide

To prepare for these transitions:
- Continue your spiritual practices and inner work
- Build supportive relationships and community
- Develop your healing and intuitive abilities
- Trust your inner wisdom and guidance
- Stay open to opportunities for growth and service

Your long-term vision involves:
- Becoming a recognized healer and spiritual guide
- Building a community of people committed to growth and healing
- Creating sustainable abundance through your gifts and abilities
- Continuing your own evolution and spiritual development
- Making a positive impact on the world through your work

This is a powerful time of transformation and awakening. Trust your journey and embrace your gifts! ✨`

      return {
        id: `analysis_${Date.now()}`,
        birthChartId: birthChart.id,
        analysisType,
        content: comprehensiveContent,
        generatedAt: new Date().toISOString(),
        model: 'gpt-4-mock-comprehensive',
      }

    default:
      return {
        id: `analysis_${Date.now()}`,
        birthChartId: birthChart.id,
        analysisType,
        content: `🌟 **Personalized Astrological Analysis**\n\n**Birth Details:** ${personName} — ${birthDate.toLocaleDateString()} at ${birthData.time} in ${birthData.location}\n\n${personalizedIntro}`,
        generatedAt: new Date().toISOString(),
        model: 'gpt-4-mock-basic',
      }
  }
}
