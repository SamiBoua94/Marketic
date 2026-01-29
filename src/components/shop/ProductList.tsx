
'use client';

import { useState } from 'react';
import { Edit, Trash, Package } from 'lucide-react';
import { EthicalScoreBadge } from '@/components/ui/EthicalScoreBadge';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string | null;
    tags: string | null;
    productInfo: string | null;
    category: string | null;
    ethicalScore?: number | null;
}

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="text-zinc-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">Aucun article</h3>
                <p className="text-zinc-500 dark:text-zinc-400">Commencez par ajouter votre premier produit.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
                let images = [];
                try {
                    images = product.images ? JSON.parse(product.images) : [];
                } catch {
                    images = [];
                }
                const mainImage = images.length > 0 ? images[0] : null;

                let tags: string[] = [];
                try {
                    tags = product.tags ? JSON.parse(product.tags as string) : [];
                } catch {
                    tags = [];
                }



                return (
                    <div key={product.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:shadow-md transition-shadow">
                        {/* Image */}
                        <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative">
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-zinc-400">
                                    <Package size={32} />
                                </div>
                            )}
                            {/* Badge score éthique */}
                            <div className="absolute top-2 left-2">
                                <EthicalScoreBadge score={product.ethicalScore} size="sm" />
                            </div>
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit(product)}
                                    className="p-2 bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 rounded-full shadow-sm hover:scale-105 transition-transform"
                                    title="Modifier"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                                            onDelete(product.id);
                                        }
                                    }}
                                    className="p-2 bg-red-50 text-red-600 rounded-full shadow-sm hover:scale-105 transition-transform"
                                    title="Supprimer"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {tags.length > 0 ? tags.map((tag: string, i: number) => (
                                            <span key={i} className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                                {tag}
                                            </span>
                                        )) : (
                                            <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                                Sans tag
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-1">{product.name}</h3>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-zinc-900 dark:text-white">{product.price.toFixed(2)} €</span>
                                </div>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 h-10">
                                {product.description}
                            </p>
                            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <span>Stock: {product.stock}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
