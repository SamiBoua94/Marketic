
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Updated for Next.js 15+ async params
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { id } = await context.params;
        const data = await request.json();

        // Verify ownership (optional but recommended: check if product belongs to user's shop)
        const shop = await prisma.shop.findUnique({ where: { userId: session.id } });
        const existingProduct = await prisma.product.findUnique({ where: { id } });

        if (!existingProduct || !shop || existingProduct.shopId !== shop.id) {
            return NextResponse.json({ error: 'Produit introuvable ou non autorisé' }, { status: 404 });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10),
                images: data.images ? JSON.stringify(data.images) : undefined,
                tags: data.tags ? JSON.stringify(data.tags) : undefined,
                productInfo: data.productInfo ? JSON.stringify(data.productInfo) : undefined,
                options: data.options ? JSON.stringify(data.options) : undefined,
                category: data.category,
            }
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { id } = await context.params;

        const shop = await prisma.shop.findUnique({ where: { userId: session.id } });
        const existingProduct = await prisma.product.findUnique({ where: { id } });

        if (!existingProduct || !shop || existingProduct.shopId !== shop.id) {
            return NextResponse.json({ error: 'Produit introuvable ou non autorisé' }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }
}
