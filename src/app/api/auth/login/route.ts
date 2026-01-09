import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createToken, setAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe sont requis' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        // Create token and set cookie
        const token = await createToken({
            id: user.id,
            email: user.email,
            name: user.name,
        });
        await setAuthCookie(token);

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                description: user.description,
                createdAt: user.createdAt,
                hasShop: !!(await prisma.shop.findUnique({
                    where: { userId: user.id },
                    select: { id: true }
                })),
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion' },
            { status: 500 }
        );
    }
}
