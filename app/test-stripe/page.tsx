'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function TestStripePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const testStripeConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-stripe-config')
      const result = await response.json()
      setTestResults(result)
      
      if (result.success) {
        toast.success('Stripe конфигурацията е правилна!')
      } else {
        toast.error('Грешка в Stripe конфигурацията')
      }
    } catch (error) {
      toast.error('Грешка при тестване')
      console.error('Test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testStripeConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-stripe-connection')
      const result = await response.json()
      setTestResults(result)
      
      if (result.success) {
        toast.success('Stripe връзката работи!')
      } else {
        toast.error('Проблем с Stripe връзката')
      }
    } catch (error) {
      toast.error('Грешка при тестване')
      console.error('Test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createTestPayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: 'basic reading',
          customerEmail: 'test@example.com',
          customerName: 'Test User',
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancel`,
        }),
      })
      
      const result = await response.json()
      setTestResults(result)
      
             if (result.success && (result.data?.sessionUrl || result.data?.url || result.url)) {
         toast.success('Тестова сесия създадена!')
         // Отваряме Stripe Checkout в нов таб
         const checkoutUrl = result.data?.sessionUrl || result.data?.url || result.url
         window.open(checkoutUrl, '_blank')
       } else {
         toast.error('Грешка при създаване на сесия')
       }
    } catch (error) {
      toast.error('Грешка при тестване')
      console.error('Test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-cosmic-900 dark:text-white mb-4">
              🧪 Тест на Stripe Конфигурация
            </h1>
            <p className="text-lg text-cosmic-700 dark:text-cosmic-300">
              Проверка на настройките и връзката с Stripe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-cosmic-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-cosmic-900 dark:text-white mb-4">
                🔧 Конфигурация
              </h3>
              <p className="text-cosmic-600 dark:text-cosmic-400 mb-4">
                Проверка на environment variables
              </p>
              <button
                onClick={testStripeConfig}
                disabled={isLoading}
                className="w-full bg-cosmic-600 hover:bg-cosmic-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Тестване...' : 'Тествай конфигурация'}
              </button>
            </div>

            <div className="bg-white dark:bg-cosmic-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-cosmic-900 dark:text-white mb-4">
                🌐 Връзка
              </h3>
              <p className="text-cosmic-600 dark:text-cosmic-400 mb-4">
                Тест на API връзката
              </p>
              <button
                onClick={testStripeConnection}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Тестване...' : 'Тествай връзка'}
              </button>
            </div>

            <div className="bg-white dark:bg-cosmic-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-cosmic-900 dark:text-white mb-4">
                💳 Плащане
              </h3>
              <p className="text-cosmic-600 dark:text-cosmic-400 mb-4">
                Създаване на тестова сесия
              </p>
              <button
                onClick={createTestPayment}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Създаване...' : 'Създай тест'}
              </button>
            </div>
          </div>

          {testResults && (
            <div className="bg-white dark:bg-cosmic-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-cosmic-900 dark:text-white mb-4">
                📊 Резултати от теста
              </h3>
              <div className="bg-gray-50 dark:bg-cosmic-900 rounded-lg p-4">
                <pre className="text-sm text-cosmic-700 dark:text-cosmic-300 overflow-x-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              💡 Важни забележки
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>• В <strong>тестовия режим</strong> използвай тестови карти (4242 4242 4242 4242)</li>
              <li>• В <strong>реалния режим</strong> ще се взимат истински пари</li>
              <li>• Винаги тествай първо в тестовия режим</li>
              <li>• Проверявай логовете за грешки</li>
              <li>• Webhook-овете трябва да са конфигурирани в Stripe Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
