import { NextRequest } from 'next/server';
import { authService } from '@/services/auth/auth.service';
import { validate, createUserSchema } from '@/validators/schema.validator';
import { handleError, successResponse } from '@/middleware/error.handler';

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validated = await validate(createUserSchema, body);

        // Register user through service
        const user = await authService.register(
            validated.email,
            validated.password,
            validated.name
        );

        return successResponse(
            {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            201
        );
    } catch (error) {
        return handleError(error);
    }
}
