import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

async function persistPaidOrder(session: Stripe.Checkout.Session) {
  if (!process.env.DATABASE_URL) return

  const {
    promoCodeId,
    influencerId,
    commissionCents,
    discountPercent,
    productName,
    productType,
  } = session.metadata || {}

  const commissionAmount = parseInt((commissionCents as string) || '0', 10) || 0
  const parsedDiscount = discountPercent ? parseInt(discountPercent as string, 10) : undefined

  await prisma.order.upsert({
    where: { stripeCheckoutSessionId: session.id },
    create: {
      stripeCheckoutSessionId: session.id,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency || 'eur',
      productName: (productName as string) || undefined,
      productType: (productType as string) || undefined,
      customerEmail: session.customer_details?.email || session.customer_email || undefined,
      discountPercent: Number.isFinite(parsedDiscount) ? parsedDiscount : undefined,
      promoCodeId: (promoCodeId as string) || undefined,
      influencerId: (influencerId as string) || undefined,
      commissionAmount,
      status: 'PAID',
    },
    update: {
      amountTotal: session.amount_total ?? 0,
      currency: session.currency || 'eur',
      productName: (productName as string) || undefined,
      productType: (productType as string) || undefined,
      customerEmail: session.customer_details?.email || session.customer_email || undefined,
      discountPercent: Number.isFinite(parsedDiscount) ? parsedDiscount : undefined,
      promoCodeId: (promoCodeId as string) || undefined,
      influencerId: (influencerId as string) || undefined,
      commissionAmount,
      status: 'PAID',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, stripeConfig } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    if (
      sessionId.startsWith('test_session_') ||
      sessionId.startsWith('free_checkout_') ||
      sessionId.startsWith('mock_session_')
    ) {
      return NextResponse.json({
        success: true,
        session: {
          id: sessionId,
          paymentStatus: 'paid',
          customerEmail: 'test@example.com',
          productName: 'Astro reading',
          productType: 'local-mock',
          amountTotal: 0,
          currency: 'eur',
        },
      })
    }

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
        console.log('Stripe verify: server environment key, mode:', envMode)
      } catch (error) {
        console.error('Failed to initialize Stripe for payment verification (env):', error)
      }
    }

    if (!stripeInstance && stripeConfig) {
      const secretKey = stripeConfig.mode === 'live' ? stripeConfig.liveSecretKey : stripeConfig.testSecretKey

      if (secretKey) {
        try {
          stripeInstance = new Stripe(secretKey, {
            apiVersion: '2023-10-16',
            typescript: true,
          })
          console.log('Stripe verify: frontend config, mode:', stripeConfig.mode)
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
          currency: 'eur',
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
      try {
        await persistPaidOrder(session)
      } catch (e) {
        console.error('verify-payment order persist error:', e)
      }

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
