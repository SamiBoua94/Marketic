'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShopSearchCard } from '@/components/search/ShopSearchCard';
import { SearchX, Loader2, Store, ShoppingBag, ArrowLeft } from 'lucide-react';

interface Shop {
    id: string;
    name: string;
    description?: string | null;
    city?: string | null;
    profilePicture?: string | null;
    tags?: string | null;
    products?: { id: string }[];
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images?: string | null;
    tags?: string | null;
    shop?: {
        id: string;
        name: string;
        city?: string | null;
        profilePicture?: string | null;
    };
}

function ProductSearchCard({ product }: { product: Product }) {
    let images: string[] = [];
    if (product.images) {
        try {
            images = JSON.parse(product.images);
        } catch {
            images = [];
        }
    }

    return (
        <Link href={`/boutique/${product.shop?.id}`} className="group block">
            <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-lg hover:border-emerald-500/50 transition-all duration-300">
                <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
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
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {product.description}
                    </p>
                    {product.shop && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                            <Store size={12} />
                            <span>{product.shop.name}</span>
                            {product.shop.city && <span>• {product.shop.city}</span>}
                        </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="font-bold text-lg text-emerald-600">{product.price.toFixed(2)} €</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [shops, setShops] = useState<Shop[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'shops' | 'products'>('all');

    useEffect(() => {
        if (!query.trim()) {
            setShops([]);
            setProducts([]);
            return;
        }

        const search = async () => {
            setLoading(true);
            try {
                const [shopsRes, productsRes] = await Promise.all([
                    fetch(`/api/shops?search=${encodeURIComponent(query)}`),
                    fetch(`/api/products/search?search=${encodeURIComponent(query)}`)
                ]);

                if (shopsRes.ok) {
                    const data = await shopsRes.json();
                    setShops(data.data || []);
                }
                if (productsRes.ok) {
                    const data = await productsRes.json();
                    setProducts(data.data || []);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        search();
    }, [query]);

    const totalResults = shops.length + products.length;

    if (!query) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center text-zinc-500">
                    <SearchX size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Entrez un terme de recherche pour trouver des boutiques et produits</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center text-zinc-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p>Recherche en cours...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Results header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                    Résultats pour "{query}"
                </h1>
                <p className="text-zinc-500">
                    {totalResults} résultat{totalResults !== 1 ? 's' : ''} trouvé{totalResults !== 1 ? 's' : ''}
                </p>
            </div>

            {totalResults === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <SearchX size={48} className="mx-auto mb-4 text-zinc-300" />
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Aucun résultat</h2>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        Nous n'avons trouvé aucun résultat pour "{query}". Essayez avec d'autres mots-clés.
                    </p>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all'
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            Tout ({totalResults})
                        </button>
                        <button
                            onClick={() => setActiveTab('shops')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'shops'
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            <Store size={16} /> Boutiques ({shops.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'products'
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            <ShoppingBag size={16} /> Produits ({products.length})
                        </button>
                    </div>

                    {/* Shops section */}
                    {(activeTab === 'all' || activeTab === 'shops') && shops.length > 0 && (
                        <div className="mb-12">
                            {activeTab === 'all' && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Store className="w-5 h-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Boutiques</h2>
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {shops.map(shop => (
                                    <ShopSearchCard key={shop.id} shop={shop} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products section */}
                    {(activeTab === 'all' || activeTab === 'products') && products.length > 0 && (
                        <div>
                            {activeTab === 'all' && (
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Produits</h2>
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <ProductSearchCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function RecherchePage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Retour à l'accueil
                </Link>

                <Suspense fallback={
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-zinc-400" />
                    </div>
                }>
                    <SearchContent />
                </Suspense>
            </div>
        </div>
    );
}
