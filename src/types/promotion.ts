export interface Promotion {
  id: string;
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  discount: number;
  products: string[];
  isActive: boolean;
}

// Interface pour la structure complète de la réponse API /products/promotions
export interface PromotionsApiResponse {
  message: string;
  products: PromotionAPI[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

// Interface pour la structure de l'API /products/promotions
export interface PromotionAPI {
  id: number;
  name: string;
  priceTtc: number;
  quantity: number;
  imagesUrl: string[];
  description: string;
  categoryId: number;
  markId: number;
  isInPromotion: boolean;
  promotionPrice: number;
  promotionEndDate: string;
  promotionPercentage: number;
  isFavorited: boolean;
  category?: {
    id: number;
    name: string;
  };
  mark?: {
    id: number;
    name: string;
  };
} 