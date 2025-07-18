// Types pour l'API Cart - basés sur la réponse réelle de l'API

export interface Category {
  id: number;
  name: string;
}

export interface Mark {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  priceTtc: number;
  quantity: number;
  imagesUrl: string[];
  description: string;
  categoryId: number;
  markId: number;
  category: Category;
  mark: Mark;
  isInPromotion: boolean;
  promotionPrice: number | null;
  promotionEndDate: string | null;
  promotionPercentage: number | null;
  isFavorited: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  priceTtc: number;
  priceHt: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  status: 'IS_ACTIVE' | 'IS_ORDERED' | 'IS_DEVIS' | 'IS_DEVIS_AND_ORDERED';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  cartItems: CartItem[];
}

// Interface pour les réponses de l'API
export interface CartApiResponse {
  message: string;
  cart: Cart;
}

// Interface pour les requêtes vers l'API
export interface AddCartItemRequest {
  cartId: number;
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartId: number;
  cartItemId: number;
  quantity: number;
}

export interface RemoveCartItemRequest {
  cartId: number;
  productId: number;
  cartItemId: number;
}

// Interface pour le panier local (pour les utilisateurs non connectés)
export interface LocalCartItem {
  productId: number;
  name: string;
  priceTtc: number;
  priceHt: number;
  quantity: number;
  image: string;
  description?: string;
}

export interface LocalCart {
  items: LocalCartItem[];
  totalPrice: number;
  updatedAt: string;
}

// Types pour l'état du contexte
export interface CartState {
  cart: Cart | null;
  localCart: LocalCart;
  isLoading: boolean;
  error: string | null;
}

// Types pour les actions du contexte
export type CartAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_LOCAL_CART'; payload: LocalCart }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ITEM_OPTIMISTIC'; payload: CartItem }
  | { type: 'UPDATE_ITEM_OPTIMISTIC'; payload: { itemId: number; quantity: number } }
  | { type: 'REMOVE_ITEM_OPTIMISTIC'; payload: number }; 