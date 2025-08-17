import { NextRequest, NextResponse } from 'next/server'
import { getProduct } from '@/lib/stripe'
import Stripe from 'stripe'
import { stripeConfigSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const { productName, successUrl, cancelUrl, stripeConfig } = await request.json()
    
    // Enhanced security: Validate Stripe configuration
    if (stripeConfig) {
      try {
        stripeConfigSchema.parse(stripeConfig)
      } catch (error) {
        console.error('Invalid Stripe configuration:', error)
        return NextResponse.json(
          { error: 'Invalid Stripe configuration' },
          { status: 400 }
        )
      }
    }
    
    console.log('Creating checkout session for:', productName)
    console.log('Stripe config from frontend:', {
      mode: stripeConfig?.mode,
      hasTestKey: !!stripeConfig?.testSecretKey,
      hasLiveKey: !!stripeConfig?.liveSecretKey,
      testKeyPrefix: stripeConfig?.testSecretKey?.substring(0, 7) + '...',
      liveKeyPrefix: stripeConfig?.liveSecretKey?.substring(0, 7) + '...'
    })

    if (!productName) {
      console.log('Error: Product name is required')
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    const product = getProduct(productName)
    console.log('Found product:', product)
    
    if (!product) {
      console.log('Error: Invalid product name:', productName)
      return NextResponse.json(
        { error: 'Invalid product name' },
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
          console.log('Stripe initialized with frontend config, mode:', stripeConfig.mode)
        } catch (error) {
          console.error('Failed to initialize Stripe with frontend config:', error)
        }
      } else {
        console.log('No secret key found for mode:', stripeConfig.mode)
      }
    }
    
    // Check if Stripe is configured
    if (!stripeInstance) {
      console.log('Stripe not configured, using mock session')
      
      // Create mock session for development
      const mockSessionId = `test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      return NextResponse.json({ 
        sessionId: mockSessionId, 
        url: `${request.nextUrl.origin}/payment-success?session_id=${mockSessionId}`,
        isMock: true
      })
    }

    // Create real Stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${request.nextUrl.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/pricing`,
      metadata: {
        productName: product.name,
        productType: productName.toLowerCase().replace(/\s+/g, ''),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    // Check if it's a Stripe configuration error
    if (error instanceof Error) {
      if (error.message.includes('No API key provided')) {
        return NextResponse.json(
          { error: 'Stripe API key not configured. Please configure Stripe in admin panel.' },
          { status: 500 }
        )
      }
      if (error.message.includes('Invalid API key')) {
        return NextResponse.json(
          { error: 'Invalid Stripe API key. Please check your configuration.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
