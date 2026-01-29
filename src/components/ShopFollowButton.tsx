import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

interface ShopFollowButtonProps {
  shopId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean, increment: number) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function ShopFollowButton({ 
  shopId, 
  initialIsFollowing = false,
  onFollowChange,
  className = '',
  variant = 'primary',
  size = 'md'
}: ShopFollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (!user) {
      // Rediriger vers la page de connexion
      window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/shops/${shopId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du suivi');
      }

      const newFollowState = !isFollowing;
      const increment = newFollowState ? 1 : -1;
      
      setIsFollowing(newFollowState);
      
      // Notifier le parent du changement
      if (onFollowChange) {
        onFollowChange(newFollowState, increment);
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const buttonContent = isFollowing ? (
    <>
      <Heart className="w-4 h-4 fill-current" />
      Suivi
    </>
  ) : (
    <>
      <Heart className="w-4 h-4" />
      Suivre
    </>
  );

  const buttonVariant = isFollowing ? 'outline' : variant;
  const buttonColor = isFollowing 
    ? 'text-red-600 border-red-600 hover:bg-red-50' 
    : '';

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleFollowToggle}
        disabled={loading}
        variant={buttonVariant}
        size={size}
        className={`${className} ${buttonColor} transition-colors`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {isFollowing ? 'Arrêt...' : 'Suivi...'}
          </>
        ) : (
          buttonContent
        )}
      </Button>
      
      {error && (
        <p className="text-sm text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
