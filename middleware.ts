import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const authRateLimitStore = new Map<string, { count: number; resetTime: number }>()
const firstAdminRegStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per minute
/** Stricter cap for sign-in / NextAuth to reduce brute force. */
const AUTH_RATE_WINDOW = 15 * 60 * 1000 // 15 minutes
const AUTH_RATE_MAX = 30
/** First admin registration: very strict (brute force on setup key). */
const FIRST_ADMIN_REG_WINDOW = 60 * 60 * 1000 // 1 hour
const FIRST_ADMIN_REG_MAX = 5

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  return `rate_limit:${ip}`
}

function isRateLimited(request: NextRequest): boolean {
  const key = getRateLimitKey(request)
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  record.count++
  return false
}

function isAuthRateLimited(request: NextRequest): boolean {
  const key = `auth:${getRateLimitKey(request)}`
  const now = Date.now()
  const record = authRateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    authRateLimitStore.set(key, { count: 1, resetTime: now + AUTH_RATE_WINDOW })
    return false
  }

  if (record.count >= AUTH_RATE_MAX) {
    return true
  }

  record.count++
  return false
}

function isFirstAdminRegisterLimited(request: NextRequest): boolean {
  const key = `first_admin_reg:${getRateLimitKey(request)}`
  const now = Date.now()
  const record = firstAdminRegStore.get(key)

  if (!record || now > record.resetTime) {
    firstAdminRegStore.set(key, { count: 1, resetTime: now + FIRST_ADMIN_REG_WINDOW })
    return false
  }

  if (record.count >= FIRST_ADMIN_REG_MAX) {
    return true
  }

  record.count++
  return false
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path === '/api/admin/register-first-admin' && request.method === 'POST') {
    if (isFirstAdminRegisterLimited(request)) {
      return new NextResponse(JSON.stringify({ error: 'Too many attempts. Try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '3600' },
      })
    }
  }

  if (path.startsWith('/admin/')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    if (!token) {
      const u = new URL('/login', request.url)
      u.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(u)
    }
    if (token.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/login?error=forbidden', request.url))
    }
  }

  if (path.startsWith('/partner')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    if (!token) {
      const u = new URL('/login', request.url)
      u.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(u)
    }
    if (token.role !== 'INFLUENCER') {
      return NextResponse.redirect(new URL('/login?error=forbidden', request.url))
    }
  }

  const response = NextResponse.next()

  if (!request.cookies.get('NEXT_LOCALE')) {
    const al = (request.headers.get('accept-language') || '').toLowerCase()
    const country = request.headers.get('x-vercel-ip-country') || ''
    const loc = al.startsWith('bg') || country === 'BG' ? 'bg' : 'en'
    response.cookies.set('NEXT_LOCALE', loc, {
      path: '/',
      maxAge: 60 * 60 * 24 * 400,
      sameSite: 'lax',
      httpOnly: false,
    })
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://api.openai.com https://api.stripe.com https://checkout.stripe.com; " +
    "frame-src 'self' https://js.stripe.com https://checkout.stripe.com; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "upgrade-insecure-requests;"
  )

  // Stricter rate limit for auth endpoints (brute force protection)
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    if (isAuthRateLimited(request)) {
      return new NextResponse(JSON.stringify({ error: 'Too many sign-in attempts. Try again later.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '900',
        },
      })
    }
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (isRateLimited(request)) {
      return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      })
    }
  }

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
