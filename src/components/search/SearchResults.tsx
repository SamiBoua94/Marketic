import { mockProducts } from '@/lib/mock-data';
import { ProductSearchCard } from './ProductSearchCard';
import { SearchX } from 'lucide-react';

interface SearchResultsProps {
    query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
    const filteredProducts = mockProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.shop.name.toLowerCase().includes(query.toLowerCase())
    );

    const hasResults = filteredProducts.length > 0;
    const itemsToDisplay = hasResults ? filteredProducts : mockProducts.slice(0, 3);

    return (
        <div className="container mx-auto px-4 py-12">
            {!hasResults && query && (
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <div className="inline-flex p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-6 text-zinc-400">
                        <SearchX size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Rien trouvé</h2>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        Nous n'avons trouvé aucun résultat pour "{query}". Voici quelques créations d'autres artisans qui pourraient vous plaire.
                    </p>
                </div>
            )}

            {query && (
                <div className="animate-in fade-in duration-500">
                    {hasResults && (
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">
                            Résultats pour "{query}"
                        </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {itemsToDisplay.map(product => (
                            <ProductSearchCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
