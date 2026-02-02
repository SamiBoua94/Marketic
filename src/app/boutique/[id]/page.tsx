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
    Users,
    CheckCircle2
} from 'lucide-react';
import { EthicalScoreBadge } from '@/components/ui/EthicalScoreBadge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ShopFollowButton } from '@/components/ShopFollowButton';
import { useAuth } from '@/context/auth-context';
import { AnimatedBackground, FloatingLeaves } from '@/components/ui/AnimatedBackground';

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
        <Link href={`/product/${product.id}`} className="block group h-full">
            <div className="bg-white rounded-[2rem] overflow-hidden border border-secondary/20 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col hover:-translate-y-2">
                <div className="aspect-[4/5] relative overflow-hidden bg-secondary/5">
                    {images.length > 0 ? (
                        <img
                            src={images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/20">
                            <ShoppingBag size={48} />
                        </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badge score éthique */}
                    {product.ethicalScore && (
                        <div className="absolute top-3 left-3">
                            <EthicalScoreBadge score={product.ethicalScore} size="sm" />
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                    </h3>

                    <p className="text-sm text-foreground/60 mb-4 line-clamp-2 leading-relaxed flex-1">
                        {product.description}
                    </p>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="text-xs font-bold px-2 py-1 bg-secondary/10 rounded-lg text-foreground/70 tracking-wide uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="pt-4 border-t border-secondary/10 flex items-center justify-between gap-4 mt-auto">
                        <span className="font-heading font-bold text-2xl text-primary">{product.price.toFixed(2)} €</span>
                        <div onClick={(e) => e.preventDefault()}>
                            <AddToCartButton productId={product.id} className="rounded-xl px-4 py-2 text-sm" />
                        </div>
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
            <AnimatedBackground variant="subtle" className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center text-foreground/60 animte-pulse">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                    <p className="font-medium">Ouverture de la boutique...</p>
                </div>
            </AnimatedBackground>
        );
    }

    if (error || !shop) {
        return (
            <AnimatedBackground variant="subtle" className="min-h-screen flex items-center justify-center">
                <div className="text-center bg-white/50 backdrop-blur-sm p-12 rounded-[2rem] border border-secondary/20 shadow-soft">
                    <Store className="w-16 h-16 text-foreground/20 mx-auto mb-6" />
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-4">{error || 'Boutique introuvable'}</h1>
                    <p className="text-foreground/60 mb-8 max-w-sm mx-auto">Cette boutique a peut-être fermé ses portes ou déménagé.</p>
                    <Link href="/" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105">
                        <ArrowLeft size={20} />
                        Retour à l'exploration
                    </Link>
                </div>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground variant="subtle" className="min-h-screen pb-20">
            {/* Banner */}
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                {shop.bannerPicture ? (
                    <img
                        src={shop.bannerPicture}
                        alt="Banner"
                        className="w-full h-full object-cover animate-fade-in-scale"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/10 animate-gradient-shift">
                        <FloatingLeaves />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

                {/* Return Nav */}
                <div className="absolute top-24 left-4 container mx-auto px-4 z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold text-white hover:bg-white/40 transition-colors border border-white/20"
                    >
                        <ArrowLeft size={16} />
                        Retour
                    </Link>
                </div>
            </div>

            {/* Shop Content */}
            <div className="container mx-auto px-4 relative z-10 -mt-32">
                <div className="max-w-7xl mx-auto">
                    {/* Header Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-soft p-8 md:p-12 border border-white/60 mb-16 animate-fade-in-up">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0 relative group">
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent rounded-[2rem] opacity-30 blur-lg group-hover:opacity-50 transition-opacity" />
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-4 border-white shadow-lg bg-white">
                                    {shop.profilePicture ? (
                                        <img
                                            src={shop.profilePicture}
                                            alt={shop.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                                            <Store className="w-12 h-12 text-primary/40" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
                                            {shop.name}
                                            {shop.certificationPicture && (
                                                <div className="bg-green-100 p-1 rounded-full check-badge" title="Certifié Markethic">
                                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                </div>
                                            )}
                                        </h1>

                                        <div className="flex flex-wrap items-center gap-4 text-foreground/60">
                                            {shop.city && (
                                                <div className="flex items-center gap-1.5 text-sm font-medium bg-secondary/10 px-3 py-1 rounded-full">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    {shop.city}{shop.postalCode ? `, ${shop.postalCode}` : ''}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-sm font-medium bg-secondary/10 px-3 py-1 rounded-full">
                                                <Users className="w-4 h-4 text-primary" />
                                                <span>{shop._count?.follows || 0} abonnés</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-start md:self-auto">
                                        <ShopFollowButton
                                            shopId={shop.id}
                                            initialIsFollowing={isFollowing}
                                            onFollowChange={handleFollowChange}
                                            size="lg"
                                            variant="primary"
                                        />
                                    </div>
                                </div>

                                {shop.description && (
                                    <p className="text-lg text-foreground/70 mb-6 leading-relaxed max-w-3xl">
                                        {shop.description}
                                    </p>
                                )}

                                {/* Tags */}
                                {parsedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {parsedTags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-4 py-1.5 bg-white border border-secondary/20 rounded-xl text-sm font-medium text-foreground/70 shadow-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Contact & Social */}
                                <div className="flex flex-wrap gap-4 items-center pt-6 border-t border-secondary/10">
                                    {shop.email && (
                                        <a href={`mailto:${shop.email}`} className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-primary transition-colors bg-secondary/5 px-4 py-2 rounded-lg hover:bg-secondary/10">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </a>
                                    )}
                                    {shop.phone && (
                                        <a href={`tel:${shop.phone}`} className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-primary transition-colors bg-secondary/5 px-4 py-2 rounded-lg hover:bg-secondary/10">
                                            <Phone className="w-4 h-4" />
                                            Téléphone
                                        </a>
                                    )}

                                    {/* Social links */}
                                    <div className="flex gap-2 ml-auto">
                                        {[
                                            { icon: Instagram, url: shop.instagram, color: "hover:text-pink-600 hover:bg-pink-50" },
                                            { icon: Facebook, url: shop.facebook, color: "hover:text-blue-600 hover:bg-blue-50" },
                                            { icon: Twitter, url: shop.twitter, color: "hover:text-sky-600 hover:bg-sky-50" },
                                            { icon: Youtube, url: shop.youtube, color: "hover:text-red-600 hover:bg-red-50" }
                                        ].map((social, idx) => social.url && (
                                            <a
                                                key={idx}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-2.5 rounded-xl bg-secondary/5 text-foreground/50 transition-all hover:scale-110 ${social.color}`}
                                            >
                                                <social.icon size={20} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="animate-fade-in-up animation-delay-200">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <ShoppingBag className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-foreground">
                                    Créations de la boutique
                                </h2>
                            </div>
                            <span className="text-sm font-medium text-foreground/50 bg-white px-4 py-2 rounded-full border border-secondary/10">
                                {shop.products?.length || 0} produit{(shop.products?.length || 0) !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {shop.products && shop.products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {shop.products.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-secondary/20">
                                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag className="w-12 h-12 text-foreground/20" />
                                </div>
                                <h3 className="text-xl font-heading font-bold mb-2">Boutique en aménagement</h3>
                                <p className="text-foreground/60 max-w-md mx-auto">
                                    L'artisan n'a pas encore ajouté ses créations. Revenez bientôt !
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}
