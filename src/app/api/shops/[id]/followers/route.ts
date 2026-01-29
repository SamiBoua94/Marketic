import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Vérifier si la boutique existe
    const shop = await prisma.shop.findUnique({
      where: { id }
    });

    if (!shop) {
      return NextResponse.json({ error: 'Boutique non trouvée' }, { status: 404 });
    }

    // Compter le nombre total de followers
    const totalCount = await prisma.follow.count({
      where: { shopId: id }
    });

    // Récupérer les followers avec pagination
    const followers = await prisma.follow.findMany({
      where: { shopId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    });

    return NextResponse.json({
      followers: followers.map(follow => follow.user),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des followers:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des followers' },
      { status: 500 }
    );
  }
}
