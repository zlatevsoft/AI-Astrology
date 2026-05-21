'use strict'

/**
 * Vercel / CI: apply Prisma schema to Postgres (`db push`) so new models (e.g. PricingSettings) exist without manual SSH.
 * Local `npm run build`: skips db push unless RUN_DB_PUSH=1 (avoid failing builds without DATABASE_URL).
 */
const { spawnSync } = require('child_process')

function exitFromStatus(status) {
  if (status === null || status !== 0) process.exit(status ?? 1)
}

let r

r = spawnSync('npx', ['prisma', 'generate'], { stdio: 'inherit', shell: true, env: process.env })
exitFromStatus(r.status)

const onVercel = process.env.VERCEL === '1'
const forcePush =
  process.env.RUN_DB_PUSH === '1' || process.env.RUN_DB_PUSH === 'true' || process.env.CI === 'true'

if (onVercel || forcePush) {
  console.log('[build] Syncing schema to database (prisma db push)')
  r = spawnSync('node', ['scripts/with-database-url.cjs', 'db', 'push'], { stdio: 'inherit', shell: false, env: process.env })
  exitFromStatus(r.status)
}

r = spawnSync('npx', ['next', 'build'], { stdio: 'inherit', shell: true, env: process.env })
exitFromStatus(r.status)
