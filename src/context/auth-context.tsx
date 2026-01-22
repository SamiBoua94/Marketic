"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSession as getClientSession, signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

export interface User {
    id: string;
    email: string;
    name: string;
    profilePicture: string | null;
    description: string | null;
    createdAt: string;
    hasShop?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        setLoading(true);
        try {
            const session = (await getClientSession()) as Session & { user: { id: string; hasShop?: boolean } } | null;
            
            if (session?.user) {
                // Vérifier si l'utilisateur a une boutique
                const hasShopResponse = await fetch('/api/shop/check', { credentials: 'include' });
                const hasShop = hasShopResponse.ok ? await hasShopResponse.json().then(res => res.hasShop) : false;
                
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.name || '',
                    profilePicture: session.user.image || null,
                    description: null,
                    hasShop,
                    createdAt: new Date().toISOString(),
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Erreur de vérification de la session:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        await checkAuthStatus();
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (!result?.ok) {
                throw new Error(result?.error || 'Échec de la connexion');
            }

            // Rafraîchir la session
            const session = await getClientSession();
            if (!session?.user) {
                throw new Error('Échec de la connexion: session non créée');
            }

            // Vérifier si l'utilisateur a une boutique
            const hasShopResponse = await fetch('/api/shop/check', { credentials: 'include' });
            const hasShop = hasShopResponse.ok ? await hasShopResponse.json().then((res: any) => res.hasShop) : false;

            const userData = {
                id: session.user.id as string,
                email: session.user.email || '',
                name: session.user.name || '',
                profilePicture: session.user.image || null,
                description: null,
                hasShop,
                createdAt: new Date().toISOString(),
            };

            setUser(userData);

            // Rafraîchir le panier
            if (typeof window !== 'undefined' && 'cart' in window) {
                window.dispatchEvent(new Event('cart:refresh'));
            }
            
            return { success: true };
        } catch (error: any) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error?.message || 'Une erreur est survenue lors de la connexion' 
            };
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                return { 
                    success: false, 
                    error: errorData.error || 'Échec de l\'inscription' 
                };
            }

            // Connecter automatiquement l'utilisateur après l'inscription
            return await login(email, password);
        } catch (error: any) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                error: error?.message || 'Erreur lors de l\'inscription' 
            };
        }
    };

    const logout = async () => {
        await signOut({ redirect: false });
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { 
                    success: false, 
                    error: errorData.error || 'Échec de la mise à jour du profil' 
                };
            }

            const updatedUser = await response.json();
            setUser(prev => ({
                ...prev!,
                ...updatedUser,
                profilePicture: updatedUser.profilePicture || prev?.profilePicture || null,
            }));

            return { success: true };
        } catch (error: any) {
            console.error('Update profile error:', error);
            return { 
                success: false, 
                error: error?.message || 'Erreur lors de la mise à jour du profil' 
            };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
