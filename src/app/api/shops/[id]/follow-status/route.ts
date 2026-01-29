import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ isFollowing: false });
    }

    // Vérifier si la boutique existe
    const shop = await prisma.shop.findUnique({
      where: { id }
    });

    if (!shop) {
      return NextResponse.json({ error: 'Boutique non trouvée' }, { status: 404 });
    }

    // Vérifier si l'utilisateur suit la boutique
    const follow = await prisma.follow.findUnique({
      where: {
        userId_shopId: {
          userId: session.user.id,
          shopId: id
        }
      }
    });

    return NextResponse.json({ 
      isFollowing: !!follow 
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut de suivi:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification du statut de suivi' },
      { status: 500 }
    );
  }
}
