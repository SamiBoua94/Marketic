import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer la boutique de l'utilisateur
    const shop = await prisma.shop.findUnique({
      where: { userId: session.user.id },
      select: { id: true, name: true }
    });

    if (!shop) {
      return NextResponse.json({ error: 'Boutique non trouvée' }, { status: 404 });
    }

    // Récupérer toutes les commandes contenant des produits de cette boutique
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              shopId: shop.id
            }
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                shopId: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filtrer pour ne garder que les items de la boutique dans chaque commande
    const filteredOrders = orders.map(order => ({
      ...order,
      items: order.items.filter(item => item.product.shopId === shop.id)
    })).filter(order => order.items.length > 0); // Ne garder que les commandes avec au moins un item de la boutique

    return NextResponse.json(filteredOrders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes boutique:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
