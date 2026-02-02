"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { ProductSearchCard } from "@/components/search/ProductSearchCard";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images?: string | string[] | null;
    ethicalScore?: number | null;
    shop?: {
        name?: string;
        profilePicture?: string | null;
    };
    createdAt: string;
}

export default function NewProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const response = await fetch("/api/products/");
                if (response.ok) {
                    const data = await response.json();
                    // Sort by creation date (newest first) and take first 12
                    const sortedProducts = (data.products || [])
                        .sort((a: Product, b: Product) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )
                        .slice(0, 12);
                    setProducts(sortedProducts);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    return (
        <AnimatedBackground variant="subtle" className="min-h-screen">
            {/* Hero Section */}
            <div className="relative pt-20 pb-12 mb-8 border-b border-primary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl relative z-10">
                        <Badge
                            variant="secondary"
                            className="mb-6 bg-accent/10 text-accent border-none px-4 py-1.5 text-sm font-medium animate-fade-in-up"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Fraîchement arrivés
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in-up animation-delay-100">
                            Nouveautés <span className="text-gradient">Markethic</span>
                        </h1>
                        <p className="text-xl text-foreground/60 leading-relaxed animate-fade-in-up animation-delay-200">
                            Découvrez les dernières créations de nos artisans. Des pièces uniques
                            et durables, fraîchement ajoutées à notre catalogue.
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-8 pb-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                            </div>
                        </div>
                        <p className="text-foreground/50 animate-pulse font-medium text-lg">
                            Dénichage des pépites en cours...
                        </p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="animate-fade-in-up animation-delay-300">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-foreground/60 text-sm font-medium bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-secondary/20">
                                <span className="font-bold text-primary">{products.length}</span> nouvelles créations trouvées
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <ProductSearchCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white/50 backdrop-blur-sm rounded-[2rem] border border-dashed border-secondary/30 animate-fade-in-up">
                        <div className="inline-flex p-8 bg-secondary/10 rounded-full mb-6 text-foreground/30 animate-float">
                            <Sparkles size={48} />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
                            Pas encore de nouveautés
                        </h2>
                        <p className="text-foreground/50 max-w-sm mx-auto text-lg leading-relaxed">
                            Nos artisans peaufinent leurs créations. Revenez très bientôt !
                        </p>
                    </div>
                )}
            </div>
        </AnimatedBackground>
    );
}
