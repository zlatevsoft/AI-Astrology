import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import OpenAI from 'openai'
import { validateAndSanitizeBirthData, validateAndSanitizePartnerData } from '@/lib/validation'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
    
    const { birthChart, analysisType } = validatedData

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('No OpenAI API key found, using mock analysis')
      // Return mock analysis for testing without API key
      const mockAnalysis = generateMockAnalysis(birthChart, analysisType)
      return NextResponse.json({
        success: true,
        data: mockAnalysis,
        isMock: true,
      })
    }

    // Create prompt for AI analysis
    const prompt = createAnalysisPrompt(birthChart, validatedData.partnerBirthChart, analysisType)

    // Generate AI analysis with fallback to GPT-3.5 Turbo if needed
    let completion;
    try {
      console.log('Attempting to use GPT-4 Turbo...')
      completion = await openai.chat.completions.create({
        model: "gpt-4o", // Използваме GPT-4o вместо gpt-4-1106-preview (по-стара версия)
        messages: [
          {
            role: "system",
            content: `You are an expert astrologer with deep knowledge of Western astrology, planetary influences, and psychological astrology. Provide insightful, personalized interpretations that are both accurate and meaningful. Focus on practical insights that can help the person understand themselves better.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: analysisType === 'comprehensive' ? 8000 : analysisType === 'detailed' ? 6000 : 4000,
        temperature: 0.7,
      })
      console.log('GPT-4o used successfully')
    } catch (error) {
      console.log('GPT-4o failed, trying GPT-4...')
      try {
        completion = await openai.chat.completions.create({
          model: "gpt-4", // Fallback to GPT-4
          messages: [
            {
              role: "system",
              content: `You are an expert astrologer with deep knowledge of Western astrology, planetary influences, and psychological astrology. Provide insightful, personalized interpretations that are both accurate and meaningful. Focus on practical insights that can help the person understand themselves better.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: analysisType === 'comprehensive' ? 6000 : analysisType === 'detailed' ? 4000 : 2500,
          temperature: 0.7,
        })
        console.log('GPT-4 used successfully')
      } catch (error2) {
        console.log('GPT-4 failed, falling back to GPT-3.5 Turbo')
        completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // GPT-3.5 Turbo - най-надеждният вариант
          messages: [
            {
              role: "system",
              content: `You are an expert astrologer with deep knowledge of Western astrology, planetary influences, and psychological astrology. Provide insightful, personalized interpretations that are both accurate and meaningful. Focus on practical insights that can help the person understand themselves better.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: analysisType === 'comprehensive' ? 4000 : analysisType === 'detailed' ? 3000 : 2000,
          temperature: 0.7,
        })
        console.log('GPT-3.5 Turbo used successfully')
      }
    }

    const analysis = completion.choices[0]?.message?.content

    if (!analysis) {
      throw new Error('Failed to generate AI analysis')
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
    console.error('AI analysis error:', error)
    
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

    if (error instanceof Error && error.message.includes('OpenAI')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI service temporarily unavailable' 
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate AI analysis' 
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

function createAnalysisPrompt(birthChart: any, partnerBirthChart: any, analysisType: string) {
  const { birthData, planetaryPositions, houses, aspects } = birthChart
  
  const birthDate = new Date(birthData.date)
  const age = new Date().getFullYear() - birthDate.getFullYear()
  
  // Base chart information
  const chartInfo = `Birth Chart Data:
- Date: ${birthDate.toLocaleDateString()}
- Time: ${birthData.time}
- Location: ${birthData.location}
- Age: ${age} years

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

Keep the tone warm, encouraging, and easy to understand. Focus on practical insights that can be applied immediately. Use simple language and avoid complex astrological jargon.`

    case 'detailed':
      return `${chartInfo}

You are an expert astrologer providing a DETAILED astrological reading. This is a comprehensive analysis that goes deeper into psychological patterns and life themes.

Please provide an in-depth analysis covering:

1. **Complete Personality Profile (4-5 paragraphs)**
   - Exhaustive personality analysis using all planets
   - Psychological archetypes and behavioral patterns
   - Cognitive processes and learning styles
   - Emotional intelligence and sensitivity levels
   - How they process and integrate experiences

2. **Soul Mission & Karmic Patterns (3-4 paragraphs)**
   - Deep soul lessons and past life influences
   - Karmic contracts and spiritual agreements
   - Evolutionary purpose and soul growth
   - What they're here to heal and transform
   - Spiritual gifts and psychic abilities

3. **Relationship Blueprint (4-5 paragraphs)**
   - Complete relationship patterns and needs
   - Partnership compatibility and attraction factors
   - Family dynamics and generational patterns
   - Social circles and community involvement
   - How they give and receive love
   - Relationship timing and cycles

4. **Career & Life Purpose (4-5 paragraphs)**
   - Complete career analysis and potential paths
   - Professional strengths and development areas
   - Financial patterns and abundance consciousness
   - Business and entrepreneurial potential
   - Public image and reputation management
   - Life purpose alignment and fulfillment

5. **Complete House Analysis (3-4 paragraphs)**
   - House-by-house detailed interpretation
   - Life areas of focus and development
   - How houses interact and influence each other
   - Timing for different life areas
   - House rulerships and their significance

6. **Advanced Aspect Analysis (3-4 paragraphs)**
   - All major and minor aspects and their meanings
   - Aspect patterns (grand trines, T-squares, etc.)
   - Psychological implications of aspect combinations
   - How to work with challenging aspects
   - Aspect timing and activation periods

7. **Life Cycles & Timing (3-4 paragraphs)**
   - Current life phase and developmental stage
   - Major life transitions and timing
   - Saturn returns and other important cycles
   - When to make important decisions
   - Timing for relationships, career, and personal growth

8. **Shadow Work & Healing (3-4 paragraphs)**
   - Deep shadow patterns and unconscious blocks
   - Healing opportunities and transformation areas
   - Past trauma and how to release it
   - Self-sabotage patterns and how to overcome them
   - Integration of light and shadow aspects

9. **Practical Application (4-5 paragraphs)**
   - 15-20 specific, actionable recommendations
   - Daily practices and rituals for growth
   - Tools and techniques for self-development
   - How to work with their unique energy
   - Long-term growth strategy and planning

10. **Future Guidance (2-3 paragraphs)**
    - Upcoming opportunities and challenges
    - How to prepare for future transitions
    - Long-term vision and goals alignment
    - Continued growth and evolution path

Use advanced astrological concepts while maintaining clarity. Include psychological depth, spiritual insights, and practical wisdom. This should be a complete life blueprint that they can reference for years to come.`

    case 'comprehensive':
      if (!partnerBirthChart) {
        throw new Error('Partner birth chart is required for comprehensive analysis')
      }

      const { birthData: partnerBirthData, planetaryPositions: partnerPlanetaryPositions, houses: partnerHouses, aspects: partnerAspects } = partnerBirthChart
      const partnerBirthDate = new Date(partnerBirthData.date)
      const partnerAge = new Date().getFullYear() - partnerBirthDate.getFullYear()

      const partnerChartInfo = `
Partner Birth Chart Data:
- Date: ${partnerBirthDate.toLocaleDateString()}
- Time: ${partnerBirthData.time}
- Location: ${partnerBirthData.location}
- Age: ${partnerAge} years

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

function generateMockAnalysis(birthChart: any, analysisType: string) {
  const { birthData, planetaryPositions, houses, aspects } = birthChart
  const birthDate = new Date(birthData.date)
  
  // Different mock content based on analysis type
  switch (analysisType) {
    case 'basic':
      const basicContent = `🌟 **AI Astrological Analysis - Basic Reading**

**Birth Details:** ${birthDate.toLocaleDateString()} at ${birthData.time} in ${birthData.location}

## 🌟 Core Personality

Your ${planetaryPositions.Sun?.sign || 'Sun sign'} placement reveals a natural leader with strong determination. Combined with your ${planetaryPositions.Moon?.sign || 'Moon sign'}, you have a unique blend of confidence and emotional sensitivity that makes you both inspiring and approachable.

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
      const detailedContent = `🌟 **AI Astrological Analysis - Detailed Reading**

**Birth Details:** ${birthDate.toLocaleDateString()} at ${birthData.time} in ${birthData.location}

## 🌟 Personality Deep Dive

Your ${planetaryPositions.Sun?.sign || 'Sun sign'} creates a powerful core identity centered around leadership and self-expression. Combined with your ${planetaryPositions.Moon?.sign || 'Moon sign'}, you have a complex emotional nature that processes feelings deeply and intuitively.

Your ${planetaryPositions.Mercury?.sign || 'Mercury'} placement shows a mind that works through ${planetaryPositions.Mercury?.sign === 'Gemini' ? 'versatility and quick thinking' : planetaryPositions.Mercury?.sign === 'Cancer' ? 'emotional intelligence and memory' : 'analytical depth and precision'}. You process information through your emotional body, making you highly intuitive and empathetic.

Your emotional nature is deeply sensitive and responsive to your environment. You have a natural ability to read people and situations, often knowing things before they're spoken. This gives you a unique advantage in relationships and social situations.

## 🎯 Life Purpose & Soul Mission

Your soul has chosen this incarnation to complete karmic lessons related to ${planetaryPositions.Saturn?.sign || 'responsibility'} and ${planetaryPositions.Jupiter?.sign || 'expansion'}. You're here to learn about the balance between structure and freedom, between serving others and honoring your own needs.

Your spiritual growth centers around developing unconditional love and forgiveness, particularly for yourself. You're meant to be a bridge between the spiritual and material worlds, helping others find their own path to enlightenment.

## 💕 Relationships & Social Dynamics

Your ${planetaryPositions.Venus?.sign || 'Venus'} placement reveals a deep need for authentic, soul-level connections. You're not interested in superficial relationships - you crave partnerships that support your growth and allow you to be your true self.

In relationships, you bring emotional depth, loyalty, and a natural ability to nurture and support your partner. However, you also need partners who can handle your intensity and emotional complexity. You're attracted to people who are spiritually aware and emotionally mature.

Your family dynamics have shaped your approach to relationships significantly. You may have learned early on to be the emotional caretaker, which can sometimes lead to codependent patterns. Learning to maintain healthy boundaries while staying open to love is a key lesson.

## 🚀 Career & Life Path

Your ${planetaryPositions.Mars?.sign || 'Mars'} energy drives you toward careers that combine creativity with helping others. You excel in fields like psychology, counseling, teaching, healing arts, or any role that allows you to use your intuitive abilities.

Your work style is characterized by deep focus and emotional investment. You don't just do a job - you pour your heart into it. This makes you excellent at building trust and creating meaningful connections with clients or colleagues.

Financial patterns show a tendency to be generous with others, sometimes at the expense of your own needs. Learning to value your worth and charge appropriately for your services is important for your financial growth.

## 🏠 House Analysis

Your ${houses[0]?.sign || '1st house'} placement emphasizes the importance of self-identity and personal development. You're constantly evolving and redefining who you are, which can sometimes feel unstable but is actually part of your growth process.

The ${houses[4]?.sign || '4th house'} shows your deep connection to family and home. You may have strong ancestral ties or karmic family patterns to work through. Creating a nurturing home environment is crucial for your emotional well-being.

The ${houses[10]?.sign || '10th house'} reveals your career aspirations and public image. You're meant to be seen and recognized for your unique gifts, but this can sometimes feel uncomfortable if you're not used to being in the spotlight.

## ⭐ Planetary Aspects

The ${aspects[0]?.planet1 || 'Sun'}-${aspects[0]?.planet2 || 'Moon'} aspect creates a powerful dynamic between your conscious and unconscious mind. This gives you unique insights into human nature and makes you naturally intuitive.

Your ${aspects[1]?.planet1 || 'Venus'}-${aspects[1]?.planet2 || 'Mars'} aspect shows a strong drive for passionate, meaningful relationships. You're not afraid of intensity in love, but you need to learn to balance passion with stability.

## 🎯 Current Life Phase

You're currently in a period of deep transformation and spiritual awakening. This is a time to:
- Release old patterns and beliefs that no longer serve you
- Embrace your intuitive abilities and spiritual gifts
- Develop deeper self-love and acceptance
- Build authentic relationships based on mutual growth
- Step into your power as a healer and guide

**Specific Recommendations:**
1. **Daily Practice:** 20 minutes of meditation focusing on self-love
2. **Personal Development:** Explore energy healing or intuitive development
3. **Relationships:** Practice vulnerability and emotional honesty
4. **Career:** Consider certification in counseling or healing arts
5. **Health:** Focus on emotional well-being and stress management
6. **Spiritual Growth:** Study spiritual texts that resonate with you
7. **Boundaries:** Learn to say no without guilt
8. **Creativity:** Express yourself through art, writing, or music
9. **Community:** Connect with like-minded spiritual seekers
10. **Self-Care:** Prioritize rest and emotional processing time

This is a powerful time of growth and transformation. Trust your intuition and embrace the journey! ✨`

      return {
        id: `analysis_${Date.now()}`,
        birthChartId: birthChart.id,
        analysisType,
        content: detailedContent,
        generatedAt: new Date().toISOString(),
        model: 'gpt-4-mock-detailed',
      }

    case 'comprehensive':
      const comprehensiveContent = `🌟 **AI Astrological Analysis - Comprehensive Reading**

**Birth Details:** ${birthDate.toLocaleDateString()} at ${birthData.time} in ${birthData.location}

## 🌟 Complete Personality Profile

Your ${planetaryPositions.Sun?.sign || 'Sun sign'} creates a powerful core identity that radiates leadership, creativity, and spiritual awareness. This placement suggests you're here to be a light for others, showing them the way through your own example of growth and transformation.

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
        content: 'Basic analysis content',
        generatedAt: new Date().toISOString(),
        model: 'gpt-4-mock-basic',
      }
  }
}
