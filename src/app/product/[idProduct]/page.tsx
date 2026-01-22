"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Store, Star, Heart, Share2, Truck, Shield, Leaf } from 'lucide-react';
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
  }, [idProduct]);

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
    </div>
  );
}
