"use client";

import React, { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { cn } from '@/components/ui/button';

interface AddToCartButtonProps {
    productId: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export function AddToCartButton({
    productId,
    className,
    variant = 'primary',
    size = 'md',
    showText = true
}: AddToCartButtonProps) {
    const { addItem } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);
        try {
            await addItem(productId, 1);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Button
            variant={isSuccess ? 'secondary' : variant}
            size={size}
            onClick={handleAdd}
            disabled={isAdding}
            className={cn(
                "relative overflow-hidden transition-all duration-300",
                isSuccess && "bg-emerald-600 text-white hover:bg-emerald-700",
                className
            )}
        >
            <div className="flex items-center justify-center gap-2">
                {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSuccess ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <ShoppingCart className="w-4 h-4" />
                )}

                {showText && (
                    <span>
                        {isAdding ? 'Ajout...' : isSuccess ? 'Ajouté !' : 'Ajouter au panier'}
                    </span>
                )}
            </div>
        </Button>
    );
}
