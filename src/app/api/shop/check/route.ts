import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ hasShop: false });
        }

        const shop = await prisma.shop.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        return NextResponse.json({ hasShop: !!shop });
    } catch (error) {
        console.error('Error checking shop:', error);
        return NextResponse.json({ hasShop: false }, { status: 500 });
    }
}
