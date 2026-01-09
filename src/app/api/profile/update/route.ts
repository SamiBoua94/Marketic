import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const { name, description, profilePicture } = await request.json();

        // Update user
        const user = await prisma.user.update({
            where: { id: session.id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(profilePicture !== undefined && { profilePicture }),
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
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
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour du profil' },
            { status: 500 }
        );
    }
}
