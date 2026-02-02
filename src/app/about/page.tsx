"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Shield, Users, Zap, Globe, Eye, Ban, AlertTriangle, Lock, Copy, Euro, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedBackground, FloatingLeaves } from "@/components/ui/AnimatedBackground";

export default function About() {
    return (
        <AnimatedBackground variant="subtle" className="min-h-screen">
            <main>
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-24 relative overflow-hidden">
                    < div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="flex justify-center mb-8">
                            <div className="p-6 bg-white/50 backdrop-blur-md rounded-[2rem] shadow-soft border border-white/60 animate-fade-in-scale">
                                <Heart className="w-16 h-16 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-foreground leading-tight tracking-tight">
                            Notre Mission
                        </h1>
                        <p className="text-xl md:text-2xl text-foreground/70 mb-10 leading-relaxed max-w-3xl mx-auto font-light">
                            Redonner le pouvoir d'achat aux <span className="font-bold text-primary">commerçants, artistes et artisans</span> de nos régions
                            face aux géants du e-commerce.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
                            <Link href="/shop">
                                <Button size="lg" className="rounded-xl px-8 h-14 text-lg shadow-glow hover:shadow-glow-accent transition-all hover:scale-105">
                                    Découvrir les boutiques
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Le Problème */}
                <section className="container mx-auto px-4 py-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Le Combat que nous menons</h2>
                            <p className="text-foreground/60 max-w-2xl mx-auto">Nous nous battons contre les pratiques qui déshumanisent le commerce et détruisent notre environnement local.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Zap, color: "text-red-500", bg: "bg-red-500/10", title: "Concurrence déloyale", desc: "Les géants du e-commerce écrasent nos commerçants locaux avec des prix et des moyens qu'ils ne peuvent égaler." },
                                { icon: Shield, color: "text-orange-500", bg: "bg-orange-500/10", title: "Manque de transparence", desc: "Le dropshipping et les productions agressives cachent la véritable origine et l'impact des produits." },
                                { icon: Users, color: "text-yellow-500", bg: "bg-yellow-500/10", title: "Barrières techniques", desc: "Les commerçants n'ont pas toujours les compétences ou les moyens pour vendre efficacement en ligne." }
                            ].map((item, idx) => (
                                <div key={idx} className="group text-center p-8 rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className={`w-20 h-20 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <item.icon className={`w-10 h-10 ${item.color}`} />
                                    </div>
                                    <h3 className="text-xl font-heading font-bold mb-4">{item.title}</h3>
                                    <p className="text-foreground/70 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Notre Solution */}
                <section className="container mx-auto px-4 py-20">
                    <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 border border-white/60 shadow-soft relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                        <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Notre Solution : Markethic</h2>
                            <p className="text-lg text-foreground/70">
                                Une plateforme conçue pour rétablir l'équilibre et donner une voix aux créateurs authentiques.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="group text-left p-8 bg-white/50 rounded-[2rem] border border-secondary/10 hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-green-100 rounded-xl group-hover:rotate-12 transition-transform">
                                        <Leaf className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-heading font-bold">Marketing Éthique</h3>
                                </div>
                                <p className="text-foreground/70 mb-6 leading-relaxed">
                                    Nous résolvons les problèmes rencontrés sur les marketplaces traditionnelles, en étant les moins cher sur le marché.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Gestion e-commerce simplifiée",
                                        "Création de boutique facile et gratuite",
                                        "Outils pour développer votre business",
                                        "Garantie de qualité des produits"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="group text-left p-8 bg-white/50 rounded-[2rem] border border-secondary/10 hover:border-blue-200 transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-100 rounded-xl group-hover:-rotate-12 transition-transform">
                                        <Globe className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-heading font-bold">Alternative Éthique</h3>
                                </div>
                                <p className="text-foreground/70 mb-6 leading-relaxed">
                                    Notre plateforme vous met en relation directe avec des créateurs locaux qui partagent vos valeurs.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Recommandations personnalisées",
                                        "Mise en relation consommateur-producteur",
                                        "Prévention sur les boycotts",
                                        "Transparence totale sur les marges"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Nos Valeurs Grid */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-heading font-bold text-center mb-16">Ce qui nous guide</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Heart, title: "Humain avant tout", text: "Nous remettons l'humain au centre des échanges commerciaux." },
                                { icon: Leaf, title: "Local et durable", text: "Nous encourageons les circuits courts et les productions respectueuses." },
                                { icon: Shield, title: "Transparence totale", text: "Chaque produit a une histoire, et nous vous la racontons sans filtre." },
                                { icon: Zap, title: "Innovation accessible", text: "Nous démocratisons les outils technologiques pour tous." },
                                { icon: Euro, title: "Tarifs équitables", text: "Commissions réduites pour maximiser les revenus des vendeurs." },
                                { icon: Database, title: "Données respectueuses", text: "Respect strict du RGPD et de votre vie privée." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-6 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/40 hover:bg-white/60 transition-colors">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-primary shrink-0">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
                                        <p className="text-sm text-foreground/70 leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision Éthique et Boycott */}
                <section className="container mx-auto px-4 py-20">
                    <div className="max-w-5xl mx-auto bg-gradient-to-br from-red-50 to-orange-50 rounded-[3rem] p-10 md:p-16 border border-red-100 relative overflow-hidden">

                        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-red-950">Refusons l'injustice</h2>
                            <p className="text-lg text-red-800/80 leading-relaxed">
                                Dans un monde où nos achats peuvent financer des pratiques que nous désapprouvons,
                                nous vous donnons les outils pour faire des choix éclairés.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="p-8 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-red-100/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-red-100 rounded-xl text-red-600">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-heading font-bold text-red-950">Vision complète</h3>
                                </div>
                                <p className="text-red-900/70 mb-4 text-sm leading-relaxed">
                                    Nous traçons l'origine de chaque produit jusqu'à ses fournisseurs finaux.
                                    Plus de secrets, plus de chaînes d'approvisionnement opaques.
                                </p>
                            </div>
                            <div className="p-8 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-red-100/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-red-100 rounded-xl text-red-600">
                                        <Ban className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-heading font-bold text-red-950">Boycotts actifs</h3>
                                </div>
                                <p className="text-red-900/70 mb-4 text-sm leading-relaxed">
                                    Nous intégrons les listes de boycott reconnues pour vous alerter
                                    lorsqu'un produit est concerné par des controverses.
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-red-100/50 rounded-2xl border border-red-200/50 text-center relative z-10">
                            <p className="font-heading font-bold text-red-900 text-lg">
                                "Chaque euro dépensé est un vote pour le monde que nous voulons."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Lanceurs d'alerte / Whistleblower */}
                <section className="container mx-auto px-4 py-20">
                    <div className="max-w-5xl mx-auto bg-slate-900 text-slate-50 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity opacity-50 group-hover:opacity-70 duration-1000"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full text-primary-foreground text-xs font-bold uppercase tracking-wider mb-6">
                                    <Lock className="w-3 h-3" /> Espace Sécurisé
                                </div>
                                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">On a besoin de vous !</h2>
                                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                    Vous êtes un lanceur d'alerte ? Vous souhaitez nous signaler des dérives ?
                                    Votre contribution est essentielle à l'intégrité de Markethic.
                                </p>

                                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-primary" />
                                        Portail TOR
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-4">Accès anonyme garanti via le réseau Onion.</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <code className="bg-black/50 px-4 py-3 rounded-xl text-primary font-mono text-xs md:text-sm border border-primary/20 flex-1 truncate">
                                            markethic-secure.onion
                                        </code>
                                        <Button
                                            variant="outline"
                                            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                                            onClick={() => navigator.clipboard.writeText('markethic-secure.onion')}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copier
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="relative w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-slow">
                                    <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping-slow"></div>
                                    <Shield className="w-24 h-24 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="container mx-auto px-4 py-24 text-center">
                    <h2 className="text-4xl font-heading font-bold mb-8">Rejoignez le mouvement</h2>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/login">
                            <Button size="lg" className="rounded-xl px-10 h-14 text-lg font-bold shadow-xl hover:-translate-y-1 transition-transform">
                                S'inscrire maintenant
                            </Button>
                        </Link>
                        <Link href="/shop">
                            <Button variant="outline" size="lg" className="rounded-xl px-10 h-14 text-lg font-bold bg-white/50 hover:bg-white transition-colors">
                                Explorer les boutiques
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
        </AnimatedBackground>
    );
}
