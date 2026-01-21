"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart, Info, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';

export default function CartPage() {
    const { items: contextItems, removeItem, updateQuantity, totalPrice: contextTotalPrice, totalItems: contextTotalItems, isLoading } = useCart();
    const { user } = useAuth();

    // Local state for file-based cart
    const [localItems, setLocalItems] = React.useState<any[]>([]);
    const [isLocalLoading, setIsLocalLoading] = React.useState(true);

    React.useEffect(() => {
        // Fetch local cart items
        import('@/app/api/addToCartLocal').then(mod => {
            mod.getCartLocal().then(items => {
                setLocalItems(items);
                setIsLocalLoading(false);
            });
        });
    }, []);

    // Combine or override items
    // For this task, we prioritize valid localItems if they exist suitable for the prompt, 
    // but the prompt implies this IS the cart now. 
    // To make it seamless with existing UI which uses 'items', we'll use localItems if populated.
    // However, existing UI relies on 'items' from useCart. 
    // Let's create a derivative 'displayItems'

    const items = localItems.length > 0 ? localItems : contextItems;
    const totalItems = localItems.length > 0 ? items.reduce((acc, item) => acc + item.quantity, 0) : contextTotalItems;
    const totalPrice = localItems.length > 0 ? items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) : contextTotalPrice;

    if (!user && localItems.length === 0) { // Only show login prompt if no local items either
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-secondary/10 rounded-full mb-6">
                    <ShoppingCart className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Votre panier vous attend</h1>
                <p className="text-foreground/60 max-w-md mb-8">
                    Connectez-vous pour voir vos articles et finaliser vos achats écologiques et locaux.
                </p>
                <Link href="/login">
                    <Button variant="primary" size="lg">Se connecter</Button>
                </Link>
            </div>
        );
    }

    if (items.length === 0 && !isLoading && !isLocalLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-secondary/10 rounded-full mb-6">
                    <ShoppingBag className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Votre panier est vide</h1>
                <p className="text-foreground/60 max-w-md mb-8">
                    Parcourez nos produits artisanaux et locaux pour trouver votre bonheur !
                </p>
                <Link href="/">
                    <Button variant="primary" size="lg">Découvrir les produits</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Mon Panier</h1>
                    <p className="text-foreground/60 flex items-center gap-2">
                        <Badge variant="secondary" className="px-2">{totalItems} {totalItems > 1 ? 'articles' : 'article'}</Badge>
                        Soutenez l'artisanat local avec cette commande.
                    </p>
                </div>
                <Link href="/" className="text-primary hover:underline text-sm font-medium">
                    Continuer mes achats
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 sm:gap-6 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-secondary/10 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            {/* Product Image */}
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-secondary/5 flex-shrink-0">
                                <img
                                    src={item.product.image || 'https://images.unsplash.com/photo-1541944743827-e04bb645f9ad?auto=format&fit=crop&q=80&w=200'}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Item Info */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-sm text-foreground/50">Production artisanale</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-foreground/30 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        title="Supprimer l'article"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                                    {/* Quantity Controller */}
                                    <div className="flex items-center gap-1 bg-secondary/10 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-colors text-foreground/70"
                                            disabled={isLoading}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-colors text-foreground/70"
                                            disabled={isLoading}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xl font-bold text-primary">
                                            {(item.product.price * item.quantity).toFixed(2)} €
                                        </span>
                                        {item.quantity > 1 && (
                                            <p className="text-xs text-foreground/40">{item.product.price.toFixed(2)} € / unité</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-primary/5 rounded-2xl p-6 flex gap-4 items-start">
                        <div className="p-2 bg-primary/20 rounded-full text-primary">
                            <Info className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-primary">Éco-responsabilité confirmée</p>
                            <p className="text-xs text-primary/70 mt-1">
                                Tous ces produits sont certifiés locaux ou écologiques. Votre colis sera expédié avec un emballage minimaliste et biodégradable.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-secondary/10 shadow-lg p-8 sticky top-28">
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Récapitulatif</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-foreground/60">
                                <span>Sous-total</span>
                                <span>{totalPrice.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-foreground/60">
                                <span>Livraison Standard</span>
                                <span className="text-emerald-600 font-medium">Gratuite</span>
                            </div>
                            <div className="flex justify-between text-foreground/60">
                                <span>Éco-participation</span>
                                <span>0.00 €</span>
                            </div>
                            <div className="pt-4 border-t border-secondary/10 flex justify-between items-end">
                                <span className="font-medium text-lg">Total TTC</span>
                                <span className="text-3xl font-bold text-primary">{totalPrice.toFixed(2)} €</span>
                            </div>
                        </div>

                        <Button variant="primary" size="lg" className="w-full h-16 text-lg group">
                            Valider la commande
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-xs text-foreground/50">
                                <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                                    <ShoppingCart className="w-4 h-4" />
                                </div>
                                Paiement sécurisé par Stripe ou PayPal
                            </div>
                            <div className="flex items-center gap-3 text-xs text-foreground/50">
                                <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                                    <Leaf className="w-4 h-4" />
                                </div>
                                1% reversé à des associations de reforestation
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
