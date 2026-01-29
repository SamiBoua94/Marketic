'use client';

import Link from 'next/link';
import { MapPin, Store, ShoppingBag } from 'lucide-react';

interface Shop {
    id: string;
    name: string;
    description?: string | null;
    city?: string | null;
    profilePicture?: string | null;
    tags?: string | null;
    products?: { id: string }[];
}

interface ShopSearchCardProps {
    shop: Shop;
}

export function ShopSearchCard({ shop }: ShopSearchCardProps) {
    // Parse tags if stored as JSON string
    let parsedTags: string[] = [];
    if (shop.tags) {
        try {
            parsedTags = JSON.parse(shop.tags);
        } catch {
            parsedTags = [];
        }
    }

    return (
        <Link href={`/boutique/${shop.id}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300">
                {/* Header with profile picture */}
                <div className="relative h-32 bg-gradient-to-br from-emerald-500 to-teal-600">
                    <div className="absolute -bottom-10 left-6">
                        {shop.profilePicture ? (
                            <img
                                src={shop.profilePicture}
                                alt={shop.name}
                                className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-emerald-100 border-4 border-white shadow-lg flex items-center justify-center">
                                <Store className="w-8 h-8 text-emerald-600" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="pt-14 pb-6 px-6">
                    <h3 className="font-bold text-lg text-zinc-900 group-hover:text-emerald-600 transition-colors">
                        {shop.name}
                    </h3>

                    {shop.city && (
                        <div className="flex items-center gap-1 text-sm text-zinc-500 mt-1">
                            <MapPin className="w-4 h-4" />
                            {shop.city}
                        </div>
                    )}

                    {shop.description && (
                        <p className="text-sm text-zinc-600 mt-3 line-clamp-2">
                            {shop.description}
                        </p>
                    )}

                    {/* Tags */}
                    {parsedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {parsedTags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Product count */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100 text-sm text-zinc-500">
                        <ShoppingBag className="w-4 h-4" />
                        {shop.products?.length || 0} produit{(shop.products?.length || 0) !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>
        </Link>
    );
}
