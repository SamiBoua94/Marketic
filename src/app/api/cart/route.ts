import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { cartService } from '@/services/cart.service';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('GET /api/cart: Aucune session valide trouvée');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    console.log('GET /api/cart: Session valide pour l\'utilisateur:', {
      userId: session.user.id,
      email: session.user.email
    });

    const cart = await cartService.getOrCreateUserCart(session.user.id);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du panier' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('POST /api/cart: Tentative non autorisée - pas de session');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'ID du produit manquant' },
        { status: 400 }
      );
    }

    console.log(`POST /api/cart: Ajout au panier pour l'utilisateur ${session.user.id}`, {
      productId,
      quantity
    });

    const cartItem = await cartService.addToCart(
      session.user.id,
      productId,
      quantity
    );
    
    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout au panier' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('PUT /api/cart: Tentative non autorisée - pas de session');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { cartItemId, quantity } = await request.json();
    
    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Données de requête invalides' },
        { status: 400 }
      );
    }

    console.log(`PUT /api/cart: Mise à jour du panier pour l'utilisateur ${session.user.id}`, {
      cartItemId,
      quantity
    });

    const updatedItem = await cartService.updateCartItem(
      cartItemId,
      quantity,
      session.user.id
    );
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du panier:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du panier' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('DELETE /api/cart: Tentative non autorisée - pas de session');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('cartItemId');

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'ID de l\'article manquant' },
        { status: 400 }
      );
    }

    console.log(`DELETE /api/cart: Suppression d'article pour l'utilisateur ${session.user.id}`, {
      cartItemId
    });

    await cartService.removeFromCart(cartItemId, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de l\'article' },
      { status: 500 }
    );
  }
}
