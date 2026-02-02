"use client";

import {
    Headphones,
    BookOpen,
    MessageSquare,
    FileText,
    TrendingUp,
    Package,
    HelpCircle,
    Mail,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SUPPORT_RESOURCES = [
    {
        icon: BookOpen,
        title: "Guide du Vendeur",
        description: "Apprenez à optimiser votre boutique et vos ventes.",
        href: "#",
        color: "bg-blue-500/10 text-blue-600"
    },
    {
        icon: Package,
        title: "Gestion des Commandes",
        description: "Tout sur le traitement et l'expédition de vos commandes.",
        href: "/shop/orders",
        color: "bg-green-500/10 text-green-600"
    },
    {
        icon: TrendingUp,
        title: "Statistiques & Analytics",
        description: "Analysez vos performances et améliorez vos résultats.",
        href: "/data-analysis",
        color: "bg-purple-500/10 text-purple-600"
    },
    {
        icon: FileText,
        title: "Conditions Vendeurs",
        description: "Consultez les termes et conditions pour les vendeurs.",
        href: "#",
        color: "bg-amber-500/10 text-amber-600"
    }
];

const FAQ_VENDEURS = [
    {
        q: "Comment modifier les informations de ma boutique ?",
        a: "Accédez à 'Gérer ma boutique' depuis votre profil, puis cliquez sur 'Modifier' pour mettre à jour vos informations."
    },
    {
        q: "Comment ajouter un nouveau produit ?",
        a: "Dans votre espace boutique, cliquez sur 'Ajouter un article'. Remplissez les informations requises et ajoutez des photos de qualité."
    },
    {
        q: "Quand suis-je payé pour mes ventes ?",
        a: "Les paiements sont effectués tous les 15 jours sur votre compte bancaire, après déduction de la commission de 8%."
    },
    {
        q: "Comment gérer un retour client ?",
        a: "Les demandes de retour apparaissent dans vos commandes. Acceptez ou refusez selon les conditions de votre politique de retour."
    }
];

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-secondary/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                            <Headphones className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            Centre de Support Vendeurs
                        </h1>
                        <p className="text-lg text-foreground/60">
                            Ressources, guides et assistance pour gérer votre boutique avec succès.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto space-y-12">

                    {/* Resources Grid */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                            Ressources Vendeurs
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {SUPPORT_RESOURCES.map((resource) => {
                                const Icon = resource.icon;
                                return (
                                    <Link key={resource.title} href={resource.href} className="group">
                                        <div className="bg-white rounded-2xl border border-secondary/20 p-6 h-full hover:shadow-lg hover:border-primary/20 transition-all">
                                            <div className={`w-12 h-12 rounded-xl ${resource.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {resource.title}
                                            </h3>
                                            <p className="text-sm text-foreground/60">
                                                {resource.description}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* FAQ Vendeurs */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <HelpCircle className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-heading font-bold text-foreground">
                                Questions Fréquentes Vendeurs
                            </h2>
                        </div>
                        <div className="bg-white rounded-2xl border border-secondary/20 divide-y divide-secondary/10">
                            {FAQ_VENDEURS.map((item, index) => (
                                <div key={index} className="p-6">
                                    <h3 className="font-medium text-foreground mb-2">{item.q}</h3>
                                    <p className="text-foreground/60">{item.a}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="/faq" className="text-primary font-medium hover:underline">
                                Voir toutes les questions →
                            </Link>
                        </div>
                    </section>

                    {/* Contact Support */}
                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-8">
                            <MessageSquare className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                                Chat en Direct
                            </h3>
                            <p className="text-foreground/60 mb-6">
                                Discutez avec notre équipe support en temps réel.
                            </p>
                            <p className="text-sm text-foreground/50 mb-4">
                                Disponible : Lun-Ven, 9h-18h
                            </p>
                            <Button disabled className="opacity-50">
                                Bientôt disponible
                            </Button>
                        </div>

                        <div className="bg-accent/5 rounded-2xl border border-accent/10 p-8">
                            <Mail className="w-10 h-10 text-accent mb-4" />
                            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                                Support par Email
                            </h3>
                            <p className="text-foreground/60 mb-6">
                                Envoyez-nous votre demande, nous répondons sous 24h.
                            </p>
                            <a
                                href="mailto:vendeurs@markethic.fr"
                                className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
                            >
                                vendeurs@markethic.fr
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="bg-secondary/5 rounded-3xl p-8 border border-secondary/10">
                        <h2 className="text-xl font-heading font-bold text-foreground mb-6 text-center">
                            Actions Rapides
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/shop">
                                <Button variant="outline">
                                    Gérer ma boutique
                                </Button>
                            </Link>
                            <Link href="/shop/orders">
                                <Button variant="outline">
                                    Voir mes commandes
                                </Button>
                            </Link>
                            <Link href="/data-analysis">
                                <Button variant="outline">
                                    Mes statistiques
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button>
                                    Contacter le support
                                </Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
