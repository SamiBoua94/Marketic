
'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Save, X, Trash, Plus, Tag, Leaf, Loader2, Award } from 'lucide-react';
import { EthicalScoreBadge } from '@/components/ui/EthicalScoreBadge';
import {
    EcobalyseProductType,
    EcobalyseFabricProcess,
    EcobalyseMaterialOption,
    EcobalyseProductOption,
    EcobalyseCountry,
    EcobalyseScore
} from '@/types/ecobalyse.types';

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
    // Ecobalyse fields
    ecobalyseProductType?: EcobalyseProductType;
    ecobalyseMass?: number;
    ecobalyseMaterials?: { id: string; share: number; country?: string }[];
    ecobalyseCountryMaking?: string;
    ecobalyseFabricProcess?: EcobalyseFabricProcess;
    ecobalyseUpcycled?: boolean;
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
                    ecobalyseMaterials: [],
                    ecobalyseUpcycled: false
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

        let processedOptions: ProductOption[] = [];
        if (typeof initialData.options === 'string') {
            try { processedOptions = JSON.parse(initialData.options); } catch (e) { processedOptions = []; }
        } else if (Array.isArray(initialData.options)) {
            processedOptions = initialData.options;
        }

        let processedInfo: ProductInfo = {
            ecobalyseMaterials: [],
            ecobalyseUpcycled: false
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
            options: processedOptions,
            productInfo: processedInfo
        };
    });

    const [showProductInfo, setShowProductInfo] = useState(false);
    const [newTag, setNewTag] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Ecobalyse states
    const [ecobalyseMaterials, setEcobalyseMaterials] = useState<EcobalyseMaterialOption[]>([]);
    const [ecobalyseProducts, setEcobalyseProducts] = useState<EcobalyseProductOption[]>([]);
    const [ecobalyseCountries, setEcobalyseCountries] = useState<EcobalyseCountry[]>([]);
    const [ecobalyseScore, setEcobalyseScore] = useState<EcobalyseScore>({ calculated: false });
    const [ecobalyseLoading, setEcobalyseLoading] = useState(false);

    // Load Ecobalyse reference data
    useEffect(() => {
        const loadEcobalyseData = async () => {
            try {
                const [materialsRes, productsRes, countriesRes] = await Promise.all([
                    fetch('/api/ecobalyse?type=materials'),
                    fetch('/api/ecobalyse?type=products'),
                    fetch('/api/ecobalyse?type=countries')
                ]);

                if (materialsRes.ok) {
                    const materials = await materialsRes.json();
                    setEcobalyseMaterials(materials);
                }
                if (productsRes.ok) {
                    const products = await productsRes.json();
                    setEcobalyseProducts(products);
                }
                if (countriesRes.ok) {
                    const countries = await countriesRes.json();
                    setEcobalyseCountries(countries);
                }
            } catch (error) {
                console.error('Erreur chargement données Ecobalyse:', error);
            }
        };

        loadEcobalyseData();
    }, []);

    // Calculate Ecobalyse score
    const calculateEcobalyseScore = async () => {
        const info = data.productInfo;
        if (!info?.ecobalyseProductType || !info?.ecobalyseMass || !info?.ecobalyseMaterials?.length) {
            setEcobalyseScore({
                calculated: false,
                error: 'Veuillez remplir le type de produit, la masse et au moins une matière'
            });
            return;
        }

        // Check materials sum = 100%
        const totalShare = info.ecobalyseMaterials.reduce((sum, mat) => sum + mat.share, 0);
        if (Math.abs(totalShare - 1) > 0.01) {
            setEcobalyseScore({
                calculated: false,
                error: `La somme des parts de matières doit être égale à 100% (actuel: ${Math.round(totalShare * 100)}%)`
            });
            return;
        }

        setEcobalyseLoading(true);
        setEcobalyseScore({ calculated: false });

        try {
            const query = {
                mass: info.ecobalyseMass,
                product: info.ecobalyseProductType,
                materials: info.ecobalyseMaterials,
                countryMaking: info.ecobalyseCountryMaking || undefined,
                fabricProcess: info.ecobalyseFabricProcess || undefined,
                upcycled: info.ecobalyseUpcycled || false
            };

            const response = await fetch('/api/ecobalyse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur de calcul');
            }

            const result = await response.json();
            setEcobalyseScore({
                calculated: true,
                pef: result.impacts?.pef,
                cch: result.impacts?.cch,
                ecs: result.impacts?.ecs
            });
        } catch (error: any) {
            setEcobalyseScore({
                calculated: false,
                error: error.message || 'Erreur lors du calcul du score'
            });
        } finally {
            setEcobalyseLoading(false);
        }
    };

    // Add Ecobalyse material
    const addEcobalyseMaterial = () => {
        setData(prev => ({
            ...prev,
            productInfo: {
                ...prev.productInfo!,
                ecobalyseMaterials: [...(prev.productInfo?.ecobalyseMaterials || []), { id: '', share: 0 }]
            }
        }));
    };

    // Remove Ecobalyse material
    const removeEcobalyseMaterial = (index: number) => {
        setData(prev => ({
            ...prev,
            productInfo: {
                ...prev.productInfo!,
                ecobalyseMaterials: prev.productInfo?.ecobalyseMaterials?.filter((_, i) => i !== index) || []
            }
        }));
    };

    // Update Ecobalyse material
    const updateEcobalyseMaterial = (index: number, field: 'id' | 'share' | 'country', value: string | number) => {
        setData(prev => {
            const materials = [...(prev.productInfo?.ecobalyseMaterials || [])];
            materials[index] = { ...materials[index], [field]: value };
            return {
                ...prev,
                productInfo: { ...prev.productInfo!, ecobalyseMaterials: materials }
            };
        });
    };

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
            setData(prev => ({
                ...prev,
                images: [...(prev.images || []), resData.url]
            }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = initialData ? 'PUT' : 'POST';
            const url = initialData ? `/api/products/${initialData.id}` : '/api/products';

            // Inclure le score éthique calculé dans les données
            const submitData = {
                ...data,
                ethicalScore: ecobalyseScore.calculated && ecobalyseScore.ecs !== undefined
                    ? ecobalyseScore.ecs
                    : null
            };

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
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
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-zinc-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-zinc-900">
                    {initialData ? 'Modifier l\'article' : 'Ajouter un article'}
                </h2>
                <button type="button" onClick={onCancel} className="text-zinc-500 hover:text-zinc-700">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Images Section */}
                <div>
                    <label className="text-sm font-medium text-zinc-700 mb-2 block">Photos du produit</label>
                    <div className="flex flex-wrap gap-4">
                        {data.images?.map((img, index) => (
                            <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-200 group">
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
                            className="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
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
                    <label className="text-sm font-medium text-zinc-700">Nom de l'article</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Ex: Vase en céramique bleue"
                        required
                    />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Prix (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Stock</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData(prev => ({ ...prev, stock: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {data.tags?.map((tag, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-emerald-900">
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
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>

                {/* Options Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Options (couleur, taille, etc.)</label>
                    <div className="space-y-3">
                        {data.options?.map((option, optIndex) => (
                            <div key={optIndex} className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
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
                                        className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setData(prev => ({ ...prev, options: prev.options?.filter((_, i) => i !== optIndex) }))}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash size={14} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {option.values.map((val, valIndex) => (
                                        <span key={valIndex} className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-200 rounded text-xs">
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
                                        className="px-2 py-1 text-xs border border-dashed border-zinc-300 rounded bg-transparent outline-none w-20"
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
                            className="w-full py-2 border-2 border-dashed border-zinc-300 rounded-lg text-zinc-500 hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <Plus size={16} /> Ajouter une option
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]"
                        placeholder="Décrivez votre produit..."
                        required
                    />
                </div>

                {/* Score Environnemental Section */}
                <div className="border-t border-zinc-200 pt-6">
                    <button
                        type="button"
                        onClick={() => setShowProductInfo(!showProductInfo)}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors border border-green-200"
                    >
                        <div className="flex items-center gap-3">
                            <Leaf className="text-green-600" size={24} />
                            <div className="text-left">
                                <span className="font-semibold block text-green-800">Score Environnemental</span>
                                <span className="text-xs text-green-600">Calculez l'impact de votre produit textile</span>
                            </div>
                        </div>
                        <Plus className={`text-green-600 transition-transform ${showProductInfo ? 'rotate-45' : ''}`} />
                    </button>

                    {showProductInfo && (
                        <div className="mt-4 space-y-4 p-4 border border-green-200 rounded-xl bg-green-50/50">

                            {/* Produit remanufacturé (upcycled) */}
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.productInfo?.ecobalyseUpcycled || false}
                                        onChange={(e) => setData(prev => ({
                                            ...prev,
                                            productInfo: { ...prev.productInfo!, ecobalyseUpcycled: e.target.checked }
                                        }))}
                                        className="w-5 h-5 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                                    />
                                    <div>
                                        <span className="font-medium text-amber-800">Produit remanufacturé / upcyclé</span>
                                        <p className="text-xs text-amber-600">Cochez si le produit est fabriqué à partir de matériaux recyclés (réduit l'impact)</p>
                                    </div>
                                </label>
                            </div>

                            {/* Type de produit */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-green-800">Type de produit textile *</label>
                                    <select
                                        value={data.productInfo?.ecobalyseProductType || ''}
                                        onChange={(e) => setData(prev => ({
                                            ...prev,
                                            productInfo: { ...prev.productInfo!, ecobalyseProductType: e.target.value as EcobalyseProductType }
                                        }))}
                                        className="w-full px-4 py-2 rounded-lg border border-green-200 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                    >
                                        <option value="">Sélectionner un type</option>
                                        {ecobalyseProducts.map(product => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-green-800">Masse du produit (kg) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.productInfo?.ecobalyseMass ?? ''}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setData(prev => ({
                                                ...prev,
                                                productInfo: { ...prev.productInfo!, ecobalyseMass: isNaN(val) ? undefined : val }
                                            }));
                                        }}
                                        placeholder="Ex: 0.17 pour un t-shirt"
                                        className="w-full px-4 py-2 rounded-lg border border-green-200 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Composition des matières */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-green-800">
                                    Composition des matières * <span className="text-xs text-green-600">(total: {Math.round((data.productInfo?.ecobalyseMaterials?.reduce((sum, m) => sum + m.share, 0) || 0) * 100)}%)</span>
                                </label>
                                <div className="space-y-2">
                                    {data.productInfo?.ecobalyseMaterials?.map((mat, index) => (
                                        <div key={index} className="flex gap-2 items-center flex-wrap">
                                            <select
                                                value={mat.id}
                                                onChange={(e) => updateEcobalyseMaterial(index, 'id', e.target.value)}
                                                className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-green-200 bg-white text-sm"
                                            >
                                                <option value="">Sélectionner une matière</option>
                                                {ecobalyseMaterials.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={Math.round(mat.share * 100) || ''}
                                                    onChange={(e) => updateEcobalyseMaterial(index, 'share', (parseInt(e.target.value) || 0) / 100)}
                                                    className="w-16 px-2 py-2 rounded-lg border border-green-200 bg-white text-sm text-center"
                                                    placeholder="100"
                                                />
                                                <span className="text-sm">%</span>
                                            </div>
                                            <select
                                                value={mat.country || ''}
                                                onChange={(e) => updateEcobalyseMaterial(index, 'country', e.target.value)}
                                                className="w-32 px-2 py-2 rounded-lg border border-green-200 bg-white text-sm"
                                            >
                                                <option value="">Origine</option>
                                                {ecobalyseCountries.map(c => (
                                                    <option key={c.code} value={c.code}>{c.name}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => removeEcobalyseMaterial(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addEcobalyseMaterial}
                                    className="w-full py-2 border border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-500 hover:bg-green-50/50 transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <Plus size={14} /> Ajouter une matière
                                </button>
                            </div>

                            {/* Pays de fabrication */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-green-800">Pays de confection</label>
                                    <select
                                        value={data.productInfo?.ecobalyseCountryMaking || ''}
                                        onChange={(e) => setData(prev => ({
                                            ...prev,
                                            productInfo: { ...prev.productInfo!, ecobalyseCountryMaking: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 rounded-lg border border-green-200 bg-white text-sm"
                                    >
                                        <option value="">Non spécifié</option>
                                        {ecobalyseCountries.map(c => (
                                            <option key={c.code} value={c.code}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-green-800">Procédé de fabrication</label>
                                    <select
                                        value={data.productInfo?.ecobalyseFabricProcess || ''}
                                        onChange={(e) => setData(prev => ({
                                            ...prev,
                                            productInfo: { ...prev.productInfo!, ecobalyseFabricProcess: e.target.value as EcobalyseFabricProcess }
                                        }))}
                                        className="w-full px-3 py-2 rounded-lg border border-green-200 bg-white text-sm"
                                    >
                                        <option value="">Non spécifié</option>
                                        <option value="knitting-mix">Tricotage moyen</option>
                                        <option value="knitting-circular">Tricotage circulaire</option>
                                        <option value="knitting-straight">Tricotage rectiligne</option>
                                        <option value="weaving">Tissage</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bouton de calcul */}
                            <div className="pt-4 border-t border-green-200">
                                <button
                                    type="button"
                                    onClick={calculateEcobalyseScore}
                                    disabled={ecobalyseLoading}
                                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                                >
                                    {ecobalyseLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Calcul en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Leaf size={18} />
                                            Calculer le score environnemental
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Score display */}
                            {ecobalyseScore.error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    ⚠️ {ecobalyseScore.error}
                                </div>
                            )}

                            {ecobalyseScore.calculated && (
                                <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border border-green-300">
                                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                        <Award className="text-green-600" size={20} />
                                        Résultats du score environnemental
                                    </h4>
                                    <div className="flex flex-col items-center gap-3">
                                        <EthicalScoreBadge score={ecobalyseScore.ecs} size="lg" showLabel />
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-zinc-800">
                                                {ecobalyseScore.ecs?.toFixed(0) || '-'} µPts
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-600 mt-3 text-center">
                                        Calculé via l'API Ecobalyse - Plus le score est bas, meilleur est l'impact
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
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
