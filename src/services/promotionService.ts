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
  brand: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  validUntil: string;
  code: string;
  inStock: boolean;
  featured?: boolean;
}

// Fonction utilitaire pour transformer la réponse API en Promotion UI
const mapPromotionAPIToPromotion = (api: PromotionAPI): Promotion => ({
  id: api.id.toString(),
  title: api.name,
  description: api.description,
  image: api.imagesUrl[0] || '/image-produit-defaut.jpeg',
  category: '', // À compléter si l'API fournit la catégorie (sinon à enrichir côté UI)
  subcategory: '',
  brand: '',
  originalPrice: api.priceTtc,
  discountPrice: api.promotionPrice,
  discountPercentage: api.promotionPercentage,
  validUntil: api.promotionEndDate,
  code: '',
  inStock: api.quantity > 0,
  featured: false, // À enrichir si besoin
});

// Récupère les produits en promotion depuis l'API
export const getPromotions = async (page = 1, limit = 10): Promise<Promotion[]> => {
  const response = await axiosInstance.get('/products/promotions', {
    params: { page, limit },
  });
  const data = response.data.data as PromotionAPI[];
  return data.map(mapPromotionAPIToPromotion);
}; 