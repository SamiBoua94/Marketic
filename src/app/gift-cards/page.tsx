"use client";

import { Gift, Bell, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function GiftCardsPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-accent/10 via-background to-primary/5">
                <div className="container mx-auto px-4 py-24">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Decorative Gift Icon */}
                        <div className="inline-flex p-6 bg-accent/10 rounded-full mb-8">
                            <Gift className="w-16 h-16 text-accent" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                            Cartes Cadeaux <span className="text-accent">Markethic</span>
                        </h1>

                        <p className="text-xl text-foreground/60 mb-8 leading-relaxed">
                            Bientôt, offrez à vos proches la liberté de choisir parmi des milliers
                            de créations artisanales et éco-responsables.
                        </p>

                        {/* Coming Soon Badge */}
                        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-medium mb-12">
                            <Sparkles className="w-4 h-4" />
                            Bientôt disponible
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center p-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Gift className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2">Montants flexibles</h3>
                        <p className="text-foreground/60 text-sm">
                            Choisissez le montant qui vous convient, de 10€ à 500€.
                        </p>
                    </div>

                    <div className="text-center p-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2">Message personnalisé</h3>
                        <p className="text-foreground/60 text-sm">
                            Ajoutez un message personnel pour rendre votre cadeau unique.
                        </p>
                    </div>

                    <div className="text-center p-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2">Validité 1 an</h3>
                        <p className="text-foreground/60 text-sm">
                            Profitez d'une année complète pour utiliser votre carte cadeau.
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification Signup */}
            <div className="container mx-auto px-4 pb-24">
                <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg border border-secondary/20 p-8 md:p-12">
                    <div className="text-center">
                        <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                            <Bell className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                            Soyez informé du lancement
                        </h2>
                        <p className="text-foreground/60 mb-6">
                            Inscrivez-vous pour être notifié dès que les cartes cadeaux seront disponibles.
                        </p>

                        {isSubmitted ? (
                            <div className="bg-green-50 text-green-700 px-6 py-4 rounded-xl">
                                <p className="font-medium">Merci ! 🎉</p>
                                <p className="text-sm">Nous vous préviendrons dès le lancement.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    required
                                    className="flex-1 px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                />
                                <Button type="submit" className="px-6">
                                    Me notifier
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
