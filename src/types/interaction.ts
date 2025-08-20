// Types pour les interactions utilisateur-produit
import { Product } from './product';

// Types d'interaction possibles
// Note: L'API backend ne supporte actuellement que CLICK_PRODUCT et LIKE
export enum InteractionType {
  CLICK_PRODUCT = 'CLICK_PRODUCT',
  LIKE = 'LIKE',
  // ADD_TO_CART n'est pas supporté par l'API actuellement
  // ADD_TO_CART = 'ADD_TO_CART',
}

// Interface pour l'utilisateur dans le contexte d'interaction
export interface InteractionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  urlPicture?: string;
  type: 'REGULAR' | 'PRO';
  role: 'ADMIN' | 'CLIENT';
  proInfo?: {
    isPro: boolean;
    categoryIdPro: number;
    percentage: number;
    categoryProName: string;
  };
}

// Interface pour une interaction
export interface Interaction {
  id: number;
  type: InteractionType | string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  user: InteractionUser;
}

// Interface pour la requête de création d'interaction
export interface CreateInteractionRequest {
  type: InteractionType | string;
  productId: number;
  userId: number;
}

// Interface pour la réponse de création d'interaction
export interface CreateInteractionResponse {
  message: string;
  interaction: Interaction;
}

// Interface pour la réponse d'erreur
export interface InteractionErrorResponse {
  message: string;
  error: string;
}
