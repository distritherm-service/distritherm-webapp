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
  isFavorited: boolean;
  promotionPercentage: number;
  category?: {
    id: number;
    name: string;
  };
  mark?: {
    id: number;
    name: string;
  };
} 