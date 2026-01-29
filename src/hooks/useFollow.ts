import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';

interface FollowShopParams {
  shopId: string;
}

export function useFollow() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const followShop = useCallback(async ({ shopId }: FollowShopParams) => {
    if (!user) {
      setError('Vous devez être connecté pour suivre une boutique');
      return { success: false, error: 'Non autorisé' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/shops/${shopId}/follow`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du suivi');
      }

      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const unfollowShop = useCallback(async ({ shopId }: FollowShopParams) => {
    if (!user) {
      setError('Vous devez être connecté pour ne plus suivre une boutique');
      return { success: false, error: 'Non autorisé' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/shops/${shopId}/follow`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'arrêt du suivi');
      }

      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    followShop,
    unfollowShop,
    loading,
    error,
    clearError
  };
}
