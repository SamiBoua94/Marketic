"use client";

import { MapPin, Star, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingLeaves, DecorativeBlobs } from "@/components/ui/AnimatedBackground";

// Mock data (temporary)
const FEATURED_ITEMS = [
    {
        id: 1,
        artist: "L'Atelier de Sophie",
        product: "Vase en Céramique Artisanale",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2670&auto=format&fit=crop",
        location: "Lyon, FR",
        price: "45€",
        category: "Céramique"
    },
    {
        id: 2,
        artist: "Bois & Nature",
        product: "Planche à découper Olivier",
        image: "https://images.unsplash.com/photo-1622396112674-3255dc7a22d7?q=80&w=2670&auto=format&fit=crop",
        location: "Annecy, FR",
        price: "32€",
        category: "Menuiserie"
    },
    {
        id: 3,
        artist: "Coton Bio",
        product: "Tote Bag Brodé Main",
        image: "https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?q=80&w=2574&auto=format&fit=crop",
        location: "Paris, FR",
        price: "24€",
        category: "Textile"
    }
];

export function FeaturedSection() {
    return (
        <section className="relative py-24 bg-background overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-gradient-nature opacity-30 rounded-l-[100px] blur-3xl pointer-events-none" />

            {/* Animated leaves */}
            <FloatingLeaves />

            <div className="container relative z-10 mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary font-medium tracking-wider uppercase text-sm mb-2 block animate-fade-in-up">
                            Coups de cœur
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-foreground animate-fade-in-up animation-delay-100">
                            Créations à la Une
                        </h2>
                        <p className="text-lg text-foreground/60 leading-relaxed animate-fade-in-up animation-delay-200">
                            Découvrez une sélection unique de pièces faites main par des artisans
                            passionnés de votre région. Chaque objet raconte une histoire.
                        </p>
                    </div>
                    <Link href="/products" className="animate-fade-in-up animation-delay-300">
                        <Button variant="ghost" className="text-primary hover:text-primary/80 group text-lg px-0 hover:bg-transparent">
                            Voir tout le catalogue
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURED_ITEMS.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative bg-white rounded-[2rem] overflow-hidden border border-secondary/20 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-foreground shadow-sm">
                                        {item.category}
                                    </span>
                                </div>

                                <button className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-foreground/40 hover:text-red-500 hover:scale-110 transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                                    <Heart className="w-5 h-5" />
                                </button>

                                <img
                                    src={item.image}
                                    alt={item.product}
                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                                            {item.product}
                                        </h3>
                                        <p className="text-foreground/60">{item.artist}</p>
                                    </div>
                                    <div className="bg-primary/5 px-3 py-1 rounded-lg">
                                        <span className="font-bold text-lg text-primary">{item.price}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-dashed border-secondary/30">
                                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary-foreground">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        {item.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                        <span className="font-bold text-foreground">4.9</span>
                                        <span className="text-foreground/40 text-sm">(124)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
