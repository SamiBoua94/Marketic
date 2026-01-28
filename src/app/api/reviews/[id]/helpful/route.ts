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

    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si l'avis existe
    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return NextResponse.json({ error: 'Avis non trouvé' }, { status: 404 });
    }

    // Incrémenter le compteur de votes utiles
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        helpfulCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ helpfulCount: updatedReview.helpfulCount });
  } catch (error) {
    console.error('Erreur lors du vote utile:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du vote' },
      { status: 500 }
    );
  }
}
