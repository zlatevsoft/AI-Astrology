'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  CreditCardIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function StripeConfigPage() {
  const [isTestMode, setIsTestMode] = useState(true)
  const [showKeys, setShowKeys] = useState(false)
  const [config, setConfig] = useState({
    testPublishableKey: '',
    testSecretKey: '',
    livePublishableKey: '',
    liveSecretKey: '',
  })
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | null
    message: string
  }>({ type: null, message: '' })

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('stripeConfig')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const saveConfig = () => {
    try {
      // Save to localStorage
      localStorage.setItem('stripeConfig', JSON.stringify(config))
      
      // Save mode to localStorage
      localStorage.setItem('stripeMode', isTestMode ? 'test' : 'live')
      
      setStatus({
        type: 'success',
        message: 'Configuration saved successfully!'
      })

      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus({ type: null, message: '' })
      }, 3000)
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to save configuration'
      })
    }
  }

  const testConnection = async () => {
    try {
      setStatus({
        type: 'info',
        message: 'Testing connection...'
      })

      const currentKey = isTestMode ? config.testSecretKey : config.liveSecretKey
      
      if (!currentKey) {
        setStatus({
          type: 'error',
          message: 'Please enter your secret key first'
        })
        return
      }

      // Test the connection by making a simple API call
      const response = await fetch('/api/test-stripe-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secretKey: currentKey,
          mode: isTestMode ? 'test' : 'live'
        }),
      })

      const result = await response.json()

      if (result.success) {
        setStatus({
          type: 'success',
          message: `Connection successful! Mode: ${isTestMode ? 'Test' : 'Live'}`
        })
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Connection failed'
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to test connection'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CreditCardIcon className="h-12 w-12 text-cosmic-400 mr-4" />
              <h1 className="text-3xl font-bold text-white">Stripe Configuration</h1>
            </div>
            <p className="text-white/80 text-lg">
              Configure your Stripe payment settings for AI Astrology
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="bg-white/5 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Payment Mode</h2>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isTestMode ? 'text-white' : 'text-white/60'}`}>
                Live Mode
              </span>
              <button
                onClick={() => setIsTestMode(!isTestMode)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                  isTestMode ? 'bg-cosmic-600' : 'bg-cosmic-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isTestMode ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${isTestMode ? 'text-white' : 'text-white/60'}`}>
                Test Mode
                <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                  Recommended
                </span>
              </span>
            </div>
          </div>

          {/* API Keys */}
          <div className="space-y-6 mb-8">
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {isTestMode ? 'Test' : 'Live'} API Keys
                </h2>
                <button
                  onClick={() => setShowKeys(!showKeys)}
                  className="flex items-center gap-2 text-cosmic-400 hover:text-cosmic-300 transition-colors"
                >
                  {showKeys ? (
                    <>
                      <EyeSlashIcon className="h-4 w-4" />
                      Hide Keys
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4" />
                      Show Keys
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Publishable Key
                  </label>
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={isTestMode ? config.testPublishableKey : config.livePublishableKey}
                    onChange={(e) => setConfig({
                      ...config,
                      [isTestMode ? 'testPublishableKey' : 'livePublishableKey']: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent"
                    placeholder={`Enter your ${isTestMode ? 'test' : 'live'} publishable key`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Secret Key
                  </label>
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={isTestMode ? config.testSecretKey : config.liveSecretKey}
                    onChange={(e) => setConfig({
                      ...config,
                      [isTestMode ? 'testSecretKey' : 'liveSecretKey']: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent"
                    placeholder={`Enter your ${isTestMode ? 'test' : 'live'} secret key`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {status.type && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                status.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : status.type === 'error'
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                  : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              }`}
            >
              {status.type === 'success' && <CheckCircleIcon className="h-5 w-5" />}
              {status.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5" />}
              {status.type === 'info' && <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
              <span>{status.message}</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={testConnection}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
            >
              Test Connection
            </Button>
            <Button
              onClick={saveConfig}
              className="bg-gradient-to-r from-cosmic-500 to-purple-600 hover:from-cosmic-600 hover:to-purple-700 text-white"
            >
              Save Configuration
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How to get your Stripe keys:</h3>
            <ol className="text-white/80 space-y-2 text-sm">
              <li>1. Go to <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-cosmic-400 hover:text-cosmic-300 underline">Stripe Dashboard</a></li>
              <li>2. Navigate to Developers → API keys</li>
              <li>3. Copy your Publishable key and Secret key</li>
              <li>4. For testing, use the test keys (start with pk_test_ and sk_test_)</li>
              <li>5. For production, use the live keys (start with pk_live_ and sk_live_)</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
