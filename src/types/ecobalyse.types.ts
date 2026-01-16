// Types pour l'API Ecobalyse - Textile

// Types de produits textiles disponibles
export type EcobalyseProductType =
    | 'calecon'
    | 'chaussettes'
    | 'chemise'
    | 'jean'
    | 'jupe'
    | 'maillot-de-bain'
    | 'manteau'
    | 'pantalon'
    | 'pull'
    | 'slip'
    | 'tshirt';

// Procédés de fabrication du tissu
export type EcobalyseFabricProcess =
    | 'knitting-mix'
    | 'knitting-fully-fashioned'
    | 'knitting-integral'
    | 'knitting-circular'
    | 'knitting-straight'
    | 'weaving';

// Procédés de filature
export type EcobalyseSpinningType =
    | 'ConventionalSpinning'
    | 'UnconventionalSpinning'
    | 'SyntheticSpinning';

// Matière dans une requête
export interface EcobalyseMaterial {
    id: string;
    share: number; // Entre 0 et 1
    country?: string; // Code ISO 2 lettres
    spinning?: EcobalyseSpinningType;
}

// Requête de simulation textile
export interface EcobalyseTextileQuery {
    mass: number; // Masse en kg
    product: EcobalyseProductType;
    materials: EcobalyseMaterial[];
    countrySpinning?: string;
    countryFabric?: string;
    countryDyeing?: string;
    countryMaking?: string;
    fabricProcess?: EcobalyseFabricProcess;
    airTransportRatio?: number;
    business?: 'small-business' | 'large-business-with-services' | 'large-business-without-services';
    price?: number;
    upcycled?: boolean;
}

// Impacts environnementaux
export interface EcobalyseImpacts {
    acd?: number; // Acidification (mol éq. H+)
    bvi?: number; // Biodiversité locale
    cch?: number; // Changement climatique (kg éq. CO2)
    ecs?: number; // Score d'impacts (µPts)
    etf?: number; // Écotoxicité eau douce
    fru?: number; // Ressources fossiles (MJ)
    fwe?: number; // Eutrophisation eaux douces
    htc?: number; // Toxicité humaine - cancer
    htn?: number; // Toxicité humaine - non-cancer
    ior?: number; // Radiations ionisantes
    ldu?: number; // Utilisation des sols
    mru?: number; // Ressources minérales
    ozd?: number; // Couche d'ozone
    pco?: number; // Ozone photochimique
    pef?: number; // Score PEF (µPt)
    pma?: number; // Particules
    swe?: number; // Eutrophisation marine
    tre?: number; // Eutrophisation terrestre
    wtu?: number; // Ressources en eau (m³)
}

// Réponse de l'API simulation
export interface EcobalyseSimulationResponse {
    impacts: EcobalyseImpacts;
    description?: string;
    query?: EcobalyseTextileQuery;
}

// Pays disponible
export interface EcobalyseCountry {
    code: string;
    name: string;
}

// Matière disponible
export interface EcobalyseMaterialOption {
    id: string;
    name: string;
    uuid?: string;
}

// Type de produit disponible
export interface EcobalyseProductOption {
    id: string;
    name: string;
}

// Données du formulaire Ecobalyse dans ProductInfo
export interface EcobalyseFormData {
    productType?: EcobalyseProductType;
    mass?: number;
    materials: { id: string; share: number; country?: string }[];
    countrySpinning?: string;
    countryFabric?: string;
    countryDyeing?: string;
    countryMaking?: string;
    fabricProcess?: EcobalyseFabricProcess;
    upcycled?: boolean;
}

// Score calculé à afficher
export interface EcobalyseScore {
    pef?: number;      // Score PEF en µPt
    cch?: number;      // CO2 en kg éq. CO2
    ecs?: number;      // Score d'impact
    calculated: boolean;
    error?: string;
}
