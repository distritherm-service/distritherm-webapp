import axiosInstance from './axiosConfig';
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
  category?: {
    id: number;
    name: string;
  };
  mark?: {
    id: number;
    name: string;
  };
  isInPromotion?: boolean;
  promotionPrice?: number;
  promotionEndDate?: string;
  promotionPercentage?: number;
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

// Interface pour les produits recommandés
export interface RecommendedProductsResponse {
  message: string;
  products: Product[];
  count: number;
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

/**
 * Récupère les produits recommandés depuis l'API
 */
export const getRecommendedProducts = async (): Promise<RecommendedProductsResponse> => {
  try {
    const response = await axiosInstance.get('/products/recommendations');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits recommandés:', error);
    // Retourner des données de test en cas d'erreur
    return {
      message: "Produits recommandés récupérés avec succès",
      products: Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        name: `Produit recommandé ${i + 1}`,
        description: "Description du produit recommandé test",
        priceHt: 99.99,
        priceTtc: 119.99,
        quantity: 50,
        imagesUrl: ['/image-produit-defaut.jpeg'],
        categoryId: 1,
        markId: 1,
        category: {
          id: 1,
          name: "Catégorie test"
        },
        mark: {
          id: 1,
          name: "Marque test"
        },
        isInPromotion: true,
        promotionPrice: 89.99,
        promotionEndDate: "2024-12-31T23:59:59Z",
        promotionPercentage: 10,
        itemCode: `PROMO${i + 100}`,
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
      })),
      count: 4
    };
  }
}; 