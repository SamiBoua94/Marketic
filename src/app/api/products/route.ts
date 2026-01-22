
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Récupération de tous les produits sans nécessiter d'authentification
        const products = await prisma.product.findMany({
            include: {
                shop: {
                    select: {
                        id: true,
                        name: true,
                        profilePicture: true,
                        bannerPicture: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' // Les produits les plus récents en premier
            }
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const shop = await prisma.shop.findUnique({
            where: { userId: session.id },
        });

        if (!shop) {
            return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });
        }

        const data = await request.json();

        // Validation
        if (!data.name || !data.price || !data.description) {
            return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                stock: parseInt(data.stock || '0', 10),
                images: data.images ? JSON.stringify(data.images) : null,
                tags: data.tags ? JSON.stringify(data.tags) : null,
                productInfo: data.productInfo ? JSON.stringify(data.productInfo) : null,
                options: data.options ? JSON.stringify(data.options) : null,
                category: data.category,
                shopId: shop.id
            }
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Erreur lors de la création du produit' }, { status: 500 });
    }
}
