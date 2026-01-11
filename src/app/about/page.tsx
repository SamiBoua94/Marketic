"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Shield, Users, Zap, Globe, Eye, Ban, AlertTriangle, Lock, Copy } from 'lucide-react';
import Link from 'next/link';

export default function About() {
    return (
        <>

            <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Heart className="w-12 h-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Notre Mission
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            Redonner le pouvoir d'achat aux commerçants, artistes et artisans de notre territoire
                            face aux géants du e-commerce.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/shop">
                                <Button size="lg" className="px-8">
                                    Découvrir les boutiques
                                </Button>
                            </Link>
                            <Link href="/chat-ia">
                                <Button variant="outline" size="lg" className="px-8">
                                    Demander à l'IA
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Le Problème */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Le Combat que nous menons</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-secondary/20">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Concurrence déloyale</h3>
                                <p className="text-muted-foreground">
                                    Les géants du e-commerce écrasent nos commerçants locaux avec des prix et des moyens qu'ils ne peuvent égaler.
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-secondary/20">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Manque de transparence</h3>
                                <p className="text-muted-foreground">
                                    Le dropshipping et les productions agressives cachent la véritable origine et l'impact des produits.
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-secondary/20">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Barrières techniques</h3>
                                <p className="text-muted-foreground">
                                    Les commerçants n'ont pas toujours les compétences ou les moyens pour vendre efficacement en ligne.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notre Solution */}
                <section className="container mx-auto px-4 py-16 bg-primary/5 rounded-3xl my-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">Notre Solution : Markethic</h2>
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="text-left p-6 bg-white rounded-xl border border-secondary/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Leaf className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Score Éthique</h3>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    Un système de notation transparent qui évalue chaque produit selon des critères éthiques,
                                    environnementaux et locaux. Plus de secret, plus de dropshipping masqué.
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Origine des produits</li>
                                    <li>• Impact environnemental</li>
                                    <li>• Circuit court ou long</li>
                                    <li>• Production éthique</li>
                                </ul>
                            </div>
                            <div className="text-left p-6 bg-white rounded-xl border border-secondary/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Globe className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold">IA Intelligente</h3>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    Notre intelligence artificielle vous aide à trouver les produits qui correspondent vraiment
                                    à vos valeurs et à vos besoins locaux.
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Recommandations personnalisées</li>
                                    <li>• Analyse des besoins locaux</li>
                                    <li>• Mise en relation consommateur-producteur</li>
                                    <li>• Suggestions d'achats utiles</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Nos Valeurs */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg h-fit">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Humain avant tout</h3>
                                    <p className="text-muted-foreground">
                                        Nous remettons l'humain au centre des échanges commerciaux,
                                        en favorisant les relations directes et la confiance.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg h-fit">
                                    <Leaf className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Local et durable</h3>
                                    <p className="text-muted-foreground">
                                        Nous encourageons les circuits courts et les productions
                                        respectueuses de notre environnement.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg h-fit">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Transparence totale</h3>
                                    <p className="text-muted-foreground">
                                        Chaque produit a une histoire, et nous vous la racontons
                                        sans filtre ni secret.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg h-fit">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Innovation accessible</h3>
                                    <p className="text-muted-foreground">
                                        Nous démocratisons les outils technologiques pour que
                                        chaque commerçant puisse vendre en ligne facilement.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision Éthique et Boycott */}
                <section className="container mx-auto px-4 py-16 bg-red-50 rounded-3xl my-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">Refusons l'injustice, agissons pour le changement</h2>
                        <p className="text-lg text-center text-muted-foreground mb-12">
                            Dans un monde où nos achats peuvent financer des pratiques que nous désapprouvons,
                            nous vous donnons les outils pour faire des choix éclairés et cohérents avec vos valeurs.
                        </p>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 bg-white rounded-xl border border-secondary/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Eye className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Vision complète sur les produits</h3>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    Nous traçons l'origine de chaque produit jusqu'à ses fournisseurs finaux.
                                    Plus de secrets, plus de chaînes d'approvisionnement opaques.
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Traçabilité complète des fournisseurs</li>
                                    <li>• Informations sur les pratiques commerciales</li>
                                    <li>• Impact social et environnemental réel</li>
                                    <li>• Transparence sur les marges et intermédiaires</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-white rounded-xl border border-secondary/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Ban className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Listes de boycott actives</h3>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    Nous intégrons les listes de boycott reconnues et vérifiées pour vous alerter
                                    lorsqu'un produit ou fournisseur est concerné par des controverses éthiques.
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Alertes automatiques de boycott</li>
                                    <li>• Alternatives locales recommandées</li>
                                    <li>• Informations contextuelles sur les controverses</li>
                                    <li>• Suivi des évolutions et résolutions</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 p-6 bg-red-100/50 rounded-xl border border-red-200">
                            <p className="text-center text-red-800 font-medium">
                                "Chaque euro dépensé est un vote pour le monde que nous voulons.
                                Faisons en sorte que nos votes comptent pour une économie plus juste."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Règles et Sécurité */}
                <section className="container mx-auto px-4 py-16 bg-orange-50/50 rounded-3xl my-16 border border-orange-100">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
                        <div className="p-4 bg-orange-100 rounded-2xl">
                            <AlertTriangle className="w-12 h-12 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-orange-800">Règles de vente et Sécurité</h2>
                            <p className="text-muted-foreground mb-4">
                                Markethic est dédié à la vente d'objets de la vie quotidienne respectant nos critères éthiques.
                                Par mesure de sécurité et de conformité, il est <strong>strictement interdit</strong> de vendre :
                            </p>
                            <ul className="grid grid-cols-2 gap-2 text-sm font-medium text-orange-900/80 mb-6">
                                <li>• Produits alimentaires ou boissons</li>
                                <li>• Articles à caractère sexuel</li>
                                <li>• Armes et objets dangereux</li>
                                <li>• Produits frauduleux ou contrefaçons</li>
                            </ul>
                            <div className="p-4 bg-white/60 rounded-xl border border-orange-200">
                                <p className="text-sm text-orange-800 leading-relaxed">
                                    <strong>Attention :</strong> Tout manquement à ces règles (arnaque, dropshipping, fraude)
                                    sous-entend l'engagement de votre responsabilité. Des poursuites judiciaires et des amendes
                                    sévères peuvent être appliquées.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lanceurs d'alerte / Whistleblower */}
                <section className="container mx-auto px-4 py-16 bg-slate-900 text-slate-50 rounded-3xl my-16 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">On a besoin de vous !</h2>
                            <p className="text-slate-300 text-lg">
                                Vous êtes un lanceur d'alerte ? Vous souhaitez nous aider à améliorer nos critères ou nous signaler
                                des dérives ? Votre contribution est essentielle à l'intégrité de Markethic.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="p-4 bg-primary/20 rounded-full">
                                    <Lock className="w-8 h-8 text-primary" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-semibold mb-2">Communications Sécurisées</h3>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Pour garantir un anonymat total et sécuriser nos échanges, nous mettons à votre disposition
                                        un portail dédié sur le réseau TOR.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                                        <code className="bg-black/40 px-4 py-2 rounded-lg text-primary font-mono text-sm border border-primary/30 flex-1 text-center sm:text-left">
                                            markethic-secure.onion
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-transparent border-white/20 text-white hover:bg-white/10"
                                            onClick={() => navigator.clipboard.writeText('markethic-secure.onion')}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copier le lien
                                        </Button>
                                    </div>
                                    <p className="mt-4 text-xs text-slate-500 italic">
                                        * Disponible uniquement via le navigateur TOR
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Rejoignez le mouvement</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Ensemble, redonnons vie à notre commerce local et créons une économie
                            plus juste et plus humaine.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login">
                                <Button size="lg" className="px-8">
                                    S'inscrire maintenant
                                </Button>
                            </Link>
                            <Link href="/shop">
                                <Button variant="outline" size="lg" className="px-8">
                                    Explorer les boutiques locales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
