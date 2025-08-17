import { NextRequest, NextResponse } from 'next/server'
import { stripeConfig, stripe } from '@/lib/stripe'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      config: {
        mode: stripeConfig.mode,
        hasPublishableKey: !!stripeConfig.publishableKey,
        hasSecretKey: !!stripeConfig.secretKey,
        secretKeyPrefix: stripeConfig.secretKey ? stripeConfig.secretKey.substring(0, 7) + '...' : 'Not set'
      }
    })
  } catch (error) {
    console.error('Stripe config test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
