"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Calendar, Truck, CheckCircle, Clock, XCircle, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        images?: string | string[] | null;
    };
}

interface Order {
    id: string;
    total: number;
    status: OrderStatus;
    createdAt: string;
    shippingInfo: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        phone?: string;
    };
    paymentInfo: {
        method: string;
        cardLast4?: string;
        cardName?: string;
    };
    items: OrderItem[];
}

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

const statusConfig = {
    PENDING: {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
    },
    PROCESSING: {
        label: 'En préparation',
        color: 'bg-blue-100 text-blue-800',
        icon: Package,
    },
    SHIPPED: {
        label: 'Expédiée',
        color: 'bg-purple-100 text-purple-800',
        icon: Truck,
    },
    DELIVERED: {
        label: 'Livrée',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
    },
    CANCELLED: {
        label: 'Annulée',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
    },
};

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders', { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des commandes');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-secondary/10 rounded-full mb-6">
                    <Package className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">Connectez-vous pour voir vos commandes</h1>
                <p className="text-foreground/60 max-w-md mb-8">
                    Vous devez être connecté pour consulter l'historique de vos commandes.
                </p>
                <Link href="/login">
                    <Button variant="primary" size="lg">Se connecter</Button>
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground/60">Chargement de vos commandes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Erreur de chargement</h1>
                    <p className="text-foreground/60 mb-6">{error}</p>
                    <Button onClick={() => window.location.reload()}>Réessayer</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Mes Commandes</h1>
                <p className="text-foreground/60">
                    {orders.length === 0 
                        ? "Vous n'avez pas encore de commande" 
                        : `${orders.length} commande${orders.length > 1 ? 's' : ''}`
                    }
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <Package className="w-24 h-24 text-foreground/20 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Aucune commande</h2>
                    <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                        Vous n'avez pas encore passé de commande. Découvrez nos produits et faites votre premier achat !
                    </p>
                    <Link href="/products">
                        <Button variant="primary" size="lg" className="group">
                            Découvrir les produits
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const StatusIcon = statusConfig[order.status].icon;
                        const statusColor = statusConfig[order.status].color;
                        const statusLabel = statusConfig[order.status].label;

                        return (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg text-foreground">
                                                    Commande #{order.id.slice(-8)}
                                                </h3>
                                                <Badge className={statusColor}>
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {statusLabel}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-foreground/60">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(order.createdAt)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">
                                                {order.total.toFixed(2)} €
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedOrder(order)}
                                                className="mt-2"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Détails
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Products preview */}
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {order.items.slice(0, 3).map((item) => {
                                            const imageUrls = normalizeImageUrls(item.product.images);
                                            const fallbackImage = 'https://placehold.co/100x100?text=Produit';
                                            const productImage = imageUrls[0] || fallbackImage;

                                            return (
                                                <div key={item.id} className="flex-shrink-0">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary/5">
                                                        <img
                                                            src={productImage}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = fallbackImage;
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-foreground/60 mt-1 text-center max-w-16 truncate">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-xs font-medium text-center">
                                                        {item.quantity}x {item.price.toFixed(2)}€
                                                    </p>
                                                </div>
                                            );
                                        })}
                                        {order.items.length > 3 && (
                                            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-lg">
                                                <span className="text-xs font-medium text-foreground/60">
                                                    +{order.items.length - 3}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                        Commande #{selectedOrder.id.slice(-8)}
                                    </h3>
                                    <p className="text-foreground/60">
                                        {formatDate(selectedOrder.createdAt)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    ×
                                </Button>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <Badge className={statusConfig[selectedOrder.status].color}>
                                    {React.createElement(statusConfig[selectedOrder.status].icon, { className: "w-4 h-4 mr-2" })}
                                    {statusConfig[selectedOrder.status].label}
                                </Badge>
                            </div>

                            {/* Items */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-4">Articles</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item) => {
                                        const imageUrls = normalizeImageUrls(item.product.images);
                                        const fallbackImage = 'https://placehold.co/80x80?text=Produit';
                                        const productImage = imageUrls[0] || fallbackImage;

                                        return (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary/5 flex-shrink-0">
                                                    <img
                                                        src={productImage}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = fallbackImage;
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-medium">{item.product.name}</h5>
                                                    <p className="text-sm text-foreground/60">
                                                        Quantité: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {(item.price * item.quantity).toFixed(2)} €
                                                    </p>
                                                    <p className="text-sm text-foreground/60">
                                                        {item.price.toFixed(2)} € / unité
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-4">Adresse de livraison</h4>
                                <div className="bg-secondary/5 rounded-lg p-4">
                                    <p className="font-medium">{selectedOrder.shippingInfo.fullName}</p>
                                    <p className="text-foreground/60">{selectedOrder.shippingInfo.address}</p>
                                    <p className="text-foreground/60">
                                        {selectedOrder.shippingInfo.postalCode} {selectedOrder.shippingInfo.city}
                                    </p>
                                    {selectedOrder.shippingInfo.phone && (
                                        <p className="text-foreground/60">{selectedOrder.shippingInfo.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-4">Paiement</h4>
                                <div className="bg-secondary/5 rounded-lg p-4">
                                    <p className="text-foreground/60">
                                        Méthode: {selectedOrder.paymentInfo.method === 'card' ? 'Carte bancaire' : selectedOrder.paymentInfo.method}
                                    </p>
                                    {selectedOrder.paymentInfo.cardLast4 && (
                                        <p className="text-foreground/60">
                                            Carte se terminant par {selectedOrder.paymentInfo.cardLast4}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {selectedOrder.total.toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
