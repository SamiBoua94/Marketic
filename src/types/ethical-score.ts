export interface EthicalCriteria {
  // Matériaux et durabilité
  materials: {
    score: number; // 0-20
    details: {
      renewableMaterials: boolean; // +5
      recycledMaterials: boolean; // +5
      sustainableSourcing: boolean; // +5
      nonToxic: boolean; // +5
    };
  };

  // Origine et localité
  origin: {
    score: number; // 0-25
    details: {
      localProduction: boolean; // +10 (rayon < 100km)
      madeInFrance: boolean; // +10
      europeanProduction: boolean; // +5
      fairTrade: boolean; // +5
    };
  };

  // Production et artisanat
  production: {
    score: number; // 0-20
    details: {
      handmade: boolean; // +10
      smallBatch: boolean; // +5
      traditionalTechniques: boolean; // +5
    };
  };

  // Éthique sociale et environnementale
  ethics: {
    score: number; // 0-20
    details: {
      notOnBoycottList: boolean; // +10
      certifiedEthical: boolean; // +5
      workerRights: boolean; // +5
    };
  };

  // Transparence et traçabilité
  transparency: {
    score: number; // 0-15
    details: {
      supplyChainTraceable: boolean; // +5
      ingredientsListed: boolean; // +5
      carbonFootprint: boolean; // +5
    };
  };
}

export interface EthicalScore {
  totalScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  criteria: EthicalCriteria;
  recommendations: string[];
  lastUpdated: Date;
}

export interface ProductEthicalData {
  productId: string;
  materials: {
    types: string[];
    renewable: boolean;
    recycled: boolean;
    sustainable: boolean;
    nonToxic: boolean;
  };
  origin: {
    country: string;
    region: string;
    coordinates?: { lat: number; lng: number };
    distanceFromUser?: number; // en km
  };
  production: {
    handmade: boolean;
    batchSize: 'small' | 'medium' | 'large';
    techniques: string[];
  };
  brand: {
    name: string;
    certifications: string[];
    onBoycottList: boolean;
    ethicalPolicies: boolean;
  };
  transparency: {
    supplyChainKnown: boolean;
    ingredientsPublic: boolean;
    carbonFootprintCalculated: boolean;
  };
}
