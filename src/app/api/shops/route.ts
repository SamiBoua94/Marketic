import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/middleware/error.handler';

// Public API to search/list shops
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        const shops = await prisma.shop.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { city: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { tags: { contains: search, mode: 'insensitive' } }
                ]
            } : {},
            include: {
                user: { select: { name: true } },
                products: {
                    take: 4,
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return successResponse(shops);
    } catch (error) {
        return handleError(error);
    }
}
