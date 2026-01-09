'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Mail, Phone, Upload, Pencil, Save, X, FileCheck } from 'lucide-react';

interface ShopData {
    id?: string;
    name: string;
    description: string;
    address: string;
    email: string;
    phone: string;
    profilePicture: string | null;
    bannerPicture: string | null;
    certificationPicture: string | null;
}

interface ShopFormProps {
    initialData?: ShopData;
    isEditing?: boolean;
    onSuccess: () => void;
}

export default function ShopForm({ initialData, onSuccess }: ShopFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Logic: 
    // If no initialData (creating), force Edit Mode.
    // If initialData (viewing), force View Mode (isEditMode = false).
    const [isEditMode, setIsEditMode] = useState(!initialData);

    const [data, setData] = useState<ShopData>(initialData || {
        name: '',
        description: '',
        address: '',
        email: '',
        phone: '',
        profilePicture: null,
        bannerPicture: null,
        certificationPicture: null
    });

    const bannerInputRef = useRef<HTMLInputElement>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const certificationInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof ShopData) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            setLoading(true);
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const resData = await res.json();
            setData(prev => ({ ...prev, [field]: resData.url }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erreur lors du téléchargement de l\'image');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch('/api/shop', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Une erreur est survenue');
            }

            onSuccess();
            // Important: If we just created, the parent will re-fetch and pass new initialData.
            // But to avoid flicker or state issues, let's assume success means we should go to view mode.
            setIsEditMode(false);

        } catch (error: any) {
            alert("Erreur: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">

            {/* View/Edit Toggle Button (Only visible if we have a shop) */}
            {initialData && !isEditMode && (
                <div className="absolute top-4 right-4 z-20">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setIsEditMode(true); }}
                        className="p-2 bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-700 transition-all"
                        title="Modifier la boutique"
                    >
                        <Pencil size={20} />
                    </button>
                </div>
            )}

            {/* Banner Section */}
            <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800 group">
                {data.bannerPicture ? (
                    <img
                        src={data.bannerPicture}
                        alt="Bannière"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400">
                        {isEditMode ? <span className="text-sm">Ajouter une bannière</span> : <span className="text-sm">Aucune bannière</span>}
                    </div>
                )}

                {isEditMode && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => bannerInputRef.current?.click()}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 transition-all border border-white/20"
                        >
                            <Camera size={20} />
                        </button>
                        <input
                            type="file"
                            ref={bannerInputRef}
                            onChange={(e) => handleFileUpload(e, 'bannerPicture')}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                )}
            </div>

            {/* Profile Picture Section */}
            <div className="px-8 relative mb-8">
                <div className="absolute -top-16 left-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-md">
                            {data.profilePicture ? (
                                <img
                                    src={data.profilePicture}
                                    alt="Profil"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-zinc-400">
                                    <Camera size={32} />
                                </div>
                            )}
                        </div>
                        {isEditMode && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => profileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors border-2 border-white dark:border-zinc-900"
                                >
                                    <Camera size={16} />
                                </button>
                                <input
                                    type="file"
                                    ref={profileInputRef}
                                    onChange={(e) => handleFileUpload(e, 'profilePicture')}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-8 pt-4 space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                            {initialData ? data.name : (isEditMode ? 'Créer ma boutique' : 'Ma Boutique')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nom de la boutique</label>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Ma Super Boutique"
                                    required
                                />
                            ) : (
                                <p className="text-zinc-900 dark:text-zinc-100 py-2 font-medium">{data.name}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email professionnel</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-zinc-400" size={20} />
                                {isEditMode ? (
                                    <input
                                        type="email"
                                        value={data.email || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="contact@boutique.com"
                                    />
                                ) : (
                                    <p className="pl-10 py-2 text-zinc-900 dark:text-zinc-100">{data.email || '-'}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-zinc-400" size={20} />
                                {isEditMode ? (
                                    <input
                                        type="tel"
                                        value={data.phone || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="+33 6 12 34 56 78"
                                    />
                                ) : (
                                    <p className="pl-10 py-2 text-zinc-900 dark:text-zinc-100">{data.phone || '-'}</p>
                                )}
                            </div>
                        </div>

                        {/* Address Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Adresse</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-zinc-400" size={20} />
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        value={data.address || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="123 Rue du Commerce"
                                    />
                                ) : (
                                    <p className="pl-10 py-2 text-zinc-900 dark:text-zinc-100">{data.address || '-'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 mt-6">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                        {isEditMode ? (
                            <textarea
                                value={data.description || ''}
                                onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[100px]"
                                placeholder="Décrivez votre activité..."
                            />
                        ) : (
                            <p className="px-4 py-2 text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap border border-transparent">
                                {data.description || <span className="text-zinc-400 italic">Aucune description</span>}
                            </p>
                        )}
                    </div>

                    {/* Certification Section */}
                    <div className="mt-8">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">Certification</label>
                        <div className={`p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border ${isEditMode ? 'border-dashed border-zinc-300 dark:border-zinc-700' : 'border-zinc-100 dark:border-zinc-800'} flex flex-col items-center justify-center text-center transition-all`}>

                            {data.certificationPicture ? (
                                <div className="space-y-4 w-full">
                                    <img
                                        src={data.certificationPicture}
                                        alt="Certification"
                                        className="max-h-64 mx-auto rounded-lg shadow-sm"
                                    />
                                    {isEditMode && (
                                        <button
                                            type="button"
                                            onClick={() => certificationInputRef.current?.click()}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Remplacer le document
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mb-3 shadow-sm mx-auto">
                                        <FileCheck className="text-zinc-400" size={24} />
                                    </div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {isEditMode
                                            ? "Ajouter un document de certification (KBIS, etc...)"
                                            : "Aucune certification ajoutée"}
                                    </p>
                                    {isEditMode && (
                                        <button
                                            type="button"
                                            onClick={() => certificationInputRef.current?.click()}
                                            className="mt-4 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            Importer depuis l'ordinateur
                                        </button>
                                    )}
                                </>
                            )}
                            <input
                                type="file"
                                ref={certificationInputRef}
                                onChange={(e) => handleFileUpload(e, 'certificationPicture')}
                                className="hidden"
                                accept="image/*,application/pdf"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            type="button"
                            disabled
                            className="px-6 py-2.5 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
                        >
                            <span>+</span> Ajouter un article
                        </button>
                        <div className="flex-1"></div>

                        {isEditMode && (
                            <>
                                {initialData && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (initialData) setData(initialData); // Reset
                                            setIsEditMode(false);
                                        }}
                                        className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                >
                                    {loading ? <span className="animate-spin">⌛</span> : <Save size={18} />}
                                    {initialData ? 'Enregistrer' : 'Créer la boutique'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
