'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Shop {
  id: string;
  name: string;
  description: string | null;
  profilePicture: string | null;
  bannerPicture: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  rating: number | null;
  tags: string[] | null;
}

export default function BoutiqueDetailsPage() {
  const params = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop & { rating: number | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchShop = async () => {
      console.log('ID de la boutique depuis les paramètres:', params?.id);
      
      if (!params?.id) {
        const errorMsg = 'ID de boutique manquant';
        console.error(errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }
      
      try {
        const apiUrl = `/api/shops/${params.id}`;
        console.log('URL de l\'API appelée:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('Réponse de l\'API - Statut:', response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Erreur API - Détails:', errorData);
          throw new Error('Boutique non trouvée');
        }
        
        const data = await response.json();
        console.log('Données reçues de l\'API:', data);
        
        if (!data) {
          throw new Error('Aucune donnée reçue de l\'API');
        }
        
        setShop(data);
        setError(null);
      } catch (err) {
        const error = err as Error;
        console.error('Erreur lors du chargement de la boutique:', error);
        setError(`Erreur lors du chargement de la boutique: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md w-full text-center">
          <strong className="font-bold">Erreur !</strong>
          <span className="block sm:inline"> {error}</span>
          <div className="mt-4">
            <Link 
              href="/boutiques" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Retour à la liste des boutiques
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Boutique non trouvée</h1>
          <Link href="/boutiques" className="text-primary hover:underline">
            Retour aux boutiques
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bannière */}
      <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
        {shop.bannerPicture ? (
          <Image
            src={shop.bannerPicture}
            alt={`Bannière de ${shop.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{shop.name}</span>
          </div>
        )}
      </div>

      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne de gauche - Photo de profil et informations */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full bg-gray-100">
                {shop.profilePicture ? (
                  <Image
                    src={shop.profilePicture}
                    alt={shop.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">Aucune image</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>
                
                {shop.rating && (
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(shop.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {(shop.rating || 0).toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {(shop.address || shop.city || shop.postalCode) && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-800">
                          {[shop.address, shop.postalCode, shop.city].filter(Boolean).join(', ')}
                        </p>
                        <button className="text-sm text-primary hover:underline mt-1">
                          Voir sur la carte
                        </button>
                      </div>
                    </div>
                  )}

                  {shop.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-2" />
                      <a href={`tel:${shop.phone}`} className="text-sm text-gray-800 hover:text-primary">
                        {shop.phone}
                      </a>
                    </div>
                  )}

                  {shop.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-2" />
                      <a href={`mailto:${shop.email}`} className="text-sm text-gray-800 hover:text-primary break-all">
                        {shop.email}
                      </a>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-2">
                    {shop.instagram && (
                      <a href={shop.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600">
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {shop.facebook && (
                      <a href={shop.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {shop.twitter && (
                      <a href={shop.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Contenu principal */}
          <div className="flex-1">
            {/* Navigation des onglets */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Produits
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Avis
                  </button>
                </nav>
              </div>

              {/* Contenu des onglets */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">À propos</h2>
                    <p className="text-gray-700 mb-6">
                      {shop.description || "Aucune description disponible pour cette boutique."}
                    </p>
                    
                    {shop.tags && shop.tags.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Mots-clés</h3>
                        <div className="flex flex-wrap gap-2">
                          {shop.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'products' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Nos produits</h2>
                    <p className="text-gray-500">
                      Aucun produit disponible pour le moment.
                    </p>
                    {/* Ici, vous pourriez ajouter une liste des produits de la boutique */}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Avis clients</h2>
                    <p className="text-gray-500">
                      Aucun avis pour le moment. Soyez le premier à laisser un commentaire !
                    </p>
                    {/* Ici, vous pourriez ajouter un formulaire d'avis et la liste des avis existants */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
