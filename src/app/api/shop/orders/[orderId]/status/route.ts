import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { orderId } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer la boutique de l'utilisateur
    const shop = await prisma.shop.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!shop) {
      return NextResponse.json({ error: 'Boutique non trouvée' }, { status: 404 });
    }

    // Vérifier que la commande contient des produits de cette boutique
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: {
            product: {
              shopId: shop.id
            }
          }
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                shopId: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée ou non autorisée' }, { status: 404 });
    }

    const { status } = await request.json();

    // Valider le statut
    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    // Mettre à jour le statut de la commande
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: status,
        updatedAt: new Date()
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
      }
    });

    // Filtrer pour ne garder que les items de la boutique
    const filteredOrder = {
      ...updatedOrder,
      items: updatedOrder.items.filter(item => item.product.shopId === shop.id)
    };

    return NextResponse.json(filteredOrder);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
}
