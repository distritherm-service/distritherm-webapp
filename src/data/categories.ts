export const CATEGORIES = [
  'Toutes les catégories',
  'Plâtrerie',
  'Isolation',
  'Chauffage',
  'Climatisation',
  'Sanitaire',
  'Plomberie',
  'Électricité',
  'Outillage',
  'EPI'
];

// Structure pour représenter une catégorie
export interface Category {
  title: string;
  slug: string;
  image: string;
  icon: React.ReactNode;
}

// Exportation des catégories utilisées dans l'application
export const categories: Category[] = [
  {
    title: 'Plâtrerie',
    slug: 'platrerie',
    image: '/images/categories/platrerie.jpg',
    icon: null
  },
  {
    title: 'Isolation',
    slug: 'isolation',
    image: '/images/categories/isolation.jpg',
    icon: null
  },
  {
    title: 'Chauffage',
    slug: 'chauffage',
    image: '/images/categories/chauffage.jpg',
    icon: null
  },
  {
    title: 'Climatisation',
    slug: 'climatisation',
    image: '/images/categories/climatisation.jpg',
    icon: null
  },
  {
    title: 'Sanitaire',
    slug: 'sanitaire',
    image: '/images/categories/sanitaire.jpg',
    icon: null
  },
  {
    title: 'Plomberie',
    slug: 'plomberie',
    image: '/images/categories/plomberie.jpg',
    icon: null
  },
  {
    title: 'Électricité',
    slug: 'electricite',
    image: '/images/categories/electricite.jpg',
    icon: null
  },
  {
    title: 'Outillage',
    slug: 'outillage',
    image: '/images/categories/outillage.jpg',
    icon: null
  },
  {
    title: 'EPI',
    slug: 'epi',
    image: '/images/categories/epi.jpg',
    icon: null
  }
];

export const SUBCATEGORIES: { [key: string]: string[] } = {
  'Plâtrerie': [
    'Toutes les sous-catégories',
    'Plaque standard',
    'Plaque hydro',
    'Plaque technique',
    'Carreau de plâtre',
    'Faux plafonds',
    'Colle',
    'Enduit',
    'Mortier',
    'Peinture',
    'Ossature',
    'Outils et accessoires du plaquiste'
  ],
  'Isolation': [
    'Toutes les sous-catégories',
    'Isolation intérieure',
    'Isolation extérieure'
  ],
  'Chauffage': [
    'Toutes les sous-catégories',
    'Pompe à chaleur AIR/EAU',
    'Chaudières',
    'Radiateurs',
    'Plancher chauffant',
    'Poêles',
    'Accessoires'
  ],
  'Climatisation': [
    'Toutes les sous-catégories',
    'Pompe à chaleur AIR/EAU',
    'Climatiseur',
    'VRV VRF',
    'Ventilation',
    'Accessoires'
  ],
  'Sanitaire': [
    'Toutes les sous-catégories',
    'Chauffe-eaux et ballons',
    'Mobilier',
    'Robinetterie',
    'Sèche serviette',
    'Espace douche',
    'Espace WC',
    'Traitement de l\'eau'
  ],
  'Plomberie': [
    'Toutes les sous-catégories',
    'Alimentation',
    'Fixations',
    'Évacuation',
    'Accessoires'
  ],
  'Électricité': [
    'Toutes les sous-catégories',
    'Thermostats',
    'Câbles',
    'Gaines',
    'Disjoncteurs',
    'Panneaux solaires'
  ],
  'Outillage': [
    'Toutes les sous-catégories',
    'Électroportatif',
    'À main',
    'Accessoires'
  ],
  'EPI': [
    'Toutes les sous-catégories',
    'Casques et protections auditives',
    'Lunettes et masques de protection',
    'Gants',
    'Chaussures',
    'Vêtements'
  ]
};

// Fonction pour récupérer toutes les catégories
export const getAllCategories = (): string[] => {
  return CATEGORIES.filter(cat => cat !== 'Toutes les catégories');
};

// Fonction pour récupérer les sous-catégories d'une catégorie
export const getSubcategoriesByCategory = (category: string): string[] => {
  return SUBCATEGORIES[category]?.filter(subcat => subcat !== 'Toutes les sous-catégories') || [];
};

// Fonction pour récupérer toutes les marques (simulé pour le moment)
export const getAllBrands = (): string[] => {
  return [
    'Atlantic',
    'Bosch',
    'Daikin',
    'De Dietrich',
    'Grohe',
    'Hansgrohe',
    'Knauf',
    'Legrand',
    'Placo',
    'Schneider',
    'Siemens',
    'Viessmann'
  ];
};

// Fonction pour récupérer la plage de prix (simulé pour le moment)
export const getPriceRange = (): [number, number] => {
  return [0, 10000];
}; 