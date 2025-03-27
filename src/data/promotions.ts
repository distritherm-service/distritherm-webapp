export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  validUntil: string; // Date au format ISO
  code: string;
  inStock: boolean;
  featured?: boolean;
}

export const promotions: Promotion[] = [
  {
    id: "promo1",
    title: "POMPE À CHALEUR SPLIT 5 À 17 KW - OFFRE EXCLUSIVE",
    description: "Profitez de -20% sur cette pompe à chaleur haute performance avec installation gratuite jusqu'au 30/06/2023.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "POMPE À CHALEUR",
    subcategory: "Split",
    brand: "ATLANTIC",
    originalPrice: 3999.99,
    discountPrice: 3199.99,
    discountPercentage: 20,
    validUntil: "2023-06-30",
    code: "PAC20",
    inStock: true,
    featured: true
  },
  {
    id: "promo2",
    title: "PACK CLIMATISATION ÉTÉ - SPLIT MURAL + INSTALLATION",
    description: "Préparez votre été avec notre offre spéciale climatisation - garantie 5 ans incluse !",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CLIMATISATION",
    subcategory: "Split mural",
    brand: "THERMOR",
    originalPrice: 1899.99,
    discountPrice: 1399.99,
    discountPercentage: 26,
    validUntil: "2023-06-15",
    code: "CLIM26",
    inStock: true,
    featured: true
  },
  {
    id: "promo3",
    title: "CHAUFFE-EAU THERMODYNAMIQUE - REMISE IMMÉDIATE",
    description: "Économisez sur votre facture d'eau chaude avec ce chauffe-eau nouvelle génération à prix réduit.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "EAU CHAUDE SANITAIRE",
    subcategory: "Thermodynamique",
    brand: "THERMOR",
    originalPrice: 2499.99,
    discountPrice: 1999.99,
    discountPercentage: 20,
    validUntil: "2023-05-31",
    code: "THERMO20",
    inStock: true
  },
  {
    id: "promo4",
    title: "OFFRE PHOTOVOLTAÏQUE - ONDULEUR + 4 PANNEAUX",
    description: "Kit complet photovoltaïque avec installation à prix promotionnel pour une autonomie énergétique.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "ONDULEUR",
    subcategory: "Monophasé",
    brand: "SOLAREDGE",
    originalPrice: 3499.99,
    discountPrice: 2799.99,
    discountPercentage: 20,
    validUntil: "2023-07-15",
    code: "SOLAR20",
    inStock: true
  },
  {
    id: "promo5",
    title: "PACK VENTILATION DOUBLE FLUX - 30% DE REMISE",
    description: "Améliorez la qualité de l'air de votre maison avec notre système de ventilation haut de gamme.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "VENTILATION",
    subcategory: "Double flux",
    brand: "ATLANTIC",
    originalPrice: 1899.99,
    discountPrice: 1329.99,
    discountPercentage: 30,
    validUntil: "2023-05-15",
    code: "VENT30",
    inStock: true,
    featured: true
  },
  {
    id: "promo6",
    title: "RADIATEUR CONNECTÉ NOUVELLE GÉNÉRATION - PACK DE 3",
    description: "Contrôlez votre chauffage à distance et réalisez jusqu'à 30% d'économies d'énergie.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CHAUFFAGE",
    subcategory: "Radiateur",
    brand: "ATLANTIC",
    originalPrice: 1799.99,
    discountPrice: 1259.99,
    discountPercentage: 30,
    validUntil: "2023-06-15",
    code: "RAD30",
    inStock: false
  },
  {
    id: "promo7",
    title: "CHAUDIÈRE À CONDENSATION - PRIME ÉNERGIE INCLUSE",
    description: "Profitez de notre offre exceptionnelle sur cette chaudière à très haut rendement avec prime énergie déduite.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CHAUFFAGE",
    subcategory: "Chaudière",
    brand: "ATLANTIC",
    originalPrice: 2199.99,
    discountPrice: 1539.99,
    discountPercentage: 30,
    validUntil: "2023-05-31",
    code: "CHAUD30",
    inStock: true
  },
  {
    id: "promo8",
    title: "OPTIMISEURS DE PUISSANCE SOLAIRE - LOT DE 5",
    description: "Optimisez votre installation photovoltaïque avec ce lot d'optimiseurs à prix cassé.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "ONDULEUR",
    subcategory: "Accessoires",
    brand: "SOLAREDGE",
    originalPrice: 499.99,
    discountPrice: 349.99,
    discountPercentage: 30,
    validUntil: "2023-06-30",
    code: "OPTI30",
    inStock: true
  },
  {
    id: "promo9",
    title: "VMC SIMPLE FLUX - PRIX SPÉCIAL RÉNOVATION",
    description: "Solution économique pour la ventilation de votre logement avec pose simplifiée.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "VENTILATION",
    subcategory: "Simple flux",
    brand: "ATLANTIC",
    originalPrice: 599.99,
    discountPrice: 449.99,
    discountPercentage: 25,
    validUntil: "2023-07-31",
    code: "VMC25",
    inStock: true
  },
  {
    id: "promo10",
    title: "PACK DOMOTIQUE CHAUFFAGE - CONTRÔLEZ VOTRE CONFORT",
    description: "Gestion intelligente de votre chauffage avec thermostat et vannes connectées compatibles avec tous assistants vocaux.",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CHAUFFAGE",
    subcategory: "Domotique",
    brand: "ATLANTIC",
    originalPrice: 899.99,
    discountPrice: 719.99,
    discountPercentage: 20,
    validUntil: "2023-06-15",
    code: "DOMO20",
    inStock: true,
    featured: true
  }
];

// Fonctions utilitaires pour les filtres
export const getAllPromotionCategories = (): string[] => {
  const categories = new Set(promotions.map(promo => promo.category));
  return Array.from(categories);
};

export const getPromotionSubcategoriesByCategory = (category: string): string[] => {
  const subcategories = new Set(
    promotions
      .filter(promo => promo.category === category)
      .map(promo => promo.subcategory)
  );
  return Array.from(subcategories);
};

export const getAllPromotionBrands = (): string[] => {
  const brands = new Set(promotions.map(promo => promo.brand));
  return Array.from(brands);
};

export const getPromotionPriceRange = (): { min: number; max: number } => {
  const prices = promotions.map(promo => promo.discountPrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Calcul de réduction moyenne
export const getAverageDiscountPercentage = (): number => {
  const total = promotions.reduce((sum, promo) => sum + promo.discountPercentage, 0);
  return Math.round(total / promotions.length);
};

// Nombre de jours restants pour une promotion
export const getDaysRemaining = (validUntilDate: string): number => {
  const today = new Date();
  const endDate = new Date(validUntilDate);
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}; 