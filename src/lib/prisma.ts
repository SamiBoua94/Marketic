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

export let prismaIsConnected = false;

// Try connecting to DB (non-blocking) so routes can check availability
(async () => {
    try {
        await prisma.$connect();
        prismaIsConnected = true;
    } catch (err) {
        console.warn('Prisma: Could not connect to the database. Some endpoints will return limited data. Error:', (err as Error)?.message ?? err);
    }
})();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
