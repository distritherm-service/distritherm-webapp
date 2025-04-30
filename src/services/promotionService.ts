import axiosInstance from './axiosConfig';
import { PromotionAPI } from '../types/promotion';

// Interface adaptée à l'UI (PromotionGrid, PromotionCard)
export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  validUntil: string;
  code: string;
  inStock: boolean;
  featured?: boolean;
  quantity: number;
}

// Interface pour les méta-données de pagination
export interface PaginationMeta {
  total: number;        // Nombre total d'éléments
  per_page: number;     // Nombre d'éléments par page
  current_page: number; // Page courante
  last_page: number;    // Dernière page
  from: number;         // Index de début
  to: number;           // Index de fin
}

// Fonction utilitaire pour transformer la réponse API en Promotion UI
const mapPromotionAPIToPromotion = (api: PromotionAPI): Promotion => {
  if (!api) {
    console.warn('Tentative de mapper une promotion undefined');
    return {
      id: 'error',
      title: 'Promotion indisponible',
      description: 'Les détails de cette promotion ne sont pas disponibles',
      image: '/image-produit-defaut.jpeg',
      category: '',
      subcategory: '',
      originalPrice: 0,
      discountPrice: 0,
      discountPercentage: 0,
      validUntil: new Date().toISOString(),
      code: '',
      inStock: false,
      quantity: 0
    };
  }

  return {
    id: api.id?.toString() || 'unknown',
    title: api.name || 'Sans titre',
    description: api.description || 'Aucune description disponible',
    image: (api.imagesUrl && api.imagesUrl.length > 0) ? api.imagesUrl[0] : '/image-produit-defaut.jpeg',
    category: api.category?.name || api.categoryId?.toString() || '', 
    subcategory: '',
    originalPrice: api.priceTtc || 0,
    discountPrice: api.promotionPrice || 0,
    discountPercentage: api.promotionPercentage || 0,
    validUntil: api.promotionEndDate || new Date().toISOString(),
    code: '',
    inStock: (api.quantity > 0) || false,
    featured: api.isFavorited || false,
    quantity: api.quantity || 0
  };
};

// Récupère les produits en promotion depuis l'API
export const getPromotions = async (page = 1, limit = 10, categoryId?: string, mark?: string): Promise<Promotion[]> => {
  try {
    const params: Record<string, any> = { page, limit };
    
    // Ajouter le filtre par catégorie si spécifié
    if (categoryId && categoryId !== 'Toutes les catégories') {
      params.categoryId = categoryId;
    }
    
    // Ajouter le filtre par marque si spécifié
    if (mark && mark !== '') {
      params.mark = mark;
    }
    
    const response = await axiosInstance.get('/products/promotions', { params });
    
    if (response?.data?.data && Array.isArray(response.data.data)) {
      const data = response.data.data as PromotionAPI[];
      return data.map(mapPromotionAPIToPromotion).filter(Boolean);
    }
    
    console.warn('Format de réponse inattendu pour les promotions:', response?.data);
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des promotions:', error);
    return [];
  }
};

// Récupère le nombre total de produits en promotion et les méta-données de pagination
export const getPromotionsCount = async (categoryId?: string, mark?: string): Promise<number> => {
  try {
    const params: Record<string, any> = { page: 1, limit: 1 };
    
    // Ajouter le filtre par catégorie si spécifié
    if (categoryId && categoryId !== 'Toutes les catégories') {
      params.categoryId = categoryId;
    }
    
    // Ajouter le filtre par marque si spécifié
    if (mark && mark !== '') {
      params.mark = mark;
    }
    
    const response = await axiosInstance.get('/products/promotions', { params });
    
    // Vérifier si nous avons des méta-données de pagination
    if (response?.data?.meta?.total !== undefined) {
      return response.data.meta.total;
    }
    
    // Vérifier s'il y a des données et les compter (fallback)
    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data.length;
    }
    
    console.warn('Méta-données de pagination non trouvées dans la réponse:', response?.data);
    return 0;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de promotions:', error);
    return 0;
  }
};

// Récupère les méta-données complètes de pagination
export const getPromotionsPaginationMeta = async (page = 1, limit = 10, categoryId?: string, mark?: string): Promise<PaginationMeta | null> => {
  try {
    const params: Record<string, any> = { page, limit };
    
    if (categoryId && categoryId !== 'Toutes les catégories') {
      params.categoryId = categoryId;
    }
    
    if (mark && mark !== '') {
      params.mark = mark;
    }
    
    const response = await axiosInstance.get('/products/promotions', { params });
    
    if (response?.data?.meta) {
      return response.data.meta as PaginationMeta;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des méta-données de pagination:', error);
    return null;
  }
}; 