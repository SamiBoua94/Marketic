import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { orderService } from '@/services/order.service';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' }, 
        { status: 401 }
      );
    }

    const orders = await orderService.getUserOrders(session.user.id);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' }, 
        { status: 401 }
      );
    }

    const { shippingInfo, paymentInfo } = await request.json();
    
    if (!shippingInfo || !paymentInfo) {
      return NextResponse.json(
        { error: 'Informations de livraison et de paiement requises' },
        { status: 400 }
      );
    }

    const order = await orderService.createOrder(
      session.user.id,
      shippingInfo,
      paymentInfo
    );
    
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Erreur lors de la création de la commande:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Erreur lors de la création de la commande',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
