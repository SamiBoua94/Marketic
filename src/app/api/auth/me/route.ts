import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { userStore } from '@/lib/user-store';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ user: null });
        }

        const user = userStore.findById(session.id);

        if (!user) {
            return NextResponse.json({ user: null });
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
        console.error('Get me error:', error);
        return NextResponse.json({ user: null });
    }
}
