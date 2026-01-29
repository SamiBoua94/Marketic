'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
        // API returns { success: true, data: [...] } via successResponse()
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
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem 1rem',
      minHeight: 'calc(100vh - 4rem)'
    }}>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '0 0.5rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            margin: 0,
            color: 'var(--foreground)',
            lineHeight: '1.2'
          }}>Découvrez nos boutiques partenaires</h1>
          <p style={{
            color: 'var(--muted-foreground)',
            margin: 0,
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Explorez notre sélection de boutiques locales et trouvez des produits uniques près de chez vous.
          </p>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '32rem',
            marginTop: '0.5rem'
          }}>
            <Search style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '1.25rem',
              width: '1.25rem',
              color: 'var(--muted-foreground)'
            }} />
            <input
              type="text"
              placeholder="Rechercher une boutique par nom..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '1rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem',
            width: '100%',
            padding: '0 0.5rem'
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                backgroundColor: 'var(--card)',
                color: 'var(--card-foreground)'
              }}>
                <div style={{
                  height: '12rem',
                  backgroundColor: 'var(--muted)',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    height: '1.5rem',
                    backgroundColor: 'var(--muted)',
                    borderRadius: '0.25rem',
                    width: '75%',
                    marginBottom: '0.5rem',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }} />
                  <div style={{
                    height: '1rem',
                    backgroundColor: 'var(--muted)',
                    borderRadius: '0.25rem',
                    width: '50%',
                    marginBottom: '1rem',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.75rem',
            marginTop: '1.5rem',
            width: '100%',
            padding: '0 0.5rem'
          }}>
            {shops.map((shop) => (
              <div
                key={shop.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  backgroundColor: 'var(--card)',
                  color: 'var(--card-foreground)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                  <div style={{
                    height: '12rem',
                    backgroundColor: 'var(--muted)',
                    overflow: 'hidden',
                    position: 'relative',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    {shop.profilePicture || shop.bannerPicture ? (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={shop.profilePicture || shop.bannerPicture || ''}
                          alt={shop.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            transform: 'scale(1)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--muted)',
                        padding: '1.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '50%',
                          backgroundColor: 'var(--muted-foreground)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem',
                          opacity: 0.5
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--background)' }}>
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </div>
                        <span style={{
                          color: 'var(--muted-foreground)',
                          fontSize: '0.875rem'
                        }}>
                          Aucune image disponible
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1'
                  }}>
                    <div style={{ flex: '1' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        margin: '0 0 0.5rem 0',
                        color: 'var(--foreground)',
                        lineHeight: '1.3'
                      }}>
                        {shop.name}
                      </h3>
                      {shop.description && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'var(--muted-foreground)',
                          margin: '0 0 0.75rem 0',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {shop.description}
                        </p>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        margin: '0.75rem 0 1rem 0',
                        color: 'var(--muted-foreground)'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span style={{
                          fontSize: '0.875rem',
                          lineHeight: '1.4',
                          flex: '1',
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {[shop.address, shop.postalCode, shop.city].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push(`/boutique/${shop.id}`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.5rem',
                        backgroundColor: '#3a5a40',
                        color: '#ffffff',
                        fontWeight: 500,
                        fontSize: '0.9375rem',
                        lineHeight: '1.5',
                        padding: '0.625rem 1.25rem',
                        width: '100%',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginTop: 'auto',
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#2d4533';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#3a5a40';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.backgroundColor = '#3a5a40';
                        e.currentTarget.style.outline = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.backgroundColor = '#3a5a40';
                        e.currentTarget.style.outline = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span>Voir la boutique</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
