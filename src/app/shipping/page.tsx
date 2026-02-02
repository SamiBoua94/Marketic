"use client";

import { Truck, RotateCcw, Clock, MapPin, Package, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-secondary/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            Livraison & Retours
                        </h1>
                        <p className="text-lg text-foreground/60">
                            Tout ce que vous devez savoir sur nos conditions de livraison
                            et notre politique de retours.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Livraison Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Truck className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-foreground">Livraison</h2>
                        </div>

                        <div className="bg-white rounded-2xl border border-secondary/20 overflow-hidden">
                            {/* Délais */}
                            <div className="p-6 border-b border-secondary/10">
                                <div className="flex items-start gap-4">
                                    <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-foreground mb-2">Délais de livraison</h3>
                                        <ul className="space-y-2 text-foreground/70">
                                            <li>• <strong>Produits en stock :</strong> 3 à 7 jours ouvrés</li>
                                            <li>• <strong>Créations sur commande :</strong> 1 à 3 semaines selon l'artisan</li>
                                            <li>• <strong>Produits personnalisés :</strong> 2 à 4 semaines</li>
                                        </ul>
                                        <p className="mt-3 text-sm text-foreground/50">
                                            Les délais sont indicatifs et peuvent varier selon la disponibilité de l'artisan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Zones */}
                            <div className="p-6 border-b border-secondary/10">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-foreground mb-2">Zones de livraison</h3>
                                        <ul className="space-y-2 text-foreground/70">
                                            <li>• <strong>France métropolitaine :</strong> Tous les artisans</li>
                                            <li>• <strong>Corse & DOM-TOM :</strong> Selon les artisans (délais allongés)</li>
                                            <li>• <strong>Europe :</strong> Certains artisans uniquement</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Tarifs */}
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <Package className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-foreground mb-2">Frais de livraison</h3>
                                        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5" />
                                            <span className="font-medium">Livraison offerte à partir de 80€ d'achat</span>
                                        </div>
                                        <ul className="space-y-2 text-foreground/70">
                                            <li>• <strong>Standard :</strong> 4,90€ à 6,90€ selon le poids</li>
                                            <li>• <strong>Express (24-48h) :</strong> 9,90€ à 14,90€</li>
                                            <li>• <strong>Point relais :</strong> 3,90€ à 5,90€</li>
                                        </ul>
                                        <p className="mt-3 text-sm text-foreground/50">
                                            Les frais exacts sont calculés à la validation de votre commande.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Retours Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-accent/10 rounded-full">
                                <RotateCcw className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-foreground">Retours & Remboursements</h2>
                        </div>

                        <div className="bg-white rounded-2xl border border-secondary/20 overflow-hidden">
                            {/* Conditions */}
                            <div className="p-6 border-b border-secondary/10">
                                <h3 className="font-bold text-foreground mb-4">Conditions de retour</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 rounded-xl p-4">
                                        <h4 className="font-medium text-green-700 mb-2">✓ Éligible au retour</h4>
                                        <ul className="text-sm text-green-600 space-y-1">
                                            <li>• Article non utilisé</li>
                                            <li>• Emballage d'origine intact</li>
                                            <li>• Demande dans les 14 jours</li>
                                            <li>• Étiquettes présentes</li>
                                        </ul>
                                    </div>
                                    <div className="bg-red-50 rounded-xl p-4">
                                        <h4 className="font-medium text-red-700 mb-2">✗ Non éligible</h4>
                                        <ul className="text-sm text-red-600 space-y-1">
                                            <li>• Articles personnalisés</li>
                                            <li>• Produits sur-mesure</li>
                                            <li>• Denrées périssables</li>
                                            <li>• Articles descellés (hygiène)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Procédure */}
                            <div className="p-6 border-b border-secondary/10">
                                <h3 className="font-bold text-foreground mb-4">Comment retourner un article ?</h3>
                                <ol className="space-y-4">
                                    <li className="flex gap-4">
                                        <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">1</span>
                                        <div>
                                            <p className="font-medium text-foreground">Demandez un retour</p>
                                            <p className="text-sm text-foreground/60">Connectez-vous et accédez à vos commandes pour initier la demande.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">2</span>
                                        <div>
                                            <p className="font-medium text-foreground">Préparez votre colis</p>
                                            <p className="text-sm text-foreground/60">Emballez l'article dans son emballage d'origine si possible.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">3</span>
                                        <div>
                                            <p className="font-medium text-foreground">Expédiez le colis</p>
                                            <p className="text-sm text-foreground/60">Utilisez le bon de retour fourni ou envoyez à l'adresse indiquée.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">4</span>
                                        <div>
                                            <p className="font-medium text-foreground">Recevez votre remboursement</p>
                                            <p className="text-sm text-foreground/60">Le remboursement est effectué sous 14 jours après réception.</p>
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            {/* Note importante */}
                            <div className="p-6 bg-amber-50">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-amber-700 mb-1">Bon à savoir</h3>
                                        <p className="text-sm text-amber-600">
                                            Les frais de retour sont à votre charge, sauf en cas de produit défectueux
                                            ou non conforme à la description. Conservez votre preuve d'envoi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact CTA */}
                    <div className="bg-secondary/5 rounded-3xl p-8 text-center border border-secondary/10">
                        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
                            Une question sur votre commande ?
                        </h2>
                        <p className="text-foreground/60 mb-6">
                            Notre équipe est disponible pour vous aider.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                        >
                            Nous contacter
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
