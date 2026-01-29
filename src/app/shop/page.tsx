'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ShopForm from '@/components/ShopForm';
import ProductForm from '@/components/shop/ProductForm';
import ProductList from '@/components/shop/ProductList';
import { Loader2, Store, Package, ArrowRight } from 'lucide-react';

export default function ShopPage() {
    const [loading, setLoading] = useState(true);
    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);

    // Product Management State
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const fetchShopAndProducts = async () => {
        try {
            // Fetch Shop
            const shopRes = await fetch('/api/shop');
            if (shopRes.ok) {
                const shopData = await shopRes.json();
                // Extract data from the response structure
                const resolvedShop = shopData?.data || shopData?.shop;
                setShop(resolvedShop);

                if (resolvedShop?.id) {
                    const productsRes = await fetch(`/api/shop/${resolvedShop.id}/products`);
                    if (productsRes.ok) {
                        const productsData = await productsRes.json();
                        setProducts(productsData?.data?.items || []);
                    } else {
                        setProducts([]);
                    }
                } else {
                    setProducts([]);
                }
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopAndProducts();
    }, []);

    const handleDeleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchShopAndProducts();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
                                <Store className="text-blue-600" />
                                Espace Boutique
                            </h1>
                            <p className="mt-2 text-zinc-600">
                                {shop
                                    ? "Gérez les informations de votre boutique, votre catalogue et vos préférences."
                                    : "Créez votre boutique professionnelle en quelques minutes."}
                            </p>
                        </div>
                        
                        {shop && (
                            <Link 
                                href="/shop/orders"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors group"
                            >
                                <Package className="w-4 h-4 text-zinc-600 group-hover:text-blue-600" />
                                <span className="text-zinc-700 group-hover:text-blue-600 font-medium">
                                    Mes commandes
                                </span>
                                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Shop Info Form */}
                <ShopForm
                    initialData={shop}
                    isEditing={!!shop} // Force edit mode if no shop exists
                    onSuccess={fetchShopAndProducts}
                />

                {/* Product Management Section (Only if shop exists) */}
                {shop && (
                    <div className="bg-white rounded-xl shadow-lg border border-zinc-200 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-zinc-900">Mes Articles</h2>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setShowProductForm(true);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <span>+</span> Ajouter un article
                            </button>
                        </div>

                        {showProductForm ? (
                            <div className="mb-8">
                                <ProductForm
                                    initialData={editingProduct}
                                    onSuccess={() => {
                                        setShowProductForm(false);
                                        setEditingProduct(null);
                                        fetchShopAndProducts();
                                    }}
                                    onCancel={() => {
                                        setShowProductForm(false);
                                        setEditingProduct(null);
                                    }}
                                />
                            </div>
                        ) : (
                            <ProductList
                                products={products}
                                onEdit={(product) => {
                                    setEditingProduct(product);
                                    setShowProductForm(true);
                                }}
                                onDelete={handleDeleteProduct}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
