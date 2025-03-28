import { PrismaClient } from "@prisma/client";

// ป้องกันการสร้าง PrismaClient หลายครั้งในโหมด Hot Reload
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
