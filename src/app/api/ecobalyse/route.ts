// Route API Ecobalyse - Proxy vers l'API Ecobalyse externe

import { NextRequest, NextResponse } from 'next/server';

const ECOBALYSE_API_BASE = 'https://ecobalyse.beta.gouv.fr/api';

// GET: Récupérer les listes (materials, products, countries)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (!type) {
            return NextResponse.json(
                { error: 'Le paramètre "type" est requis (materials, products, countries)' },
                { status: 400 }
            );
        }

        let endpoint = '';
        switch (type) {
            case 'materials':
                endpoint = '/textile/materials';
                break;
            case 'products':
                endpoint = '/textile/products';
                break;
            case 'countries':
                endpoint = '/textile/countries';
                break;
            default:
                return NextResponse.json(
                    { error: 'Type invalide. Utilisez: materials, products, countries' },
                    { status: 400 }
                );
        }

        const response = await fetch(`${ECOBALYSE_API_BASE}${endpoint}`);

        if (!response.ok) {
            throw new Error(`Erreur API Ecobalyse: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur Ecobalyse GET:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des données Ecobalyse' },
            { status: 500 }
        );
    }
}

// POST: Calculer le score environnemental
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation de base
        if (!body.mass || !body.product || !body.materials || body.materials.length === 0) {
            return NextResponse.json(
                { error: 'Paramètres requis manquants: mass, product, materials' },
                { status: 400 }
            );
        }

        // Valider que la somme des parts de matières = 1
        const totalShare = body.materials.reduce(
            (sum: number, mat: { share: number }) => sum + mat.share,
            0
        );
        if (Math.abs(totalShare - 1) > 0.01) {
            return NextResponse.json(
                { error: 'La somme des parts de matières doit être égale à 100%' },
                { status: 400 }
            );
        }

        const response = await fetch(`${ECOBALYSE_API_BASE}/textile/simulator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erreur Ecobalyse:', errorData);
            return NextResponse.json(
                {
                    error: errorData.error?.general ||
                        Object.values(errorData.error || {}).join(', ') ||
                        'Erreur lors du calcul du score'
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur Ecobalyse POST:', error);
        return NextResponse.json(
            { error: 'Erreur lors du calcul du score environnemental' },
            { status: 500 }
        );
    }
}
