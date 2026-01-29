"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, PackageSearch, X, LayoutGrid, List, Loader2 } from 'lucide-react';
import { ProductSearchCard } from '@/components/search/ProductSearchCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MockProduct } from '@/lib/mock-data';

const CATEGORIES = [
    'Tous',
    'Décoration',
    'Mode',
    'Mobilier',
    'Soin & Beauté',
    'Accessoires',
    'Fashion',
    'Home & Garden'
];

export default function ProductsPage() {
    const [products, setProducts] = useState<MockProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/products/');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des produits');
                }
                const data = await response.json();
                setProducts(data.products || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());

            // Allow matching "Fashion" and "Mode", etc. if categories differ between DB and display
            const normalizedCategory = selectedCategory === 'Tous' ? 'Tous' : selectedCategory;
            const matchesCategory = normalizedCategory === 'Tous' || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header / Hero Section */}
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl">
                        <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-none px-3 py-1">
                            Catalogue Artisanal
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            Découvrez le savoir-faire <span className="text-primary text-italic">local</span>
                        </h1>
                        <p className="text-lg text-foreground/60">
                            Explorez notre sélection unique de créations durables, conçues avec passion par des artisans près de chez vous.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar (Desktop) / Top Bar (Mobile) */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="sticky top-24 space-y-8">
                            {/* Search */}
                            <div>
                                <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                                    <Search className="w-5 h-5 text-primary" />
                                    Rechercher
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nom, artisan, matière..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/10 rounded-full"
                                        >
                                            <X className="w-3 h-3 text-foreground/40" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-primary" />
                                    Catégories
                                </h3>
                                <div className="flex flex-wrap lg:flex-col gap-2">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === category
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'bg-secondary/5 text-foreground/70 hover:bg-secondary/10'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10 sm:hidden lg:block">
                                <h4 className="font-bold text-accent mb-2 flex items-center gap-2">
                                    <PackageSearch className="w-4 h-4" />
                                    Engagement Éthique
                                </h4>
                                <p className="text-xs text-accent/80 leading-relaxed">
                                    Chaque produit sur Markethic est vérifié pour son impact environnemental et son origine locale.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-foreground/50 text-sm">
                                <span className="font-bold text-foreground">{filteredProducts.length}</span> créations trouvées
                            </p>

                            <div className="flex items-center gap-2 bg-secondary/5 p-1 rounded-lg">
                                <button className="p-2 bg-white shadow-sm rounded-md text-primary">
                                    <LayoutGrid size={18} />
                                </button>
                                <button className="p-2 text-foreground/40 hover:text-foreground/70 transition-colors">
                                    <List size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <p className="text-foreground/50 animate-pulse font-medium">Chargement des produits...</p>
                            </div>
                        ) : error ? (
                            <div className="py-24 text-center bg-destructive/5 rounded-3xl border border-dashed border-destructive/20">
                                <h2 className="text-2xl font-heading font-bold text-destructive mb-2">Erreur</h2>
                                <p className="text-foreground/50 max-w-sm mx-auto mb-6">
                                    {error}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                >
                                    Réessayer
                                </Button>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <ProductSearchCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-secondary/5 rounded-3xl border border-dashed border-secondary/20">
                                <div className="inline-flex p-6 bg-white rounded-full mb-6 text-foreground/20">
                                    <Search size={48} />
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Aucun résultat</h2>
                                <p className="text-foreground/50 max-w-sm mx-auto">
                                    Nous n'avons trouvé aucun produit correspondant à vos critères de recherche. Essayez d'élargir votre sélection.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-8"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('Tous');
                                    }}
                                >
                                    Réinitialiser les filtres
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
