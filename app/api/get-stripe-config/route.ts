import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get Stripe config from query parameters (passed from frontend)
    const { searchParams } = new URL(request.url)
    const config = searchParams.get('config')
    
    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'No configuration provided'
      }, { status: 400 })
    }
    
    const stripeConfig = JSON.parse(config)
    
    return NextResponse.json({
      success: true,
      config: stripeConfig
    })
  } catch (error) {
    console.error('Error getting Stripe config:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
