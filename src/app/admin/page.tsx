"use client";

import { useState } from "react";
import { ShieldCheck, Store, Package, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'welcome' | 'roles' | 'shops' | 'articles'>('welcome');

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
                                    onClick={() => setActiveTab('roles')}
                                    className={`w-full justify-start gap-4 h-12 px-4 transition-all duration-200 group border border-transparent ${activeTab === 'roles' ? 'bg-primary/10 text-primary border-primary/10' : 'hover:bg-primary/5 hover:text-primary hover:border-primary/10'}`}
                                >
                                    <ShieldCheck className={`w-5 h-5 ${activeTab === 'roles' ? 'text-primary' : 'text-foreground/40 group-hover:text-primary'}`} />
                                    <span className="font-semibold">Gestion des rôles</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab('shops')}
                                    className={`w-full justify-start gap-4 h-12 px-4 transition-all duration-200 group border border-transparent ${activeTab === 'shops' ? 'bg-primary/10 text-primary border-primary/10' : 'hover:bg-primary/5 hover:text-primary hover:border-primary/10'}`}
                                >
                                    <Store className={`w-5 h-5 ${activeTab === 'shops' ? 'text-primary' : 'text-foreground/40 group-hover:text-primary'}`} />
                                    <span className="font-semibold">Gestion des boutiques</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab('articles')}
                                    className={`w-full justify-start gap-4 h-12 px-4 transition-all duration-200 group border border-transparent ${activeTab === 'articles' ? 'bg-primary/10 text-primary border-primary/10' : 'hover:bg-primary/5 hover:text-primary hover:border-primary/10'}`}
                                >
                                    <Package className={`w-5 h-5 ${activeTab === 'articles' ? 'text-primary' : 'text-foreground/40 group-hover:text-primary'}`} />
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
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-secondary/10 min-h-[600px]">
                            {activeTab === 'welcome' ? (
                                <div className="h-full flex flex-col justify-center items-center text-center py-12">
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
                            ) : activeTab === 'roles' ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-secondary/10 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Gestion des rôles</h2>
                                            <p className="text-foreground/60">Gérez les privilèges et les permissions des utilisateurs.</p>
                                        </div>
                                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300">
                                            <UserPlus className="w-5 h-5" />
                                            Nouvel utilisateur
                                        </Button>
                                    </div>

                                    <div className="bg-secondary/5 rounded-2xl border-2 border-dashed border-secondary/20 p-12 flex flex-col items-center justify-center text-center">
                                        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                            <ShieldCheck className="w-8 h-8 text-secondary/40" />
                                        </div>
                                        <p className="text-foreground/40 font-medium">Liste des utilisateurs et rôles bientôt disponible.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center py-12">
                                    <p className="text-foreground/40 font-medium italic">Section en cours de développement...</p>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setActiveTab('welcome')}
                                        className="mt-4 gap-2 text-primary"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
                                    </Button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
