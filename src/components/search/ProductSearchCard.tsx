import { Award, Store } from 'lucide-react';
import { MockProduct } from '@/lib/mock-data';

export function ProductSearchCard({ product }: { product: MockProduct }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                    <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Award size={14} />
                        {product.score}%
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-1">{product.name}</h3>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{product.price.toFixed(2)} €</span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 h-10">
                    {product.description}
                </p>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                        <img src={product.shop.logo} alt={product.shop.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-400">Vendu par</span>
                        <div className="flex items-center gap-1.5 font-medium text-sm text-zinc-900 dark:text-white">
                            <Store size={14} className="text-emerald-600" />
                            {product.shop.name}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
