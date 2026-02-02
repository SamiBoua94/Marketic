'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Instagram, Facebook, Twitter, Loader2, Check } from 'lucide-react';

export function Footer() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState('');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !email.includes('@')) {
            setError('Veuillez entrer un email valide');
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Implement actual newsletter API
            // For now, simulate a successful subscription
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsSubscribed(true);
            setEmail('');
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Social media links
    const socialLinks = {
        instagram: 'https://instagram.com/markethic',
        facebook: 'https://facebook.com/markethic',
        twitter: 'https://twitter.com/markethic'
    };

    return (
        <footer className="bg-secondary/10 border-t border-secondary/20 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Leaf className="w-6 h-6 text-primary" />
                            <span className="font-heading font-bold text-xl">Markethic</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            La place de marché éthique qui connecte les artisans locaux avec les consommateurs responsables.
                            Favorisons le circuit court, ensemble.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Découvrir</h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                            <li><Link href="/new" className="hover:text-primary transition-colors">Nouveautés</Link></li>
                            <li><Link href="/artisans" className="hover:text-primary transition-colors">Nos Artisans</Link></li>
                            <li><Link href="/categories" className="hover:text-primary transition-colors">Catégories</Link></li>
                            <li><Link href="/gift-cards" className="hover:text-primary transition-colors">Cartes Cadeaux</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Aide & Info</h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                            <li><Link href="/about" className="hover:text-primary transition-colors">Qui sommes-nous ?</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Livraison & Retours</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Rejoignez le mouvement</h4>
                        <p className="text-sm text-foreground/80 mb-4">Recevez nos dernières découvertes et actualités locales.</p>

                        {isSubscribed ? (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                                <Check className="w-5 h-5" />
                                <span className="text-sm font-medium">Merci pour votre inscription !</span>
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletterSubmit}>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-background border border-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[60px]"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'OK'
                                        )}
                                    </button>
                                </div>
                                {error && (
                                    <p className="text-red-500 text-xs mt-2">{error}</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-secondary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-foreground/60">
                        © {new Date().getFullYear()} Markethic. Tous droits réservés.
                    </p>
                    <div className="flex gap-6 text-foreground/60">
                        <a
                            href={socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="hover:text-accent transition-colors"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href={socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="hover:text-accent transition-colors"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href={socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="hover:text-accent transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
