import Stripe from 'stripe'

// Get environment variables
const isTestMode = process.env.STRIPE_MODE === 'test'

// Stripe configuration
export const stripeConfig = {
  publishableKey: isTestMode 
    ? process.env.STRIPE_PUBLISHABLE_KEY_TEST 
    : process.env.STRIPE_PUBLISHABLE_KEY_LIVE,
  secretKey: isTestMode 
    ? process.env.STRIPE_SECRET_KEY_TEST 
    : process.env.STRIPE_SECRET_KEY_LIVE,
  mode: isTestMode ? 'test' : 'live'
}

// Initialize Stripe with fallback for development
let stripe: Stripe | null = null

if (stripeConfig.secretKey) {
  try {
    stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  } catch (error) {
    console.error('Failed to initialize Stripe:', error)
  }
} else {
  console.warn('Stripe secret key not found! Using mock mode for development.')
}

export { stripe }

   // Product configurations
  export const products = {
    basic: {
      name: 'Basic Reading',
      price: 999, // $9.99 in cents
      description: 'Discover your core personality and life path',
     features: [
       '🌟 Complete birth chart analysis',
       '💫 Core personality insights',
       '🎯 Life purpose & destiny guidance',
       '💕 Relationship patterns revealed',
       '💼 Career inclinations & strengths',
       '📊 Detailed planetary influences',
       '🔮 Key life lessons & challenges',
       '📱 Instant PDF download',
       '✨ Beautiful, shareable report'
     ]
   },
       detailed: {
      name: 'Detailed Analysis',
      price: 1999, // $19.99 in cents
      description: 'Deep dive into your soul\'s journey',
     features: [
       '✨ Everything in Basic, plus:',
       '🧠 Complete personality profile',
       '🌙 Soul mission & karmic patterns',
       '💝 Advanced relationship blueprint',
       '🚀 Complete career & life path',
       '🏠 Detailed house analysis',
       '⭐ All planetary aspects explained',
       '⏰ Life cycles & timing insights',
       '🔄 Shadow work & healing guidance',
       '📋 15+ practical recommendations',
       '🔮 Future guidance & predictions',
       '📱 Premium PDF download',
       '🎨 Stunning visual report'
     ]
   },
       comprehensive: {
      name: 'Comprehensive Reading',
      price: 2999, // $29.99 in cents
      description: 'Complete relationship compatibility analysis',
     features: [
       '💕 Astrological synastry analysis',
       '❤️ Relationship compatibility insights',
       '🗣️ Communication patterns revealed',
       '🔥 Emotional & intimate connection',
       '🌟 Long-term potential assessment',
       '⚡ Challenges & growth opportunities',
       '✨ Harmonious aspects identification',
       '🛡️ Conflict resolution strategies',
       '🛤️ Shared life path analysis',
       '⏰ Timing for important decisions',
       '📱 Ultimate PDF download',
       '🎭 Interactive compatibility report',
       '💎 Exclusive relationship insights'
     ]
   }
 }

// Helper function to get product by name
export function getProduct(productName: string) {
  // Map product names to keys
  const productMap: { [key: string]: keyof typeof products } = {
    'basic reading': 'basic',
    'detailed analysis': 'detailed',
    'comprehensive reading': 'comprehensive'
  }
  
  const normalizedName = productName.toLowerCase()
  const productKey = productMap[normalizedName] || normalizedName.replace(/\s+/g, '') as keyof typeof products
  
  console.log('Looking for product:', productName, '->', productKey, '->', products[productKey])
  
  return products[productKey]
}

// Helper function to format price
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`
}
