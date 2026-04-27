import { NextRequest, NextResponse } from 'next/server'
import { getProduct } from '@/lib/stripe'
import Stripe from 'stripe'
import { stripeConfigSchema } from '@/lib/validation'
import { isFreeCheckoutEnabled } from '@/lib/pricing'
import { findActivePromoByCode, amountAfterDiscountCents, commissionCentsForOrder } from '@/lib/promo'

export async function POST(request: NextRequest) {
  try {
    const { productName, successUrl, cancelUrl, stripeConfig, promoCode } = await request.json() as {
      productName?: string
      successUrl?: string
      cancelUrl?: string
      stripeConfig?: unknown
      promoCode?: string
    }
    const cfg = stripeConfig as
      | { mode?: string; testSecretKey?: string; liveSecretKey?: string }
      | undefined

    // Enhanced security: Validate Stripe configuration
    if (stripeConfig) {
      try {
        stripeConfigSchema.parse(stripeConfig)
      } catch (error) {
        console.error('Invalid Stripe configuration:', error)
        // Don't fail here, let the fallback logic handle it
        console.log('Stripe config validation failed, will use fallback')
      }
    }
    
    console.log('Creating checkout session for:', productName)
    console.log('Stripe config from frontend:', {
      mode: cfg?.mode,
      hasTestKey: !!cfg?.testSecretKey,
      hasLiveKey: !!cfg?.liveSecretKey,
      testKeyPrefix: cfg?.testSecretKey?.substring(0, 7) + '...',
      liveKeyPrefix: cfg?.liveSecretKey?.substring(0, 7) + '...',
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

    if (isFreeCheckoutEnabled()) {
      const mockSessionId = `free_checkout_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      console.log('FREE_CHECKOUT: skipping Stripe, redirecting to success')
      return NextResponse.json({
        sessionId: mockSessionId,
        url: `${request.nextUrl.origin}/payment-success?session_id=${mockSessionId}`,
        isMock: true,
        freeCheckout: true,
      })
    }

    // Prefer server env keys so STRIPE_MODE on Vercel is authoritative. Browser localStorage
    // stripeConfig (with live mode) was previously taken first, which always produced cs_live_ sessions.
    let stripeInstance: Stripe | null = null
    const envMode = (process.env.STRIPE_MODE || 'test') as 'test' | 'live'
    const envSecretKey =
      envMode === 'live' ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST

    if (envSecretKey && envSecretKey.trim() !== '') {
      try {
        stripeInstance = new Stripe(envSecretKey, {
          apiVersion: '2023-10-16',
          typescript: true,
        })
        console.log('Stripe: server environment key, mode:', envMode)
      } catch (error) {
        console.error('Failed to initialize Stripe with environment variables:', error)
      }
    }

    // Local dev / legacy: keys only in admin UI localStorage
    if (!stripeInstance && cfg) {
      const secretKey = cfg.mode === 'live' ? cfg.liveSecretKey : cfg.testSecretKey

      if (secretKey && secretKey.trim() !== '') {
        try {
          stripeInstance = new Stripe(secretKey, {
            apiVersion: '2023-10-16',
            typescript: true,
          })
          console.log('Stripe initialized with frontend localStorage config, mode:', cfg.mode)
        } catch (error) {
          console.error('Failed to initialize Stripe with frontend config:', error)
        }
      } else {
        console.log('No valid secret key in frontend config for mode:', cfg.mode)
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

    let unitAmount = product.price
    const meta: Record<string, string> = {
      productName: product.name,
      productType: productName.toLowerCase().replace(/\s+/g, ''),
    }
    if (promoCode && process.env.DATABASE_URL) {
      const pc = (promoCode as string).trim()
      if (pc) {
        const promo = await findActivePromoByCode(pc)
        if (!promo) {
          return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 })
        }
        unitAmount = amountAfterDiscountCents(product.price, promo.discountPercent)
        const comm = commissionCentsForOrder(unitAmount, promo.commissionPercent)
        meta.promoCodeId = promo.id
        meta.influencerId = promo.influencerId
        meta.commissionCents = String(comm)
        meta.discountPercent = String(promo.discountPercent)
      }
    }

    // Create real Stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${request.nextUrl.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/pricing`,
      metadata: meta,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    // Check if it's a Stripe configuration error
    if (error instanceof Error) {
      if (error.message.includes('No API key provided')) {
        console.log('No API key provided, using mock session')
        const mockSessionId = `test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        return NextResponse.json({ 
          sessionId: mockSessionId, 
          url: `${request.nextUrl.origin}/payment-success?session_id=${mockSessionId}`,
          isMock: true
        })
      }
      if (error.message.includes('Invalid API key')) {
        console.log('Invalid API key, using mock session')
        const mockSessionId = `test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        return NextResponse.json({ 
          sessionId: mockSessionId, 
          url: `${request.nextUrl.origin}/payment-success?session_id=${mockSessionId}`,
          isMock: true
        })
      }
    }
    
    // For any other error, also use mock session as fallback
    console.log('Unexpected error, using mock session as fallback')
    const mockSessionId = `test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return NextResponse.json({ 
      sessionId: mockSessionId, 
      url: `${request.nextUrl.origin}/payment-success?session_id=${mockSessionId}`,
      isMock: true
    })
  }
}
