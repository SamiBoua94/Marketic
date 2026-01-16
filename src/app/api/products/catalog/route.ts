import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                shop: {
                    select: {
                        name: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Map database structure to the structure expected by the frontend if necessary
        // The frontend expects: { id, name, description, price, image, category, shop: { name, logo } }
        const formattedProducts = products.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            // handle images - database stores it as JSON string or nullable
            image: p.images ? JSON.parse(p.images)[0] : 'https://images.unsplash.com/photo-1578749553846-bc3a6c9a4421?auto=format&fit=crop&q=80&w=400',
            category: p.category || 'Non classé',
            shop: {
                name: p.shop.name,
                logo: p.shop.profilePicture || 'https://images.unsplash.com/photo-1541944743827-e04bb645f9ad?auto=format&fit=crop&q=80&w=100',
            },
        }));

        return NextResponse.json({ products: formattedProducts });
    } catch (error) {
        console.error('Error fetching catalog products:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des produits' }, { status: 500 });
    }
}
