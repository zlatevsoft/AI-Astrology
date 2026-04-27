import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const Body = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8),
    name: z.string().optional(),
    username: z.string().min(2).max(64).optional(),
  })
  .refine(
    (d) => Boolean((d.email && d.email.trim()) || (d.username && d.username.trim())),
    { message: 'Provide email and/or username', path: ['email'] }
  )

/**
 * One-time: create first SUPER_ADMIN if none exist. Requires X-Setup-Key matching SETUP_SECRET in env.
 * You may use `username` only (e.g. "zlatevsoft"), `email` only, or both. Rotate SETUP_SECRET after use.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-setup-key')
  if (!process.env.SETUP_SECRET || secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 503 })
  }
  const existing = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } })
  if (existing > 0) {
    return NextResponse.json(
      { error: 'Admin already exists. Use /api/admin/provision-super-user to add another super admin.' },
      { status: 409 }
    )
  }
  const raw = await request.json()
  const body = Body.parse(raw)
  const email = body.email?.trim() ? body.email.toLowerCase() : null
  const username = body.username?.trim() ? body.username.trim() : null
  if (email) {
    const e = await prisma.user.findUnique({ where: { email } })
    if (e) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
  }
  if (username) {
    const u = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    })
    if (u) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }
  }
  const passwordHash = await bcrypt.hash(body.password, 12)
  const user = await prisma.user.create({
    data: {
      email,
      username,
      name: body.name || 'Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  })
  return NextResponse.json({ ok: true, id: user.id, email: user.email, username: user.username })
}
