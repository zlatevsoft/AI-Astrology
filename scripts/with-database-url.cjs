'use strict'

const { spawnSync } = require('child_process')

/**
 * Mirrors lib/database-url.ts — keep Postgres URL fallback list in sync.
 * Sets process.env.DATABASE_URL before running Prisma CLI (schema datasource uses env DATABASE_URL).
 */
const URL_KEYS = ['DATABASE_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING', 'POSTGRES_URL']

function resolveIntoDatabaseUrlEnv() {
  for (const key of URL_KEYS) {
    const raw = process.env[key]
    if (typeof raw !== 'string') continue
    const t = raw.trim()
    if (t.startsWith('postgresql://') || t.startsWith('postgres://')) {
      process.env.DATABASE_URL = t
      return true
    }
  }
  return false
}

if (!resolveIntoDatabaseUrlEnv()) {
  console.error(
    '[prisma] No Postgres URL. Set DATABASE_URL or (typical on Vercel/Neon) POSTGRES_PRISMA_URL,\n' +
      'POSTGRES_URL, or POSTGRES_URL_NON_POOLING, then rerun.'
  )
  process.exit(1)
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/with-database-url.cjs <db push | studio | ...>')
  process.exit(1)
}

const result = spawnSync('npx', ['prisma', ...args], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})
process.exit(result.status === null ? 1 : result.status)
