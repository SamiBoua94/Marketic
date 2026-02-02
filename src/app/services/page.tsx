"use client";

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
    ScanBarcode,
    Check
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function ServicesPage() {
    return (
        <AnimatedBackground variant="subtle" className="min-h-screen">
            <main className="pb-20">
                {/* Hero Section */}
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 bg-white/50 backdrop-blur-md rounded-full text-primary font-bold shadow-sm border border-secondary/20 animate-fade-in-up">
                            <Sparkles className="w-4 h-4" />
                            <span>Propulsez votre business</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-8 text-foreground animate-fade-in-up animation-delay-100">
                            Des outils puissants pour
                            <span className="block text-primary mt-2">votre réussite</span>
                        </h1>
                        <p className="text-xl text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
                            Markethic ne se contente pas de vous offrir une vitrine. Nous vous donnons les moyens de concurrencer les géants, avec éthique.
                        </p>
                    </div>
                </div>

                {/* Services Principaux */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-10 w-1.5 bg-primary rounded-full shadow-glow" />
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Services Premium</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Trustation (Featured) */}
                            <div className="group relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-primary/20 shadow-soft hover:shadow-glow-accent transition-all duration-500 overflow-hidden lg:col-span-1 lg:row-span-2 flex flex-col">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/20 transition-colors" />

                                <div className="relative z-10 flex-1">
                                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                                        <ShieldCheck className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-heading font-bold mb-4">Trustation</h3>
                                    <p className="text-foreground/70 mb-8 text-lg leading-relaxed">
                                        Certification blockchain de vos produits. Instaurez une confiance totale avec vos clients grâce à une traçabilité irréprochable.
                                    </p>
                                    <ul className="space-y-4 mb-10">
                                        {['Certificat d\'authenticité', 'Historique de production', 'Preuve d\'impact carbone'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 font-medium text-foreground/80">
                                                <div className="p-1 rounded-full bg-green-100 text-green-600">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link href="/trustation" className="mt-auto">
                                    <Button className="w-full py-7 text-lg rounded-xl shadow-glow group-hover:translate-x-1 transition-all">
                                        Accéder à Trustation
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Livraison */}
                            <div className="group relative bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Truck className="w-7 h-7" />
                                    </div>
                                    <span className="px-3 py-1 bg-secondary/10 text-secondary-foreground text-xs font-bold rounded-full uppercase tracking-wider border border-secondary/10">
                                        Bientôt
                                    </span>
                                </div>
                                <h3 className="text-2xl font-heading font-bold mb-3">Logistique Verte</h3>
                                <p className="text-foreground/60 mb-8 leading-relaxed">
                                    Une solution logistique intégrée et décarbonée pour expédier vos produits partout en France.
                                </p>
                                <Button disabled variant="outline" className="w-full py-6 rounded-xl border-dashed bg-transparent hover:bg-secondary/5">
                                    <Lock className="w-4 h-4 mr-2 opacity-50" />
                                    En développement
                                </Button>
                            </div>

                            {/* Scored */}
                            <div className="group relative bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <ScanBarcode className="w-7 h-7" />
                                    </div>
                                    <span className="px-3 py-1 bg-secondary/10 text-secondary-foreground text-xs font-bold rounded-full uppercase tracking-wider border border-secondary/10">
                                        Bientôt
                                    </span>
                                </div>
                                <h3 className="text-2xl font-heading font-bold mb-3">Scored</h3>
                                <p className="text-foreground/60 mb-8 leading-relaxed">
                                    Le "Yuka" des objets. Analysez et affichez le score environnemental de vos produits en un scan.
                                </p>
                                <Button disabled variant="outline" className="w-full py-6 rounded-xl border-dashed bg-transparent hover:bg-secondary/5">
                                    <Lock className="w-4 h-4 mr-2 opacity-50" />
                                    En développement
                                </Button>
                            </div>

                            {/* Publicité (Placeholder for balance) */}
                            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem] p-8 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-2">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md text-purple-600 mb-4 md:mb-0">
                                        <Megaphone className="w-10 h-10" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-heading font-bold mb-2 text-purple-900"> Boostez votre visibilité</h3>
                                        <p className="text-purple-800/70 max-w-lg">
                                            Profitez de nos outils publicitaires éthiques pour mettre en avant vos produits auprès d'une communauté engagée.
                                        </p>
                                    </div>
                                    <Button variant="ghost" className="md:ml-auto rounded-xl text-purple-700 bg-white/50 hover:bg-white">
                                        En savoir plus
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Agents Section */}
                <section className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Vos Agents IA</h2>
                                <p className="text-foreground/60 text-lg">
                                    Une équipe d'experts virtuels pour vous épauler au quotidien.
                                </p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AgentCard
                                icon={<Calculator className="w-6 h-6" />}
                                title="Expert Comptable"
                                description="Gestion automatisée de votre facturation, déclarations et suivi de trésorerie en temps réel."
                                color="bg-orange-100 text-orange-600"
                            />
                            <AgentCard
                                icon={<BarChart3 className="w-6 h-6" />}
                                title="Data Analyst"
                                description="Analyse prédictive de vos ventes pour optimiser vos stocks et anticiper les tendances."
                                color="bg-indigo-100 text-indigo-600"
                            />
                            <AgentCard
                                icon={<Megaphone className="w-6 h-6" />}
                                title="Responsable Marketing"
                                description="Création de campagnes sur mesure et rédaction automatique de fiches produits SEO."
                                color="bg-pink-100 text-pink-600"
                            />
                            <AgentCard
                                icon={<Briefcase className="w-6 h-6" />}
                                title="Chef de Projet"
                                description="Organisation de vos tâches, rappels automatiques et suivi de production."
                                color="bg-cyan-100 text-cyan-600"
                            />
                            <AgentCard
                                icon={<FileText className="w-6 h-6" />}
                                title="Assistant Admin"
                                description="Génération et classement de vos documents officiels. Zéro paperasse."
                                color="bg-slate-100 text-slate-600"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </AnimatedBackground>
    );
}

function AgentCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
    return (
        <div className="group bg-white/40 backdrop-blur-sm border border-white/40 rounded-3xl p-8 hover:bg-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>

            <div className="flex items-center justify-between mb-3">
                <h4 className="font-heading font-bold text-xl text-foreground">{title}</h4>
                <Lock className="w-4 h-4 text-foreground/30" />
            </div>

            <p className="text-foreground/60 leading-relaxed mb-6">
                {description}
            </p>

            <div className="pt-4 border-t border-secondary/10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/5 text-[10px] font-bold uppercase tracking-wider text-foreground/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    En développement
                </div>
            </div>
        </div>
    );
}
