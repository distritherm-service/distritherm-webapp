// Types pour le système de favoris basés sur l'API Swagger

// Structure du détail d'un produit
export interface ProductDetail {
  itemCode?: string;
  directorWord1?: string;
  directorWord2?: string;
  designation1?: string;
  designation2?: string;
  complementDesignation?: string;
  packaging?: string;
  packagingType?: string;
  submissionFgaz?: string;
  fgazFile?: string;
  active?: boolean;
  label?: string;
  unity?: string;
  weight?: number;
  familyCode?: string;
  ecoContributionPercentage?: number;
  ecoContributionApplication?: boolean;
}

// Structure d'une catégorie
export interface Category {
  id: number;
  name: string;
}

// Structure d'une marque
export interface Mark {
  id: number;
  name: string;
}

// Structure d'un produit dans les favoris
export interface FavoriteProduct {
  id: number;
  name: string;
  priceTtc: number;
  quantity: number;
  imagesUrl: string[];
  description?: string;
  categoryId?: number;
  markId?: number;
  category?: Category;
  mark?: Mark;
  isInPromotion?: boolean;
  promotionPrice?: number;
  promotionEndDate?: string;
  promotionPercentage?: number;
  isFavorited?: boolean;
  priceHt?: number;
  createdAt?: string;
  updatedAt?: string;
  productDetail?: ProductDetail;
}

// Structure d'un utilisateur
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Structure d'un favori
export interface Favorite {
  id: number;
  productId: number;
  userId: number;
  createdAt: string;
  product?: {
    message: string;
    product: FavoriteProduct;
  };
  user?: User;
}

// Réponse lors de l'ajout d'un favori
export interface AddFavoriteResponse {
  message: string;
  favorite: Favorite;
}

// Réponse pour la liste des favoris avec pagination
export interface FavoritesListResponse {
  favorites: Favorite[];
  count: number;
  page: number;
  limit: number;
  total: number;
  lastPage: number;
  message: string;
}

// Réponse pour le nombre de favoris d'un produit
export interface FavoriteCountResponse {
  message: string;
  favoritesCount: number;
}

// Réponse pour vérifier si un produit est dans les favoris
export interface FavoriteCheckResponse {
  isFavorite: boolean;
  favoriteId?: number;
  message: string;
}

// Body pour ajouter un favori
export interface AddFavoriteRequest {
  productId: number;
  userId: number; // REQUIS selon l'API Swagger
}

// Type simplifié pour l'affichage dans l'interface
export interface FavoriteItem {
  // Données du favori
  favoriteId: number;
  
  // Données du produit
  id: number;
  name: string;
  priceTtc: number;
  priceHt?: number;
  quantity: number;
  imagesUrl: string[];
  description?: string;
  
  // Relations
  categoryId?: number;
  markId?: number;
  category?: Category;
  mark?: Mark;
  
  // Promotions
  isInPromotion?: boolean;
  promotionPrice?: number;
  promotionEndDate?: string;
  promotionPercentage?: number;
  
  // Métadonnées
  createdAt?: string;
  updatedAt?: string;
  favoriteCreatedAt?: string;
} 