import { NextResponse } from 'next/server'
import { stripeConfig } from '@/lib/stripe'

export async function GET() {
  try {
    const config = {
      mode: stripeConfig.mode,
      hasPublishableKey: !!stripeConfig.publishableKey,
      hasSecretKey: !!stripeConfig.secretKey,
      publishableKeyPrefix: stripeConfig.publishableKey?.substring(0, 7) || 'N/A',
      secretKeyPrefix: stripeConfig.secretKey?.substring(0, 7) || 'N/A',
      webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    }

    const isValid = config.hasPublishableKey && config.hasSecretKey && config.webhookSecret

    return NextResponse.json({
      success: isValid,
      data: config,
      message: isValid 
        ? 'Stripe конфигурацията е правилна' 
        : 'Липсват някои от задължителните настройки'
    })

  } catch (error) {
    console.error('Stripe config test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Грешка при проверка на конфигурацията'
    }, { status: 500 })
  }
}
