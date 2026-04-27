import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
})

/**
 * One-time: create first SUPER_ADMIN if none exist. Requires X-Setup-Key matching SETUP_SECRET in env.
 * Remove or rotate after use.
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
    return NextResponse.json({ error: 'Admin already exists' }, { status: 409 })
  }
  const body = await request.json()
  const { email, password, name } = Body.parse(body)
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: name || 'Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  })
  return NextResponse.json({ ok: true, id: user.id, email: user.email })
}
