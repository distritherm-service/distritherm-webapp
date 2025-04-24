import axiosInstance from './axiosConfig';

// Interface du produit correspondant à l'API
export interface Product {
  id: number;
  name: string;
  description: string;
  priceHt: number;
  priceTtc: number;
  quantity: number;
  imagesUrl: string[];
  categoryId: number;
  markId: number;
  itemCode: string;
  active: boolean;
  directorWord1: string;
  directorWord2: string;
  directorWord3: string;
  directorWord4: string;
  directorWord5: string;
  directorWordLink1: string;
  directorWordLink2: string;
  directorWordLink3: string;
  directorWordLink4: string;
  directorWordLink5: string;
  brandLogo: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les options de filtrage
export interface FilterOptions {
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  inStockOnly?: boolean;
  sortBy?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

// Interface pour la réponse de l'API contenant les produits
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface pour la réponse de la plage de prix
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Récupère les produits depuis l'API avec des filtres optionnels
 */
export const getProducts = async (filters?: FilterOptions): Promise<ProductsResponse> => {
  try {
    // Construire les paramètres de requête à partir des filtres
    const params: Record<string, any> = {};
    
    if (filters) {
      if (filters.category && filters.category !== 'Toutes les catégories') {
        params.category = filters.category;
      }
      
      if (filters.brand && filters.brand !== 'Toutes les marques') {
        params.brand = filters.brand;
      }
      
      if (filters.priceRange) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
      }
      
      if (filters.inStockOnly) {
        params.inStock = true;
      }
      
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }
      
      if (filters.searchQuery) {
        params.search = filters.searchQuery;
      }
      
      // Pagination
      params.page = filters.page || 1;
      params.limit = filters.limit || 10;
    }
    
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    
    // Créer des produits de test en cas d'erreur
    const mockProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Produit test ${i + 1}`,
      description: "Description du produit test. Ce produit est généré automatiquement car l'API est inaccessible.",
      priceHt: 100 + i * 10,
      priceTtc: (100 + i * 10) * 1.2,
      quantity: Math.floor(Math.random() * 10),
      imagesUrl: ['/image-produit-defaut.jpeg'],
      categoryId: 1,
      markId: 1,
      itemCode: `ITEM${i + 100}`,
      active: true,
      directorWord1: '',
      directorWord2: '',
      directorWord3: '',
      directorWord4: '',
      directorWord5: '',
      directorWordLink1: '',
      directorWordLink2: '',
      directorWordLink3: '',
      directorWordLink4: '',
      directorWordLink5: '',
      brandLogo: '',
      weight: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Retourner une réponse par défaut en cas d'erreur
    return {
      products: mockProducts,
      total: mockProducts.length,
      page: 1,
      limit: 10,
      totalPages: 1
    };
  }
};

/**
 * Récupère un produit par son identifiant
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    return null;
  }
};

/**
 * Récupère la plage de prix des produits
 */
export const getPriceRange = async (): Promise<PriceRange> => {
  try {
    const response = await axiosInstance.get('/products/price-range');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la plage de prix:', error);
    // Retourner une plage par défaut en cas d'erreur
    return { min: 0, max: 1000 };
  }
};

/**
 * Récupère toutes les marques disponibles
 */
export const getAllBrands = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get('/products/brands');
    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
    // Retourner des marques par défaut en cas d'erreur
    return ['Daikin', 'Atlantic', 'Samsung', 'Mitsubishi', 'LG', 'Toshiba'];
  }
};

// Fonctions pour gérer les catégories (pour compatibilité avec le code existant)
export const getCategories = () => {
  return ['Chauffage', 'Climatisation', 'Ventilation', 'Plomberie', 'Électricité'];
};

export const filterProductsByCategory = (categoryName: string) => {
  // Cette fonction est conservée pour compatibilité, mais devrait utiliser l'API
  return getProducts({ category: categoryName });
};

// Pour la rétrocompatibilité, garder ces fonctions avec des valeurs par défaut
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

// Fonction pour récupérer toutes les catégories
export const getAllCategories = (): string[] => {
  return CATEGORIES.filter(cat => cat !== 'Toutes les catégories');
};

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

// Fonction pour récupérer les sous-catégories d'une catégorie
export const getSubcategoriesByCategory = (category: string): string[] => {
  return SUBCATEGORIES[category]?.filter(subcat => subcat !== 'Toutes les sous-catégories') || [];
}; 