import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { normalizePromoCode } from '@/lib/promo'

const PatchBody = z
  .object({
    influencer: z
      .object({
        name: z.string().min(1).max(120).optional(),
        username: z.string().min(2).max(32).optional(),
        email: z.union([z.string().email(), z.literal('')]).optional(),
        password: z.string().min(8).max(200).optional(),
      })
      .optional(),
    promo: z
      .object({
        code: z.string().min(2).max(32).optional(),
        discountPercent: z.number().int().min(1).max(90).optional(),
        commissionPercent: z.number().int().min(0).max(100).optional(),
        active: z.boolean().optional(),
        validUntil: z.union([z.string().min(1), z.null()]).optional(),
      })
      .optional(),
  })
  .refine(
    (b) => {
      const infVals = b.influencer ? Object.values(b.influencer).filter((v) => v !== undefined) : []
      const promoVals = b.promo ? Object.values(b.promo).filter((v) => v !== undefined) : []
      return infVals.length > 0 || promoVals.length > 0
    },
    { message: 'Nothing to update' }
  )

async function assertSuperAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'SUPER_ADMIN' || !process.env.DATABASE_URL) {
    return null
  }
  return session
}

export async function PATCH(request: NextRequest, { params }: { params: { promoCodeId: string } }) {
  const session = await assertSuperAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PatchBody.safeParse(json)
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] || parsed.error.message || 'Invalid input'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const promoCodeId = params.promoCodeId
  const promoRow = await prisma.promoCode.findUnique({
    where: { id: promoCodeId },
    include: { influencer: true },
  })
  if (!promoRow || promoRow.influencer.role !== 'INFLUENCER') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { influencer: infPatch, promo: promoPatch } = parsed.data

  try {
    await prisma.$transaction(async (tx) => {
      if (infPatch) {
        const userData: {
          name?: string
          username?: string
          email?: string | null
          passwordHash?: string
        } = {}

        if (infPatch.name !== undefined) userData.name = infPatch.name.trim()
        if (infPatch.username !== undefined) {
          const u = infPatch.username.trim()
          const clash = await tx.user.findFirst({
            where: {
              username: { equals: u, mode: 'insensitive' },
              NOT: { id: promoRow.influencerId },
            },
          })
          if (clash) {
            throw Object.assign(new Error('USERNAME_TAKEN'), { code: 'USERNAME_TAKEN' })
          }
          userData.username = u
        }
        if (infPatch.email !== undefined) {
          const em = infPatch.email === '' ? null : infPatch.email.trim()
          if (em) {
            const clash = await tx.user.findFirst({
              where: {
                email: { equals: em, mode: 'insensitive' },
                NOT: { id: promoRow.influencerId },
              },
            })
            if (clash) {
              throw Object.assign(new Error('EMAIL_TAKEN'), { code: 'EMAIL_TAKEN' })
            }
          }
          userData.email = em
        }
        if (infPatch.password !== undefined) {
          userData.passwordHash = await bcrypt.hash(infPatch.password, 12)
        }

        if (Object.keys(userData).length > 0) {
          await tx.user.update({
            where: { id: promoRow.influencerId, role: 'INFLUENCER' },
            data: userData,
          })
        }
      }

      if (promoPatch) {
        const promoData: {
          code?: string
          discountPercent?: number
          commissionPercent?: number
          active?: boolean
          validUntil?: Date | null
        } = {}

        if (promoPatch.code !== undefined) {
          const code = normalizePromoCode(promoPatch.code)
          const clash = await tx.promoCode.findFirst({
            where: { code, NOT: { id: promoCodeId } },
          })
          if (clash) {
            throw Object.assign(new Error('CODE_TAKEN'), { code: 'CODE_TAKEN' })
          }
          promoData.code = code
        }
        if (promoPatch.discountPercent !== undefined) promoData.discountPercent = promoPatch.discountPercent
        if (promoPatch.commissionPercent !== undefined) promoData.commissionPercent = promoPatch.commissionPercent
        if (promoPatch.active !== undefined) promoData.active = promoPatch.active
        if (promoPatch.validUntil !== undefined) {
          const vu = promoPatch.validUntil
          promoData.validUntil = vu === null ? null : new Date(vu)
        }

        if (Object.keys(promoData).length > 0) {
          await tx.promoCode.update({
            where: { id: promoCodeId },
            data: promoData,
          })
        }
      }
    })
  } catch (e) {
    const err = e as { code?: string }
    if (err.code === 'USERNAME_TAKEN') {
      return NextResponse.json({ error: 'Username taken' }, { status: 409 })
    }
    if (err.code === 'EMAIL_TAKEN') {
      return NextResponse.json({ error: 'Email taken' }, { status: 409 })
    }
    if (err.code === 'CODE_TAKEN') {
      return NextResponse.json({ error: 'Promo code already used' }, { status: 409 })
    }
    console.error('PATCH affiliate:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: NextRequest, { params }: { params: { promoCodeId: string } }) {
  const session = await assertSuperAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const promoCodeId = params.promoCodeId
  const promoRow = await prisma.promoCode.findUnique({
    where: { id: promoCodeId },
    select: { influencerId: true, influencer: { select: { role: true } } },
  })

  if (!promoRow || promoRow.influencer.role !== 'INFLUENCER') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    await prisma.user.delete({
      where: { id: promoRow.influencerId, role: 'INFLUENCER' },
    })
  } catch (e) {
    console.error('DELETE influencer:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
