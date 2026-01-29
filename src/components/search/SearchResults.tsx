'use client';

import { useState, useEffect } from 'react';
import { ShopSearchCard } from './ShopSearchCard';
import { SearchX, Loader2, Store } from 'lucide-react';

interface Shop {
    id: string;
    name: string;
    description?: string | null;
    city?: string | null;
    profilePicture?: string | null;
    tags?: string | null;
    products?: { id: string }[];
}

interface SearchResultsProps {
    query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setShops([]);
            setSearched(false);
            return;
        }

        const searchShops = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/shops?search=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const response = await res.json();
                    // API returns { success: true, data: [...] }
                    setShops(response.data || response || []);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
                setSearched(true);
            }
        };

        // Debounce search
        const timeout = setTimeout(searchShops, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    if (!query) return null;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col items-center justify-center text-zinc-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p>Recherche en cours...</p>
                </div>
            </div>
        );
    }

    const hasResults = shops.length > 0;

    return (
        <div className="container mx-auto px-4 py-12">
            {!hasResults && searched && (
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <div className="inline-flex p-4 bg-zinc-100 rounded-full mb-6 text-zinc-400">
                        <SearchX size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Aucune boutique trouvée</h2>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        Nous n'avons trouvé aucune boutique pour "{query}". Essayez un autre terme de recherche.
                    </p>
                </div>
            )}

            {hasResults && (
                <div className="animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 mb-8">
                        <Store className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-2xl font-bold text-zinc-900">
                            Boutiques pour "{query}"
                        </h2>
                        <span className="text-sm text-zinc-500">({shops.length} résultat{shops.length !== 1 ? 's' : ''})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {shops.map(shop => (
                            <ShopSearchCard key={shop.id} shop={shop} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
