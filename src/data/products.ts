export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  brand: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isPromo?: boolean;
  category: string;
  subcategory: string;
  level3category?: string;
  level4category?: string;
  stock: number;
  specifications?: Record<string, string>;
};

// Exemple de produits pour notre application
export const products: Product[] = [
  // Produits de la catégorie Chauffage > Chaudières > Chaudières à gaz
  {
    id: 'chaudiere-gaz-condensation-01',
    title: 'Chaudière à gaz à condensation EcoCondens 25kW',
    description: 'Chaudière murale à gaz à condensation, puissance 25kW, rendement jusqu\'à 108%, classe énergétique A+.',
    price: 1499.99,
    compareAtPrice: 1699.99,
    image: '/products/chaudiere-gaz-condensation.jpg',
    brand: 'EcoTherm',
    rating: 4.5,
    reviewCount: 32,
    isNew: true,
    category: 'chauffage',
    subcategory: 'chaudieres',
    level3category: 'chaudieres-gaz',
    level4category: 'condensation',
    stock: 12,
    specifications: {
      'Puissance': '25 kW',
      'Rendement': '108%',
      'Classe énergétique': 'A+',
      'Dimensions': '760 x 440 x 360 mm',
      'Poids': '34 kg'
    }
  },
  {
    id: 'chaudiere-gaz-basse-temperature-01',
    title: 'Chaudière à gaz basse température PlusHeat 20kW',
    description: 'Chaudière murale à gaz basse température, puissance 20kW, économique et fiable.',
    price: 1099.99,
    image: '/products/chaudiere-gaz-basse-temperature.jpg',
    brand: 'PlusHeat',
    rating: 4.2,
    reviewCount: 18,
    category: 'chauffage',
    subcategory: 'chaudieres',
    level3category: 'chaudieres-gaz',
    level4category: 'basse-temperature',
    stock: 8,
    specifications: {
      'Puissance': '20 kW',
      'Rendement': '93%',
      'Classe énergétique': 'B',
      'Dimensions': '720 x 410 x 340 mm',
      'Poids': '32 kg'
    }
  },
  
  // Produits de la catégorie Chauffage > Pompes à chaleur > PAC air/eau
  {
    id: 'pac-air-eau-01',
    title: 'Pompe à chaleur air/eau Atlantic Alfea Excellia 11kW',
    description: 'Pompe à chaleur air/eau bi-bloc, puissance 11kW, COP jusqu\'à 4,5, idéale pour le chauffage et l\'eau chaude sanitaire.',
    price: 3999.99,
    compareAtPrice: 4399.99,
    image: '/products/pac-air-eau.jpg',
    brand: 'Atlantic',
    rating: 4.8,
    reviewCount: 45,
    isPromo: true,
    category: 'chauffage',
    subcategory: 'pompes-a-chaleur',
    level3category: 'pac-air-eau',
    stock: 5,
    specifications: {
      'Puissance': '11 kW',
      'COP': '4,5',
      'Classe énergétique': 'A+++',
      'Dimensions unité extérieure': '870 x 1290 x 400 mm',
      'Dimensions unité intérieure': '890 x 450 x 470 mm'
    }
  },
  
  // Produits de la catégorie Plomberie > Sanitaires > WC
  {
    id: 'wc-suspendu-01',
    title: 'WC suspendu Grohe Bau Ceramic avec abattant frein de chute',
    description: 'Pack WC suspendu en céramique, avec abattant à frein de chute, design moderne et compact.',
    price: 299.99,
    compareAtPrice: 349.99,
    image: '/products/wc-suspendu.jpg',
    brand: 'Grohe',
    rating: 4.6,
    reviewCount: 58,
    category: 'plomberie',
    subcategory: 'sanitaires',
    level3category: 'wc',
    level4category: 'suspendus',
    stock: 15,
    specifications: {
      'Matériau': 'Céramique',
      'Couleur': 'Blanc',
      'Dimensions': '530 x 370 x 340 mm',
      'Abattant': 'Avec frein de chute',
      'Fixation': 'Suspendue'
    }
  },
  
  // Produits de la catégorie Climatisation > Climatiseurs muraux
  {
    id: 'climatiseur-mural-01',
    title: 'Climatiseur mural Daikin Perfera 3,5kW',
    description: 'Climatiseur mural réversible, puissance froid 3,5kW, puissance chaud 4kW, technologie inverter pour une consommation réduite.',
    price: 1199.99,
    image: '/products/climatiseur-mural.jpg',
    brand: 'Daikin',
    rating: 4.7,
    reviewCount: 73,
    isNew: true,
    category: 'climatisation',
    subcategory: 'climatiseurs-muraux',
    stock: 7,
    specifications: {
      'Puissance froid': '3,5 kW',
      'Puissance chaud': '4 kW',
      'SEER': '7,1',
      'SCOP': '4,6',
      'Classe énergétique': 'A++/A+',
      'Niveau sonore min': '19 dB(A)'
    }
  },
  
  // Produits de la catégorie Électricité > Éclairage
  {
    id: 'spot-led-01',
    title: 'Lot de 5 spots LED encastrables orientables 7W',
    description: 'Spots LED encastrables orientables, 7W, blanc chaud, compatible avec variateur, idéal pour salon et cuisine.',
    price: 49.99,
    image: '/products/spot-led.jpg',
    brand: 'LumiPro',
    rating: 4.4,
    reviewCount: 127,
    category: 'electricite',
    subcategory: 'eclairage',
    stock: 32,
    specifications: {
      'Puissance': '7W',
      'Équivalent incandescent': '50W',
      'Température de couleur': '3000K (blanc chaud)',
      'Flux lumineux': '600 lumens',
      'Angle d\'éclairage': '38°',
      'Dimmable': 'Oui'
    }
  },
  
  // Produits de la catégorie Outillage > Outillage électrique
  {
    id: 'perceuse-visseuse-01',
    title: 'Perceuse-visseuse sans fil Bosch GSR 18V-55 Professional',
    description: 'Perceuse-visseuse sans fil 18V, 2 batteries Li-ion 2.0Ah, couple max 55Nm, mandrin auto-serrant 13mm, livrée en coffret.',
    price: 199.99,
    compareAtPrice: 249.99,
    image: '/products/perceuse-visseuse.jpg',
    brand: 'Bosch',
    rating: 4.9,
    reviewCount: 215,
    isPromo: true,
    category: 'outillage',
    subcategory: 'outillage-electrique',
    stock: 14,
    specifications: {
      'Tension': '18V',
      'Couple max': '55 Nm',
      'Vitesse à vide': '0-500/0-1900 tr/min',
      'Capacité mandrin': '13 mm',
      'Poids avec batterie': '1,5 kg',
      'Batteries incluses': '2x 2.0Ah Li-ion'
    }
  },
  
  // Autres produits des différentes catégories
  {
    id: 'radiateur-inertie-01',
    title: 'Radiateur à inertie sèche Atlantic Galapagos 1500W',
    description: 'Radiateur électrique à inertie sèche, puissance 1500W, pilotage intelligent, corps de chauffe en fonte.',
    price: 599.99,
    image: '/products/radiateur-inertie.jpg',
    brand: 'Atlantic',
    rating: 4.6,
    reviewCount: 89,
    category: 'chauffage',
    subcategory: 'radiateurs',
    level3category: 'radiateurs-electriques',
    level4category: 'inertie',
    stock: 9,
    specifications: {
      'Puissance': '1500W',
      'Surface recommandée': '15-20 m²',
      'Dimensions': '578 x 845 x 137 mm',
      'Poids': '30 kg',
      'Programmation': 'Pilotage intelligent'
    }
  },
  {
    id: 'mitigeur-cuisine-01',
    title: 'Mitigeur d\'évier cuisine Hansgrohe Talis S avec douchette extractible',
    description: 'Mitigeur d\'évier avec douchette extractible, finition chromée, installation sur plage, 2 jets.',
    price: 249.99,
    image: '/products/mitigeur-cuisine.jpg',
    brand: 'Hansgrohe',
    rating: 4.7,
    reviewCount: 64,
    category: 'plomberie',
    subcategory: 'robinetterie',
    level3category: 'robinets-cuisine',
    stock: 11,
    specifications: {
      'Type': 'Mitigeur avec douchette extractible',
      'Finition': 'Chromé',
      'Hauteur': '219 mm',
      'Saillie': '226 mm',
      'Jets': '2 (pluie et jet)',
      'Installation': 'Sur plage'
    }
  },
  {
    id: 'thermometre-ir-01',
    title: 'Thermomètre infrarouge numérique Fluke 62 MAX+',
    description: 'Thermomètre infrarouge professionnel, plage de mesure -30°C à +650°C, précision ±1%, résistant aux chutes jusqu\'à 3m.',
    price: 129.99,
    image: '/products/thermometre-ir.jpg',
    brand: 'Fluke',
    rating: 4.8,
    reviewCount: 42,
    category: 'outillage',
    subcategory: 'mesure-et-controle',
    stock: 6,
    specifications: {
      'Plage de mesure': '-30°C à +650°C',
      'Précision': '±1%',
      'Résolution optique': '12:1',
      'Émissivité': 'Réglable',
      'Étanchéité': 'IP54',
      'Alimentation': 'Pile AA'
    }
  }
];

// Fonctions utilitaires pour les filtres
export const getAllCategories = (): string[] => {
  const categories = new Set(products.map(product => product.category));
  return Array.from(categories);
};

export const getSubcategoriesByCategory = (category: string): string[] => {
  const subcategories = new Set(
    products
      .filter(product => product.category === category)
      .map(product => product.subcategory)
  );
  return Array.from(subcategories);
};

export const getAllBrands = (): string[] => {
  const brands = new Set(products.map(product => product.brand));
  return Array.from(brands);
};

export const getPriceRange = (): { min: number; max: number } => {
  const prices = products.map(product => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}; 