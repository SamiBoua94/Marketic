import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/middleware/error.handler';
import { NotFoundException } from '@/exceptions/http.exception';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ idShop: string }> }
) {
    try {
        const { idShop } = await params;

        const shop = await prisma.shop.findUnique({
            where: { id: idShop },
            select: { id: true },
        });

        if (!shop) {
            throw new NotFoundException('Boutique introuvable');
        }

        const { searchParams } = new URL(request.url);
        const page = Math.max(1, Number(searchParams.get('page') || '1'));
        const limitRaw = Number(searchParams.get('limit') || '20');
        const limit = Math.min(100, Math.max(1, limitRaw));
        const skip = (page - 1) * limit;

        const [total, items] = await Promise.all([
            prisma.product.count({ where: { shopId: idShop } }),
            prisma.product.findMany({
                where: { shopId: idShop },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
        ]);

        return successResponse({
            items,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return handleError(error);
    }
}
