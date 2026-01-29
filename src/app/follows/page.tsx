"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Users, MapPin, Store, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { FollowButton } from '@/components/FollowButton';

interface Shop {
  id: string;
  name: string;
  description: string | null;
  profilePicture: string | null;
  city: string | null;
  tags: string | null;
  _count: {
    follows: number;
  };
  followedAt: string;
}

export default function FollowsPage() {
  const { user } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFollowedShops = async (pageNum = 1) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/user/follows?page=${pageNum}&limit=12`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des boutiques suivies');
      }

      const data = await response.json();
      setShops(data.shops || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowedShops(page);
    }
  }, [user, page]);

  const handleUnfollow = (shopId: string) => {
    setShops(prev => prev.filter(shop => shop.id !== shopId));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="p-6 bg-secondary/10 rounded-full mb-6">
          <Heart className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Connectez-vous pour voir vos boutiques suivies</h1>
        <p className="text-foreground/60 max-w-md mb-8">
          Vous devez être connecté pour consulter les boutiques que vous suivez.
        </p>
        <Link href="/login">
          <Button variant="primary" size="lg">Se connecter</Button>
        </Link>
      </div>
    );
  }

  if (loading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/60">Chargement de vos boutiques suivies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Erreur de chargement</h1>
          <p className="text-foreground/60 mb-6">{error}</p>
          <Button onClick={() => fetchFollowedShops(page)}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary" />
          Mes boutiques suivies
        </h1>
        <p className="text-foreground/60">
          {shops.length === 0 
            ? "Vous ne suivez encore aucune boutique" 
            : `${shops.length} boutique${shops.length > 1 ? 's' : ''} suivie${shops.length > 1 ? 's' : ''}`
          }
        </p>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-24 h-24 text-foreground/20 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Aucune boutique suivie</h2>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto">
            Découvrez des boutiques locales et suivez vos préférées pour ne rien manquer de leurs nouveautés !
          </p>
          <Link href="/boutiques">
            <Button variant="primary" size="lg" className="group">
              Découvrir des boutiques
              <Store className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {shops.map((shop) => (
              <div key={shop.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/10">
                        <img
                          src={shop.profilePicture || 'https://placehold.co/100x100?text=Shop'}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{shop.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-foreground/60">
                          <Users className="w-3 h-3" />
                          {shop._count.follows} followers
                        </div>
                      </div>
                    </div>
                    <FollowButton
                      shopId={shop.id}
                      initialIsFollowing={true}
                      size="sm"
                      variant="outline"
                    />
                  </div>

                  {shop.description && (
                    <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                      {shop.description}
                    </p>
                  )}

                  {shop.city && (
                    <div className="flex items-center gap-1 text-sm text-foreground/60 mb-4">
                      <MapPin className="w-4 h-4" />
                      {shop.city}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Link href={`/boutique/${shop.id}`}>
                      <Button variant="outline" size="sm">
                        Voir la boutique
                      </Button>
                    </Link>
                    <span className="text-xs text-foreground/60">
                      Suivi le {new Date(shop.followedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || loading}
              >
                Précédent
              </Button>
              <span className="flex items-center px-4 text-sm text-foreground/60">
                Page {page} sur {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || loading}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
