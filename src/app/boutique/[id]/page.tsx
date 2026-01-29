'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    MapPin,
    Store,
    Mail,
    Phone,
    ArrowLeft,
    Loader2,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    ShoppingBag,
    ExternalLink,
    Users
} from 'lucide-react';
import { EthicalScoreBadge } from '@/components/ui/EthicalScoreBadge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ShopFollowButton } from '@/components/ShopFollowButton';
import { useAuth } from '@/context/auth-context';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images?: string | null;
    tags?: string | null;
    ethicalScore?: number | null;
}

interface Shop {
    id: string;
    name: string;
    description?: string | null;
    address?: string | null;
    city?: string | null;
    postalCode?: string | null;
    email?: string | null;
    phone?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    tags?: string | null;
    profilePicture?: string | null;
    bannerPicture?: string | null;
    certificationPicture?: string | null;
    user?: { name?: string; profilePicture?: string | null };
    products?: Product[];
    _count?: {
        follows: number;
    };
}

function ProductCard({ product }: { product: Product }) {
    let images: string[] = [];
    if (product.images) {
        try {
            images = JSON.parse(product.images);
        } catch {
            images = [];
        }
    }

    let tags: string[] = [];
    if (product.tags) {
        try {
            tags = JSON.parse(product.tags);
        } catch {
            tags = [];
        }
    }

    return (
        <Link href={`/product/${product.id}`} className="block group">
            <div className="bg-white rounded-xl overflow-hidden border border-zinc-200 hover:shadow-lg hover:border-emerald-500/50 transition-all duration-300">
                <div className="aspect-square relative overflow-hidden bg-zinc-100">
                    {images.length > 0 ? (
                        <img
                            src={images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <ShoppingBag size={48} />
                        </div>
                    )}
                    {/* Badge score éthique */}
                    <div className="absolute top-2 left-2">
                        <EthicalScoreBadge score={product.ethicalScore} size="sm" />
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-zinc-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                        {product.description}
                    </p>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-600">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-between items-center">
                        <span className="font-bold text-lg text-emerald-600">{product.price.toFixed(2)} €</span>
                    </div>
                    {/* Bouton Ajouter au panier */}
                    <div className="mt-3" onClick={(e) => e.preventDefault()}>
                        <AddToCartButton productId={product.id} className="w-full" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function BoutiquePage() {
    const params = useParams();
    const { user } = useAuth();
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowChange = (newFollowState: boolean, increment: number) => {
        setIsFollowing(newFollowState);
        if (shop) {
            setShop(prev => prev ? {
                ...prev,
                _count: {
                    ...prev._count,
                    follows: Math.max(0, (prev._count?.follows || 0) + increment)
                }
            } : null);
        }
    };

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const res = await fetch(`/api/shops/${params.id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError('Boutique introuvable');
                    } else {
                        setError('Erreur lors du chargement de la boutique');
                    }
                    return;
                }
                const response = await res.json();
                // API returns { success: true, data: {...} }
                setShop(response.data || response);
            } catch (err) {
                setError('Erreur de connexion');
            } finally {
                setLoading(false);
            }
        };

        const checkFollowStatus = async () => {
            if (!user || !params.id) return;
            
            try {
                const res = await fetch(`/api/shops/${params.id}/follow-status`, {
                    credentials: 'include'
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setIsFollowing(data.isFollowing);
                }
            } catch (err) {
                // Silently fail - user might not be following
            }
        };

        if (params.id) {
            fetchShop();
            checkFollowStatus();
        }
    }, [params.id, user]);

    // Parse tags
    let parsedTags: string[] = [];
    if (shop?.tags) {
        try {
            parsedTags = JSON.parse(shop.tags);
        } catch {
            parsedTags = [];
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center text-zinc-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p>Chargement de la boutique...</p>
                </div>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Store className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900 mb-2">{error || 'Boutique introuvable'}</h1>
                    <p className="text-zinc-500 mb-6">Cette boutique n'existe pas ou a été supprimée.</p>
                    <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
                        <ArrowLeft size={18} />
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Banner */}
            <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600">
                {shop.bannerPicture && (
                    <img
                        src={shop.bannerPicture}
                        alt="Banner"
                        className="w-full h-full object-cover absolute inset-0"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Back button */}
                <Link
                    href="/"
                    className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-zinc-700 hover:bg-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    Retour
                </Link>
            </div>

            {/* Shop Info */}
            <div className="container mx-auto px-4">
                <div className="relative -mt-16 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-zinc-200">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0">
                                {shop.profilePicture ? (
                                    <img
                                        src={shop.profilePicture}
                                        alt={shop.name}
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-4 border-white shadow-lg -mt-16 md:-mt-20"
                                    />
                                ) : (
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-emerald-100 border-4 border-white shadow-lg -mt-16 md:-mt-20 flex items-center justify-center">
                                        <Store className="w-10 h-10 text-emerald-600" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">
                                    {shop.name}
                                </h1>

                                {shop.city && (
                                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{shop.city}{shop.postalCode ? `, ${shop.postalCode}` : ''}</span>
                                    </div>
                                )}

                                {/* Followers count */}
                                <div className="flex items-center gap-2 text-zinc-500 mb-4">
                                    <Users className="w-4 h-4" />
                                    <span>{shop._count?.follows || 0} follower{shop._count?.follows !== 1 ? 's' : ''}</span>
                                </div>

                                {shop.description && (
                                    <p className="text-zinc-600 mb-4 max-w-2xl">
                                        {shop.description}
                                    </p>
                                )}

                                {/* Tags */}
                                {parsedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {parsedTags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Contact & Social */}
                                <div className="flex flex-wrap gap-4 items-center">
                                    {shop.email && (
                                        <a href={`mailto:${shop.email}`} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 transition-colors">
                                            <Mail className="w-4 h-4" />
                                            {shop.email}
                                        </a>
                                    )}
                                    {shop.phone && (
                                        <a href={`tel:${shop.phone}`} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 transition-colors">
                                            <Phone className="w-4 h-4" />
                                            {shop.phone}
                                        </a>
                                    )}

                                    {/* Social links */}
                                    <div className="flex gap-2 ml-auto">
                                        {shop.instagram && (
                                            <a href={shop.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-pink-100 hover:text-pink-600 transition-colors">
                                                <Instagram size={18} />
                                            </a>
                                        )}
                                        {shop.facebook && (
                                            <a href={shop.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                                <Facebook size={18} />
                                            </a>
                                        )}
                                        {shop.twitter && (
                                            <a href={shop.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-sky-100 hover:text-sky-600 transition-colors">
                                                <Twitter size={18} />
                                            </a>
                                        )}
                                        {shop.youtube && (
                                            <a href={shop.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-red-100 hover:text-red-600 transition-colors">
                                                <Youtube size={18} />
                                            </a>
                                        )}

                                        {/* Bouton Follow */}
                                        <div className="flex items-center gap-3">
                                            <ShopFollowButton
                                                shopId={shop.id}
                                                initialIsFollowing={isFollowing}
                                                onFollowChange={handleFollowChange}
                                                size="sm"
                                                variant="primary"
                                            />
                                            <div className="flex items-center gap-1 text-sm text-zinc-600">
                                                <Users size={16} />
                                                <span>{shop._count?.follows || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="pb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <ShoppingBag className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-xl font-bold text-zinc-900">
                            Produits de la boutique
                        </h2>
                        <span className="text-sm text-zinc-500">
                            ({shop.products?.length || 0} produit{(shop.products?.length || 0) !== 1 ? 's' : ''})
                        </span>
                    </div>

                    {shop.products && shop.products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {shop.products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
                            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                            <p className="text-zinc-500">Cette boutique n'a pas encore de produits.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
