// Service Ecobalyse - Communication avec l'API Ecobalyse pour le calcul d'impact environnemental textile

import {
    EcobalyseTextileQuery,
    EcobalyseSimulationResponse,
    EcobalyseCountry,
    EcobalyseMaterialOption,
    EcobalyseProductOption
} from '@/types/ecobalyse.types';

const ECOBALYSE_API_BASE = 'https://ecobalyse.beta.gouv.fr/api';

export class EcobalyseService {
    /**
     * Récupère la liste des pays disponibles pour les simulations textile
     */
    async getCountries(): Promise<EcobalyseCountry[]> {
        const response = await fetch(`${ECOBALYSE_API_BASE}/textile/countries`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des pays');
        }
        return response.json();
    }

    /**
     * Récupère la liste des matières textiles disponibles
     */
    async getMaterials(): Promise<EcobalyseMaterialOption[]> {
        const response = await fetch(`${ECOBALYSE_API_BASE}/textile/materials`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des matières');
        }
        return response.json();
    }

    /**
     * Récupère la liste des types de produits textiles
     */
    async getProducts(): Promise<EcobalyseProductOption[]> {
        const response = await fetch(`${ECOBALYSE_API_BASE}/textile/products`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des produits');
        }
        return response.json();
    }

    /**
     * Calcule le score environnemental d'un produit textile
     */
    async calculateScore(query: EcobalyseTextileQuery): Promise<EcobalyseSimulationResponse> {
        const response = await fetch(`${ECOBALYSE_API_BASE}/textile/simulator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.general || 'Erreur lors du calcul du score');
        }

        return response.json();
    }
}

export const ecobalyseService = new EcobalyseService();
