import { PrismaClient } from "@/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! })

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// SQLite-only WAL mode — remove if migrating to PostgreSQL
prisma.$executeRaw`PRAGMA journal_mode=WAL;`.catch((err: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[prisma] WAL PRAGMA failed:", err)
  }
})
