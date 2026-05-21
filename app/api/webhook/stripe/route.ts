import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { isDatabaseConfigured } from '@/lib/database-url'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Add GET handler for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint is working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe!.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(failedPayment)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    
    // Return proper error response
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id)
  
  const {
    birthChartId,
    analysisType,
    customerName,
    promoCodeId,
    influencerId,
    commissionCents,
    discountPercent,
    productName,
    productType,
  } = session.metadata || {}
  
  console.log('Processing payment for:', {
    birthChartId,
    analysisType,
    customerName,
    customerEmail: session.customer_email,
    amount: session.amount_total
  })

  if (isDatabaseConfigured()) {
    try {
      const at = session.amount_total ?? 0
      const comm = parseInt((commissionCents as string) || '0', 10) || 0
      await prisma.order.upsert({
        where: { stripeCheckoutSessionId: session.id },
        create: {
          stripeCheckoutSessionId: session.id,
          amountTotal: at,
          currency: session.currency || 'eur',
          productName: (productName as string) || undefined,
          productType: (productType as string) || undefined,
          customerEmail: session.customer_details?.email || session.customer_email || undefined,
          discountPercent: discountPercent ? parseInt(discountPercent as string, 10) || undefined : undefined,
          promoCodeId: (promoCodeId as string) || undefined,
          influencerId: (influencerId as string) || undefined,
          commissionAmount: comm,
          status: 'PAID',
        },
        update: {
          amountTotal: at,
          currency: session.currency || 'eur',
          productName: (productName as string) || undefined,
          productType: (productType as string) || undefined,
          customerEmail: session.customer_details?.email || session.customer_email || undefined,
          discountPercent: discountPercent ? parseInt(discountPercent as string, 10) || undefined : undefined,
          promoCodeId: (promoCodeId as string) || undefined,
          influencerId: (influencerId as string) || undefined,
          commissionAmount: comm,
          status: 'PAID',
        },
      })
    } catch (e) {
      console.error('Order persist error:', e)
    }
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id)
  
  // Handle successful payment
  const { birthChartId, analysisType, customerName } = paymentIntent.metadata || {}
  
  console.log('Payment successful for:', {
    birthChartId,
    analysisType,
    customerName,
    amount: paymentIntent.amount
  })
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id)
  
  // Handle failed payment
  const { birthChartId, analysisType, customerName } = paymentIntent.metadata || {}
  
  console.log('Payment failed for:', {
    birthChartId,
    analysisType,
    customerName,
    lastPaymentError: paymentIntent.last_payment_error
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id)
  
  // Handle successful invoice payment (for subscriptions if you add them later)
  console.log('Invoice payment successful:', {
    customerId: invoice.customer,
    amount: invoice.amount_paid,
    status: invoice.status
  })
}
