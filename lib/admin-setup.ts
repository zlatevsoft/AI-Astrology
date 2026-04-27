import { prisma } from '@/lib/prisma'

export type FirstAdminBlockReason =
  | 'no_setup_secret'
  | 'no_database_url'
  | 'form_disabled'
  | 'super_admin_exists'
  | 'database_error'

export type FirstAdminSetupState =
  | { ok: true }
  | { ok: false; reason: FirstAdminBlockReason }

/**
 * When ok: first-time form may be shown. When ok false: use reason for a clear message.
 */
export async function getFirstAdminSetupState(): Promise<FirstAdminSetupState> {
  if (process.env.ALLOW_FIRST_ADMIN_FORM === '0' || process.env.ALLOW_FIRST_ADMIN_FORM === 'false') {
    return { ok: false, reason: 'form_disabled' }
  }
  if (!process.env.SETUP_SECRET?.trim()) {
    return { ok: false, reason: 'no_setup_secret' }
  }
  if (!process.env.DATABASE_URL?.trim()) {
    return { ok: false, reason: 'no_database_url' }
  }
  try {
    const n = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } })
    if (n > 0) {
      return { ok: false, reason: 'super_admin_exists' }
    }
    return { ok: true }
  } catch (e) {
    console.error('getFirstAdminSetupState:', e)
    return { ok: false, reason: 'database_error' }
  }
}

/** @deprecated use getFirstAdminSetupState */
export async function getAllowFirstAdminSetup(): Promise<boolean> {
  const s = await getFirstAdminSetupState()
  return s.ok === true
}
