import { PrismaClient } from "@prisma/client";

const globalWithPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalWithPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalWithPrisma.prisma = prisma;
}

export default prisma;
