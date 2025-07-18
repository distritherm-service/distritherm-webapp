import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartService, CartError } from '../services/cartService';
import { 
  Cart, 
  CartItem, 
  LocalCart, 
  LocalCartItem, 
  CartState, 
  CartAction, 
  Product as CartProduct 
} from '../types/cart';
import { Product as ProductType } from '../types/product';
import { toast } from 'react-hot-toast';

// Clé localStorage pour le panier invité
const GUEST_CART_KEY = 'distritherm_guest_cart';

// État initial
const initialState: CartState = {
  cart: null,
  localCart: {
    items: [],
    totalPrice: 0,
    updatedAt: new Date().toISOString()
  },
  isLoading: false,
  error: null
};

// Reducer pour gérer l'état du panier
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'SET_CART':
      return { 
        ...state, 
        cart: action.payload, 
        isLoading: false, 
        error: null 
      };
      
    case 'SET_LOCAL_CART':
      return { 
        ...state, 
        localCart: action.payload, 
        isLoading: false, 
        error: null 
      };
      
    case 'CLEAR_CART':
      return { 
        ...state, 
        cart: null, 
        localCart: { items: [], totalPrice: 0, updatedAt: new Date().toISOString() },
        error: null 
      };
      
    case 'ADD_ITEM_OPTIMISTIC':
      if (!state.cart || !state.cart.cartItems) return state;
      
      const existingItemIndex = state.cart.cartItems.findIndex(
        item => item.productId === action.payload.productId
      );
      
      let updatedCartItems;
      if (existingItemIndex >= 0) {
        updatedCartItems = state.cart.cartItems.map((item, index) =>
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedCartItems = [...state.cart.cartItems, action.payload];
      }
      
      const newTotalPrice = updatedCartItems.reduce(
        (sum, item) => sum + (item.priceTtc * item.quantity), 
        0
      );
      
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: updatedCartItems,
          totalPrice: newTotalPrice
        }
      };
      
    case 'UPDATE_ITEM_OPTIMISTIC':
      if (!state.cart || !state.cart.cartItems) return state;
      
      const updatedItems = state.cart.cartItems.map(item =>
        item.id === action.payload.itemId 
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + (item.priceTtc * item.quantity), 
        0
      );
      
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: updatedItems,
          totalPrice
        }
      };
      
    case 'REMOVE_ITEM_OPTIMISTIC':
      if (!state.cart || !state.cart.cartItems) return state;
      
      const filteredItems = state.cart.cartItems.filter(
        item => item.id !== action.payload
      );
      
      const remainingTotalPrice = filteredItems.reduce(
        (sum, item) => sum + (item.priceTtc * item.quantity), 
        0
      );
      
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: filteredItems,
          totalPrice: remainingTotalPrice
        }
      };
      
    default:
      return state;
  }
};

// Interface pour le contexte
interface CartContextType {
  // État
  cart: Cart | null;
  localCart: LocalCart;
  isLoading: boolean;
  error: string | null;
  
  // Actions - Modifier pour accepter ProductType
  addToCart: (product: ProductType, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Utilitaires
  isInCart: (productId: number) => boolean;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  clearError: () => void;
}

// Contexte
const CartContext = createContext<CartContextType | undefined>(undefined);

// Utilitaires
const saveLocalCart = (localCart: LocalCart) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(localCart));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier local:', error);
  }
};

const loadLocalCart = (): LocalCart => {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : initialState.localCart;
  } catch (error) {
    console.error('Erreur lors du chargement du panier local:', error);
    return initialState.localCart;
  }
};

// Normaliser un panier reçu de l'API pour s'assurer que cartItems existe
const normalizeCart = (cart: Cart): Cart => {
  return {
    ...cart,
    cartItems: cart.cartItems || [],
    totalPrice: cart.totalPrice || 0
  };
};

const createCartItemFromProduct = (product: ProductType, quantity: number): CartItem => {
  // Convertir le Product de product.ts vers le format attendu par cart.ts
  const cartProduct: CartProduct = {
    id: product.id,
    name: product.name,
    priceTtc: product.priceTtc,
    quantity: product.quantity,
    imagesUrl: product.imagesUrl || [],
    description: product.description || '',
    categoryId: product.categoryId,
    markId: product.markId,
    category: product.category || { id: product.categoryId, name: 'Non spécifiée' },
    mark: product.mark || { id: product.markId, name: 'Non spécifiée' },
    isInPromotion: product.isInPromotion || false,
    promotionPrice: product.promotionPrice || null,
    promotionEndDate: product.promotionEndDate || null,
    promotionPercentage: product.promotionPercentage || null,
    isFavorited: product.isFavorited || false
  };

  return {
    id: 0, // Sera défini par l'API
    productId: product.id,
    quantity,
    priceTtc: product.priceTtc,
    priceHt: product.priceHt || product.priceTtc / 1.2, // TVA 20%
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product: cartProduct
  };
};

