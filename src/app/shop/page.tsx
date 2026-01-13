'use client';

import { useEffect, useState } from 'react';
import ShopForm from '@/components/ShopForm';
import ProductForm from '@/components/shop/ProductForm';
import ProductList from '@/components/shop/ProductList';
import { Loader2, Store } from 'lucide-react';

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
                setShop(shopData.data || shopData.shop);
            }

            // Fetch Products (if authenticated)
            const productsRes = await fetch('/api/products');
            if (productsRes.ok) {
                const productsData = await productsRes.json();
                // Extract data from the response structure
                setProducts(productsData.data || productsData.products || []);
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
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <Store className="text-blue-600" />
                        Espace Boutique
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        {shop
                            ? "Gérez les informations de votre boutique, votre catalogue et vos préférences."
                            : "Créez votre boutique professionnelle en quelques minutes."}
                    </p>
                </div>

                {/* Shop Info Form */}
                <ShopForm
                    initialData={shop}
                    isEditing={!!shop} // Force edit mode if no shop exists
                    onSuccess={fetchShopAndProducts}
                />

                {/* Product Management Section (Only if shop exists) */}
                {shop && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Mes Articles</h2>
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
