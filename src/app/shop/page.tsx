'use client';

import { useEffect, useState } from 'react';
import ShopForm from '@/components/ShopForm';
import { Loader2, Store } from 'lucide-react';

export default function ShopPage() {
    const [loading, setLoading] = useState(true);
    const [shop, setShop] = useState<any>(null);

    const fetchShop = async () => {
        try {
            const res = await fetch('/api/shop');
            if (res.ok) {
                const data = await res.json();
                setShop(data.shop);
            }
        } catch (error) {
            console.error('Error fetching shop:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShop();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
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

                <ShopForm
                    initialData={shop}
                    isEditing={!!shop}
                    onSuccess={fetchShop}
                />
            </div>
        </div>
    );
}
