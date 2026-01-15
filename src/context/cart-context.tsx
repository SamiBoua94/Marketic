"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';

export type CartItem = {
    id: string;
    productId: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
    };
};

type CartContextType = {
    items: CartItem[];
    addItem: (productId: string, quantity?: number) => Promise<void>;
    removeItem: (cartItemId: string) => Promise<void>;
    updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalItems: number;
    totalPrice: number;
    isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setItems([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
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

    const addItem = async (productId: string, quantity: number = 1) => {
        if (!user) {
            alert('Veuillez vous connecter pour ajouter des articles au panier');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });

            if (response.ok) {
                await fetchCart();
            }
        } catch (error) {
            console.error('Failed to add item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (cartItemId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setItems(prev => prev.filter(item => item.id !== cartItemId));
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            return removeItem(cartItemId);
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId, quantity }),
            });

            if (response.ok) {
                setItems(prev =>
                    prev.map(item =>
                        item.id === cartItemId ? { ...item, quantity } : item
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        setItems([]);
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
