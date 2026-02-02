"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Search, MessageCircle } from "lucide-react";
import Link from "next/link";

const FAQ_SECTIONS = [
    {
        title: "Commandes",
        questions: [
            {
                q: "Comment passer une commande sur Markethic ?",
                a: "Pour passer une commande, parcourez notre catalogue, ajoutez les produits souhaités à votre panier, puis suivez les étapes de paiement. Vous devez créer un compte ou vous connecter pour finaliser votre achat."
            },
            {
                q: "Puis-je modifier ou annuler ma commande ?",
                a: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation, avant qu'elle ne soit préparée par l'artisan. Contactez-nous rapidement via la page contact."
            },
            {
                q: "Comment suivre ma commande ?",
                a: "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pouvez également consulter l'état de vos commandes dans votre espace personnel."
            }
        ]
    },
    {
        title: "Livraison",
        questions: [
            {
                q: "Quels sont les délais de livraison ?",
                a: "Les délais varient selon l'artisan et le type de produit. En général, comptez 3 à 7 jours ouvrés pour les produits en stock, et 1 à 3 semaines pour les créations sur commande."
            },
            {
                q: "Livrez-vous à l'international ?",
                a: "Actuellement, nous livrons principalement en France métropolitaine. Certains artisans proposent la livraison dans d'autres pays européens. Vérifiez les options disponibles lors du paiement."
            },
            {
                q: "Combien coûte la livraison ?",
                a: "Les frais de livraison sont calculés en fonction du poids, de la taille et de la destination. Ils sont affichés avant la validation de votre commande. La livraison est offerte à partir de 80€ d'achat."
            }
        ]
    },
    {
        title: "Retours & Remboursements",
        questions: [
            {
                q: "Quelle est votre politique de retour ?",
                a: "Vous disposez de 14 jours à compter de la réception pour retourner un produit. L'article doit être dans son état d'origine, non utilisé et dans son emballage. Les produits personnalisés ne sont pas éligibles au retour."
            },
            {
                q: "Comment effectuer un retour ?",
                a: "Connectez-vous à votre compte, accédez à vos commandes, et sélectionnez 'Demander un retour'. Vous recevrez les instructions par email. Les frais de retour sont à votre charge sauf en cas de produit défectueux."
            },
            {
                q: "Quand serai-je remboursé ?",
                a: "Le remboursement est effectué sous 14 jours après réception et vérification du produit retourné. Le montant sera crédité sur le moyen de paiement utilisé lors de l'achat."
            }
        ]
    },
    {
        title: "Vendeurs & Artisans",
        questions: [
            {
                q: "Comment devenir vendeur sur Markethic ?",
                a: "Créez un compte, puis accédez à 'Ouvrir ma boutique' dans votre profil. Remplissez les informations requises sur votre activité et vos créations. Notre équipe vérifiera votre demande sous 48h."
            },
            {
                q: "Quelles sont les commissions prélevées ?",
                a: "Markethic prélève une commission de 8% sur chaque vente, couvrant la plateforme, le support et les outils de gestion. Aucun frais d'inscription ni abonnement mensuel."
            },
            {
                q: "Comment sont sélectionnés les artisans ?",
                a: "Nous vérifions l'authenticité artisanale, la qualité des produits et l'engagement éco-responsable de chaque vendeur. Seuls les créateurs répondant à nos critères sont acceptés."
            }
        ]
    },
    {
        title: "Paiement & Sécurité",
        questions: [
            {
                q: "Quels moyens de paiement acceptez-vous ?",
                a: "Nous acceptons les cartes bancaires (Visa, Mastercard, CB), PayPal et Apple Pay. Tous les paiements sont sécurisés et cryptés."
            },
            {
                q: "Mes données de paiement sont-elles sécurisées ?",
                a: "Absolument. Nous utilisons le protocole SSL et ne stockons jamais vos données de carte bancaire. Les transactions sont traitées par des partenaires certifiés PCI-DSS."
            },
            {
                q: "Proposez-vous le paiement en plusieurs fois ?",
                a: "Le paiement en 3 fois sans frais est disponible pour les commandes supérieures à 100€, via notre partenaire de paiement."
            }
        ]
    }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-secondary/10 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
            >
                <span className="font-medium text-foreground pr-4">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-foreground/40 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && (
                <div className="pb-4 pr-8">
                    <p className="text-foreground/60 leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSections = FAQ_SECTIONS.map(section => ({
        ...section,
        questions: section.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(section => section.questions.length > 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-secondary/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
                            <HelpCircle className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            Questions Fréquentes
                        </h1>
                        <p className="text-lg text-foreground/60 mb-8">
                            Trouvez rapidement les réponses à vos questions sur Markethic.
                        </p>

                        {/* Search */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Rechercher une question..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    {filteredSections.length > 0 ? (
                        <div className="space-y-8">
                            {filteredSections.map((section) => (
                                <div key={section.title} className="bg-white rounded-2xl border border-secondary/20 overflow-hidden">
                                    <h2 className="text-xl font-heading font-bold text-foreground px-6 py-4 bg-secondary/5 border-b border-secondary/10">
                                        {section.title}
                                    </h2>
                                    <div className="px-6">
                                        {section.questions.map((item, index) => (
                                            <FAQItem key={index} question={item.q} answer={item.a} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-foreground/60">Aucune question ne correspond à votre recherche.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact CTA */}
            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-xl mx-auto bg-accent/5 rounded-3xl p-8 text-center border border-accent/10">
                    <MessageCircle className="w-10 h-10 text-accent mx-auto mb-4" />
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                        Vous n'avez pas trouvé votre réponse ?
                    </h2>
                    <p className="text-foreground/60 mb-6">
                        Notre équipe est là pour vous aider. Contactez-nous directement.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors"
                    >
                        Nous contacter
                    </Link>
                </div>
            </div>
        </div>
    );
}
