import axiosInstance from './axiosConfig';
import { getAllMarks } from './markService';
import { Product } from '../types/product';

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
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
    excludedCount: number;
    strategy: string;
    userId?: number;
  };
}

/**
 * Récupère les produits depuis l'API avec des filtres optionnels
 */
export const getProducts = async (filters?: FilterOptions): Promise<ProductsResponse> => {
  try {
    // console.log('Récupération des produits avec filtres:', filters);
    
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
    
    // console.log('Paramètres de requête API:', params);
    
    const response = await axiosInstance.get('/products', { params });
    // console.log('Réponse API brute:', response.data);
    
    // Vérifier la structure de la réponse
    if (!response.data || !Array.isArray(response.data.products)) {
      // console.error('Structure de réponse inattendue:', response.data);
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
      // console.log('Marques disponibles:', marks);
    } catch (error) {
      // console.warn('Impossible de récupérer les marques pour le filtrage:', error);
    }

    // Filtrer les produits par prix côté client si un filtre de prix est défini
    if (filters?.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      products = products.filter((product: Product) => {
        const price = product.priceHt || product.priceTtc || 0;
        return price >= minPrice && price <= maxPrice;
      });
      // console.log(`Filtre prix [${minPrice}, ${maxPrice}] appliqué. Produits restants:`, products.length);
    }

    // Filtrer les produits par marque côté client
    if (filters?.brand && filters.brand !== 'Toutes les marques') {
      products = products.filter((product: Product) => {
        // Comparer avec le nom de la marque au lieu de l'ID
        const productBrandName = product.mark?.name || '';
        const matches = productBrandName.toLowerCase() === filters.brand!.toLowerCase();
        return matches;
      });
      // console.log(`Filtre marque "${filters.brand}" appliqué. Produits restants:`, products.length);
    }

    // Filtrer les produits en stock uniquement
    if (filters?.inStockOnly) {
      products = products.filter((product: Product) => product.quantity > 0);
      // console.log('Filtre stock appliqué. Produits restants:', products.length);
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
    
    // console.log('Résultat final:', {
    //   nombreProduits: result.products.length,
    //   total: result.total,
    //   page: result.page,
    //   totalPages: result.totalPages
    // });
    
    return result;
  } catch (error) {
    // console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};

/**
 * Récupère un produit spécifique par son ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);

    // Tolérer plusieurs structures de réponse possibles
    let productData: any = undefined;
    const data = response?.data;

    if (data?.product) {
      productData = data.product;
    } else if (data?.data && !Array.isArray(data.data)) {
      productData = data.data;
    } else if (data && data.id && data.name) {
      // Cas où l'API renvoie directement l'objet produit
      productData = data;
    } else if (Array.isArray(data?.products)) {
      // Parfois, l'API peut renvoyer un tableau « products » même pour un seul produit
      productData = data.products.find((p: any) => p?.id?.toString() === id) || data.products[0];
    }

    if (!productData) {
      throw new Error('Données du produit non trouvées dans la réponse API');
    }

    // Normaliser le produit
    const normalizedProduct: Product = {
      ...productData,
      priceHt: Number(productData.priceHt ?? productData.priceTtc ?? 0),
      priceTtc: Number(productData.priceTtc ?? productData.priceHt ?? 0),
      imagesUrl: Array.isArray(productData.imagesUrl) ? productData.imagesUrl : [],
    };

    return normalizedProduct;
  } catch (error) {
    // Essayer un fallback via l'endpoint liste si disponible
    try {
      const alt = await axiosInstance.get('/products', { params: { id } });
      const altData = alt?.data;
      let productData: any = undefined;
      if (altData?.product) productData = altData.product;
      else if (Array.isArray(altData?.products)) {
        productData = altData.products.find((p: any) => p?.id?.toString() === id) || altData.products[0];
      } else if (altData?.data && !Array.isArray(altData.data)) {
        productData = altData.data;
      }

      if (productData) {
        const normalizedProduct: Product = {
          ...productData,
          priceHt: Number(productData.priceHt ?? productData.priceTtc ?? 0),
          priceTtc: Number(productData.priceTtc ?? productData.priceHt ?? 0),
          imagesUrl: Array.isArray(productData.imagesUrl) ? productData.imagesUrl : [],
        };
        return normalizedProduct;
      }
    } catch {
      // Ignorer et relancer l'erreur initiale
    }

    // console.error('Erreur lors de la récupération du produit:', error);
    throw error;
  }
};

/**
 * Récupère toutes les marques disponibles
 */
export const getAllBrands = async (): Promise<string[]> => {
  try {
    const marks = await getAllMarks();
    return marks;
  } catch (error) {
    // console.error('Erreur lors de la récupération des marques:', error);
    return [];
  }
};

/**
 * Récupère les produits recommandés
 */
export const getRecommendedProducts = async (excludedIds?: string[], page: number = 1, limit: number = 10): Promise<RecommendedProductsResponse> => {
  try {
    // Construire les paramètres de requête
    const params: Record<string, any> = {
      page,
      limit: Math.min(limit, 50) // Limiter à 50 selon la documentation
    };
    
    // Ajouter les IDs à exclure si fournis
    if (excludedIds && excludedIds.length > 0) {
      params.excludedIds = excludedIds.join(',');
    }
    
    const response = await axiosInstance.get('/products/recommendations', { params });
    
    // Normaliser les produits
    const products = response.data.products.map((product: any) => ({
      ...product,
      priceHt: product.priceHt || product.priceTtc || 0,
      priceTtc: product.priceTtc || product.priceHt || 0,
    }));
    
    return {
      ...response.data,
      products
    };
  } catch (error) {
    // console.error('Erreur lors de la récupération des produits recommandés:', error);
    throw error;
  }
};

// Interface pour la réponse des produits similaires
export interface SimilarProductsResponse {
  message: string;
  products: Product[];
  count: number;
  criteriaUsed: string[];
  originalProduct: {
    id: number;
    name: string;
    category: string;
    mark: string;
    price: number;
  };
}

/**
 * Récupère les produits similaires à un produit donné
 */
export const getSimilarProducts = async (productId: string | number): Promise<SimilarProductsResponse> => {
  try {
    const response = await axiosInstance.get<SimilarProductsResponse>(`/products/${productId}/similar`);
    
    // Normaliser les produits dans la réponse
    const products = response.data.products.map((product: any) => ({
      ...product,
      priceHt: product.priceHt || product.priceTtc || 0,
      priceTtc: product.priceTtc || product.priceHt || 0,
    }));
    
    return {
      ...response.data,
      products
    };
  } catch (error) {
    // console.error('Erreur lors de la récupération des produits similaires:', error);
    throw error;
  }
}; 