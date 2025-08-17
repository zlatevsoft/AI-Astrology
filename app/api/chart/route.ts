import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for birth chart request
const BirthChartSchema = z.object({
  birthDate: z.string().datetime(),
  birthTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  location: z.string().min(1),
})

// Planetary positions calculation (simplified version)
function calculatePlanetaryPositions(birthDate: Date, latitude: number, longitude: number) {
  // This is a simplified calculation - in production you'd use Swiss Ephemeris
  const planets = {
    Sun: { sign: 'Aries', degree: 15, house: 1 },
    Moon: { sign: 'Cancer', degree: 22, house: 4 },
    Mercury: { sign: 'Aries', degree: 8, house: 1 },
    Venus: { sign: 'Pisces', degree: 28, house: 12 },
    Mars: { sign: 'Taurus', degree: 5, house: 2 },
    Jupiter: { sign: 'Sagittarius', degree: 12, house: 9 },
    Saturn: { sign: 'Capricorn', degree: 18, house: 10 },
    Uranus: { sign: 'Aquarius', degree: 3, house: 11 },
    Neptune: { sign: 'Pisces', degree: 25, house: 12 },
    Pluto: { sign: 'Capricorn', degree: 29, house: 10 },
  }

  return planets
}

// House calculations
function calculateHouses(birthDate: Date, latitude: number, longitude: number) {
  // Simplified house calculation
  const houses = []
  for (let i = 1; i <= 12; i++) {
    houses.push({
      house: i,
      sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][(i - 1) % 12],
      degree: Math.floor(Math.random() * 30),
    })
  }
  return houses
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = BirthChartSchema.parse(body)
    
    const birthDate = new Date(validatedData.birthDate)
    const birthTime = validatedData.birthTime
    const latitude = validatedData.latitude
    const longitude = validatedData.longitude
    const location = validatedData.location

    // Calculate birth chart
    const planetaryPositions = calculatePlanetaryPositions(birthDate, latitude, longitude)
    const houses = calculateHouses(birthDate, latitude, longitude)

    // Calculate aspects (simplified)
    const aspects = [
      { planet1: 'Sun', planet2: 'Moon', type: 'Conjunction', orb: 7 },
      { planet1: 'Venus', planet2: 'Mars', type: 'Trine', orb: 3 },
      { planet1: 'Jupiter', planet2: 'Saturn', type: 'Square', orb: 5 },
    ]

    const birthChart = {
      id: `chart_${Date.now()}`,
      birthData: {
        date: birthDate.toISOString(),
        time: birthTime,
        latitude,
        longitude,
        location,
      },
      planetaryPositions,
      houses,
      aspects,
      calculatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: birthChart,
    })

  } catch (error) {
    console.error('Birth chart calculation error:', error)
    
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
        error: 'Failed to calculate birth chart' 
      },
      { status: 500 }
    )
  }
}
