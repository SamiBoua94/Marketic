import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/middleware/error.handler';

// Public API to search products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        const products = await prisma.product.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { tags: { contains: search, mode: 'insensitive' } },
                    { category: { contains: search, mode: 'insensitive' } }
                ]
            } : {},
            include: {
                shop: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        profilePicture: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return successResponse(products);
    } catch (error) {
        return handleError(error);
    }
}
