import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { orderService } from '@/services/order.service';
import { authOptions } from '@/lib/auth';

// Version simplifiée pour la compatibilité avec Next.js 14
export async function GET(
  request: NextRequest,
  { params }: any
) {
  const orderId = params?.orderId;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' }, 
        { status: 401 }
      );
    }

    const order = await orderService.getOrderById(
      orderId, 
      session.user.id
    );
    
    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: any
) {
  const orderId = params?.orderId;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' }, 
        { status: 401 }
      );
    }

    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { error: 'Le statut est requis' },
        { status: 400 }
      );
    }

    const updatedOrder = await orderService.updateOrderStatus(
      orderId,
      status
    );
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}
