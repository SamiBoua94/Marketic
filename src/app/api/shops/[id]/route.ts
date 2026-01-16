import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extraire l'ID directement de l'URL
    const url = new URL(request.url || '', `http://${request.headers.get('host')}`);
    const pathSegments = url.pathname.split('/');
    const shopId = pathSegments[pathSegments.length - 1];
    
    console.log('URL complète:', request.url);
    console.log('Segments du chemin:', pathSegments);
    console.log('ID extrait:', shopId);
    
    // Vérifier que l'ID est bien défini
    if (!shopId) {
      console.error('Erreur: Aucun ID de boutique fourni');
      return NextResponse.json(
        { error: 'ID de boutique manquant', receivedParams: params },
        { status: 400 }
      );
    }
    
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
        twitter: true
        // Note: Ces champs devront être ajoutés à votre schéma Prisma si ce n'est pas déjà fait
        // rating: true,
        // tags: true
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
