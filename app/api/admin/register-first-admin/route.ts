import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const Body = z.object({
  setupKey: z.string().min(1),
  username: z.string().min(2).max(64),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
})

function safeEqualKey(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/**
 * One-time: create the first SUPER_ADMIN from the /login form.
 * Requires body.setupKey === env SETUP_SECRET and zero existing SUPER_ADMIN.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.SETUP_SECRET
  if (!expected?.trim() || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Not available' }, { status: 503 })
  }
  if (process.env.ALLOW_FIRST_ADMIN_FORM === '0' || process.env.ALLOW_FIRST_ADMIN_FORM === 'false') {
    return NextResponse.json({ error: 'Disabled' }, { status: 403 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const { setupKey, username, password, name } = parsed.data

  if (!safeEqualKey(setupKey, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const existing = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } })
    if (existing > 0) {
      return NextResponse.json({ error: 'Already configured' }, { status: 409 })
    }

    const u = await prisma.user.findFirst({
      where: { username: { equals: username.trim(), mode: 'insensitive' } },
    })
    if (u) {
      return NextResponse.json({ error: 'Username taken' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        name: name?.trim() || username.trim(),
        passwordHash,
        role: 'SUPER_ADMIN',
      },
    })
    return NextResponse.json({ ok: true, username: user.username })
  } catch (e) {
    console.error('register-first-admin:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
