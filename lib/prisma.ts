import { PrismaClient } from '@prisma/client'

const datasourceUrl = process.env.DATABASE_URL || 'file:./dev.db'

let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined
}

if (!globalThis.prismaGlobal) globalThis.prismaGlobal = new PrismaClient({ datasources: { db: { url: datasourceUrl } } })
prisma = globalThis.prismaGlobal

export { prisma }


