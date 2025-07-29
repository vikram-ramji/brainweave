import { PrismaClient } from "@/generated/prisma";

interface GlobalPrisma {
  prisma?: PrismaClient;
}

const globalForPrisma = globalThis as GlobalPrisma;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "query", "warn"]
        : ["error"],
  });

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma;
