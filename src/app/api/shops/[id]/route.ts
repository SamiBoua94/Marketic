import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Version simplifiée pour la compatibilité avec Next.js 14
export async function GET(
  request: NextRequest,
  { params }: any
) {
  const shopId = params?.id;
  
  if (!shopId) {
    return NextResponse.json(
      { error: 'ID de boutique manquant' },
      { status: 400 }
    );
  }
  try {
    // Journalisation pour le débogage
    console.log('Recherche de la boutique avec ID:', shopId);
    console.log('Type de shopId:', typeof shopId);

    // Vérifier si la boutique existe dans la base de données
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        name: true,
        description: true,
        profilePicture: true,
        bannerPicture: true,
        address: true,
        city: true,
        postalCode: true,
        phone: true,
        email: true,
        instagram: true,
        facebook: true,
        twitter: true,
        // Ajoutez d'autres champs nécessaires
      },
    });

    if (!shop) {
      return NextResponse.json(
        { error: 'Boutique non trouvée' },
        { status: 404 }
      );
    }

    // Simuler une note pour l'exemple (à remplacer par la logique réelle)
    const shopWithRating = {
      ...shop,
      rating: 4.5, // Remplacez par la moyenne réelle des avis
      tags: shop.description ? shop.description.split(/[\s,]+/).slice(0, 5) : []
    };

    return NextResponse.json(shopWithRating);
  } catch (error) {
    console.error('Erreur lors de la récupération de la boutique:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