const createLocalCartItemFromProduct = (product: ProductType, quantity: number): LocalCartItem => ({
  productId: product.id,
  name: product.name,
  priceTtc: product.priceTtc,
  priceHt: product.priceHt || product.priceTtc / 1.2,
  quantity,
  image: product.imagesUrl?.[0] || '/image-produit-defaut.jpeg',
  description: product.description
});

// Provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    localCart: loadLocalCart()
  });
  
  const { isAuthenticated, user } = useAuth();
  const userId = user ? Number(user.id) : null;

  // Sauvegarde automatique du panier local
  useEffect(() => {
    if (!isAuthenticated) {
      saveLocalCart(state.localCart);
    }
  }, [state.localCart, isAuthenticated]);

  // Chargement initial et synchronisation
  useEffect(() => {
    const initializeCart = async () => {
      if (!isAuthenticated || !userId) {
        // Utilisateur non connecté - utiliser le panier local
        const localCart = loadLocalCart();
        dispatch({ type: 'SET_LOCAL_CART', payload: localCart });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Récupérer le panier serveur (créera automatiquement un panier si nécessaire)
        const response = await cartService.getActiveCart(userId);
        const normalizedCart = normalizeCart(response.cart);
        
        // Fusionner avec le panier local si nécessaire
        const localCart = loadLocalCart();
        if (localCart.items.length > 0) {
          await mergeLocalCartToServer(normalizedCart);
          // Recharger le panier après fusion
          const updatedResponse = await cartService.getActiveCart(userId);
          dispatch({ type: 'SET_CART', payload: normalizeCart(updatedResponse.cart) });
        } else {
          dispatch({ type: 'SET_CART', payload: normalizedCart });
        }

        // Nettoyer le panier local après synchronisation réussie
        localStorage.removeItem(GUEST_CART_KEY);
        dispatch({ type: 'SET_LOCAL_CART', payload: initialState.localCart });
        
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du panier:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement du panier' });
      }
    };

    initializeCart();
  }, [isAuthenticated, userId]);

  // Fusion du panier local vers le serveur
  const mergeLocalCartToServer = async (serverCart: Cart) => {
    try {
      const localCart = loadLocalCart();
      // Vérifier que cartItems existe
      if (!serverCart.cartItems) {
        console.error('Le panier serveur n\'a pas de cartItems');
        return;
      }
      
      for (const localItem of localCart.items) {
        const existingItem = serverCart.cartItems.find(
          item => item.productId === localItem.productId
        );

        if (existingItem) {
          // Mettre à jour la quantité si différente
          const newQuantity = existingItem.quantity + localItem.quantity;
          await cartService.updateCartItemQuantity({
            cartId: serverCart.id,
            cartItemId: existingItem.id,
            quantity: newQuantity
          });
        } else {
          // Ajouter le nouvel item
          await cartService.addProductToCart({
            cartId: serverCart.id,
            productId: localItem.productId,
            quantity: localItem.quantity
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la fusion des paniers:', error);
    }
  };

  // Actions
  const addToCart = async (product: ProductType, quantity = 1) => {
    dispatch({ type: 'SET_ERROR', payload: null });

    if (!isAuthenticated || !userId) {
      // Utilisateur non connecté - ajouter au panier local
      const existingItemIndex = state.localCart.items.findIndex(
        item => item.productId === product.id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.localCart.items.map((item, index) =>
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Quantité mise à jour pour ${product.name}`);
      } else {
        const newItem = createLocalCartItemFromProduct(product, quantity);
        updatedItems = [...state.localCart.items, newItem];
        toast.success(`${product.name} ajouté au panier`);
      }

      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + (item.priceTtc * item.quantity), 
        0
      );

      dispatch({
        type: 'SET_LOCAL_CART',
        payload: {
          items: updatedItems,
          totalPrice,
          updatedAt: new Date().toISOString()
        }
      });
      return;
    }

    // Utilisateur connecté - mettre à jour via l'API
    try {
      // S'assurer qu'on a un panier
      let currentCart = state.cart;
      if (!currentCart) {
        const response = await cartService.getActiveCart(userId);
        currentCart = normalizeCart(response.cart);
        dispatch({ type: 'SET_CART', payload: currentCart });
      }

      const cartItem = createCartItemFromProduct(product, quantity);
      
      // Mise à jour optimiste
      dispatch({ type: 'ADD_ITEM_OPTIMISTIC', payload: cartItem });

      // Appel API
      const response = await cartService.addProductToCart({
        cartId: currentCart.id,
        productId: product.id,
        quantity
      });

      dispatch({ type: 'SET_CART', payload: normalizeCart(response.cart) });
      toast.success(`${product.name} ajouté au panier`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      
      // Recharger le panier en cas d'erreur
      if (userId) {
        try {
          const response = await cartService.getActiveCart(userId);
          dispatch({ type: 'SET_CART', payload: normalizeCart(response.cart) });
        } catch (reloadError) {
          console.error('Erreur lors du rechargement:', reloadError);
        }
      }
      
      const errorMessage = error instanceof CartError ? error.message : 'Erreur lors de l\'ajout au panier';
      toast.error(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    dispatch({ type: 'SET_ERROR', payload: null });

    // Gérer le panier local pour les utilisateurs non connectés
    if (!isAuthenticated || !userId) {
      const updatedItems = state.localCart.items.map(item => {
        // Pour le panier local, on utilise productId comme identifiant
        if (item.productId === itemId) {
          return { ...item, quantity };
        }
        return item;
      });

      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + (item.priceTtc * item.quantity), 
        0
      );

      dispatch({
        type: 'SET_LOCAL_CART',
        payload: {
          items: updatedItems,
          totalPrice,
          updatedAt: new Date().toISOString()
        }
      });

      toast.success('Quantité mise à jour');
      return;
    }

    // Pour les utilisateurs connectés
    if (!state.cart) return;

    try {
      // Mise à jour optimiste
      dispatch({ type: 'UPDATE_ITEM_OPTIMISTIC', payload: { itemId, quantity } });

      // Appel API
      const response = await cartService.updateCartItemQuantity({
        cartId: state.cart.id,
        cartItemId: itemId,
        quantity
      });

      dispatch({ type: 'SET_CART', payload: normalizeCart(response.cart) });
      toast.success('Quantité mise à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      
      // Recharger en cas d'erreur
      if (userId) {
        try {
          const response = await cartService.getActiveCart(userId);
          dispatch({ type: 'SET_CART', payload: normalizeCart(response.cart) });
        } catch (reloadError) {
          console.error('Erreur lors du rechargement:', reloadError);
        }
      }
      
      const errorMessage = error instanceof CartError ? error.message : 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const removeFromCart = async (itemId: number) => {
    dispatch({ type: 'SET_ERROR', payload: null });

    // Gérer le panier local pour les utilisateurs non connectés
    if (!isAuthenticated || !userId) {
      const filteredItems = state.localCart.items.filter(
        item => item.productId !== itemId
      );

      const totalPrice = filteredItems.reduce(
        (sum, item) => sum + (item.priceTtc * item.quantity), 
        0
      );

      dispatch({
        type: 'SET_LOCAL_CART',
        payload: {
          items: filteredItems,
          totalPrice,
          updatedAt: new Date().toISOString()
        }
      });

      toast.success('Produit retiré du panier');
      return;
    }

    // Pour les utilisateurs connectés
    if (!state.cart || !state.cart.cartItems) return;

    try {
      const item = state.cart.cartItems.find(i => i.id === itemId);
      if (!item) return;

      // Mise à jour optimiste
      dispatch({ type: 'REMOVE_ITEM_OPTIMISTIC', payload: itemId });

      // Appel API
      const response = await cartService.removeProductFromCart({
        cartId: state.cart.id,
        productId: item.productId,
        cartItemId: itemId
      });

      dispatch({ type: 'SET_CART', payload: normalizeCart(response.cart) });
      toast.success('Produit retiré du panier');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      // Recharger en cas d'erreur
      if (userId) {
        try {
          const response = await cartService.getActiveCart(userId);
          dispatch({ type: 'SET_CART', payload: normalizeCart(response.cart) });
        } catch (reloadError) {
          console.error('Erreur lors du rechargement:', reloadError);
        }
      }
      
      const errorMessage = error instanceof CartError ? error.message : 'Erreur lors de la suppression';
      toast.error(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !state.cart) {
      // Panier local
      dispatch({ type: 'CLEAR_CART' });
      saveLocalCart(initialState.localCart);
      toast.success('Panier vidé');
      return;
    }

    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await cartService.clearCart(state.cart);
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Panier vidé');
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      const errorMessage = error instanceof CartError ? error.message : 'Erreur lors du vidage du panier';
      toast.error(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  // Utilitaires
  const isInCart = (productId: number): boolean => {
    if (isAuthenticated && state.cart && state.cart.cartItems) {
      return state.cart.cartItems.some(item => item.productId === productId);
    }
    return state.localCart.items.some(item => item.productId === productId);
  };

  const getCartItemCount = (): number => {
    if (isAuthenticated && state.cart && state.cart.cartItems) {
      return state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }
    return state.localCart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = (): number => {
    if (isAuthenticated && state.cart) {
      return state.cart.totalPrice || 0;
    }
    return state.localCart.totalPrice;
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: CartContextType = {
    cart: state.cart,
    localCart: state.localCart,
    isLoading: state.isLoading,
    error: state.error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItemCount,
    getCartTotal,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 