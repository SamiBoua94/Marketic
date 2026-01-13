"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Store, Package, Plus, Trash2, Edit2, X, CheckCircle2, Lock, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUser {
    id: string;
    name: string;
    email: string;
    description?: string;
    role?: 'Administrateur' | 'Support';
    createdAt: string;
}

const AVAILABLE_ROLES = [
    { id: 'admin', label: 'Administrateur', color: 'red' },
    { id: 'support', label: 'Support', color: 'green' }
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'welcome' | 'users' | 'roles' | 'shops' | 'articles'>('welcome');
    const [isLoading, setIsLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

    // Load users on mount
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/v1/users');
            if (response.ok) {
                const result = await response.json();
                const users = result.data || [];
                setAllUsers(users);
                // Filter admin users (those with description 'Admin' or 'Support')
                const adminList = users.filter((u: any) => u.description === 'Admin' || u.description === 'Support');
                setAdminUsers(adminList);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Security State
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationPassword, setVerificationPassword] = useState('');
    const [pendingDelete, setPendingDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Support' as 'Administrateur' | 'Support'
    });

    const openModal = (user?: AdminUser) => {
        console.log('openModal called');
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.description === 'Admin' ? 'Administrateur' : 'Support'
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'Support' });
        }
        setErrorMessage('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handleSubmit called with formData:', formData);
        
        if (!formData.name.trim()) {
            setErrorMessage('Le nom est requis');
            return;
        }
        
        if (!formData.email.includes('@')) {
            setErrorMessage('Email invalide');
            return;
        }

        setIsSubmitting(true);
        
        try {
            if (editingUser) {
                // Update user
                const response = await fetch(`/api/v1/users/${editingUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        ...(formData.password && { password: formData.password }),
                        role: formData.role
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || error.message || 'Erreur lors de la mise à jour');
                }
            } else {
                // Create new user
                if (!formData.password) {
                    setErrorMessage('Le mot de passe est requis');
                    setIsSubmitting(false);
                    return;
                }

                const response = await fetch('/api/v1/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || error.message || 'Erreur lors de la création');
                }
            }

            // Reload users
            await loadUsers();
            setIsModalOpen(false);
        } catch (error: any) {
            setErrorMessage(error.message || 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (verificationPassword.length > 0 && pendingDelete) {
            try {
                const response = await fetch(`/api/v1/users/${pendingDelete}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }

                // Reload users
                await loadUsers();
                setVerificationPassword('');
                setIsVerifying(false);
                setPendingDelete(null);
            } catch (error: any) {
                setErrorMessage(error.message || 'Erreur lors de la suppression');
            }
        }
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

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-secondary/10 min-h-[600px]">
                            {/* Roles Tab - Gestion des comptes admin/support */}
                            {activeTab === 'roles' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-secondary/10 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Gestion des rôles</h2>
                                            <p className="text-foreground/60">Créez des comptes administrateur et support.</p>
                                        </div>
                                        <Button
                                            onClick={() => openModal()}
                                            className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Nouveau compte
                                        </Button>
                                    </div>

                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-12">
                                            <p className="text-foreground/60">Chargement...</p>
                                        </div>
                                    ) : adminUsers.length === 0 ? (
                                        <div className="bg-secondary/2 rounded-3xl border-2 border-dashed border-secondary/20 p-20 flex flex-col items-center justify-center text-center">
                                            <div className="p-5 rounded-full shadow-sm mb-6 bg-amber-100 text-amber-600">
                                                <ShieldCheck className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">Aucun compte créé</h3>
                                            <p className="text-foreground/40 max-w-xs">
                                                Créez un compte Admin ou Support en cliquant sur "Nouveau compte".
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border border-secondary/10 rounded-2xl">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-[#F8FAFC]">
                                                    <tr>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Nom</th>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Email</th>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Rôle</th>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Date Création</th>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-secondary/10">
                                                    {adminUsers.map((user) => (
                                                        <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <span className="font-semibold text-foreground">{user.name}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-foreground/60">{user.email}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.description === 'Admin' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                                                    {user.description === 'Admin' ? 'Administrateur' : 'Support'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-foreground/50">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        onClick={() => openModal(user)}
                                                                        className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setPendingDelete(user.id);
                                                                            setIsVerifying(true);
                                                                        }}
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
                                    )}
                                </div>
                            )}

                            {/* Users Tab - Tous les utilisateurs */}
                            {activeTab === 'users' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-secondary/10 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h2>
                                            <p className="text-foreground/60">Tous les utilisateurs créés dans la base de données.</p>
                                        </div>
                                    </div>

                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-12">
                                            <p className="text-foreground/60">Chargement...</p>
                                        </div>
                                    ) : allUsers.length === 0 ? (
                                        <div className="bg-secondary/2 rounded-3xl border-2 border-dashed border-secondary/20 p-20 flex flex-col items-center justify-center text-center">
                                            <div className="p-5 rounded-full shadow-sm mb-6 bg-amber-100 text-amber-600">
                                                <Users className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">Aucun utilisateur</h3>
                                            <p className="text-foreground/40 max-w-xs mb-6">
                                                Aucun utilisateur n'a été créé pour le moment.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border border-secondary/10 rounded-2xl">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-[#F8FAFC]">
                                                    <tr>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Nom</th>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Email</th>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Type</th>
                                                        <th className="px-6 py-4 text-sm font-semibold text-foreground/60 border-b border-secondary/10">Date Création</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-secondary/10">
                                                    {allUsers.map((user) => (
                                                        <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <span className="font-semibold text-foreground">{user.name}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-foreground/60">{user.email}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.description === 'Admin' ? 'bg-red-50 text-red-700 border border-red-100' : user.description === 'Support' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                                                    {user.description === 'Admin' ? 'Administrateur' : user.description === 'Support' ? 'Support' : 'Client'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-foreground/50">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Shops & Articles placeholders */}
                            {activeTab === 'shops' && <div className="text-center py-12"><p className="text-foreground/60">Gestion des boutiques (à configurer)</p></div>}
                            {activeTab === 'articles' && <div className="text-center py-12"><p className="text-foreground/60">Gestion des articles (à configurer)</p></div>}
                            {activeTab === 'welcome' && (
                                <div className="h-full flex flex-col justify-center items-center text-center py-12">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                        Bienvenue sur <span className="text-primary">MarkAdmin</span>
                                    </h1>
                                    <p className="text-lg text-foreground/60 max-w-md">
                                        Gérez les accès, les boutiques et le catalogue.
                                    </p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Security Verification Modal */}
            {isVerifying && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-secondary/10 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-secondary/10 flex items-center justify-between bg-red-50/50">
                            <div className="flex items-center gap-2 text-red-600">
                                <Lock className="w-5 h-5" />
                                <h3 className="text-lg font-bold">Sécurité requise</h3>
                            </div>
                            <button onClick={() => { setIsVerifying(false); setPendingDelete(null); setVerificationPassword(''); }} className="p-2 hover:bg-secondary/10 rounded-full">
                                <X className="w-5 h-5 text-foreground/40" />
                            </button>
                        </div>

                        <form onSubmit={confirmDelete} className="p-8 space-y-6">
                            {errorMessage && (
                                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <p className="text-sm text-foreground/60 text-center">
                                Confirmer en saisissant votre mot de passe administrateur.
                            </p>

                            <input
                                type="password"
                                required
                                autoFocus
                                value={verificationPassword}
                                onChange={(e) => setVerificationPassword(e.target.value)}
                                placeholder="Votre mot de passe"
                                className="w-full h-12 px-4 rounded-xl border border-secondary/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-center"
                            />

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => { setIsVerifying(false); setPendingDelete(null); }} className="flex-1 rounded-xl h-12">
                                    Annuler
                                </Button>
                                <Button type="submit" className="flex-1 rounded-xl h-12 bg-red-600 hover:bg-red-700 text-white">
                                    Supprimer
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Account Modal - Create/Edit Admin or Support */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-secondary/10 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-secondary/10 flex items-center justify-between bg-primary/5">
                            <h3 className="text-xl font-bold text-foreground">
                                {editingUser ? 'Modifier le compte' : 'Nouveau compte'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary/10 rounded-full">
                                <X className="w-5 h-5 text-foreground/40" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {errorMessage && (
                                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/60 ml-1">Rôle</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Administrateur' | 'Support' })}
                                    className="w-full h-12 px-4 rounded-xl border border-secondary/20 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="Support">Support</option>
                                    <option value="Administrateur">Administrateur</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/60 ml-1">Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nom complet"
                                    className="w-full h-12 px-4 rounded-xl border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/60 ml-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Email"
                                    className="w-full h-12 px-4 rounded-xl border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/60 ml-1">Mot de passe</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingUser ? "Laisser vide si inchangé" : "••••••••"}
                                    className="w-full h-12 px-4 rounded-xl border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl h-12" disabled={isSubmitting}>
                                    Annuler
                                </Button>
                                <Button type="submit" className="flex-1 rounded-xl h-12 bg-primary text-white gap-2" disabled={isSubmitting}>
                                    <CheckCircle2 className="w-4 h-4" />
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
