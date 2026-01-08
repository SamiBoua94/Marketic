"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
    const router = useRouter();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = isLogin
            ? await login(email, password)
            : await register(email, password, name);

        setLoading(false);

        if (result.success) {
            router.push("/profile");
        } else {
            setError(result.error || "Une erreur s'est produite");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <span className="font-heading font-bold text-2xl text-foreground">
                        Markethic
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-secondary/20 p-8">
                    {/* Toggle */}
                    <div className="flex mb-8 bg-secondary/10 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(true); setError(""); }}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${isLogin
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-foreground/70 hover:text-foreground"
                                }`}
                        >
                            Connexion
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); setError(""); }}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${!isLogin
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-foreground/70 hover:text-foreground"
                                }`}
                        >
                            Inscription
                        </button>
                    </div>

                    <h1 className="text-2xl font-bold font-heading text-foreground mb-2">
                        {isLogin ? "Bon retour !" : "Rejoignez le mouvement"}
                    </h1>
                    <p className="text-foreground/70 text-sm mb-6">
                        {isLogin
                            ? "Connectez-vous pour accéder à votre espace."
                            : "Créez votre compte et commencez à vendre ou acheter local."}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                                    Nom complet
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jean Dupont"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                                Adresse email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vous@exemple.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        )}

                        <Button type="submit" size="lg" className="w-full gap-2 mt-2" disabled={loading}>
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Se connecter" : "Créer mon compte"}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {!isLogin && (
                        <p className="text-xs text-foreground/60 text-center mt-6">
                            En vous inscrivant, vous acceptez nos{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                                Conditions d&apos;utilisation
                            </Link>{" "}
                            et notre{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Politique de confidentialité
                            </Link>
                            .
                        </p>
                    )}
                </div>

                {/* Artisan CTA */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-foreground/70">
                        Vous êtes artisan ?{" "}
                        <Link href="/artisans/register" className="text-accent font-medium hover:underline">
                            Créez votre boutique
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
