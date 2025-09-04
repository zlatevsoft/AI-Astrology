import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Validation schema for payment request
const PaymentSchema = z.object({
  birthChartId: z.string(),
  analysisType: z.enum(['basic', 'detailed', 'comprehensive']),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
})

// Pricing configuration
const PRICING = {
  basic: {
    amount: 999, // $9.99
    currency: 'usd',
    description: 'Basic Birth Chart Analysis',
  },
  detailed: {
    amount: 1999, // $19.99
    currency: 'usd',
    description: 'Detailed Birth Chart Analysis',
  },
  comprehensive: {
    amount: 3999, // $39.99
    currency: 'usd',
    description: 'Comprehensive Birth Chart Analysis',
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = PaymentSchema.parse(body)
    
    const { 
      birthChartId, 
      analysisType, 
      customerEmail, 
      customerName,
      successUrl,
      cancelUrl 
    } = validatedData

    // Check if Stripe is configured for testing
    if (!process.env.STRIPE_SECRET_KEY) {
      // Return mock payment session for testing
      const mockSessionId = `mock_session_${Date.now()}`
      return NextResponse.json({
        success: true,
        data: {
          sessionId: mockSessionId,
          sessionUrl: `${successUrl}?session_id=${mockSessionId}`,
          amount: 0,
          currency: 'usd',
          isMock: true,
        },
      })
    }

    const pricing = PRICING[analysisType]

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: pricing.currency,
            product_data: {
              name: pricing.description,
              description: `AI-powered ${analysisType} birth chart analysis`,
              images: ['https://astrohoroscope.online/og-image-new.jpg'],
              metadata: {
                birthChartId,
                analysisType,
              },
            },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        birthChartId,
        analysisType,
        customerName,
      },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'AU'],
      },
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: {
          birthChartId,
          analysisType,
          customerName,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        sessionUrl: session.url,
        amount: pricing.amount,
        currency: pricing.currency,
      },
    })

  } catch (error) {
    console.error('Payment session creation error:', error)
    
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

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment session' 
      },
      { status: 500 }
    )
  }
}

// Get payment session details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session ID is required' 
        },
        { status: 400 }
      )
    }

    // Check if this is a mock session
    if (sessionId.startsWith('mock_session_')) {
      return NextResponse.json({
        success: true,
        data: {
          sessionId: sessionId,
          status: 'complete',
          paymentStatus: 'paid',
          amountTotal: 0,
          currency: 'usd',
          customerEmail: 'test@example.com',
          metadata: {
            birthChartId: 'mock_chart_id',
            analysisType: 'basic',
            customerName: 'Test User',
          },
          isMock: true,
        },
      })
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Stripe not configured' 
        },
        { status: 503 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_email,
        metadata: session.metadata,
      },
    })

  } catch (error) {
    console.error('Payment session retrieval error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve payment session' 
      },
      { status: 500 }
    )
  }
}
