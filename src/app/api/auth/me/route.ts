import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ user: null });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.id }
        });

        if (!user) {
            return NextResponse.json({ user: null });
        }

        const shop = await prisma.shop.findUnique({
            where: { userId: session.id },
            select: { id: true }
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                description: user.description,
                createdAt: user.createdAt,
                hasShop: !!shop,
            },
        });
    } catch (error) {
        console.error('Get me error:', error);
        return NextResponse.json({ user: null });
    }
}
