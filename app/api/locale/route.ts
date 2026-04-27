import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const Body = z.object({ locale: z.enum(['en', 'bg']) })

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => ({}))
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }
  const { locale } = parsed.data
  const res = NextResponse.json({ ok: true, locale })
  res.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 400,
    sameSite: 'lax',
  })
  return res
}
