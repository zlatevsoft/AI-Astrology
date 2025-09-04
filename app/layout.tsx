import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Professional Astro Horoscope Birth Chart',
    template: '%s | AstroHoroscope.online'
  },
  description: 'Get your personalized AI astrology birth chart reading at AstroHoroscope.online. Professional astro horoscope analysis with cosmic insights starting at $9.99.',
  keywords: [
    'astro horoscope',
    'AI astrology',
    'birth chart',
    'natal chart',
    'zodiac horoscope',
    'astrological reading',
    'cosmic analysis',
    'zodiac signs',
    'planetary positions',
    'astrology online',
    'horoscope reading',
    'birth chart analysis',
    'astrological insights',
    'zodiac compatibility',
    'astrology consultation'
  ],
  authors: [{ name: 'AstroHoroscope.online Team' }],
  creator: 'AstroHoroscope.online',
  publisher: 'AstroHoroscope.online',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    'theme-color': '#7c3aed',
    'color-scheme': 'dark light',
    'msapplication-TileColor': '#667eea',
  },
  metadataBase: new URL('https://astrohoroscope.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://astrohoroscope.online',
    title: 'Professional Astro Horoscope Birth Chart',
    description: 'Get your personalized AI astrology birth chart reading at AstroHoroscope.online. Professional astro horoscope analysis with cosmic insights starting at $9.99.',
    siteName: 'AstroHoroscope.online',
    images: [
      {
        url: '/og-image-new.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Astrology - Cosmic Birth Chart Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Astro Horoscope Birth Chart',
    description: 'Get your personalized AI astrology birth chart reading at AstroHoroscope.online. Professional astro horoscope analysis with cosmic insights starting at $9.99.',
    images: ['/og-image-new.jpg'],
    creator: '@astrohoroscope',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  manifest: '/manifest.json',
  icons: {
  icon: [
    { url: '/icon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
    { url: '/icon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
    { url: '/favicon.ico?v=2' },
    { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
    { url: '/favicon-large.svg?v=2', type: 'image/svg+xml', sizes: '64x64' },
  ],
  apple: [
    { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
  ],
  other: [
    { rel: 'mask-icon', url: '/safari-pinned-tab.svg?v=2', color: '#667eea' },
  ],
},

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                 <meta name="apple-mobile-web-app-title" content="AstroHoroscope.online" />
         <meta name="mobile-web-app-capable" content="yes" />
         <meta name="application-name" content="AstroHoroscope.online" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.openai.com" />
        <link rel="preconnect" href="https://api.stripe.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.openai.com" />
        <link rel="dns-prefetch" href="//api.stripe.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
                         __html: JSON.stringify({
               "@context": "https://schema.org",
               "@type": "WebApplication",
               "name": "Professional Astro Horoscope Birth Chart",
               "description": "Get your personalized AI astrology birth chart reading at AstroHoroscope.online. Professional astro horoscope analysis with cosmic insights starting at $9.99",
               "url": "https://astrohoroscope.online",
               "applicationCategory": "LifestyleApplication",
               "operatingSystem": "Web",
               "offers": {
                 "@type": "Offer",
                 "price": "9.99",
                 "priceCurrency": "USD"
               },
               "author": {
                 "@type": "Organization",
                 "name": "AstroHoroscope.online"
               }
             })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
            {children}
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
