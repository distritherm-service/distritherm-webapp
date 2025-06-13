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
  itemCode?: string;
  active?: boolean;
  directorWord1?: string;
  directorWord2?: string;
  directorWord3?: string;
  directorWord4?: string;
  directorWord5?: string;
  directorWordLink1?: string;
  directorWordLink2?: string;
  directorWordLink3?: string;
  directorWordLink4?: string;
  directorWordLink5?: string;
  brandLogo?: string;
  weight?: number;
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
  isFavorited?: boolean;
  productDetail?: {
    id: number;
    productId: number;
    itemCode: string;
    directorWord1?: string;
    directorWord2?: string;
    designation1?: string;
    designation2?: string;
    complementDesignation?: string;
    packaging?: string;
    packagingType?: string;
    submissionFgaz?: string;
    active: boolean;
    label?: string;
    unity?: string;
    weight?: number;
    familyCode?: string;
    ecoContributionPercentage?: number;
    ecoContributionApplication?: boolean;
  };
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
    console.log('Récupération des produits avec filtres:', filters);
    
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
    
    console.log('Paramètres de requête API:', params);
    
    const response = await axiosInstance.get('/products', { params });
    console.log('Réponse API brute:', response.data);
    
    // Vérifier la structure de la réponse
    if (!response.data || !Array.isArray(response.data.products)) {
      console.error('Structure de réponse inattendue:', response.data);
      throw new Error('Structure de réponse API invalide');
    }
    
    let products = response.data.products;
    
    // Normaliser les produits - ajouter priceHt si manquant
    products = products.map((product: any) => ({
      ...product,
      priceHt: product.priceHt || product.priceTtc || 0,
      priceTtc: product.priceTtc || product.priceHt || 0,
    }));

    // Récupérer les marques pour le filtrage
    let marksMap: { [name: string]: number } = {};
    try {
      const marks = await getAllMarks();
      // Créer un mapping nom -> id si on a accès aux données complètes
      // Pour l'instant, on va utiliser le nom directement
      console.log('Marques disponibles:', marks);
    } catch (error) {
      console.warn('Impossible de récupérer les marques pour le filtrage:', error);
    }

    // Filtrer les produits par prix côté client si un filtre de prix est défini
    if (filters?.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      products = products.filter((product: Product) => {
        const price = product.priceHt || product.priceTtc || 0;
        return price >= minPrice && price <= maxPrice;
      });
      console.log(`Filtre prix [${minPrice}, ${maxPrice}] appliqué. Produits restants:`, products.length);
    }

    // Filtrer les produits par marque côté client
    if (filters?.brand && filters.brand !== 'Toutes les marques') {
      products = products.filter((product: Product) => {
        // Comparer avec le nom de la marque au lieu de l'ID
        const productBrandName = product.mark?.name || '';
        const matches = productBrandName.toLowerCase() === filters.brand!.toLowerCase();
        return matches;
      });
      console.log(`Filtre marque "${filters.brand}" appliqué. Produits restants:`, products.length);
    }

    // Filtrer les produits en stock uniquement
    if (filters?.inStockOnly) {
      products = products.filter((product: Product) => product.quantity > 0);
      console.log('Filtre stock appliqué. Produits restants:', products.length);
    }

    // Construire la réponse avec la structure attendue
    const totalPages = response.data.meta?.lastPage || Math.ceil((response.data.meta?.total || products.length) / (params.limit || 12));
    
    const result: ProductsResponse = {
      products,
      total: response.data.meta?.total || products.length,
      page: response.data.meta?.page || 1,
      limit: response.data.meta?.limit || 12,
      totalPages
    };
    
    console.log('Résultat final:', {
      nombreProduits: result.products.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    });
    
    return result;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    
    // Au lieu de retourner des produits mock, on propage l'erreur pour permettre un meilleur debugging
    // Mais on peut retourner une réponse vide pour éviter les crashes
    return {
      products: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1
    };
  }
};

/**
 * Récupère un produit par son ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    const product = response.data.product;
    
    // Normaliser le produit
    return {
      ...product,
      priceHt: product.priceHt || product.priceTtc || 0,
      priceTtc: product.priceTtc || product.priceHt || 0,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    throw error;
  }
};

/**
 * Récupère toutes les marques disponibles
 */
export const getAllBrands = async (): Promise<string[]> => {
  try {
    const marks = await getAllMarks();
    console.log('Marques récupérées:', marks);
    return marks;
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
    // Retourner un tableau vide au lieu de marques par défaut
    return [];
  }
};

/**
 * Récupère les produits recommandés depuis l'API
 */
export const getRecommendedProducts = async (): Promise<RecommendedProductsResponse> => {
  try {
    const response = await axiosInstance.get('/products/recommendations');
    const products = response.data.products || [];
    
    // Normaliser les produits recommandés
    const normalizedProducts = products.map((product: any) => ({
      ...product,
      priceHt: product.priceHt || product.priceTtc || 0,
      priceTtc: product.priceTtc || product.priceHt || 0,
    }));
    
    return {
      ...response.data,
      products: normalizedProducts
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des produits recommandés:', error);
    // Retourner une réponse vide au lieu de données mock
    return {
      message: "Aucun produit recommandé disponible",
      products: [],
      count: 0
    };
  }
}; 