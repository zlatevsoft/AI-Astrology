import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

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
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id)
  
  // Extract metadata
  const { birthChartId, analysisType, customerName } = session.metadata || {}
  
  // Here you would typically:
  // 1. Update your database to mark the payment as successful
  // 2. Generate the AI analysis if not already done
  // 3. Send confirmation email to customer
  // 4. Update order status
  
  console.log('Processing payment for:', {
    birthChartId,
    analysisType,
    customerName,
    customerEmail: session.customer_email,
    amount: session.amount_total
  })
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
