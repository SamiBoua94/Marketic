import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useFollow } from '@/hooks/useFollow';

interface FollowButtonProps {
  shopId: string;
  initialIsFollowing?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function FollowButton({ 
  shopId, 
  initialIsFollowing = false,
  className = '',
  variant = 'primary',
  size = 'md'
}: FollowButtonProps) {
  const { user } = useAuth();
  const { followShop, unfollowShop, loading, error, clearError } = useFollow();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (!user) {
      // Rediriger vers la page de connexion
      window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    clearError();

    if (isFollowing) {
      const result = await unfollowShop({ shopId });
      if (result.success) {
        setIsFollowing(false);
      }
    } else {
      const result = await followShop({ shopId });
      if (result.success) {
        setIsFollowing(true);
      }
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
