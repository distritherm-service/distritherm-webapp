import axiosInstance from './axiosConfig';
// Importation du service de catégorie
import { categoryService } from './categoryService';
import { Category } from '@/types/category';
import { getAllMarks } from './markService';

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
      
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }
      
      if (filters.searchQuery) {
        params.search = filters.searchQuery;
      }
      
      // Pagination
      params.page = filters.page || 1;
      params.limit = filters.limit || 12;
    }
    
    const response = await axiosInstance.get('/products', { params });
    let products = response.data.products;

    // Filtrer les produits par prix côté client si un filtre de prix est défini
    if (filters?.priceRange) {
      products = products.filter((product: Product) => 
        product.priceHt >= filters.priceRange![0] && 
        product.priceHt <= filters.priceRange![1]
      );
    }

    // Filtrer les produits par marque côté client
    if (filters?.brand && filters.brand !== 'Toutes les marques') {
      products = products.filter((product: Product) => 
        product.markId.toString() === filters.brand
      );
    }

    return {
      ...response.data,
      products
    };
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

    return {
      products: mockProducts,
      total: mockProducts.length,
      page: 1,
      limit: 12,
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
 * Récupère toutes les marques disponibles
 */
export const getAllBrands = async (): Promise<string[]> => {
  try {
    return await getAllMarks();
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
    // Retourner des marques par défaut en cas d'erreur
    return ['Daikin', 'Atlantic', 'Samsung', 'Mitsubishi', 'LG', 'Toshiba'];
  }
};

// Cache pour stocker les catégories récupérées de l'API
let categoriesCache: Category[] = [];

// Fonctions pour gérer les catégories avec l'API
export const getCategories = async (): Promise<string[]> => {
  try {
    const categories = await categoryService.getAllCategories();
    return categories.filter(cat => cat.level === 1).map(cat => cat.name);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return ['Chauffage', 'Climatisation', 'Ventilation', 'Plomberie', 'Électricité'];
  }
};

export const filterProductsByCategory = (categoryId: string) => {
  // Cette fonction utilise maintenant l'ID de catégorie depuis l'API
  return getProducts({ category: categoryId });
};

// Fonction pour récupérer toutes les catégories depuis l'API
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    try {
      // Utiliser le cache si disponible
      if (categoriesCache.length > 0) {
        return categoriesCache;
      }
      
      // Récupérer les catégories de niveau 1 depuis l'API
      const categories = await categoryService.getCategoriesByLevel(1);
      categoriesCache = categories;
      
      return categories;
    } catch (apiError) {
      console.warn('API de catégories indisponible, utilisation des données de test:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    // Valeurs par défaut en cas d'erreur
    return [
      {
        id: 1,
        name: 'Plâtrerie',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Matériaux de plâtrerie',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Isolation',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Matériaux d\'isolation',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Chauffage',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Systèmes de chauffage',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Climatisation',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Systèmes de climatisation',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Sanitaire',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Équipements sanitaires',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Plomberie',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Matériel de plomberie',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 7,
        name: 'Électricité',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Matériel électrique',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 8,
        name: 'Outillage',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Outils et équipements',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 9,
        name: 'EPI',
        level: 1,
        haveParent: false,
        haveChildren: true,
        description: 'Équipements de protection individuelle',
        imageUrl: '/images/category-placeholder.jpg',
        parentCategoryId: null,
        agenceId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
};

// Fonction pour récupérer les sous-catégories d'une catégorie depuis l'API
export const getSubcategoriesByCategory = async (categoryName: string): Promise<string[]> => {
  try {
    // Chercher d'abord la catégorie parente par son nom
    let categoryId: number | null = null;
    
    // Utiliser le cache si disponible
    if (categoriesCache.length > 0) {
      const category = categoriesCache.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      categoryId = category?.id || null;
    } else {
      // Sinon rechercher dans l'API
      const categories = await categoryService.getAllCategories();
      categoriesCache = categories;
      const category = categories.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      categoryId = category?.id || null;
    }
    
    // Si on a trouvé la catégorie, récupérer ses enfants
    if (categoryId) {
      const children = await categoryService.getCategoryChildren(categoryId);
      return children.map(child => child.name);
    }
    
    return [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des sous-catégories pour ${categoryName}:`, error);
    
    // Valeurs par défaut en cas d'erreur
    const defaultSubcategories: { [key: string]: string[] } = {
      'Plâtrerie': [
        'Plaque standard', 'Plaque hydro', 'Plaque technique', 'Carreau de plâtre',
        'Faux plafonds', 'Colle', 'Enduit', 'Mortier', 'Peinture', 'Ossature', 
        'Outils et accessoires du plaquiste'
      ],
      'Isolation': ['Isolation intérieure', 'Isolation extérieure'],
      'Chauffage': [
        'Pompe à chaleur AIR/EAU', 'Chaudières', 'Radiateurs', 'Plancher chauffant',
        'Poêles', 'Accessoires'
      ],
      'Climatisation': [
        'Pompe à chaleur AIR/EAU', 'Climatiseur', 'VRV VRF', 'Ventilation', 'Accessoires'
      ],
      'Sanitaire': [
        'Chauffe-eaux et ballons', 'Mobilier', 'Robinetterie', 'Sèche serviette',
        'Espace douche', 'Espace WC', 'Traitement de l\'eau'
      ],
      'Plomberie': ['Alimentation', 'Fixations', 'Évacuation', 'Accessoires'],
      'Électricité': ['Thermostats', 'Câbles', 'Gaines', 'Disjoncteurs', 'Panneaux solaires'],
      'Outillage': ['Électroportatif', 'À main', 'Accessoires'],
      'EPI': [
        'Casques et protections auditives', 'Lunettes et masques de protection',
        'Gants', 'Chaussures', 'Vêtements'
      ]
    };
    
    return defaultSubcategories[categoryName] || [];
  }
}; 