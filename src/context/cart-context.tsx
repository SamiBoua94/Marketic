"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';

export type CartItem = {
    id: string;
    productId: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
        images?: string[];
    };
};

type CartContextType = {
    items: CartItem[];
    addItem: (productId: string, quantity?: number) => Promise<{ success: boolean; error?: string }>;
    removeItem: (cartItemId: string) => Promise<{ success: boolean; error?: string }>;
    updateQuantity: (cartItemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
    clearCart: () => Promise<{ success: boolean; error?: string }>;
    totalItems: number;
    totalPrice: number;
    isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setItems([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/cart', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                console.log("dataCart =",data);
                setItems(data.items || []);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addItem = async (productId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            // Rediriger vers la page de connexion avec un retour vers la page actuelle
            const currentPath = window.location.pathname;
            router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
            return { success: false, error: 'Non authentifié' };
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Échec de l\'ajout au panier');
            }

            // Rafraîchir le panier après l'ajout
            await fetchCart();
            
            // Déclencher un événement personnalisé pour notifier d'autres composants
            window.dispatchEvent(new Event('cart:updated'));
            
            return { success: true };
        } catch (error: any) {
            console.error('Erreur lors de l\'ajout au panier:', error);
            return { 
                success: false, 
                error: error.message || 'Une erreur est survenue lors de l\'ajout au panier' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (cartItemId: string): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            router.push('/login');
            return { success: false, error: 'Non authentifié' };
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Échec de la suppression de l\'article');
            }

            // Mettre à jour l'état local
            setItems(prev => {
                const updated = prev.filter(item => item.id !== cartItemId);
                return updated;
            });

            // Déclencher un événement personnalisé
            window.dispatchEvent(new Event('cart:updated'));
            
            return { success: true };
        } catch (error: any) {
            console.error('Erreur lors de la suppression de l\'article:', error);
            return { 
                success: false, 
                error: error.message || 'Une erreur est survenue lors de la suppression' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (cartItemId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            router.push('/login');
            return { success: false, error: 'Non authentifié' };
        }

        if (quantity < 1) {
            return removeItem(cartItemId);
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ cartItemId, quantity }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Échec de la mise à jour de la quantité');
            }

            // Mettre à jour l'état local
            setItems(prev =>
                prev.map(item =>
                    item.id === cartItemId ? { ...item, quantity } : item
                )
            );

            // Déclencher un événement personnalisé
            window.dispatchEvent(new Event('cart:updated'));
            
            return { success: true };
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour de la quantité:', error);
            return { 
                success: false, 
                error: error.message || 'Une erreur est survenue lors de la mise à jour' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async (): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            return { success: false, error: 'Non authentifié' };
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Échec de la vidange du panier');
            }

            // Mettre à jour l'état local
            setItems([]);
            
            // Déclencher un événement personnalisé
            window.dispatchEvent(new Event('cart:cleared'));
            
            return { success: true };
        } catch (error: any) {
            console.error('Erreur lors de la vidange du panier:', error);
            return { 
                success: false, 
                error: error.message || 'Une erreur est survenue lors de la vidange du panier' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
