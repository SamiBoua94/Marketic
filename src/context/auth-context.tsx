"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    id: string;
    email: string;
    name: string;
    profilePicture: string | null;
    description: string | null;
    createdAt: string;
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

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error };
            }

            setUser(data.user);
            return { success: true };
        } catch {
            return { success: false, error: 'Erreur de connexion' };
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });
            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error };
            }

            setUser(data.user);
            return { success: true };
        } catch {
            return { success: false, error: 'Erreur lors de l\'inscription' };
        }
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        try {
            const res = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            if (!res.ok) {
                return { success: false, error: result.error };
            }

            setUser(result.user);
            return { success: true };
        } catch {
            return { success: false, error: 'Erreur lors de la mise à jour' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser }}>
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
