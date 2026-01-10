import { EthicalCriteria, EthicalScore, ProductEthicalData } from '@/types/ethical-score';

export class EthicalScoreCalculator {
  /**
   * Calcule le score éthique d'un produit
   * @param productData Données éthiques du produit
   * @param userLocation Coordonnées de l'utilisateur (optionnel)
   * @returns Le score éthique complet
   */
  static calculateScore(productData: ProductEthicalData, userLocation?: { lat: number; lng: number }): EthicalScore {
    const criteria = this.calculateCriteria(productData, userLocation);
    const totalScore = this.calculateTotalScore(criteria);
    const grade = this.getGrade(totalScore);
    const recommendations = this.generateRecommendations(criteria, totalScore);

    return {
      totalScore,
      grade,
      criteria,
      recommendations,
      lastUpdated: new Date()
    };
  }

  private static calculateCriteria(productData: ProductEthicalData, userLocation?: { lat: number; lng: number }): EthicalCriteria {
    return {
      materials: this.calculateMaterialsScore(productData.materials),
      origin: this.calculateOriginScore(productData.origin, userLocation),
      production: this.calculateProductionScore(productData.production),
      ethics: this.calculateEthicsScore(productData.brand),
      transparency: this.calculateTransparencyScore(productData.transparency)
    };
  }

  private static calculateMaterialsScore(materials: ProductEthicalData['materials']): EthicalCriteria['materials'] {
    let score = 0;
    const details = {
      renewableMaterials: materials.renewable,
      recycledMaterials: materials.recycled,
      sustainableSourcing: materials.sustainable,
      nonToxic: materials.nonToxic
    };

    if (details.renewableMaterials) score += 5;
    if (details.recycledMaterials) score += 5;
    if (details.sustainableSourcing) score += 5;
    if (details.nonToxic) score += 5;

    return { score, details };
  }

  private static calculateOriginScore(
    origin: ProductEthicalData['origin'], 
    userLocation?: { lat: number; lng: number }
  ): EthicalCriteria['origin'] {
    let score = 0;
    
    // Calcul de la localité
    const isLocal = origin.distanceFromUser !== undefined && origin.distanceFromUser <= 100;
    const isMadeInFrance = origin.country.toLowerCase() === 'france' || origin.country.toLowerCase() === 'fr';
    const isEuropean = this.isEuropeanCountry(origin.country);

    const details = {
      localProduction: isLocal,
      madeInFrance: isMadeInFrance,
      europeanProduction: isEuropean,
      fairTrade: false // À implémenter avec une base de données
    };

    if (details.localProduction) score += 10;
    if (details.madeInFrance) score += 10;
    if (details.europeanProduction) score += 5;
    if (details.fairTrade) score += 5;

    return { score, details };
  }

  private static calculateProductionScore(production: ProductEthicalData['production']): EthicalCriteria['production'] {
    let score = 0;
    const details = {
      handmade: production.handmade,
      smallBatch: production.batchSize === 'small',
      traditionalTechniques: production.techniques.length > 0
    };

    if (details.handmade) score += 10;
    if (details.smallBatch) score += 5;
    if (details.traditionalTechniques) score += 5;

    return { score, details };
  }

  private static calculateEthicsScore(brand: ProductEthicalData['brand']): EthicalCriteria['ethics'] {
    let score = 0;
    const details = {
      notOnBoycottList: !brand.onBoycottList,
      certifiedEthical: brand.certifications.length > 0,
      workerRights: brand.ethicalPolicies
    };

    if (details.notOnBoycottList) score += 10;
    if (details.certifiedEthical) score += 5;
    if (details.workerRights) score += 5;

    return { score, details };
  }

  private static calculateTransparencyScore(transparency: ProductEthicalData['transparency']): EthicalCriteria['transparency'] {
    let score = 0;
    const details = {
      supplyChainTraceable: transparency.supplyChainKnown,
      ingredientsListed: transparency.ingredientsPublic,
      carbonFootprint: transparency.carbonFootprintCalculated
    };

    if (details.supplyChainTraceable) score += 5;
    if (details.ingredientsListed) score += 5;
    if (details.carbonFootprint) score += 5;

    return { score, details };
  }

  private static calculateTotalScore(criteria: EthicalCriteria): number {
    return Math.round(
      criteria.materials.score +
      criteria.origin.score +
      criteria.production.score +
      criteria.ethics.score +
      criteria.transparency.score
    );
  }

  private static getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'E' {
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    if (score >= 20) return 'D';
    return 'E';
  }

  private static generateRecommendations(criteria: EthicalCriteria, totalScore: number): string[] {
    const recommendations: string[] = [];

    if (criteria.materials.score < 15) {
      recommendations.push("Privilégiez des matériaux recyclés, durables et non toxiques");
    }

    if (criteria.origin.score < 20) {
      recommendations.push("Recherchez des produits fabriqués localement ou en France");
    }

    if (criteria.production.score < 15) {
      recommendations.push("Optez pour des produits faits main ou en petites séries");
    }

    if (criteria.ethics.score < 15) {
      recommendations.push("Vérifiez que la marque n'est pas sur liste de boycott et a des certifications éthiques");
    }

    if (criteria.transparency.score < 10) {
      recommendations.push("Privilégiez les marques transparentes sur leur chaîne d'approvisionnement");
    }

    if (totalScore >= 80) {
      recommendations.push("Excellent choix ! Ce produit a un score éthique remarquable");
    }

    return recommendations;
  }

  private static isEuropeanCountry(country: string): boolean {
    const europeanCountries = [
      'france', 'fr', 'allemagne', 'de', 'belgique', 'be', 'espagne', 'es',
      'italie', 'it', 'portugal', 'pt', 'pays-bas', 'nl', 'suisse', 'ch',
      'autriche', 'at', 'suède', 'se', 'danemark', 'dk', 'norvège', 'no',
      'finlande', 'fi', 'pologne', 'pl', 'république tchèque', 'cz'
    ];
    return europeanCountries.includes(country.toLowerCase());
  }

  /**
   * Vérifie si une marque est sur liste de boycott
   * @param brandName Nom de la marque
   * @returns true si la marque est sur liste de boycott
   */
  static async checkBoycottList(brandName: string): Promise<boolean> {
    // Simulation - en production, utiliser une API réelle
    const boycottList = [
      'nestlé', 'coca-cola', 'mcdonald', 'amazon', 'apple', 'samsung'
    ];
    
    return boycottList.some(brand => 
      brandName.toLowerCase().includes(brand)
    );
  }
}
