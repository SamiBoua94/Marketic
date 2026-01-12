export interface MockProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    shop: {
        name: string;
        logo: string;
    };
}

export const mockProducts: MockProduct[] = [
    {
        id: '1',
        name: 'Vase en Céramique Bleue',
        description: 'Un vase artisanal fabriqué à la main avec de l\'argile locale et une glaçure minérale unique.',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1578749553846-bc3a6c9a4421?auto=format&fit=crop&q=80&w=400',
        shop: {
            name: 'Atelier de la Terre',
            logo: 'https://images.unsplash.com/photo-1541944743827-e04bb645f9ad?auto=format&fit=crop&q=80&w=100'
        }
    },
    {
        id: '2',
        name: 'Écharpe en Laine Bio',
        description: 'Tissage traditionnel en laine de mouton élevée en plein air, sans colorants chimiques.',
        price: 32.50,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=400',
        shop: {
            name: 'Tissage & Co',
            logo: 'https://images.unsplash.com/photo-1621237023020-f57f5c9428b4?auto=format&fit=crop&q=80&w=100'
        }
    },
    {
        id: '3',
        name: 'Table de Chevet Chêne',
        description: 'Fabriquée à partir de chêne massif recyclé, chaque table possède un grain unique.',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=400',
        shop: {
            name: 'Le Coin du Bois',
            logo: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=100'
        }
    },
    {
        id: '4',
        name: 'Savon Artisanal Lavande',
        description: 'Saponification à froid avec des huiles essentielles bio de Provence.',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=400',
        shop: {
            name: 'Bullles & Nature',
            logo: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=100'
        }
    },
    {
        id: '5',
        name: 'Panier en Osier Tressé',
        description: 'Panier robuste idéal pour le marché, tressé à la main par des vanneries locales.',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1590736704728-f4730bb3c570?auto=format&fit=crop&q=80&w=400',
        shop: {
            name: 'Vannerie d\'Antan',
            logo: 'https://images.unsplash.com/photo-1590736704728-f4730bb3c570?auto=format&fit=crop&q=80&w=100'
        }
    }
];
