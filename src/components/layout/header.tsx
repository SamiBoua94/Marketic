"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, Leaf, User, LogOut, ChevronDown, Store, Package, Headphones, MessageSquare, BarChart3, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { useState, useRef, useEffect } from 'react';

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();
    const { totalItems } = useCart();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Handle search submission - navigate to search page
    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-secondary/20 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                        <Leaf className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                        Markethic
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        Notre Mission
                    </Link>
                    <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                        Catalogue
                    </Link>
                    <Link href="/boutiques" className="text-sm font-medium hover:text-primary transition-colors">
                        Boutiques
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <div className={`relative flex items-center transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-48 sm:w-64' : 'w-10'}`}>
                        <button
                            onClick={() => {
                                if (isSearchOpen) setSearchQuery('');
                                setIsSearchOpen(!isSearchOpen);
                            }}
                            className={`p-2 rounded-full hover:bg-secondary/10 transition-colors z-10 ${isSearchOpen ? 'text-primary' : 'text-foreground/70'}`}
                        >
                            <Search className="w-5 h-5" />
                            <span className="sr-only">Rechercher</span>
                        </button>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Rechercher boutiques, produits..."
                            className={`absolute left-0 pl-10 pr-4 py-2 w-full bg-secondary/5 border border-secondary/20 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${isSearchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                        />
                    </div>

                    <Link href="/cart">
                        <Button variant="ghost" size="sm" className="relative">
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                            <span className="sr-only">Panier</span>
                        </Button>
                    </Link>

                    {loading ? (
                        <div className="w-10 h-10 rounded-full bg-secondary/20 animate-pulse" />
                    ) : user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary/10 transition-colors"
                            >
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        className="w-9 h-9 rounded-full object-cover border-2 border-primary/30"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                                <ChevronDown className={`w-4 h-4 text-foreground/60 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-secondary/20 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-secondary/10">
                                        <p className="font-medium text-foreground">{user.name}</p>
                                        <p className="text-sm text-foreground/60">{user.email}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Mon Profil
                                    </Link>
                                    <Link
                                        href="/follows"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 transition-colors"
                                    >
                                        <Heart className="w-4 h-4" />
                                        Mes boutiques suivies
                                    </Link>
                                    <Link
                                        href="/shop"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 transition-colors"
                                    >
                                        <Store className="w-4 h-4" />
                                        {user.hasShop ? "Gérer ma boutique" : "Ouvrir ma boutique"}
                                    </Link>
                                    {user.hasShop && (
                                        <Link
                                            href="/data-analysis"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 transition-colors"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            Data Analysis
                                        </Link>
                                    )}
                                    <Link
                                        href="/orders"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 transition-colors"
                                    >
                                        <Package className="w-4 h-4" />
                                        Commande
                                    </Link>
                                    {user.hasShop && (
                                        <Link
                                            href="/support"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 transition-colors"
                                        >
                                            <Headphones className="w-4 h-4" />
                                            Support
                                        </Link>
                                    )}
                                    <Link
                                        href="/services"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 transition-colors"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Services
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Se déconnecter
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="primary" size="sm" className="hidden md:inline-flex">
                                Connexion
                            </Button>
                        </Link>
                    )}

                    <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-secondary/20 bg-background/95 backdrop-blur-md">
                    <nav className="container mx-auto px-4 py-4 space-y-3">
                        <Link href="/about" className="block text-sm font-medium hover:text-primary transition-colors py-2">
                            Notre Mission
                        </Link>
                        <Link href="/products" className="block text-sm font-medium hover:text-primary transition-colors py-2">
                            Catalogue
                        </Link>
                        <Link href="/boutiques" className="block text-sm font-medium hover:text-primary transition-colors py-2">
                            Boutiques
                        </Link>

                        {!user && (
                            <>
                                <div className="border-t border-secondary/10 pt-3 mt-3 space-y-2">
                                    <Link href="/login" className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                        Connexion
                                    </Link>
                                    <Link href="/login" className="block w-full text-center px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors">
                                        Inscription
                                    </Link>
                                </div>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
