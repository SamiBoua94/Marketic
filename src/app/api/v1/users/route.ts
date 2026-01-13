import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/middleware/error.handler';
import { BadRequestException, ConflictException, NotFoundException } from '@/exceptions/http.exception';
import { hashPassword } from '@/utils/helpers';

/**
 * GET /api/v1/users
 * Get all users
 */
export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                description: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return successResponse(users);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/v1/users
 * Create a new user (admin or support account)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('POST /api/v1/users - Body:', body);
        const { name, email, password, role } = body;

        // Validate inputs
        if (!name || !email || !password) {
            throw new BadRequestException('Nom, email et mot de passe sont requis');
        }

        if (!email.includes('@')) {
            throw new BadRequestException('Email invalide');
        }

        if (password.length < 6) {
            throw new BadRequestException('Le mot de passe doit avoir au moins 6 caractères');
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ConflictException('Un utilisateur avec cet email existe déjà');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                description: role === 'Administrateur' ? 'Admin' : 'Support'
            },
            select: {
                id: true,
                name: true,
                email: true,
                description: true,
                createdAt: true
            }
        });

        console.log('User created:', user);
        return successResponse(user, 201);
    } catch (error) {
        return handleError(error);
    }
}
