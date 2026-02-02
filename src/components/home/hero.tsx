"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Sparkles, ShoppingBag, Users, Heart } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

// Stats component
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-soft hover-lift">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {icon}
            </div>
            <div>
                <p className="font-bold text-foreground text-lg">{value}</p>
                <p className="text-xs text-foreground/60">{label}</p>
            </div>
        </div>
    );
}

export function Hero() {
    return (
        <AnimatedBackground variant="hero" className="min-h-[90vh] flex items-center">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in-up shadow-soft">
                            <Sparkles className="w-4 h-4" />
                            <span>La marketplace éco-responsable #1 en France</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-foreground tracking-tight mb-6 animate-fade-in-up animation-delay-100">
                            Soutenez le commerce{" "}
                            <span className="text-gradient">local</span>{" "}
                            et{" "}
                            <span className="relative inline-block">
                                <span className="text-accent">durable</span>
                                <svg
                                    className="absolute -bottom-2 left-0 w-full h-3 text-accent/30"
                                    viewBox="0 0 100 12"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M0,8 Q25,0 50,8 T100,8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-foreground/70 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
                            Markethic connecte directement les créateurs de talents,
                            artisans et producteurs de votre région avec des consommateurs
                            engagés pour un avenir plus vert.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12 animate-fade-in-up animation-delay-300">
                            <Link href="/boutiques">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto gap-2 shadow-glow hover:shadow-glow hover:-translate-y-1 transition-all text-base px-8 py-6"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    Découvrir les boutiques
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto border-2 hover:bg-primary/5 transition-all text-base px-8 py-6"
                                >
                                    Voir les produits
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-500">
                            <StatCard
                                icon={<Users className="w-5 h-5" />}
                                value="500+"
                                label="Artisans"
                            />
                            <StatCard
                                icon={<ShoppingBag className="w-5 h-5" />}
                                value="2000+"
                                label="Produits"
                            />
                            <StatCard
                                icon={<Heart className="w-5 h-5" />}
                                value="98%"
                                label="Satisfaits"
                            />
                        </div>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="relative hidden lg:block animate-fade-in-scale animation-delay-300">
                        {/* Main Card Stack */}
                        <div className="relative">
                            {/* Background Cards */}
                            <div className="absolute -top-4 -left-4 w-full h-full bg-secondary/20 rounded-3xl transform rotate-3 blur-sm" />
                            <div className="absolute -top-2 -left-2 w-full h-full bg-accent/10 rounded-3xl transform -rotate-2" />

                            {/* Main Image Container */}
                            <div className="relative bg-gradient-to-br from-primary/5 to-secondary/10 rounded-3xl p-8 shadow-glow overflow-hidden">
                                {/* Decorative Pattern */}
                                <div className="absolute inset-0 bg-pattern-leaves opacity-30" />

                                {/* Product Grid Preview */}
                                <div className="relative grid grid-cols-2 gap-4">
                                    {[
                                        { bg: "bg-amber-100", emoji: "🍯" },
                                        { bg: "bg-emerald-100", emoji: "🌿" },
                                        { bg: "bg-rose-100", emoji: "🧴" },
                                        { bg: "bg-sky-100", emoji: "🧶" },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className={`${item.bg} rounded-2xl p-6 aspect-square flex items-center justify-center text-5xl shadow-soft hover-lift cursor-pointer animate-fade-in-up`}
                                            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                                        >
                                            {item.emoji}
                                        </div>
                                    ))}
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -top-3 -right-3 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium shadow-glow-accent animate-bounce-soft">
                                    <Sparkles className="w-4 h-4 inline mr-1" />
                                    Nouveau
                                </div>

                                {/* Eco Badge */}
                                <div className="absolute -bottom-3 -left-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-soft flex items-center gap-2 animate-float">
                                    <Leaf className="w-4 h-4 text-primary" />
                                    <span className="text-foreground">100% Éco</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements around the card */}
                        <div className="absolute -top-8 right-1/4 animate-float animation-delay-200">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shadow-soft">
                                <Leaf className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 left-1/4 animate-float animation-delay-500">
                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shadow-soft">
                                <Heart className="w-5 h-5 text-accent" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}
