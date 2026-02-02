"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Store, Star, Heart, Share2, Truck, Shield, Leaf, MessageSquare, ThumbsUp, User as UserIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EthicalScoreBadge } from '@/components/ui/EthicalScoreBadge';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { AnimatedBackground, FloatingLeaves } from '@/components/ui/AnimatedBackground';

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
        className={`${size} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
      />
    ));
  };

  if (loading) {
    return (
      <AnimatedBackground variant="subtle" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60 animate-pulse">Chargement de la pépite...</p>
        </div>
      </AnimatedBackground>
    );
  }

  if (error || !product) {
    return (
      <AnimatedBackground variant="subtle" className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white/50 backdrop-blur-sm p-12 rounded-[2rem] border border-secondary/20 shadow-soft">
          <h1 className="text-2xl font-bold font-heading text-foreground mb-4">Produit introuvable</h1>
          <p className="text-foreground/60 mb-8">{error || 'Ce produit n\'existe pas ou a été retiré.'}</p>
          <Link href="/products">
            <Button className="rounded-xl px-8 py-6">Retour aux produits</Button>
          </Link>
        </div>
      </AnimatedBackground>
    );
  }

  const imageUrls = normalizeImageUrls(product.images);
  const fallbackImage = 'https://placehold.co/800x600?text=Produit';

  return (
    <AnimatedBackground variant="subtle" className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground/60 mb-8 animate-fade-in-up">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Produits</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-6 animate-fade-in-up animation-delay-100">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white shadow-soft group border border-secondary/10">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
              <div className="absolute top-4 right-4 z-10">
                <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform text-foreground/60 hover:text-red-500">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
              {product.ethicalScore && (
                <div className="absolute top-4 left-4 z-10">
                  <EthicalScoreBadge score={product.ethicalScore} size="lg" showLabel />
                </div>
              )}
            </div>
            {imageUrls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(url)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shadow-sm hover:scale-105 ${selectedImage === url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
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
          <div className="space-y-8 animate-fade-in-up animation-delay-200">
            <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/50 shadow-soft">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-6">
                  <p className="text-3xl font-bold text-primary">{product.price.toFixed(2)} €</p>
                  <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full">
                    {renderStars(Math.round(calculateAverageRating()), 'w-4 h-4')}
                    <span className="text-sm font-bold text-yellow-700 ml-1">{calculateAverageRating().toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-foreground/70 leading-relaxed mb-8">{product.description}</p>

              {/* Shop Info */}
              <div className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl border border-secondary/10 shadow-sm hover:shadow-md transition-shadow mb-8 group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary/10">
                  <img
                    src={product.shop?.profilePicture || 'https://placehold.co/100x100?text=Shop'}
                    alt={product.shop?.name || 'Boutique'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/100x100?text=Shop';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground/60 font-medium mb-1">Vendu et expédié par</p>
                  <Link
                    href={`/boutique/${product.shop?.id}`}
                    className="flex items-center gap-2 font-heading font-bold text-lg text-foreground hover:text-primary transition-colors"
                  >
                    <Store className="w-5 h-5" />
                    {product.shop?.name || 'Boutique Partenaire'}
                  </Link>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Voir la boutique
                </Button>
              </div>

              {/* Actions */}
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-sm border border-secondary/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-secondary/10 rounded-lg transition-colors text-foreground font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-secondary/10 rounded-lg transition-colors text-foreground font-bold text-lg"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-sm text-foreground/60">
                    <span className="block font-medium text-green-600 flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> En stock
                    </span>
                    <span>Expédié sous 48h</span>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  size="lg"
                  className="w-full h-16 text-lg font-bold rounded-2xl shadow-glow hover:shadow-glow-accent hover:-translate-y-1 transition-all"
                >
                  <ShoppingCart className="mr-3 w-6 h-6" />
                  {cartLoading ? 'Ajout en cours...' : 'Ajouter au panier'}
                </Button>
              </div>
            </div>

            {/* Features Reassurance */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-foreground/80">Livraison rapide</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-foreground/80">Paiement sécurisé</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-foreground/80">Éco-responsable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 border-t border-secondary/10 pt-16">
          <div className="relative">
            <div className="absolute inset-x-0 -top-40 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-3 flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    Avis clients
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-secondary/10">
                      {renderStars(Math.round(calculateAverageRating()), 'w-5 h-5')}
                      <span className="font-bold text-lg text-foreground ml-2">
                        {calculateAverageRating().toFixed(1)}
                      </span>
                    </div>
                    <span className="text-foreground/60 font-medium">
                      Basé sur {reviews.length} avis
                    </span>
                  </div>
                </div>

                {user && (
                  <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl py-6 px-6 border-2 hover:bg-secondary/5 hover:border-primary/30"
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                    {userReview ? 'Modifier mon avis' : 'Partager mon expérience'}
                  </Button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && user && (
                <div className="bg-white rounded-[2rem] p-8 mb-12 border border-secondary/20 shadow-lg animate-fade-in-scale">
                  <h3 className="font-heading font-bold text-xl mb-6">
                    {userReview ? 'Votre avis compte' : 'Racontez-nous tout'}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-3 uppercase tracking-wide text-foreground/70">Votre note</label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-10 h-10 ${rating <= newReview.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200 hover:text-yellow-200'
                                } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 uppercase tracking-wide text-foreground/70">Votre commentaire</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Qu'avez-vous pensé de ce produit ? Qualité, livraison, emballage..."
                        className="w-full px-5 py-4 rounded-2xl border-2 border-secondary/10 bg-secondary/5 focus:outline-none focus:border-primary/30 focus:bg-white transition-all resize-none"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-4 pt-2">
                      <Button
                        onClick={handleSubmitReview}
                        disabled={submittingReview || !newReview.comment.trim()}
                        className="flex items-center gap-2 rounded-xl px-8 shadow-glow"
                      >
                        {submittingReview ? 'Publication...' : userReview ? 'Mettre à jour' : 'Publier mon avis'}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowReviewForm(false);
                          setNewReview({ rating: 5, comment: '' });
                        }}
                        className="rounded-xl"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="flex flex-col items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                  <p className="text-foreground/60">Récupération des avis...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-16 bg-white/50 rounded-[2rem] border border-dashed border-secondary/20">
                  <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-foreground/30">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">Aucun avis pour le moment</h3>
                  <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                    Ce produit attend son premier fan. Soyez celui qui lancera la tendance !
                  </p>
                  {!user && (
                    <Button onClick={() => router.push('/login')} variant="outline" className="rounded-xl">
                      Se connecter pour donner un avis
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border border-secondary/10 hover:shadow-lg transition-all shadow-sm">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/10 border-2 border-white shadow-sm">
                            {review.user.profilePicture ? (
                              <img
                                src={review.user.profilePicture}
                                alt={review.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-lg">{review.user.name}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex">
                                {renderStars(review.rating, 'w-4 h-4')}
                              </div>
                              <span className="text-sm text-foreground/40 font-medium">
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
                            className="text-foreground/40 hover:text-primary rounded-full px-4"
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
                        <div className="bg-secondary/5 rounded-2xl p-6 mb-6">
                          <p className="text-foreground/80 leading-relaxed text-lg italic">
                            "{review.comment}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleHelpfulVote(review.id)}
                          className="flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-primary transition-colors bg-white px-4 py-2 rounded-full border border-secondary/10 hover:border-primary/20"
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
      </div>
    </AnimatedBackground>
  );
}
