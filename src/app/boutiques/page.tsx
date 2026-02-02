'use client';

import { useState, useEffect } from 'react';
import { Search, Store, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Shop {
  id: string;
  name: string;
  description: string | null;
  profilePicture: string | null;
  bannerPicture: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
}

export default function BoutiquesPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`/api/shops?query=${searchQuery}`);
        const result = await response.json();
        setShops(result.data || []);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setShops([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchShops();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-secondary/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Découvrez nos boutiques
            </h1>
            <p className="text-lg text-foreground/60 mb-8">
              Explorez notre sélection de boutiques locales et trouvez des produits uniques près de chez vous.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Rechercher une boutique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-foreground/50 animate-pulse font-medium">
              Chargement des boutiques...
            </p>
          </div>
        ) : shops.length > 0 ? (
          <>
            <p className="text-foreground/50 text-sm mb-6">
              <span className="font-bold text-foreground">{shops.length}</span> boutique{shops.length > 1 ? 's' : ''} trouvée{shops.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl border border-secondary/20 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col group"
                >
                  {/* Shop Image */}
                  <div className="h-48 bg-secondary/10 overflow-hidden relative">
                    {shop.profilePicture || shop.bannerPicture ? (
                      <img
                        src={shop.profilePicture || shop.bannerPicture || ''}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/400x300?text=Boutique';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-3">
                          <Store className="w-8 h-8 text-foreground/30" />
                        </div>
                        <span className="text-sm text-foreground/40">Aucune image</span>
                      </div>
                    )}
                  </div>

                  {/* Shop Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {shop.name}
                    </h3>

                    {shop.description && (
                      <p className="text-sm text-foreground/60 line-clamp-2 mb-3">
                        {shop.description}
                      </p>
                    )}

                    {(shop.address || shop.city) && (
                      <div className="flex items-center gap-2 text-foreground/50 text-sm mb-4">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {[shop.address, shop.postalCode, shop.city].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}

                    <Button
                      onClick={() => router.push(`/boutique/${shop.id}`)}
                      className="mt-auto w-full"
                    >
                      Voir la boutique
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-24 text-center bg-secondary/5 rounded-3xl border border-dashed border-secondary/20">
            <div className="inline-flex p-6 bg-white rounded-full mb-6">
              <Store className="w-12 h-12 text-foreground/20" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Aucune boutique trouvée
            </h2>
            <p className="text-foreground/50 max-w-sm mx-auto">
              {searchQuery
                ? `Aucune boutique ne correspond à "${searchQuery}"`
                : "Il n'y a pas encore de boutiques sur la plateforme."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
