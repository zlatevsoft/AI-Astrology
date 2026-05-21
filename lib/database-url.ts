/**
 * Vercel Postgres / Neon часто вкарват `POSTGRES_PRISMA_URL` и др., без да попълват `DATABASE_URL`.
 * Приложението и `npm run db:push` трябва да ползват първата валидна верига като Postgres connection string.
 */
const URL_KEYS = ['DATABASE_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING', 'POSTGRES_URL'] as const

function isPostgresConnString(s: string): boolean {
  const t = s.trim()
  return t.startsWith('postgresql://') || t.startsWith('postgres://')
}

/** Първата непразна променлива, която изглежда като Postgres URL. */
export function getEffectiveDatabaseUrl(): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined

  for (const key of URL_KEYS) {
    const raw = process.env[key]
    if (typeof raw === 'string' && raw.trim() && isPostgresConnString(raw)) {
      return raw.trim()
    }
  }
  return undefined
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getEffectiveDatabaseUrl())
}
