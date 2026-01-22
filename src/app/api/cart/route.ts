import { NextResponse } from 'next/server';
import { cartService } from '@/services/cart.service';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const cart = await cartService.getOrCreateUserCart(session.id);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du panier' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { productId, quantity = 1 } = await request.json();
    const cartItem = await cartService.addToCart(
      session.id,
      productId,
      quantity
    );
    return NextResponse.json(cartItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout au panier' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { cartItemId, quantity } = await request.json();
    const updatedItem = await cartService.updateCartItem(cartItemId, quantity);
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du panier' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('cartItemId');

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'ID de l\'article manquant' },
        { status: 400 }
      );
    }

    await cartService.removeFromCart(cartItemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    );
  }
}
