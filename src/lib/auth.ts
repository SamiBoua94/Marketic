import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'markethic-secret-key-change-in-production'
);

export interface UserPayload {
    id: string;
    email: string;
    name: string;
}

export async function createToken(payload: UserPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as UserPayload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<UserPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}
