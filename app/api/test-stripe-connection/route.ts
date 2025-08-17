import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { secretKey, mode } = await request.json()

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Secret key is required' },
        { status: 400 }
      )
    }

    // Create a temporary Stripe instance with the provided key
    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })

    // Test the connection by making a simple API call
    const account = await stripe.accounts.retrieve()

    return NextResponse.json({
      success: true,
      message: `Connection successful! Mode: ${mode}`,
      account: {
        id: account.id,
        business_type: account.business_type,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      }
    })
  } catch (error: any) {
    console.error('Stripe connection test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to connect to Stripe'
    }, { status: 400 })
  }
}
