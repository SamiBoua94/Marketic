import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { orderService } from '@/services/order.service';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const orders = await orderService.getUserOrders(session.user.id);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { shippingInfo, paymentInfo } = await request.json();
    const order = await orderService.createOrder(
      session.user.id,
      shippingInfo,
      paymentInfo
    );
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
