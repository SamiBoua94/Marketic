import { NextRequest } from 'next/server';
import { jwtDecode } from 'jose';
import { env } from '@/config/env';
import { UnauthorizedException } from '@/exceptions/http.exception';

export interface AuthRequest extends NextRequest {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

export async function verifyAuth(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    try {
        const secret = new TextEncoder().encode(env.JWT_SECRET);
        const { payload } = await jwtDecode(token, { secret });
        return payload;
    } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
    }
}

export function getAuthToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
