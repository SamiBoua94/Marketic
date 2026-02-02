"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag, ArrowRight, Heart, Share2, Printer } from 'lucide-react';
import { AnimatedBackground, FloatingLeaves } from "@/components/ui/AnimatedBackground";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function CheckoutSuccessPage() {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatedBackground variant="subtle" className="min-h-screen flex items-center justify-center p-4">
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.15} />}

            <div className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-soft text-center relative overflow-hidden animate-scale-up">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-green-400 to-primary" />

                <div className="mb-8 relative">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce-soft">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                    Merci pour votre commande !
                </h1>

                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                    Votre soutien aux artisans locaux fait toute la différence.
                    <br />
                    Un email de confirmation vous a été envoyé.
                </p>

                <div className="bg-white/50 rounded-2xl p-6 mb-8 border border-secondary/10">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-secondary/10">
                        <span className="text-sm font-medium text-foreground/60">Commande n°</span>
                        <span className="font-mono font-bold text-foreground">MK-{Math.floor(Math.random() * 100000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground/60">Date estimée</span>
                        <span className="font-bold text-foreground">
                            {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <Button variant="outline" className="rounded-xl border-secondary/20 hover:bg-white hover:border-primary/20 group">
                        <Printer className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                        Facture
                    </Button>
                    <Button variant="outline" className="rounded-xl border-secondary/20 hover:bg-white hover:border-primary/20 group">
                        <Share2 className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                        Partager
                    </Button>
                </div>

                <div className="space-y-4">
                    <Link href="/products">
                        <Button className="w-full h-14 text-lg rounded-xl shadow-glow hover:shadow-glow-accent hover:-translate-y-1 transition-all">
                            Continuer mes achats
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>

                    <Link href="/account/orders" className="block text-sm font-medium text-foreground/50 hover:text-primary transition-colors">
                        Suivre ma commande
                    </Link>
                </div>
            </div>
        </AnimatedBackground>
    );
}
