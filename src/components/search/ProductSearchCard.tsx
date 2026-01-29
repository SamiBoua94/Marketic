import { Store } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { EthicalScoreBadge } from '@/components/ui/EthicalScoreBadge';
import Link from 'next/link';

type ProductSearchCardProduct = {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    images?: string | string[] | null;
    ethicalScore?: number | null;
    shop?: {
        name?: string;
        logo?: string;
        profilePicture?: string | null;
    };
};

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

export function ProductSearchCard({ product }: { product: ProductSearchCardProduct }) {
    const fallbackProductImage = 'https://placehold.co/800x600?text=Produit';
    const productImage =
        normalizeImageUrls(product.images)[0] ||
        (typeof product.image === 'string' ? product.image : '') ||
        fallbackProductImage;

    const shopLogo =
        (product.shop?.profilePicture || product.shop?.logo || '').trim() ||
        'https://placehold.co/100x100?text=Shop';

    return (
        <Link href={`/product/${product.id}`} className="block group">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-all flex flex-col h-full cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.currentTarget.src = fallbackProductImage;
                        }}
                    />
                    {/* Badge score éthique */}
                    <div className="absolute top-2 left-2">
                        <EthicalScoreBadge score={product.ethicalScore} size="sm" />
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-1">{product.name}</h3>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{product.price.toFixed(2)} €</span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 h-10">
                        {product.description}
                    </p>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                            <img
                                src={shopLogo}
                                alt={product.shop?.name || 'Boutique'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/100x100?text=Shop';
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-400">Vendu par</span>
                            <div className="flex items-center gap-1.5 font-medium text-sm text-zinc-900 dark:text-white">
                                <Store size={14} className="text-emerald-600" />
                                {product.shop?.name || 'Boutique'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto" onClick={(e) => e.preventDefault()}>
                        <AddToCartButton productId={product.id} className="w-full" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
