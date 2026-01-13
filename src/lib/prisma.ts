import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
    // Load .env synchronously if DATABASE_URL isn't already set.
    if (!process.env.DATABASE_URL) {
        require('dotenv').config();
    }
} catch (e) {
    // If dotenv is not installed (e.g., in certain deploy environments), ignore.
}

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
