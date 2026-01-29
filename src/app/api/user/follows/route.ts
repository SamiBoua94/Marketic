import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Compter le nombre total de boutiques suivies
    const totalCount = await prisma.follow.count({
      where: { userId: session.user.id }
    });

    // Récupérer les boutiques suivies avec pagination
    const follows = await prisma.follow.findMany({
      where: { userId: session.user.id },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            description: true,
            profilePicture: true,
            city: true,
            tags: true,
            _count: {
              select: {
                follows: true
              }
            }
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
      shops: follows.map(follow => ({
        ...follow.shop,
        followedAt: follow.createdAt
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des boutiques suivies:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des boutiques suivies' },
      { status: 500 }
    );
  }
}
