
'use client';

import { useState, useRef } from 'react';
import { Camera, Save, X, Trash, Plus, Tag, Info, Upload, Award } from 'lucide-react';

interface ProductOption {
    name: string;
    values: string[];
}

interface ProductData {
    id?: string;
    name: string;
    description: string;
    price: string;
    stock: string;
    images?: string[];
    tags?: string[];
    options?: ProductOption[];
    productInfo?: ProductInfo;
}

interface ProductInfo {
    materials: string;
    materialSources: string;
    purchaseLocation: string;
    handmadeOrPurchased: string;
    supplyChainSteps: string;
    traceabilityDocuments: string;
    materialsList?: string[];
    additionalInfo?: string;
    proofs?: string[];
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
                tags: [],
                options: [],
                productInfo: {
                    materials: '',
                    materialSources: '',
                    purchaseLocation: '',
                    handmadeOrPurchased: '',
                    supplyChainSteps: '',
                    traceabilityDocuments: '',
                    materialsList: [],
                    additionalInfo: '',
                    proofs: []
                }
            };
        }

        // Parse existing fields if they are strings
        let processedImages: string[] = [];
        if (typeof initialData.images === 'string') {
            try { processedImages = JSON.parse(initialData.images); } catch (e) { processedImages = []; }
        } else if (Array.isArray(initialData.images)) {
            processedImages = initialData.images;
        }

        let processedTags: string[] = [];
        if (typeof initialData.tags === 'string') {
            try { processedTags = JSON.parse(initialData.tags); } catch (e) { processedTags = []; }
        } else if (Array.isArray(initialData.tags)) {
            processedTags = initialData.tags;
        }

        let processedInfo: ProductInfo = {
            materials: '',
            materialSources: '',
            purchaseLocation: '',
            handmadeOrPurchased: '',
            supplyChainSteps: '',
            traceabilityDocuments: '',
            proofs: []
        };
        if (typeof initialData.productInfo === 'string') {
            try { processedInfo = JSON.parse(initialData.productInfo); } catch (e) { }
        } else if (initialData.productInfo) {
            processedInfo = initialData.productInfo;
        }

        return {
            ...initialData,
            price: String(initialData.price),
            stock: String(initialData.stock),
            images: processedImages,
            tags: processedTags,
            productInfo: processedInfo
        };
    });

    const [showProductInfo, setShowProductInfo] = useState(false);
    const [newTag, setNewTag] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const proofInputRef = useRef<HTMLInputElement>(null);



    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isProof: boolean = false) => {
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

            if (isProof) {
                setData(prev => {
                    const newInfo = {
                        ...prev.productInfo!,
                        proofs: [...(prev.productInfo?.proofs || []), resData.url]
                    };
                    return {
                        ...prev,
                        productInfo: newInfo
                    };
                });
            } else {
                setData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), resData.url]
                }));
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Erreur lors du téléchargement');
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

    const removeProof = (indexToRemove: number) => {
        setData(prev => {
            const newInfo = {
                ...prev.productInfo!,
                proofs: prev.productInfo?.proofs?.filter((_, index) => index !== indexToRemove) || []
            };
            return {
                ...prev,
                productInfo: newInfo
            };
        });
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            if (!data.tags?.includes(newTag.trim())) {
                setData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), newTag.trim()]
                }));
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setData(prev => ({
            ...prev,
            tags: prev.tags?.filter(t => t !== tagToRemove)
        }));
    };

    const handleInfoChange = (field: keyof ProductInfo, value: string) => {
        setData(prev => {
            const newInfo = {
                ...prev.productInfo!,
                [field]: value
            };
            return {
                ...prev,
                productInfo: newInfo
            };
        });
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
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 max-h-[90vh] overflow-y-auto">
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
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">Photos du produit</label>
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
                            className="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
                        >
                            <Camera size={24} />
                            <span className="text-xs mt-1">Ajouter</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e, false)}
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
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Ex: Vase en céramique bleue"
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
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Stock</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData(prev => ({ ...prev, stock: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>
                </div>

                {/* Tags (Replacement for Category) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {data.tags?.map((tag, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-emerald-900 dark:hover:text-emerald-200">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={addTag}
                            placeholder="Ajouter un tag (Entrée)"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>

                {/* Options Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Options (couleur, taille, etc.)</label>
                    <div className="space-y-3">
                        {data.options?.map((option, optIndex) => (
                            <div key={optIndex} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={option.name}
                                        onChange={(e) => {
                                            const newOptions = [...(data.options || [])];
                                            newOptions[optIndex] = { ...option, name: e.target.value };
                                            setData(prev => ({ ...prev, options: newOptions }));
                                        }}
                                        placeholder="Nom de l'option (ex: Couleur)"
                                        className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setData(prev => ({ ...prev, options: prev.options?.filter((_, i) => i !== optIndex) }))}
                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    >
                                        <Trash size={14} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {option.values.map((val, valIndex) => (
                                        <span key={valIndex} className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-xs">
                                            {val}
                                            <button type="button" onClick={() => {
                                                const newOptions = [...(data.options || [])];
                                                newOptions[optIndex] = { ...option, values: option.values.filter((_, vi) => vi !== valIndex) };
                                                setData(prev => ({ ...prev, options: newOptions }));
                                            }}>
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder="+ valeur"
                                        className="px-2 py-1 text-xs border border-dashed border-zinc-300 dark:border-zinc-600 rounded bg-transparent outline-none w-20"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const value = (e.target as HTMLInputElement).value.trim();
                                                if (value) {
                                                    const newOptions = [...(data.options || [])];
                                                    newOptions[optIndex] = { ...option, values: [...option.values, value] };
                                                    setData(prev => ({ ...prev, options: newOptions }));
                                                    (e.target as HTMLInputElement).value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setData(prev => ({ ...prev, options: [...(prev.options || []), { name: '', values: [] }] }))}
                            className="w-full py-2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-500 hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <Plus size={16} /> Ajouter une option
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]"
                        placeholder="Décrivez votre produit..."
                        required
                    />
                </div>

                {/* Product Info Section Toggle */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                    <button
                        type="button"
                        onClick={() => setShowProductInfo(!showProductInfo)}
                        className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Info className="text-emerald-600" size={24} />
                            <div className="text-left">
                                <span className="font-semibold block">Informations produit</span>
                                <span className="text-xs text-zinc-500">Transparence et traçabilité pour vos clients</span>
                            </div>
                        </div>
                        <Plus className={`transition-transform ${showProductInfo ? 'rotate-45' : ''}`} />
                    </button>

                    {showProductInfo && (
                        <div className="mt-4 space-y-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Matières</label>
                                <input
                                    type="text"
                                    value={data.productInfo?.materials}
                                    onChange={(e) => handleInfoChange('materials', e.target.value)}
                                    placeholder="Ex: Coton bio, Bois flotté..."
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Source des matériaux</label>
                                <input
                                    type="text"
                                    value={data.productInfo?.materialSources}
                                    onChange={(e) => handleInfoChange('materialSources', e.target.value)}
                                    placeholder="Ex: Fournisseur local, Recyclage..."
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Où avez-vous acheté le produit de base ?</label>
                                <input
                                    type="text"
                                    value={data.productInfo?.purchaseLocation}
                                    onChange={(e) => handleInfoChange('purchaseLocation', e.target.value)}
                                    placeholder="Ex: Mercerie du coin, Site spécialisé..."
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fait main ou acheté tels quels ?</label>
                                <select
                                    value={data.productInfo?.handmadeOrPurchased}
                                    onChange={(e) => handleInfoChange('handmadeOrPurchased', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="handmade">Fait main de A à Z</option>
                                    <option value="customized">Acheté et personnalisé</option>
                                    <option value="resale">Revendu tel quel</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pouvez-vous décrire les principales étapes de la chaîne d'approvisionnement de ce produit ?</label>
                                <textarea
                                    value={data.productInfo?.supplyChainSteps}
                                    onChange={(e) => handleInfoChange('supplyChainSteps', e.target.value)}
                                    placeholder="Décrivez les étapes de fabrication et de transport..."
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sur quels documents (certificats, factures, bordereaux) vous appuyez-vous pour garantir la traçabilité ?</label>
                                <textarea
                                    value={data.productInfo?.traceabilityDocuments}
                                    onChange={(e) => handleInfoChange('traceabilityDocuments', e.target.value)}
                                    placeholder="Ex: Factures fournisseurs, Certificats d'origine..."
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
                                />
                            </div>

                            {/* Materials List */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Liste des matériaux</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {data.productInfo?.materialsList?.map((mat, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs">
                                            {mat}
                                            <button type="button" onClick={() => {
                                                const newList = data.productInfo?.materialsList?.filter((_, i) => i !== index) || [];
                                                setData(prev => ({
                                                    ...prev,
                                                    productInfo: { ...prev.productInfo!, materialsList: newList }
                                                }));
                                            }}>
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ajouter un matériau (Entrée)"
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const value = (e.target as HTMLInputElement).value.trim();
                                            if (value) {
                                                setData(prev => ({
                                                    ...prev,
                                                    productInfo: {
                                                        ...prev.productInfo!,
                                                        materialsList: [...(prev.productInfo?.materialsList || []), value]
                                                    }
                                                }));
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Informations additionnelles</label>
                                <textarea
                                    value={data.productInfo?.additionalInfo || ''}
                                    onChange={(e) => setData(prev => ({
                                        ...prev,
                                        productInfo: { ...prev.productInfo!, additionalInfo: e.target.value }
                                    }))}
                                    placeholder="Toute information complémentaire sur le produit..."
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium block">Preuves du produit (Photos, factures...)</label>
                                <div className="flex flex-wrap gap-3">
                                    {data.productInfo?.proofs?.map((proof, index) => (
                                        <div key={index} className="relative w-16 h-16 rounded border dark:border-zinc-700 group">
                                            <img src={proof} className="w-full h-full object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => removeProof(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => proofInputRef.current?.click()}
                                        className="w-16 h-16 rounded border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 hover:border-emerald-500 hover:text-emerald-500"
                                    >
                                        <Upload size={16} />
                                        <span className="text-[10px] mt-1">Preuve</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={proofInputRef}
                                        onChange={(e) => handleFileUpload(e, true)}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
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

