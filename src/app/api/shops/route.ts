import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const shops = await prisma.shop.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        profilePicture: true,
        bannerPicture: true,
        address: true,
        city: true,
        postalCode: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json(
      { error: 'Impossible de charger les boutiques' },
      { status: 500 }
    );
  }
}
