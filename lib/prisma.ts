import { PrismaClient } from '@prisma/client'
import { getEffectiveDatabaseUrl } from '@/lib/database-url'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const datasourceUrl = getEffectiveDatabaseUrl()

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
