import { Product } from '@/types';

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

// Fonction pour récupérer toutes les marques uniques
export const getAllBrands = (): string[] => {
  // TODO: Implémenter la logique pour récupérer les marques depuis l'API
  return ['Marque 1', 'Marque 2', 'Marque 3'];
};

// Fonction pour récupérer la plage de prix des produits
export const getPriceRange = (): [number, number] => {
  // TODO: Implémenter la logique pour récupérer la plage de prix depuis l'API
  return [0, 1000];
}; 