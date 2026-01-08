import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userStore } from '@/lib/user-store';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, mot de passe et nom sont requis' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = userStore.findByEmail(email);

        if (existingUser) {
            return NextResponse.json(
                { error: 'Un compte avec cet email existe déjà' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = userStore.create({
            email,
            password: hashedPassword,
            name,
        });

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
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création du compte' },
            { status: 500 }
        );
    }
}
