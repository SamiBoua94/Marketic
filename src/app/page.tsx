"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function Home() {
    return (
        <AnimatedBackground variant="subtle" className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-4">
            <main className="max-w-3xl mx-auto space-y-12 animate-fade-in-up">

                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>La marketplace éthique & locale</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tight leading-tight">
                        Consommez mieux avec <span className="text-primary">Markethic</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-foreground/60 font-light max-w-2xl mx-auto leading-relaxed">
                        Soutenez directement les artisans, artistes et commerçants locaux.

                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/products" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl shadow-glow hover:shadow-glow-accent hover:-translate-y-1 transition-all">
                            Acheter des produits
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>

                    <Link href="/boutiques" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl border-2 hover:bg-secondary/10 hover:text-primary transition-all">
                            Découvrir les boutiques
                        </Button>
                    </Link>
                </div>

                {/* Minimal footprint footer for homepage only if needed, otherwise rely on global footer */}
                <div className="pt-20 opacity-40 text-sm">
                    <p>@Markethic</p>
                </div>

            </main>
        </AnimatedBackground>
    );
}
