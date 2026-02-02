"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedBackground, FloatingLeaves } from "@/components/ui/AnimatedBackground";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Form submitted:", formData);

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    return (
        <AnimatedBackground variant="subtle" className="min-h-screen">
            {/* Hero Section */}
            <div className="relative pt-20 pb-12 mb-8 border-b border-primary/5">
                <FloatingLeaves />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block animate-fade-in-up">
                            Nous sommes là pour vous
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in-up animation-delay-100">
                            Contactez <span className="text-gradient">Markethic</span>
                        </h1>
                        <p className="text-xl text-foreground/60 leading-relaxed animate-fade-in-up animation-delay-200">
                            Une question, une suggestion ou besoin d'aide ?
                            Notre équipe passionnée est à votre écoute.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8 items-start">

                        {/* Contact Info */}
                        <div className="space-y-6 lg:sticky lg:top-8 animate-fade-in-up animation-delay-300">
                            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-secondary/20 p-8 shadow-soft hover:shadow-glow transition-all">
                                <h2 className="font-heading font-bold text-xl text-foreground mb-8">
                                    Nos coordonnées
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start group">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-primary">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground mb-1">Email</p>
                                            <a href="mailto:contact@markethic.fr" className="text-foreground/70 hover:text-primary transition-colors">
                                                contact@markethic.fr
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start group">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-primary">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground mb-1">Téléphone</p>
                                            <a href="tel:+33123456789" className="text-foreground/70 hover:text-primary transition-colors">
                                                01 23 45 67 89
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start group">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-primary">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground mb-1">Bureaux</p>
                                            <p className="text-foreground/70">
                                                123 Rue de l'Artisanat<br />
                                                75001 Paris, France
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start group">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-primary">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground mb-1">Horaires</p>
                                            <p className="text-foreground/70">
                                                Lun - Ven : 9h - 18h<br />
                                                Sam : 10h - 16h
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="bg-gradient-to-br from-accent/10 to-transparent rounded-[2rem] border border-accent/10 p-8 hover-lift">
                                <MessageCircle className="w-10 h-10 text-accent mb-4" />
                                <h3 className="font-heading font-bold text-foreground text-lg mb-2">
                                    Besoin d'aide immédiate ?
                                </h3>
                                <p className="text-foreground/60 mb-6 leading-relaxed">
                                    La réponse à votre question se trouve peut-être déjà dans notre foire aux questions.
                                </p>
                                <Link
                                    href="/faq"
                                    className="inline-flex items-center text-accent font-bold hover:underline"
                                >
                                    Consulter la FAQ
                                    <span className="ml-2 text-xl">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2 animate-fade-in-up animation-delay-500">
                            <div className="bg-white rounded-[2.5rem] border border-secondary/20 p-8 md:p-10 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-primary/5 to-transparent rounded-bl-full" />

                                <h2 className="font-heading font-bold text-2xl text-foreground mb-8 relative z-10">
                                    Envoyez-nous un message
                                </h2>

                                {isSubmitted ? (
                                    <div className="text-center py-20 animate-fade-in-scale">
                                        <div className="inline-flex p-6 bg-green-100 rounded-full mb-6 shadow-glow animate-bounce-soft">
                                            <Send className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-3">
                                            Message envoyé ! 🎉
                                        </h3>
                                        <p className="text-lg text-foreground/60 mb-8 max-w-md mx-auto">
                                            Merci de nous avoir contactés. Nous reviendrons vers vous dans les 24h ouvrées.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl px-8 py-6 text-base"
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setFormData({ name: "", email: "", subject: "", message: "" });
                                            }}
                                        >
                                            Envoyer un autre message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-foreground ml-1">
                                                    Nom complet
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-6 py-4 bg-secondary/5 border-2 border-transparent focus:border-primary/20 hover:bg-secondary/10 rounded-2xl focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                                    placeholder="Jean Dupont"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-foreground ml-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-6 py-4 bg-secondary/5 border-2 border-transparent focus:border-primary/20 hover:bg-secondary/10 rounded-2xl focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                                    placeholder="jean@exemple.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-foreground ml-1">
                                                Sujet
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-6 py-4 bg-secondary/5 border-2 border-transparent focus:border-primary/20 hover:bg-secondary/10 rounded-2xl focus:outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">Sélectionnez un sujet</option>
                                                    <option value="order">📦 Question sur une commande</option>
                                                    <option value="product">🛍️ Question sur un produit</option>
                                                    <option value="seller">🤝 Devenir vendeur</option>
                                                    <option value="partnership">💼 Partenariat</option>
                                                    <option value="bug">🐛 Signaler un bug</option>
                                                    <option value="other">✨ Autre</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-foreground ml-1">
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full px-6 py-4 bg-secondary/5 border-2 border-transparent focus:border-primary/20 hover:bg-secondary/10 rounded-2xl focus:outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                                                placeholder="Comment pouvons-nous vous aider aujourd'hui ?"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto px-10 py-6 text-base rounded-xl shadow-glow hover:shadow-glow-accent transition-all hover:-translate-y-1"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-3" />
                                                        Envoyer le message
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}
