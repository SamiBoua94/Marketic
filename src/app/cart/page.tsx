"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart, Info, Leaf, MapPin, User, Phone, CreditCard, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { EthicalScoreBadge } from '@/components/ui/EthicalScoreBadge';

function normalizeImageUrls(images: unknown): string[] {
    if (Array.isArray(images)) {
        return images
            .filter((v): v is string => typeof v === 'string')
            .map((v) => v.trim())
            .filter(Boolean);
    }

    if (typeof images === 'string') {
        const trimmed = images.trim();
        if (!trimmed) return [];

        try {
            const parsed = JSON.parse(trimmed);
            return normalizeImageUrls(parsed);
        } catch {
            if (trimmed.includes(',')) {
                return trimmed
                    .split(',')
                    .map((v) => v.trim())
                    .filter(Boolean);
            }

            return [trimmed];
        }
    }

    return [];
}

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, totalItems, isLoading, clearCart } = useCart();
    const { user } = useAuth();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState('');
    const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        instructions: ''
    });
    const [paymentInfo, setPaymentInfo] = useState({
        method: 'card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveCard: false
    });

    // Debug: afficher tous les items du panier dans la console
    console.log('Cart items:', items);

    const handleCheckout = async () => {
        if (checkoutStep === 'shipping') {
            if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
                setOrderError('Veuillez remplir tous les champs d\'adresse');
                return;
            }
            setCheckoutStep('payment');
            setOrderError('');
        } else if (checkoutStep === 'payment') {
            if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv) {
                setOrderError('Veuillez remplir toutes les informations de paiement');
                return;
            }
            setCheckoutStep('review');
            setOrderError('');
        } else if (checkoutStep === 'review') {
            await processOrder();
        }
    };

    const processOrder = async () => {
        setIsCheckingOut(true);
        setOrderError('');

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    shippingInfo,
                    paymentInfo: {
                        method: paymentInfo.method,
                        cardLast4: paymentInfo.cardNumber.slice(-4),
                        cardName: paymentInfo.cardName
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erreur lors de la validation de la commande');
            }

            const order = await response.json();
            console.log('Commande créée:', order);

            // Vider le panier
            await clearCart();

            // Afficher le succès
            setOrderSuccess(true);
            setShowCheckoutForm(false);
            setCheckoutStep('shipping');
        } catch (error: any) {
            setOrderError(error.message || 'Une erreur est survenue lors de la validation de la commande');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleInputChange = (field: string, value: string, section: 'shipping' | 'payment' = 'shipping') => {
        if (section === 'shipping') {
            setShippingInfo(prev => ({
                ...prev,
                [field]: value
            }));
        } else {
            setPaymentInfo(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    if (!user) {
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

    if (items.length === 0 && !isLoading) {
        if (orderSuccess) {
            return (
                <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                    <div className="p-6 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Commande validée !</h1>
                    <p className="text-foreground/60 max-w-md mb-8">
                        Merci pour votre commande. Vous recevrez une confirmation par email prochainement.
                    </p>
                    <Link href="/products">
                        <Button variant="primary" size="lg">Continuer vos achats</Button>
                    </Link>
                </div>
            );
        }

        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-secondary/10 rounded-full mb-6">
                    <ShoppingCart className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Votre panier est vide</h1>
                <p className="text-foreground/60 max-w-md mb-8">
                    Parcourez nos produits artisanaux et locaux pour trouver votre bonheur !
                </p>
                <Link href="/products">
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
                        (() => {
                            const fallbackProductImage = 'https://placehold.co/400x400?text=Produit';
                            const productImage =
                                normalizeImageUrls((item as any)?.product?.images)[0] ||
                                ((item as any)?.product?.image as string) ||
                                fallbackProductImage;

                            return (
                                <div
                                    key={item.id}
                                    className="flex gap-4 sm:gap-6 p-4 bg-white rounded-2xl border border-secondary/10 shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-secondary/5 flex-shrink-0">
                                        <img
                                            src={productImage}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.currentTarget.src = fallbackProductImage;
                                            }}
                                        />
                                    </div>

                                    {/* Item Info */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                                                    {item.product.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-foreground/50">Production artisanale</p>
                                                    <EthicalScoreBadge score={(item.product as any).ethicalScore} size="sm" />
                                                </div>
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
                                                    className="p-1.5 hover:bg-white rounded-md transition-colors text-foreground/70"
                                                    disabled={isLoading}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1.5 hover:bg-white rounded-md transition-colors text-foreground/70"
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
                            );
                        })()
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
                    <div className="bg-white rounded-2xl border border-secondary/10 shadow-lg p-8 sticky top-28">
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

                        {/* Checkout Form */}
                        {showCheckoutForm ? (
                            <div className="space-y-4 mb-6">
                                {/* Progress Steps */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep === 'shipping' ? 'bg-primary text-white' :
                                                checkoutStep === 'payment' || checkoutStep === 'review' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {checkoutStep === 'shipping' ? '1' : checkoutStep === 'payment' || checkoutStep === 'review' ? '✓' : '1'}
                                        </div>
                                        <span className="ml-2 text-sm font-medium">Livraison</span>
                                    </div>
                                    <div className={`flex-1 h-1 mx-4 ${checkoutStep === 'payment' || checkoutStep === 'review' ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep === 'payment' ? 'bg-primary text-white' :
                                                checkoutStep === 'review' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {checkoutStep === 'payment' ? '2' : checkoutStep === 'review' ? '✓' : '2'}
                                        </div>
                                        <span className="ml-2 text-sm font-medium">Paiement</span>
                                    </div>
                                    <div className={`flex-1 h-1 mx-4 ${checkoutStep === 'review' ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep === 'review' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {checkoutStep === 'review' ? '3' : '3'}
                                        </div>
                                        <span className="ml-2 text-sm font-medium">Confirmation</span>
                                    </div>
                                </div>

                                {orderError && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                        {orderError}
                                    </div>
                                )}

                                {/* Step 1: Shipping */}
                                {checkoutStep === 'shipping' && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-foreground mb-4">Adresse de livraison</h3>

                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1">
                                                        <User className="w-4 h-4" />
                                                        Nom complet
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={shippingInfo.fullName}
                                                        onChange={(e) => handleInputChange('fullName', e.target.value, 'shipping')}
                                                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                        placeholder="Votre nom"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1">
                                                        <Phone className="w-4 h-4" />
                                                        Téléphone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={shippingInfo.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value, 'shipping')}
                                                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                        placeholder="Votre téléphone"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1">
                                                    <MapPin className="w-4 h-4" />
                                                    Adresse
                                                </label>
                                                <input
                                                    type="text"
                                                    value={shippingInfo.address}
                                                    onChange={(e) => handleInputChange('address', e.target.value, 'shipping')}
                                                    className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                    placeholder="Rue et numéro"
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <label className="text-sm font-medium text-foreground/70 mb-1 block">Ville</label>
                                                    <input
                                                        type="text"
                                                        value={shippingInfo.city}
                                                        onChange={(e) => handleInputChange('city', e.target.value, 'shipping')}
                                                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                        placeholder="Ville"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-sm font-medium text-foreground/70 mb-1 block">Code postal</label>
                                                    <input
                                                        type="text"
                                                        value={shippingInfo.postalCode}
                                                        onChange={(e) => handleInputChange('postalCode', e.target.value, 'shipping')}
                                                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                        placeholder="Code postal"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-foreground/70 mb-1 block">Instructions (optionnel)</label>
                                                <textarea
                                                    value={shippingInfo.instructions}
                                                    onChange={(e) => handleInputChange('instructions', e.target.value, 'shipping')}
                                                    className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                                                    placeholder="Instructions de livraison (digicode, étage, etc.)"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Payment */}
                                {checkoutStep === 'payment' && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-foreground mb-4">Informations de paiement</h3>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                            <div className="flex items-center gap-2 text-blue-700">
                                                <Lock className="w-4 h-4" />
                                                <span className="text-sm">Paiement sécurisé via cryptage SSL</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-foreground/70 mb-1 block">Numéro de carte</label>
                                                <input
                                                    type="text"
                                                    value={paymentInfo.cardNumber}
                                                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value), 'payment')}
                                                    className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength={19}
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-foreground/70 mb-1 block">Nom sur la carte</label>
                                                <input
                                                    type="text"
                                                    value={paymentInfo.cardName}
                                                    onChange={(e) => handleInputChange('cardName', e.target.value, 'payment')}
                                                    className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                    placeholder="NOM COMPLET"
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <label className="text-sm font-medium text-foreground/70 mb-1 block">Date d'expiration</label>
                                                    <input
                                                        type="text"
                                                        value={paymentInfo.expiryDate}
                                                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value), 'payment')}
                                                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                        placeholder="MM/AA"
                                                        maxLength={5}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-sm font-medium text-foreground/70 mb-1 block">CVV</label>
                                                    <input
                                                        type="text"
                                                        value={paymentInfo.cvv}
                                                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3), 'payment')}
                                                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                        placeholder="123"
                                                        maxLength={3}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="saveCard"
                                                    checked={paymentInfo.saveCard}
                                                    onChange={(e) => handleInputChange('saveCard', e.target.checked.toString(), 'payment')}
                                                    className="rounded border-secondary/30"
                                                />
                                                <label htmlFor="saveCard" className="text-sm text-foreground/70">
                                                    Enregistrer cette carte pour mes prochains achats
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 text-xs text-foreground/50">
                                            <CreditCard className="w-4 h-4" />
                                            <span>Nous acceptons Visa, Mastercard, American Express</span>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review */}
                                {checkoutStep === 'review' && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-foreground mb-4">Récapitulatif de la commande</h3>

                                        <div className="bg-secondary/5 rounded-lg p-4 space-y-3">
                                            <div>
                                                <h4 className="font-medium text-sm text-foreground/70 mb-2">Adresse de livraison</h4>
                                                <p className="text-sm">{shippingInfo.fullName}</p>
                                                <p className="text-sm">{shippingInfo.address}</p>
                                                <p className="text-sm">{shippingInfo.postalCode} {shippingInfo.city}</p>
                                                <p className="text-sm">{shippingInfo.phone}</p>
                                                {shippingInfo.instructions && (
                                                    <p className="text-sm text-foreground/60">Instructions: {shippingInfo.instructions}</p>
                                                )}
                                            </div>

                                            <div className="border-t border-secondary/20 pt-3">
                                                <h4 className="font-medium text-sm text-foreground/70 mb-2">Moyen de paiement</h4>
                                                <p className="text-sm">Carte se terminant par {paymentInfo.cardNumber.slice(-4)}</p>
                                                <p className="text-sm">{paymentInfo.cardName}</p>
                                            </div>

                                            <div className="border-t border-secondary/20 pt-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Sous-total</span>
                                                    <span>{totalPrice.toFixed(2)} €</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Livraison</span>
                                                    <span className="text-green-600">Gratuite</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-base pt-2 border-t border-secondary/20">
                                                    <span>Total</span>
                                                    <span className="text-primary">{totalPrice.toFixed(2)} €</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm">En confirmant, vous acceptez nos conditions générales de vente</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex gap-3 pt-4">
                                    {checkoutStep !== 'shipping' && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (checkoutStep === 'payment') setCheckoutStep('shipping');
                                                else if (checkoutStep === 'review') setCheckoutStep('payment');
                                            }}
                                            disabled={isCheckingOut}
                                        >
                                            Retour
                                        </Button>
                                    )}

                                    <Button
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                        className="flex-1"
                                    >
                                        {isCheckingOut ? 'Traitement...' :
                                            checkoutStep === 'shipping' ? 'Continuer vers le paiement' :
                                                checkoutStep === 'payment' ? 'Vérifier la commande' :
                                                    'Confirmer et payer'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setShowCheckoutForm(true)}
                                variant="primary"
                                size="lg"
                                className="w-full h-16 text-lg group"
                            >
                                Valider la commande
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        )}

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-xs text-foreground/50">
                                <div className="p-1.5 bg-zinc-100 rounded-md">
                                    <ShoppingCart className="w-4 h-4" />
                                </div>
                                Paiement sécurisé par Stripe ou PayPal
                            </div>
                            <div className="flex items-center gap-3 text-xs text-foreground/50">
                                <div className="p-1.5 bg-zinc-100 rounded-md">
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
