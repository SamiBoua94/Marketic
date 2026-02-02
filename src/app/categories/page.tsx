"use client";

import Link from "next/link";
import {
    Palette,
    Shirt,
    Sofa,
    Sparkles,
    Watch,
    Leaf,
    Home,
    Gift,
    ArrowRight
} from "lucide-react";
import { AnimatedBackground, DecorativeBlobs } from "@/components/ui/AnimatedBackground";

const CATEGORIES = [
    {
        name: "Décoration",
        slug: "Décoration",
        icon: Palette,
        description: "Objets décoratifs artisanaux pour embellir votre intérieur",
        color: "bg-rose-500/10 text-rose-600",
        border: "group-hover:border-rose-200"
    },
    {
        name: "Mode",
        slug: "Mode",
        icon: Shirt,
        description: "Vêtements et accessoires de mode éco-responsables",
        color: "bg-purple-500/10 text-purple-600",
        border: "group-hover:border-purple-200"
    },
    {
        name: "Mobilier",
        slug: "Mobilier",
        icon: Sofa,
        description: "Meubles artisanaux en bois et matériaux durables",
        color: "bg-amber-500/10 text-amber-600",
        border: "group-hover:border-amber-200"
    },
    {
        name: "Soin & Beauté",
        slug: "Soin & Beauté",
        icon: Sparkles,
        description: "Cosmétiques naturels et soins faits main",
        color: "bg-pink-500/10 text-pink-600",
        border: "group-hover:border-pink-200"
    },
    {
        name: "Accessoires",
        slug: "Accessoires",
        icon: Watch,
        description: "Bijoux, sacs et accessoires uniques",
        color: "bg-sky-500/10 text-sky-600",
        border: "group-hover:border-sky-200"
    },
    {
        name: "Maison & Jardin",
        slug: "Home & Garden",
        icon: Home,
        description: "Articles pour la maison et le jardinage écologique",
        color: "bg-green-500/10 text-green-600",
        border: "group-hover:border-green-200"
    },
    {
        name: "Cadeaux",
        slug: "Cadeaux",
        icon: Gift,
        description: "Idées cadeaux originales et personnalisables",
        color: "bg-orange-500/10 text-orange-600",
        border: "group-hover:border-orange-200"
    },
    {
        name: "Éco-responsable",
        slug: "Éco-responsable",
        icon: Leaf,
        description: "Produits zéro déchet et respectueux de l'environnement",
        color: "bg-emerald-500/10 text-emerald-600",
        border: "group-hover:border-emerald-200"
    }
];

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-primary/5 to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-accent/5 to-transparent blur-3xl" />

            <AnimatedBackground variant="subtle" className="pb-20">
                {/* Hero Section */}
                <div className="relative pt-20 pb-12 mb-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl relative z-10">
                            <span className="text-sm font-bold tracking-widest text-primary uppercase mb-3 block animate-fade-in-up">
                                Explorez par univers
                            </span>
                            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in-up animation-delay-100">
                                Nos <span className="text-gradient">Catégories</span>
                            </h1>
                            <p className="text-xl text-foreground/60 leading-relaxed animate-fade-in-up animation-delay-200">
                                Plongez dans nos différents univers et trouvez l'objet rare qui correspond
                                à vos valeurs et à votre style de vie.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                        {CATEGORIES.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <Link
                                    key={category.slug}
                                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                                    className="group block h-full animate-fade-in-up"
                                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                                >
                                    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-secondary/20 p-8 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden ${category.border}`}>
                                        <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full ${category.color} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`} />

                                        <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                            <Icon className="w-8 h-8" />
                                        </div>

                                        <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                                            {category.name}
                                        </h3>

                                        <p className="text-foreground/60 leading-relaxed mb-6">
                                            {category.description}
                                        </p>

                                        <div className="flex items-center text-sm font-medium text-foreground/40 group-hover:text-primary transition-colors mt-auto">
                                            Explorer
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="container mx-auto px-4 mt-24">
                    <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden animate-fade-in-up animation-delay-300">
                        <div className="absolute inset-0 bg-pattern-leaves opacity-20" />
                        <DecorativeBlobs variant="mixed" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                                Vous ne trouvez pas votre bonheur ?
                            </h2>
                            <p className="text-xl text-foreground/60 mb-10">
                                Explorez l'ensemble de notre catalogue ou utilisez notre recherche avancée
                                pour trouver le produit artisanal parfait.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-glow hover:shadow-glow-accent"
                            >
                                Voir tout le catalogue
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </AnimatedBackground>
        </div>
    );
}
