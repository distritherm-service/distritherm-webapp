export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  priceTtc: number;
  quantity: number;
  imagesUrl: string[];
  description?: string;
  categoryId?: number;
  markId?: number;
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
  priceHt?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Favorite {
  id: number;
  productId: number;
  userId: number;
  createdAt: string;
  product?: Product;
  user?: User;
}

export interface FavoriteResponse {
  message: string;
  favorite: Favorite;
}

export interface FavoritesListResponse {
  message: string;
  favorites: Favorite[];
  count: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface FavoriteCountResponse {
  message: string;
  product: {
    message: string;
    product: Product;
  };
  favoritesCount: number;
}

export interface FavoriteCheckResponse {
  message: string;
  isFavorite: boolean;
  favoriteId?: number;
}

// Pour conserver la compatibilité avec le contexte existant
export interface FavoriteItem {
  id: string | number;
  name: string;
  priceTtc: number;
  quantity?: number;
  imagesUrl?: string[];
  image?: string; // Pour la compatibilité avec le contexte existant
  description?: string;
  categoryId?: number;
  markId?: number;
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
  priceHt?: number;
  createdAt?: string;
  updatedAt?: string;
} 