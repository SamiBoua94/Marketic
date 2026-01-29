import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si la boutique existe
    const shop = await prisma.shop.findUnique({
      where: { id }
    });

    if (!shop) {
      return NextResponse.json({ error: 'Boutique non trouvée' }, { status: 404 });
    }

    // Vérifier si l'utilisateur ne suit pas déjà la boutique
    const existingFollow = await prisma.follow.findUnique({
      where: {
        userId_shopId: {
          userId: session.user.id,
          shopId: id
        }
      }
    });

    if (existingFollow) {
      return NextResponse.json({ error: 'Vous suivez déjà cette boutique' }, { status: 400 });
    }

    // Créer la relation de suivi
    const follow = await prisma.follow.create({
      data: {
        userId: session.user.id,
        shopId: id
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Boutique suivie avec succès',
      follow 
    });
  } catch (error) {
    console.error('Erreur lors du suivi de la boutique:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du suivi de la boutique' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si la relation de suivi existe
    const follow = await prisma.follow.findUnique({
      where: {
        userId_shopId: {
          userId: session.user.id,
          shopId: id
        }
      }
    });

    if (!follow) {
      return NextResponse.json({ error: 'Vous ne suivez pas cette boutique' }, { status: 400 });
    }

    // Supprimer la relation de suivi
    await prisma.follow.delete({
      where: { id: follow.id }
    });

    return NextResponse.json({ 
      message: 'Boutique ne plus suivie avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'arrêt du suivi:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'arrêt du suivi' },
      { status: 500 }
    );
  }
}
