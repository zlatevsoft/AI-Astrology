import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const Body = z.object({
  password: z.string().min(8),
  name: z.string().optional(),
  email: z.string().email().optional(),
  username: z.string().min(2).max(64),
})

/**
 * Add another SUPER_ADMIN (e.g. zlatevsoft) when a super admin already exists.
 * Requires the same X-Setup-Key as bootstrap. Create the account once, then remove/rotate the secret in production.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-setup-key')
  if (!process.env.SETUP_SECRET || secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 503 })
  }
  const raw = await request.json()
  const body = Body.parse(raw)
  const email = body.email?.trim() ? body.email.toLowerCase() : null
  const username = body.username.trim()
  if (email) {
    const e = await prisma.user.findUnique({ where: { email } })
    if (e) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
  }
  const taken = await prisma.user.findFirst({
    where: { username: { equals: username, mode: 'insensitive' } },
  })
  if (taken) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }
  const passwordHash = await bcrypt.hash(body.password, 12)
  const user = await prisma.user.create({
    data: {
      email,
      username,
      name: body.name || username,
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  })
  return NextResponse.json({ ok: true, id: user.id, email: user.email, username: user.username })
}
