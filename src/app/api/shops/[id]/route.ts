import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/middleware/error.handler';
import { NotFoundException } from '@/exceptions/http.exception';

// Public API to get a single shop by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const shop = await prisma.shop.findUnique({
            where: { id },
            include: {
                user: { 
                    select: { 
                        id: true,
                        name: true, 
                        profilePicture: true 
                    } 
                },
                products: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        images: true,
                        tags: true,
                        ethicalScore: true
                    }
                },
                _count: {
                    select: {
                        follows: true
                    }
                }
            }
        });

        if (!shop) {
            throw new NotFoundException('Boutique introuvable');
        }

        return successResponse(shop);
    } catch (error) {
        return handleError(error);
    }
}
