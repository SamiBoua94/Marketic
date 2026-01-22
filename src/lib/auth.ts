import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth-options';

// Configuration JWT
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'markethic-secret-key-change-in-production'
);

// Interface pour le payload utilisateur
export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

// Extension du type Session de NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export { authOptions };

// Fonctions JWT
export async function createToken(payload: UserPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.sub || '',
      email: payload.email as string,
      name: payload.name as string
    };
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return null;
  }
}

// Fonction utilitaire pour obtenir l'utilisateur courant (côté serveur)
export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('Aucune session utilisateur trouvée');
      return null;
    }

    console.log('Session trouvée:', {
      userId: session.user.id,
      email: session.user.email
    });
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || ''
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

// Fonction utilitaire pour obtenir la session utilisateur (côté serveur)
export async function getSession(): Promise<UserPayload | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('getSession: Aucun ID utilisateur trouvé dans la session');
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || ''
    };
  } catch (error) {
    console.error('Erreur dans getSession:', error);
    return null;
  }
}

// Fonction utilitaire pour définir un cookie d'authentification
export async function setAuthCookie(token: string): Promise<NextResponse> {
  const response = NextResponse.next();
  
  response.cookies.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  });
  
  return response;
}

export function clearAuthCookie(): NextResponse {
  const response = NextResponse.next();
  response.cookies.delete('auth-token');
  return response;
}
