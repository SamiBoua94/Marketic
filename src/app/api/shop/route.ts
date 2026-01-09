import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        console.log('GET /api/shop - Session:', session?.id);
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const shop = await prisma.shop.findUnique({
            where: { userId: session.id },
            include: { user: { select: { name: true, email: true } } }
        });

        return NextResponse.json({ shop });
    } catch (error) {
        console.error('Error fetching shop:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const data = await request.json();
        console.log('POST /api/shop - Payload:', data);

        // Validation simple
        if (!data.name) {
            return NextResponse.json({ error: 'Le nom de la boutique est requis' }, { status: 400 });
        }

        // Check if shop already exists
        const existingShop = await prisma.shop.findUnique({
            where: { userId: session.id },
        });

        if (existingShop) {
            return NextResponse.json({ error: 'Une boutique existe déjà pour cet utilisateur' }, { status: 400 });
        }

        const shop = await prisma.shop.create({
            data: {
                ...data,
                userId: session.id
            }
        });

        console.log('POST /api/shop - Created:', shop);

        return NextResponse.json({ shop });
    } catch (error) {
        console.error('Error creating shop:', error);
        return NextResponse.json({ error: 'Erreur lors de la création de la boutique' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const data = await request.json();

        // Remove id and userId from update data to prevent tampering
        const { id, userId, ...updateData } = data;

        const shop = await prisma.shop.update({
            where: { userId: session.id },
            data: updateData
        });

        return NextResponse.json({ shop });
    } catch (error) {
        console.error('Error updating shop:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour de la boutique' }, { status: 500 });
    }
}
