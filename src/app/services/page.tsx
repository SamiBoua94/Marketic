"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    ShieldCheck,
    Truck,
    Calculator,
    BarChart3,
    Megaphone,
    Briefcase,
    FileText,
    Lock,
    ArrowRight,
    ScanBarcode
} from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <main className="container mx-auto px-4 py-20">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>Propulsez votre business</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Découvrez nos services pour développer votre business
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Bénéficiez de réductions à nos services grâce aux ventes et achats réalisés sur Markethic.
                    </p>
                </div>

                {/* Services Section */}
                <section className="max-w-6xl mx-auto mb-20">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-8 w-1 bg-primary rounded-full" />
                        <h2 className="text-3xl font-bold">Nos Services</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Trustation */}
                        <div className="group relative bg-white rounded-3xl p-8 border border-secondary/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

                            <div className="relative">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Trustation</h3>
                                <p className="text-muted-foreground mb-8">
                                    Certifié et Authentifié vos produits pour instaurer une confiance totale avec vos clients.
                                </p>
                                <Link href="/trustation">
                                    <Button className="w-full group/btn py-6 text-lg">
                                        Accéder à Trustation
                                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Livraison */}
                        <div className="group relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-secondary/20 shadow-sm transition-all duration-300">
                            <div className="relative">
                                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Truck className="w-8 h-8 text-secondary" />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-2xl font-bold">Livraison</h3>
                                    <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold rounded-full uppercase tracking-wider">
                                        Prochainement
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-8">
                                    Une solution logistique intégrée pour expédier vos produits partout en France en un clic.
                                </p>
                                <Button disabled variant="outline" className="w-full py-6 text-lg border-dashed">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Bientôt disponible
                                </Button>
                            </div>
                        </div>

                        {/* Scored */}
                        <div className="group relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-secondary/20 shadow-sm transition-all duration-300">
                            <div className="relative">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                                    <ScanBarcode className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-2xl font-bold">Scored</h3>
                                    <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold rounded-full uppercase tracking-wider">
                                        Prochainement
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-8">
                                    Notre partenaire Scored vous permet de voir les spécifications des produits. C'est le Yuka des objets.
                                </p>
                                <Button disabled variant="outline" className="w-full py-6 text-lg border-dashed">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Bientôt disponible
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Agents Section */}
                <section className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-1 bg-accent rounded-full" />
                        <h2 className="text-3xl font-bold">Nos agents d'aide</h2>
                    </div>
                    <p className="text-muted-foreground mb-10 ml-4 italic">
                        Des agents IA spécialisés pour vous accompagner au quotidien.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Agent Comptable */}
                        <AgentCard
                            icon={<Calculator className="w-6 h-6" />}
                            title="Agent Comptable"
                            description="Gestion simplifiée de votre comptabilité et facturation."
                        />
                        {/* Agent Analyste */}
                        <AgentCard
                            icon={<BarChart3 className="w-6 h-6" />}
                            title="Agent Analyste"
                            description="Analyse de vos ventes et prévisions de stocks."
                        />
                        {/* Agent Marketing */}
                        <AgentCard
                            icon={<Megaphone className="w-6 h-6" />}
                            title="Agent Marketing"
                            description="Création de campagnes et optimisation de visibilité."
                        />
                        {/* Agent Gestion de votre projet */}
                        <AgentCard
                            icon={<Briefcase className="w-6 h-6" />}
                            title="Agent Gestion de projet"
                            description="Organisation de vos tâches et suivi de production."
                        />
                        {/* Agent Administratif */}
                        <AgentCard
                            icon={<FileText className="w-6 h-6" />}
                            title="Agent Administratif"
                            description="Automatisation de vos démarches et documents."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

function AgentCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-white/40 backdrop-blur-sm border border-secondary/10 rounded-2xl p-6 hover:bg-white/60 transition-colors group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-lg">{title}</h4>
                <span className="text-[10px] bg-secondary/10 text-secondary-foreground px-2 py-0.5 rounded-full font-bold uppercase">
                    Bientôt
                </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
            </p>
            <div className="mt-4 pt-4 border-t border-secondary/5 flex items-center text-xs text-primary font-medium opacity-50">
                <Lock className="w-3 h-3 mr-1" />
                Développement en cours
            </div>
        </div>
    );
}
