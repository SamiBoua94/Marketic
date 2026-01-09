
'use client';

import { useState, useRef } from 'react';
import { Camera, Save, X, Trash } from 'lucide-react';

interface ProductData {
    id?: string;
    name: string;
    description: string;
    price: string;
    stock: string;
    images?: string[];
    category?: string;
}

interface ProductFormProps {
    initialData?: ProductData;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ProductData>(() => {
        if (!initialData) {
            return {
                name: '',
                description: '',
                price: '',
                stock: '',
                images: [],
                category: ''
            };
        }

        // Handle images parsing if string (DB format)
        let processedImages: string[] = [];
        if (typeof initialData.images === 'string') {
            try {
                processedImages = JSON.parse(initialData.images);
            } catch (e) {
                console.error("Failed to parse images", e);
                processedImages = [];
            }
        } else if (Array.isArray(initialData.images)) {
            processedImages = initialData.images;
        }

        return {
            ...initialData,
            price: String(initialData.price),
            stock: String(initialData.stock),
            images: processedImages
        };
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            // Append new image to the list
            setData(prev => ({
                ...prev,
                images: [...(prev.images || []), resData.url]
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erreur lors du téléchargement de l\'image');
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setData(prev => ({
            ...prev,
            images: prev.images?.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = initialData ? 'PUT' : 'POST';
            const url = initialData ? `/api/products/${initialData.id}` : '/api/products';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Une erreur est survenue');
            }

            onSuccess();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {initialData ? 'Modifier l\'article' : 'Ajouter un article'}
                </h2>
                <button type="button" onClick={onCancel} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Images Section */}
                <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">Photos</label>
                    <div className="flex flex-wrap gap-4">
                        {data.images?.map((img, index) => (
                            <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group">
                                <img src={img} alt={`Produit ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                            <Camera size={24} />
                            <span className="text-xs mt-1">Ajouter</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nom de l'article</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Prix (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Stock</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData(prev => ({ ...prev, stock: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Catégorie</label>
                    <select
                        value={data.category || ''}
                        onChange={(e) => setData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Sélectionner une catégorie</option>
                        <option value="ceramique">Céramique</option>
                        <option value="textile">Textile</option>
                        <option value="menuiserie">Menuiserie</option>
                        <option value="bijoux">Bijoux</option>
                        <option value="decoration">Décoration</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Enregistrement...' : (
                            <>
                                <Save size={18} />
                                Enregistrer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
