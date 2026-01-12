"use client";

import { ShieldCheck, Store, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC]">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Navigation de Gauche */}
                    <aside className="w-full lg:w-80 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/10">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-6 px-2">
                                Menu Principal
                            </h2>
                            <nav className="space-y-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-4 h-12 px-4 hover:bg-primary/5 hover:text-primary transition-all duration-200 group border border-transparent hover:border-primary/10"
                                >
                                    <ShieldCheck className="w-5 h-5 text-foreground/40 group-hover:text-primary" />
                                    <span className="font-semibold">Gestion des rôles</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-4 h-12 px-4 hover:bg-primary/5 hover:text-primary transition-all duration-200 group border border-transparent hover:border-primary/10"
                                >
                                    <Store className="w-5 h-5 text-foreground/40 group-hover:text-primary" />
                                    <span className="font-semibold">Gestion des boutiques</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-4 h-12 px-4 hover:bg-primary/5 hover:text-primary transition-all duration-200 group border border-transparent hover:border-primary/10"
                                >
                                    <Package className="w-5 h-5 text-foreground/40 group-hover:text-primary" />
                                    <span className="font-semibold">Gestion des articles</span>
                                </Button>
                            </nav>
                        </div>

                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                            <p className="text-sm text-primary/80 font-medium leading-relaxed">
                                Connecté en tant qu'administrateur. Vous avez accès à tous les contrôles système.
                            </p>
                        </div>
                    </aside>

                    {/* Zone de Contenu Principale */}
                    <main className="flex-1">
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-secondary/10 min-h-[500px] flex flex-col justify-center items-center text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                                Bienvenue sur <span className="text-primary">MarkAdmin</span>
                            </h1>
                            <p className="text-lg text-foreground/60 max-w-md leading-relaxed">
                                Sélectionnez une option dans le menu de gauche pour commencer à gérer votre plateforme.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
