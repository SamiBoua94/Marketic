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

    const reviews = await prisma.review.findMany({
      where: { productId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des avis' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { rating, comment } = await request.json();

    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La note doit être comprise entre 1 et 5' }, { status: 400 });
    }

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Vérifier si l'utilisateur a déjà donné un avis
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: id
        }
      }
    });

    let review;
    if (existingReview) {
      // Mettre à jour l'avis existant
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment: comment || null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePicture: true
            }
          }
        }
      });
    } else {
      // Créer un nouvel avis
      review = await prisma.review.create({
        data: {
          rating,
          comment: comment || null,
          userId: session.user.id,
          productId: id
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePicture: true
            }
          }
        }
      });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Erreur lors de la création/mise à jour de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création/mise à jour de l\'avis' },
      { status: 500 }
    );
  }
}
