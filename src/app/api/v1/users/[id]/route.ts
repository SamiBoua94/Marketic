import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/middleware/error.handler';
import { NotFoundException, BadRequestException } from '@/exceptions/http.exception';
import { hashPassword } from '@/utils/helpers';

/**
 * GET /api/v1/users/[id]
 * Get a user by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                description: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        return successResponse(user);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * PUT /api/v1/users/[id]
 * Update a user
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, email, password, role } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Build update data
        const updateData: any = {};
        
        if (name) updateData.name = name;
        if (email && email !== existingUser.email) {
            // Check if new email already exists
            const userWithEmail = await prisma.user.findUnique({
                where: { email }
            });
            if (userWithEmail) {
                throw new BadRequestException('Un utilisateur avec cet email existe déjà');
            }
            updateData.email = email;
        }
        if (password) {
            if (password.length < 6) {
                throw new BadRequestException('Le mot de passe doit avoir au moins 6 caractères');
            }
            updateData.password = await hashPassword(password);
        }
        if (role) {
            updateData.description = role === 'Administrateur' ? 'Admin' : 'Support';
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                description: true,
                createdAt: true
            }
        });

        return successResponse(user);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/v1/users/[id]
 * Delete a user
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        await prisma.user.delete({
            where: { id }
        });

        return successResponse({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        return handleError(error);
    }
}
