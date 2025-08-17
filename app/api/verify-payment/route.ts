import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, stripeConfig } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Initialize Stripe with frontend config
    let stripeInstance: Stripe | null = null
    
    if (stripeConfig) {
      // Determine which key to use based on mode
      const secretKey = stripeConfig.mode === 'live' 
        ? stripeConfig.liveSecretKey 
        : stripeConfig.testSecretKey
      
      if (secretKey) {
        try {
          stripeInstance = new Stripe(secretKey, {
            apiVersion: '2023-10-16',
            typescript: true,
          })
          console.log('Stripe initialized for payment verification, mode:', stripeConfig.mode)
        } catch (error) {
          console.error('Failed to initialize Stripe for payment verification:', error)
        }
      }
    }
    
    if (!stripeInstance) {
      console.log('Stripe not configured for payment verification, skipping verification')
      return NextResponse.json({
        success: true,
        session: {
          id: sessionId,
          paymentStatus: 'paid',
          customerEmail: 'test@example.com',
          productName: 'Test Product',
          productType: 'test',
          amountTotal: 1900,
          currency: 'usd',
        }
      })
    }

    // Retrieve the session
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        session: {
          id: session.id,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email,
          productName: session.metadata?.productName,
          productType: session.metadata?.productType,
          amountTotal: session.amount_total,
          currency: session.currency,
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        paymentStatus: session.payment_status,
        error: 'Payment not completed'
      })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
