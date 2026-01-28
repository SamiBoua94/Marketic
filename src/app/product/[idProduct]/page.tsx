"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Store, Star, Heart, Share2, Truck, Shield, Leaf, MessageSquare, ThumbsUp, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';

function normalizeImageUrls(images: unknown): string[] {
  if (Array.isArray(images)) {
    return images
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return normalizeImageUrls(parsed);
    } catch {
      if (trimmed.includes(',')) {
        return trimmed
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean);
      }

      return [trimmed];
    }
  }

  return [];
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  user: {
    id: string;
    name: string;
    profilePicture: string | null;
  };
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState(1);

  // États pour les avis
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const idProduct = params.idProduct as string;

  React.useEffect(() => {
    if (!idProduct) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${idProduct}`);
        if (!res.ok) {
          throw new Error('Produit non trouvé');
        }
        const data = await res.json();
        setProduct(data.product);
        const normalized = normalizeImageUrls(data.product.images);
        setSelectedImage(normalized[0] || 'https://placehold.co/800x600?text=Produit');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [idProduct]);

  // Recharger les avis quand l'utilisateur se connecte
  React.useEffect(() => {
    if (user && idProduct) {
      fetchReviews();
    }
  }, [user, idProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const result = await addItem(product.id, quantity);
    if (result.success) {
      // Optionnel: afficher une notification
    }
  };

  // Fonctions pour les avis
  const fetchReviews = async () => {
    if (!idProduct) return;

    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/products/${idProduct}/reviews`);
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des avis');
      }
      const data = await res.json();
      setReviews(data.reviews || []);
      
      // Vérifier si l'utilisateur a déjà donné un avis
      if (user) {
        const existingReview = data.reviews?.find((review: Review) => review.userId === user.id);
        setUserReview(existingReview || null);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des avis:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${idProduct}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur lors de la soumission de l\'avis');
      }

      const createdReview = await res.json();
      
      if (userReview) {
        // Mettre à jour l'avis existant
        setReviews(prev => prev.map(review => 
          review.id === userReview.id ? createdReview : review
        ));
        setUserReview(createdReview);
      } else {
        // Ajouter le nouvel avis
        setReviews(prev => [createdReview, ...prev]);
        setUserReview(createdReview);
      }

      // Réinitialiser le formulaire
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    } catch (err: any) {
      alert(err.message || 'Une erreur est survenue lors de la soumission de l\'avis');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Erreur lors du vote');
      }

      const data = await res.json();
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: data.helpfulCount }
          : review
      ));
    } catch (err: any) {
      console.error('Erreur lors du vote:', err);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produit non trouvé</h1>
          <p className="text-foreground/60 mb-6">{error || 'Ce produit n\'existe pas.'}</p>
          <Link href="/products">
            <Button variant="primary">Retour aux produits</Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrls = normalizeImageUrls(product.images);
  const fallbackImage = 'https://placehold.co/800x600?text=Produit';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-foreground/60 mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Produits</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/5">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
          </div>
          {imageUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === url ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-primary">{product.price.toFixed(2)} €</p>
          </div>

          <p className="text-foreground/70 leading-relaxed">{product.description}</p>

          {/* Shop Info */}
          <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-xl">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/10">
              <img
                src={product.shop?.profilePicture || 'https://placehold.co/100x100?text=Shop'}
                alt={product.shop?.name || 'Boutique'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/100x100?text=Shop';
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground/60">Vendu par</p>
              <Link
                href={`/shop/${product.shop?.id}`}
                className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors"
              >
                <Store size={16} />
                {product.shop?.name || 'Boutique'}
              </Link>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantité:</span>
              <div className="flex items-center gap-2 bg-secondary/10 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-colors text-foreground/70"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-colors text-foreground/70"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={cartLoading}
              size="lg"
              className="w-full h-14 text-lg group"
            >
              <ShoppingCart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartLoading ? 'Ajout...' : 'Ajouter au panier'}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-secondary/10">
            <div className="flex flex-col items-center text-center p-3">
              <Truck className="w-6 h-6 text-primary mb-2" />
              <span className="text-xs font-medium">Livraison rapide</span>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <Shield className="w-6 h-6 text-primary mb-2" />
              <span className="text-xs font-medium">Paiement sécurisé</span>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <Leaf className="w-6 h-6 text-primary mb-2" />
              <span className="text-xs font-medium">Éco-responsable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-secondary/20 pt-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Avis des clients
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(calculateAverageRating()), 'w-5 h-5')}
                  <span className="font-semibold text-lg">
                    {calculateAverageRating().toFixed(1)}
                  </span>
                </div>
                <span className="text-foreground/60">
                  ({reviews.length} avis{reviews.length > 1 ? 's' : ''})
                </span>
              </div>
            </div>
            
            {user && (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                {userReview ? 'Modifier mon avis' : 'Donner mon avis'}
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && user && (
            <div className="bg-secondary/5 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">
                {userReview ? 'Modifier votre avis' : 'Donner votre avis'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Note</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= newReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-200'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Commentaire</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Partagez votre expérience avec ce produit..."
                    className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || !newReview.comment.trim()}
                    className="flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    {submittingReview ? 'Envoi...' : userReview ? 'Mettre à jour' : 'Publier'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setNewReview({ rating: 5, comment: '' });
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground/60">Chargement des avis...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun avis pour le moment</h3>
              <p className="text-foreground/60 mb-6">
                Soyez le premier à donner votre avis sur ce produit !
              </p>
              {!user && (
                <Button onClick={() => router.push('/login')}>
                  Se connecter pour donner un avis
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-secondary/20 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/10">
                        {review.user.profilePicture ? (
                          <img
                            src={review.user.profilePicture}
                            alt={review.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-foreground/60" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.rating, 'w-4 h-4')}
                          </div>
                          <span className="text-sm text-foreground/60">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.userId === user?.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowReviewForm(true);
                          setNewReview({
                            rating: review.rating,
                            comment: review.comment || ''
                          });
                        }}
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                  
                  {review.comment && (
                    <p className="text-foreground/80 mb-4 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-secondary/10">
                    <button
                      onClick={() => handleHelpfulVote(review.id)}
                      className="flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Utile ({review.helpfulCount})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
