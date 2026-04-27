import { prisma } from '@/lib/prisma'

/**
 * True only when: DATABASE_URL + SETUP_SECRET are set, DB works, and no SUPER_ADMIN exists.
 * Used on the server for /login — no public API needed (avoids leaking "no admin yet" via GET).
 */
export async function getAllowFirstAdminSetup(): Promise<boolean> {
  if (!process.env.DATABASE_URL?.trim() || !process.env.SETUP_SECRET?.trim()) {
    return false
  }
  if (process.env.ALLOW_FIRST_ADMIN_FORM === '0' || process.env.ALLOW_FIRST_ADMIN_FORM === 'false') {
    return false
  }
  try {
    const n = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } })
    return n === 0
  } catch (e) {
    console.error('getAllowFirstAdminSetup:', e)
    return false
  }
}
