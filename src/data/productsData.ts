import { Product } from '../types/product';

export const productsData: Record<string, Product[]> = {
  // Platerie
  'platerie': [
    {
      id: 'pl-001',
      name: 'Plaque de plâtre BA13',
      description: 'Plaque de plâtre standard pour cloison et plafond',
      price: 4.99,
      image: '/images/products/ba13.jpg',
      category: 'platerie',
      subCategory: 'ba13',
      features: ['Épaisseur: 13mm', 'Format: 1200x2400mm', 'Résistance au feu'],
      stock: 100,
      brand: 'Placo',
      rating: 4.5,
      reviews: 25
    },
    {
      id: 'pl-002',
      name: 'Plaque de plâtre hydrofuge',
      description: 'Plaque de plâtre résistante à l\'humidité',
      price: 7.99,
      image: '/images/products/hydrofuge.jpg',
      category: 'platerie',
      subCategory: 'hydrofuge',
      features: ['Épaisseur: 13mm', 'Résistant à l\'humidité', 'Idéal pour salle de bain'],
      stock: 75,
      brand: 'Placo',
      rating: 4.8,
      reviews: 18
    },
    {
      id: 'pl-003',
      name: 'Plaque de plâtre phonique',
      description: 'Plaque de plâtre à isolation phonique renforcée',
      price: 9.99,
      image: '/images/products/phonique.jpg',
      category: 'platerie',
      subCategory: 'phonique',
      features: ['Épaisseur: 13mm', 'Isolation phonique renforcée', 'Format: 1200x2400mm'],
      stock: 50,
      brand: 'Placo',
      rating: 4.7,
      reviews: 12
    }
  ],

  // Isolation
  'isolation': [
    {
      id: 'is-001',
      name: 'Laine de verre R=3.7',
      description: 'Laine de verre pour isolation thermique et phonique',
      price: 12.99,
      image: '/images/products/laine-verre.jpg',
      category: 'isolation',
      subCategory: 'laine-verre',
      features: ['R=3.7', 'Format: 1000x600mm', 'Épaisseur: 100mm'],
      stock: 200,
      brand: 'Isover',
      rating: 4.6,
      reviews: 45
    },
    {
      id: 'is-002',
      name: 'Panneau de polystyrène extrudé',
      description: 'Panneau isolant haute performance',
      price: 24.99,
      image: '/images/products/polystyrene.jpg',
      category: 'isolation',
      subCategory: 'polystyrene',
      features: ['R=5.0', 'Format: 1200x600mm', 'Épaisseur: 100mm'],
      stock: 150,
      brand: 'Styrodur',
      rating: 4.9,
      reviews: 32
    },
    {
      id: 'is-003',
      name: 'Laine de roche R=4.0',
      description: 'Laine de roche pour isolation thermique et acoustique',
      price: 15.99,
      image: '/images/products/laine-roche.jpg',
      category: 'isolation',
      subCategory: 'laine-roche',
      features: ['R=4.0', 'Format: 1000x600mm', 'Épaisseur: 100mm'],
      stock: 180,
      brand: 'Rockwool',
      rating: 4.7,
      reviews: 28
    },
    {
      id: 'iso-001',
      name: 'Laine de verre haute performance',
      description: 'Rouleau de laine de verre pour isolation thermique et acoustique',
      price: 49.99,
      image: '/image-produit-defaut.jpeg',
      category: 'isolation',
      subCategory: 'laine-minerale',
      features: ['R=7', 'Épaisseur 240mm', '5.4m²/rouleau'],
      stock: 100,
      brand: 'Isover',
      rating: 4.6,
      reviews: 45
    }
  ],

  // Chauffage
  'chauffage': [
    {
      id: 'ch-001',
      name: 'Pompe à chaleur air/eau',
      description: 'Pompe à chaleur haute performance pour chauffage et eau chaude',
      price: 4999.99,
      image: '/images/products/pac-air-eau.jpg',
      category: 'chauffage',
      subCategory: 'pompe-chaleur',
      features: ['COP: 4.5', 'Puissance: 8kW', 'Garantie: 5 ans'],
      stock: 15,
      brand: 'Daikin',
      rating: 4.8,
      reviews: 12
    },
    {
      id: 'ch-002',
      name: 'Chaudière à condensation gaz',
      description: 'Chaudière à condensation haute efficacité énergétique',
      price: 2999.99,
      image: '/images/products/chaudiere-gaz.jpg',
      category: 'chauffage',
      subCategory: 'chaudiere',
      features: ['Rendement: 98%', 'Puissance: 24kW', 'Garantie: 5 ans'],
      stock: 20,
      brand: 'Viessmann',
      rating: 4.7,
      reviews: 18
    },
    {
      id: 'ch-003',
      name: 'Radiateur électrique intelligent',
      description: 'Radiateur électrique connecté avec programmation',
      price: 299.99,
      image: '/images/products/radiateur-electrique.jpg',
      category: 'chauffage',
      subCategory: 'radiateur',
      features: ['Connecté WiFi', 'Programmation', 'Détection présence'],
      stock: 50,
      brand: 'Thermor',
      rating: 4.6,
      reviews: 25
    },
    {
      id: 'chauf-001',
      name: 'Radiateur connecté intelligent',
      description: 'Radiateur électrique avec programmation et contrôle via smartphone',
      price: 399.99,
      image: '/image-produit-defaut.jpeg',
      category: 'chauffage',
      subCategory: 'radiateur',
      features: ['1500W', 'Wifi intégré', 'Programmation hebdomadaire'],
      stock: 20,
      brand: 'Atlantic',
      rating: 4.7,
      reviews: 36
    }
  ],

  // Climatisation
  'climatisation': [
    {
      id: 'cl-001',
      name: 'Climatiseur réversible',
      description: 'Climatiseur réversible haute performance',
      price: 1299.99,
      image: '/images/products/clim-reversible.jpg',
      category: 'climatisation',
      subCategory: 'reversible',
      features: ['Puissance: 3.5kW', 'SEER: 5.2', 'Garantie: 5 ans'],
      stock: 25,
      brand: 'Mitsubishi',
      rating: 4.9,
      reviews: 15
    },
    {
      id: 'cl-002',
      name: 'Climatiseur monosplit',
      description: 'Climatiseur monosplit silencieux',
      price: 899.99,
      image: '/images/products/clim-monosplit.jpg',
      category: 'climatisation',
      subCategory: 'monosplit',
      features: ['Puissance: 2.5kW', 'SEER: 4.8', 'Niveau sonore: 19dB'],
      stock: 30,
      brand: 'Daikin',
      rating: 4.7,
      reviews: 20
    },
    {
      id: 'cl-003',
      name: 'Climatiseur multisplit',
      description: 'Climatiseur multisplit pour plusieurs pièces',
      price: 2499.99,
      image: '/images/products/clim-multisplit.jpg',
      category: 'climatisation',
      subCategory: 'multisplit',
      features: ['4 unités intérieures', 'Puissance: 8kW', 'SEER: 5.0'],
      stock: 10,
      brand: 'Mitsubishi',
      rating: 4.8,
      reviews: 8
    }
  ],

  'sanitaire': [
    {
      id: 'san-001',
      name: 'Pack WC suspendu',
      description: 'Pack WC suspendu complet avec bâti-support et plaque de commande double',
      price: 299.99,
      image: '/image-produit-defaut.jpeg',
      category: 'sanitaire',
      subCategory: 'wc',
      features: ['Bâti-support inclus', 'Cuvette en céramique', 'Plaque double commande'],
      stock: 25,
      brand: 'Geberit',
      rating: 4.8,
      reviews: 32
    }
  ],

  'outillage': [
    {
      id: 'out-001',
      name: 'Perceuse visseuse 18V',
      description: 'Perceuse visseuse sans fil professionnelle avec 2 batteries Li-ion',
      price: 199.99,
      image: '/image-produit-defaut.jpeg',
      category: 'outillage',
      subCategory: 'electroportatif',
      features: ['18V', '2 batteries 4.0Ah', '13mm mandrin'],
      stock: 45,
      brand: 'Makita',
      rating: 4.7,
      reviews: 58
    }
  ],

  'electricite': [
    {
      id: 'elec-001',
      name: 'Tableau électrique pré-équipé',
      description: 'Tableau électrique 3 rangées avec protection différentielle',
      price: 159.99,
      image: '/image-produit-defaut.jpeg',
      category: 'electricite',
      subCategory: 'protection',
      features: ['3 rangées', 'Pré-équipé', '13 modules par rangée'],
      stock: 30,
      brand: 'Legrand',
      rating: 4.9,
      reviews: 27
    }
  ],

  'plomberie': [
    {
      id: 'plomb-001',
      name: 'Mitigeur thermostatique douche',
      description: 'Mitigeur thermostatique de douche avec système anti-brûlure',
      price: 129.99,
      image: '/image-produit-defaut.jpeg',
      category: 'plomberie',
      subCategory: 'robinetterie',
      features: ['Thermostatique', 'Anti-brûlure', 'Chrome'],
      stock: 40,
      brand: 'Grohe',
      rating: 4.8,
      reviews: 42
    }
  ],

  'epi': [
    {
      id: 'epi-001',
      name: 'Pack sécurité chantier complet',
      description: 'Kit complet EPI avec équipements de protection essentiels',
      price: 79.99,
      image: '/image-produit-defaut.jpeg',
      category: 'epi',
      subCategory: 'protection-individuelle',
      features: ['Casque', 'Lunettes', 'Gants', 'Chaussures sécurité'],
      stock: 50,
      brand: '3M',
      rating: 4.6,
      reviews: 33
    }
  ],

  'peinture': [
    {
      id: 'peint-001',
      name: 'Peinture acrylique mate premium',
      description: 'Peinture mate haute qualité pour murs et plafonds, application facile',
      price: 39.99,
      image: '/image-produit-defaut.jpeg',
      category: 'peinture',
      subCategory: 'peinture-interieure',
      features: ['10L', 'Blanc mat', 'Sans solvants'],
      stock: 60,
      brand: 'Dulux',
      rating: 4.7,
      reviews: 51
    }
  ]
}; 