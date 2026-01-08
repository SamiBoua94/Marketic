import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { userStore } from '@/lib/user-store';

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

        const user = userStore.update(session.id, {
            ...(name && { name }),
            ...(description !== undefined && { description }),
            ...(profilePicture !== undefined && { profilePicture }),
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                description: user.description,
                createdAt: user.createdAt,
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
