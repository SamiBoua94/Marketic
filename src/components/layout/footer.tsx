import Link from 'next/link';
import { Leaf, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
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
                            <li><Link href="/new" className="hover:text-primary">Nouveautés</Link></li>
                            <li><Link href="/artisans" className="hover:text-primary">Nos Artisans</Link></li>
                            <li><Link href="/categories" className="hover:text-primary">Catégories</Link></li>
                            <li><Link href="/gift-cards" className="hover:text-primary">Cartes Cadeaux</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Aide & Info</h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                            <li><Link href="/about" className="hover:text-primary">Qui sommes-nous ?</Link></li>
                            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary">Livraison & Retours</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Rejoignez le mouvement</h4>
                        <p className="text-sm text-foreground/80 mb-4">Recevez nos dernières découvertes et actualités locales.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="flex-1 bg-background border border-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-secondary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-foreground/60">
                        © {new Date().getFullYear()} Markethic. Tous droits réservés.
                    </p>
                    <div className="flex gap-6 text-foreground/60">
                        <Instagram className="w-5 h-5 hover:text-accent transition-colors cursor-pointer" />
                        <Facebook className="w-5 h-5 hover:text-accent transition-colors cursor-pointer" />
                        <Twitter className="w-5 h-5 hover:text-accent transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
