"use client";

import { useState } from "react";
import { ShieldCheck, Store, Package, UserPlus, ArrowLeft, Trash2, Edit2, X, CheckCircle2, Lock, Users, Eye, Globe, Phone, MapPin, Info, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUser {
    id: string;
    pseudo: string;
    email: string;
    role: 'Administrateur' | 'Support';
    createdAt: string;
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'welcome' | 'users' | 'roles' | 'shops' | 'articles'>('welcome');

    // User Management State
    const [users, setUsers] = useState<AdminUser[]>([
        { id: '1', pseudo: 'Admin_Sami', email: 'sami@marketic.fr', role: 'Administrateur', createdAt: '12/01/2026' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

    // Security State
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationPassword, setVerificationPassword] = useState('');
    const [pendingAction, setPendingAction] = useState<{ type: 'edit' | 'delete' | 'delete_shop', user?: AdminUser | string, id?: string } | null>(null);

    // Shops State
    const [shops, setShops] = useState([
        {
            id: '1',
            name: 'Ma Boutique Bio',
            description: 'Produits issus de l\'agriculture biologique et locale.',
            address: '12 rue de la Paix',
            city: 'Paris',
            postalCode: '75002',
            legalStatus: 'SARL',
            email: 'contact@bio.fr',
            phone: '01 23 45 67 89',
            siret: '123 456 789 00012',
            instagram: '@maboutiquebio',
            facebook: 'maboutiquebio',
            tags: '["Bio", "Local", "Éthique"]',
            createdAt: '12/01/2026'
        },
        {
            id: '2',
            name: 'Éco-Artisanat',
            description: 'Artisanat fait main avec des matériaux recyclés.',
            address: '45 avenue Verte',
            city: 'Lyon',
            postalCode: '69001',
            legalStatus: 'Auto-entrepreneur',
            email: 'artis@eco.fr',
            phone: '04 56 78 90 12',
            siret: '987 654 321 00045',
            createdAt: '13/01/2026'
        },
    ]);
    const [selectedShop, setSelectedShop] = useState<any>(null);
    const [isShopModalOpen, setIsShopModalOpen] = useState(false);

    // Articles State
    const [articleFilter, setArticleFilter] = useState<'pending' | 'accepted' | 'refused' | 'reported'>('pending');

    // Form State
    const [formData, setFormData] = useState({
        pseudo: '',
        email: '',
        password: '',
        role: 'Support' as AdminUser['role']
    });

    const handleOpenModal = (user?: AdminUser) => {
        if (user) {
            setPendingAction({ type: 'edit', user });
            setIsVerifying(true);
        } else {
            setEditingUser(null);
            setFormData({ pseudo: '', email: '', password: '', role: 'Support' });
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id: string) => {
        setPendingAction({ type: 'delete', user: id });
        setIsVerifying(true);
    };

    const confirmSecurity = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation de vérification du mot de l'admin actuel
        if (verificationPassword.length > 0) {
            const action = pendingAction;
            setVerificationPassword('');
            setIsVerifying(false);
            setPendingAction(null);

            if (action?.type === 'edit') {
                const user = action.user as AdminUser;
                setEditingUser(user);
                setFormData({
                    pseudo: user.pseudo,
                    email: user.email,
                    password: '',
                    role: user.role
                });
                setIsModalOpen(true);
            } else if (action?.type === 'delete') {
                const id = action.user as string;
                setUsers(users.filter(u => u.id !== id));
            } else if (action?.type === 'delete_shop') {
                const id = action.id as string;
                setShops(shops.filter(s => s.id !== id));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
        } else {
            const newUser: AdminUser = {
                id: Math.random().toString(36).substr(2, 9),
                ...formData,
                createdAt: new Date().toLocaleDateString('fr-FR')
            };
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC]">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
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

                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab('users')}
                                    className={`w-full justify-start gap-4 h-12 px-4 transition-all duration-200 group border border-transparent ${activeTab === 'users' ? 'bg-primary/10 text-primary border-primary/10' : 'hover:bg-primary/5 hover:text-primary hover:border-primary/10'}`}
                                >
                                    <Users className={`w-5 h-5 ${activeTab === 'users' ? 'text-primary' : 'text-foreground/40 group-hover:text-primary'}`} />
                                    <span className="font-semibold">Gestion des utilisateurs</span>
                                </Button>
                            </nav>
                        </div>
                    </aside>

                    {/* Zone de Contenu Principale */}
                    <main className="flex-1">
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-secondary/10 min-h-[600px]">
                            {activeTab === 'welcome' && (
                                <div className="h-full flex flex-col justify-center items-center text-center py-12">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                                        Bienvenue sur <span className="text-primary">MarkAdmin</span>
                                    </h1>
                                    <p className="text-lg text-foreground/60 max-w-md leading-relaxed">
                                        Gérez les accès, les boutiques et le catalogue depuis votre interface sécurisée.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'roles' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-secondary/10 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Gestion des rôles</h2>
                                            <p className="text-foreground/60">Gérez les privilèges et les permissions des utilisateurs.</p>
                                        </div>
                                        <Button
                                            onClick={() => handleOpenModal()}
                                            className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            Nouvel utilisateur
                                        </Button>
                                    </div>

                                    {/* Table des utilisateurs */}
                                    <div className="overflow-x-auto border border-secondary/10 rounded-2xl">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-[#F8FAFC]">
                                                <tr>
                                                    <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Utilisateur</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Rôle</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Date Création</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-secondary/10">
                                                {users.map((user) => (
                                                    <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-foreground">{user.pseudo}</span>
                                                                <span className="text-xs text-foreground/40">{user.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Administrateur' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                                'bg-green-50 text-green-700 border border-green-100'
                                                                }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-foreground/50">{user.createdAt}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleOpenModal(user)}
                                                                    className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(user.id)}
                                                                    className="p-2 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'shops' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-secondary/10 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Gestion des boutiques</h2>
                                            <p className="text-foreground/60">Gérez et modérez les boutiques enregistrées sur la plateforme.</p>
                                        </div>
                                    </div>

                                    {/* Table des boutiques */}
                                    <div className="overflow-x-auto border border-secondary/10 rounded-2xl">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-[#F8FAFC]">
                                                <tr>
                                                    <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Boutique</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Email Contact</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Date Création</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-secondary/10">
                                                {shops.map((shop) => (
                                                    <tr key={shop.id} className="hover:bg-secondary/5 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                                    <Store className="w-5 h-5" />
                                                                </div>
                                                                <span className="font-semibold text-foreground">{shop.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-foreground/60">{shop.email}</td>
                                                        <td className="px-6 py-4 text-sm text-foreground/50">{shop.createdAt}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedShop(shop);
                                                                        setIsShopModalOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/10"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    Détails
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setPendingAction({ type: 'delete_shop', id: shop.id });
                                                                        setIsVerifying(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Supprimer
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {shops.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-12 text-center text-foreground/40 italic">
                                                            Aucune boutique n'a été créée pour le moment.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'articles' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-secondary/10 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Gestion des articles</h2>
                                            <p className="text-foreground/60">Modérez les articles publiés sur la plateforme.</p>
                                        </div>
                                    </div>

                                    {/* Articles Status Filter Buttons */}
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        <button
                                            onClick={() => setArticleFilter('pending')}
                                            className={`flex-1 min-w-[150px] max-w-[250px] h-14 rounded-2xl border-2 transition-all duration-300 font-bold flex items-center justify-center gap-3 ${articleFilter === 'pending'
                                                ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-lg shadow-amber-500/10'
                                                : 'bg-white border-secondary/10 text-foreground/40 hover:border-amber-200 hover:text-amber-600'
                                                }`}
                                        >
                                            En attente
                                        </button>
                                        <button
                                            onClick={() => setArticleFilter('accepted')}
                                            className={`flex-1 min-w-[150px] max-w-[250px] h-14 rounded-2xl border-2 transition-all duration-300 font-bold flex items-center justify-center gap-3 ${articleFilter === 'accepted'
                                                ? 'bg-green-50 border-green-500 text-green-700 shadow-lg shadow-green-500/10'
                                                : 'bg-white border-secondary/10 text-foreground/40 hover:border-green-200 hover:text-green-600'
                                                }`}
                                        >
                                            Acceptés
                                        </button>
                                        <button
                                            onClick={() => setArticleFilter('refused')}
                                            className={`flex-1 min-w-[150px] max-w-[250px] h-14 rounded-2xl border-2 transition-all duration-300 font-bold flex items-center justify-center gap-3 ${articleFilter === 'refused'
                                                ? 'bg-red-50 border-red-500 text-red-700 shadow-lg shadow-red-500/10'
                                                : 'bg-white border-secondary/10 text-foreground/40 hover:border-red-200 hover:text-red-600'
                                                }`}
                                        >
                                            Refusés
                                        </button>
                                    </div>

                                    {/* Articles List Placeholder */}
                                    <div className="bg-secondary/2 rounded-3xl border-2 border-dashed border-secondary/20 p-20 flex flex-col items-center justify-center text-center">
                                        <div className={`p-5 rounded-full shadow-sm mb-6 ${articleFilter === 'pending' ? 'bg-amber-100 text-amber-600' :
                                            articleFilter === 'accepted' ? 'bg-green-100 text-green-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                            <Package className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">
                                            {articleFilter === 'pending' ? 'Aucun article en attente' :
                                                articleFilter === 'accepted' ? 'Aucun article accepté' :
                                                    'Aucun article refusé'}
                                        </h3>
                                        <p className="text-foreground/40 max-w-xs">
                                            La liste des articles apparaîtra ici après modération.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Modal de Vérification de Sécurité */}
            {isVerifying && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-secondary/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-secondary/10 flex items-center justify-between bg-red-50/50">
                            <div className="flex items-center gap-2 text-red-600">
                                <Lock className="w-5 h-5" />
                                <h3 className="text-lg font-bold">Sécurité requise</h3>
                            </div>
                            <button onClick={() => { setIsVerifying(false); setPendingAction(null); setVerificationPassword(''); }} className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-foreground/40" />
                            </button>
                        </div>

                        <form onSubmit={confirmSecurity} className="p-8 space-y-6">
                            <p className="text-sm text-foreground/60 text-center">
                                Pour modifier ou supprimer un rôle, veuillez saisir <strong>votre mot de passe</strong> administrateur pour confirmer.
                            </p>

                            <div className="space-y-2">
                                <input
                                    type="password"
                                    required
                                    autoFocus
                                    value={verificationPassword}
                                    onChange={(e) => setVerificationPassword(e.target.value)}
                                    placeholder="Votre mot de passe"
                                    className="w-full h-12 px-4 rounded-xl border border-secondary/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-center"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => { setIsVerifying(false); setPendingAction(null); setVerificationPassword(''); }}
                                    className="flex-1 rounded-xl h-12"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 rounded-xl h-12 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                                >
                                    Confirmer
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Création/Édition */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-secondary/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-secondary/10 flex items-center justify-between bg-primary/5">
                            <h3 className="text-xl font-bold text-foreground">
                                {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-foreground/40" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/60 ml-1">Rôle</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminUser['role'] })}
                                        className="w-full h-12 px-4 rounded-xl border border-secondary/20 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="Administrateur">Administrateur</option>
                                        <option value="Support">Support</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/60 ml-1">Pseudo</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.pseudo}
                                        onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                                        placeholder="Pseudo"
                                        className="w-full h-12 px-4 rounded-xl border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/60 ml-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Email"
                                        className="w-full h-12 px-4 rounded-xl border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/60 ml-1">Mot de passe</label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={editingUser ? "Laisser vide si inchangé" : "••••••••"}
                                        className="w-full h-12 px-4 rounded-xl border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-xl h-12"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 rounded-xl h-12 bg-primary text-white shadow-lg shadow-primary/20 gap-2"
                                >
                                    {editingUser ? <Edit2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {editingUser ? 'Mettre à jour' : 'Enregistrer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal Détails Boutique */}
            {isShopModalOpen && selectedShop && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-secondary/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
                        <div className="p-6 border-b border-secondary/10 flex items-center justify-between bg-primary/5 sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-3 text-primary">
                                <Store className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Détails de la boutique</h3>
                            </div>
                            <button onClick={() => { setIsShopModalOpen(false); setSelectedShop(null); }} className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-foreground/40" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-8 space-y-8">
                            {/* Header Info */}
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <Store className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold text-foreground">{selectedShop.name}</h4>
                                    <p className="text-foreground/60 italic leading-relaxed">
                                        "{selectedShop.description || 'Aucune description fournie.'}"
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {selectedShop.tags ? JSON.parse(selectedShop.tags).map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-secondary/10 text-foreground/60 rounded-full text-xs font-medium">
                                                #{tag}
                                            </span>
                                        )) : <span className="text-xs text-foreground/40 italic">Aucun tag</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Contact & Legal */}
                                <div className="space-y-6">
                                    <h5 className="text-sm font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        Informations Générales
                                    </h5>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-foreground/40 font-semibold">Email Contact</p>
                                                <p className="text-sm font-medium">{selectedShop.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-foreground/40 font-semibold">Téléphone</p>
                                                <p className="text-sm font-medium">{selectedShop.phone || 'Non renseigné'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-foreground/40 font-semibold">Statut Juridique & SIRET</p>
                                                <p className="text-sm font-medium">{selectedShop.legalStatus || 'N/A'} - {selectedShop.siret || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Social */}
                                <div className="space-y-6">
                                    <h5 className="text-sm font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Localisation & Réseaux
                                    </h5>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-foreground/40 font-semibold">Adresse Siège</p>
                                                <p className="text-sm font-medium leading-tight">
                                                    {selectedShop.address}<br />
                                                    {selectedShop.postalCode} {selectedShop.city}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            {selectedShop.instagram && (
                                                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-600 hover:text-white transition-colors cursor-pointer">
                                                    <Instagram className="w-5 h-5" />
                                                </div>
                                            )}
                                            {selectedShop.facebook && (
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                                                    <Facebook className="w-5 h-5" />
                                                </div>
                                            )}
                                            {selectedShop.twitter && (
                                                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-600 hover:text-white transition-colors cursor-pointer">
                                                    <Twitter className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-secondary/10 bg-secondary/5 flex justify-end">
                            <Button
                                onClick={() => { setIsShopModalOpen(false); setSelectedShop(null); }}
                                className="px-8 rounded-xl bg-foreground text-white hover:bg-foreground/90"
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
