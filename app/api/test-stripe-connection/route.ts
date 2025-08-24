import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  try {
    if (!stripe) {
      return NextResponse.json({
        success: false,
        error: 'Stripe не е инициализиран'
      }, { status: 500 })
    }

    // Тестваме връзката като опитаме да извлечем account информация
    const account = await stripe.accounts.retrieve()
    
    return NextResponse.json({
      success: true,
      data: {
        accountId: account.id,
        businessType: account.business_type,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        country: account.country,
        defaultCurrency: account.default_currency,
        detailsSubmitted: account.details_submitted,
        email: account.email,
      },
      message: 'Stripe връзката работи успешно'
    })

  } catch (error) {
    console.error('Stripe connection test error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Проверете дали API ключовете са правилни'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: 'Неизвестна грешка при тестване на връзката'
    }, { status: 500 })
  }
}
