"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, PackageSearch, X, LayoutGrid, List, Loader2, Sparkles } from 'lucide-react';
import { ProductSearchCard } from '@/components/search/ProductSearchCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MockProduct } from '@/lib/mock-data';
import { AnimatedBackground, FloatingLeaves } from '@/components/ui/AnimatedBackground';

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

            const normalizedCategory = selectedCategory === 'Tous' ? 'Tous' : selectedCategory;
            const matchesCategory = normalizedCategory === 'Tous' || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    return (
        <AnimatedBackground variant="subtle" className="min-h-screen">
            <div className="pb-20">
                {/* Header / Hero Section */}
                <div className="relative pt-24 pb-12 mb-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/60 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4" />
                                <span>Catalogue Artisanal</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
                                Le savoir-faire <span className="text-primary italic">local</span> à portée de main
                            </h1>
                            <p className="text-lg text-foreground/60 leading-relaxed max-w-xl">
                                Explorez notre sélection unique de créations durables, conçues avec passion par des artisans près de chez vous.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <aside className="w-full lg:w-80 flex-shrink-0 animate-fade-in-up animation-delay-100">
                            <div className="sticky top-24 space-y-6">
                                {/* Search Card */}
                                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-soft">
                                    <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                                        <Search className="w-5 h-5 text-primary" />
                                        Rechercher
                                    </h3>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Nom, artisan, matière..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-11 pr-4 py-4 bg-white/80 border border-secondary/20 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans text-sm group-hover:border-primary/30"
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/10 rounded-full transition-colors"
                                            >
                                                <X className="w-3 h-3 text-foreground/40" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Categories Card */}
                                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-soft">
                                    <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                                        <Filter className="w-5 h-5 text-primary" />
                                        Catégories
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${selectedCategory === category
                                                    ? 'bg-primary text-white border-primary shadow-glow'
                                                    : 'bg-white/50 border-secondary/10 text-foreground/60 hover:border-primary/30 hover:bg-white hover:text-foreground'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ethical Badge Info */}
                                <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-[2rem] border border-primary/10 relative overflow-hidden hidden lg:block group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-125 duration-700" />
                                    <h4 className="font-heading font-bold text-primary mb-2 flex items-center gap-2 relative z-10">
                                        <PackageSearch className="w-5 h-5" />
                                        Engagement Éthique
                                    </h4>
                                    <p className="text-sm text-foreground/70 leading-relaxed relative z-10">
                                        Chaque produit sur Markethic est vérifié pour son impact environnemental et son origine locale.
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 animate-fade-in-up animation-delay-200">
                            {/* Results Header */}
                            <div className="flex items-center justify-between mb-8 bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                                <p className="text-foreground/60 text-sm font-medium pl-2">
                                    <span className="font-bold text-foreground text-lg mr-1">{filteredProducts.length}</span>
                                    créations trouvées
                                </p>

                                <div className="flex items-center gap-1 bg-white/60 p-1.5 rounded-xl border border-white/60">
                                    <button className="p-2 bg-white shadow-sm rounded-lg text-primary transition-all hover:scale-105">
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button className="p-2 text-foreground/40 hover:text-foreground/70 transition-colors hover:bg-white/50 rounded-lg">
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-32 text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                                        <Loader2 className="relative w-12 h-12 text-primary animate-spin" />
                                    </div>
                                    <p className="text-foreground/60 font-medium animate-pulse">Recherche des pépites...</p>
                                </div>
                            ) : error ? (
                                <div className="py-24 text-center bg-red-50/50 backdrop-blur-sm rounded-[2rem] border border-red-100">
                                    <h2 className="text-2xl font-heading font-bold text-red-800 mb-2">Oups !</h2>
                                    <p className="text-red-600/70 max-w-sm mx-auto mb-6">
                                        {error}
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                        className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                        Réessayer
                                    </Button>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="animate-fade-in-up"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <ProductSearchCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-32 text-center bg-white/40 backdrop-blur-sm rounded-[3rem] border border-dashed border-secondary/20">
                                    <div className="inline-flex p-8 bg-white/80 rounded-full mb-6 text-foreground/20 shadow-sm">
                                        <Search size={48} />
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Aucun résultat</h2>
                                    <p className="text-foreground/60 max-w-md mx-auto mb-8 leading-relaxed">
                                        Nous n'avons trouvé aucun produit correspondant à vos critères.
                                        Essayez d'élargir votre recherche ou explorez nos catégories populaires.
                                    </p>
                                    <Button
                                        size="lg"
                                        className="rounded-xl shadow-glow"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('Tous');
                                        }}
                                    >
                                        Voir tous les produits
                                    </Button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}
