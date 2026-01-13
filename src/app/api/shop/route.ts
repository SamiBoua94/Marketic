import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/middleware/error.handler';
import { UnauthorizedException, BadRequestException, ConflictException } from '@/exceptions/http.exception';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            throw new UnauthorizedException('Non autorisé');
        }

        const shop = await prisma.shop.findUnique({
            where: { userId: session.id },
            include: { user: { select: { name: true, email: true } }, products: true }
        });

        return successResponse(shop);
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            throw new UnauthorizedException('Non autorisé');
        }

        const data = await request.json();
        console.log('POST /api/shop - Payload:', data);

        // Validation
        if (!data.name || !data.name.trim()) {
            throw new BadRequestException('Le nom de la boutique est requis');
        }

        // Check if shop already exists
        const existingShop = await prisma.shop.findUnique({
            where: { userId: session.id }
        });

        if (existingShop) {
            throw new ConflictException('Une boutique existe déjà pour cet utilisateur');
        }

        // Prepare shop data
        const shopData = {
            name: data.name,
            description: data.description || null,
            address: data.address || null,
            city: data.city || null,
            postalCode: data.postalCode || null,
            email: data.email || null,
            phone: data.phone || null,
            siret: data.siret || null,
            legalStatus: data.legalStatus || null,
            instagram: data.instagram || null,
            facebook: data.facebook || null,
            twitter: data.twitter || null,
            tiktok: data.tiktok || null,
            youtube: data.youtube || null,
            profilePicture: data.profilePicture || null,
            bannerPicture: data.bannerPicture || null,
            certificationPicture: data.certificationPicture || null,
            tags: data.tags ? (Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags) : null,
            userId: session.id
        };

        const shop = await prisma.shop.create({
            data: shopData,
            include: { products: true }
        });

        console.log('POST /api/shop - Created:', shop);

        return successResponse(shop, 201);
    } catch (error) {
        return handleError(error);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            throw new UnauthorizedException('Non autorisé');
        }

        const data = await request.json();

        // Remove system fields
        const { id, userId, user, createdAt, updatedAt, products, ...updateData } = data;

        // Convert tags array to JSON string if it's an array
        if (Array.isArray(updateData.tags)) {
            updateData.tags = JSON.stringify(updateData.tags);
        } else if (!updateData.tags) {
            updateData.tags = null;
        }

        const shop = await prisma.shop.update({
            where: { userId: session.id },
            data: updateData
        });

        return successResponse(shop);
    } catch (error) {
        return handleError(error);
    }
}
