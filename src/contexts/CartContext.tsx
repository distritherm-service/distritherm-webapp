import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  addProductToCart,
  getActiveCart,
  updateCartItemQuantity,
  removeProductFromCart,
  Cart as ApiCart,
} from '../services/cartService';

interface CartItem {
  id: string;
  name: string;
  price: number;
  priceHT: number;
  priceTTC: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartId: number | null;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'priceHT' | 'priceTTC'> & { price: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
}

// Création du contexte avec une valeur par défaut
const CartContext = createContext<CartContextType>({
  cart: [],
  cartId: null,
  isLoading: false,
  addToCart: () => {
    throw new Error('CartContext not initialized');
  },
  removeFromCart: () => {
    throw new Error('CartContext not initialized');
  },
  updateQuantity: () => {
    throw new Error('CartContext not initialized');
  },
  isInCart: () => false,
  clearCart: () => {
    throw new Error('CartContext not initialized');
  },
});

// Clef localStorage pour le panier invité
const GUEST_CART_KEY = 'distritherm_guest_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isAuthenticated, user } = useAuth();

  const numericUserId = user && !isNaN(Number(user.id)) ? Number(user.id) : null;

  // Helper : convertir la réponse API en CartItem "front"
  const mapApiItems = (apiCart: ApiCart): CartItem[] =>
    apiCart.cartItems.map((ci) => {
      const priceTTC = ci.price;
      const priceHT = priceTTC / 1.2;
      return {
        id: ci.productId.toString(),
        name: ci.product?.name || 'Produit',
        price: priceTTC,
        priceHT,
        priceTTC,
        image:
          ci.product?.imagesUrl && ci.product.imagesUrl.length > 0
            ? `/images/products/${ci.product.imagesUrl[0]}`
            : '/image-produit-defaut.jpeg',
        quantity: ci.quantity,
      };
    });

  // Hydratation initiale si l'utilisateur est connecté
  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated || !user || numericUserId === null) {
        // Utilisateur déconnecté => restaurer le panier invité si présent
        try {
          const stored = localStorage.getItem(GUEST_CART_KEY);
          setCart(stored ? (JSON.parse(stored) as CartItem[]) : []);
        } catch (_) {
          setCart([]);
        }
        setCartId(null);
        return;
      }

      try {
        setIsLoading(true);
        const { cart: apiCart } = await getActiveCart(numericUserId);

        // Récupérer le panier invité pour fusion
        const guestRaw = localStorage.getItem(GUEST_CART_KEY);
        const guestItems: CartItem[] = guestRaw ? JSON.parse(guestRaw) : [];

        // Fusionner : pour chaque item invité absent de l'API, l'ajouter
        for (const guest of guestItems) {
          const already = apiCart.cartItems.find((ci) => ci.productId === Number(guest.id));
          if (already) {
            // Si quantités différentes, ajuster
            const delta = guest.quantity - already.quantity;
            if (delta !== 0) {
              await updateCartItemQuantity(apiCart.id, already.id, guest.quantity).catch(console.error);
            }
          } else {
            await addProductToCart(apiCart.id, Number(guest.id), guest.quantity).catch(console.error);
          }
        }

        // Recharger le panier API après fusion
        const { cart: mergedCart } = await getActiveCart(numericUserId);
        setCart(mapApiItems(mergedCart));
        setCartId(mergedCart.id);

        // Nettoyer le panier invité
        localStorage.removeItem(GUEST_CART_KEY);
      } catch (e: any) {
        // Si l'API renvoie 404 (pas de panier actif) ou 401 (non autorisé), utiliser le panier local
        if (e.response?.status === 404 || e.response?.status === 401) {
          // Charger le panier local s'il existe
          try {
            const stored = localStorage.getItem(GUEST_CART_KEY);
            setCart(stored ? (JSON.parse(stored) as CartItem[]) : []);
          } catch (_) {
            setCart([]);
          }
        } else {
          console.error('Erreur lors de l\'hydratation du panier:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
    // Nettoyer si user change / logout
  }, [isAuthenticated, user]);

  // Persistance du panier invité
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = (item: Omit<CartItem, 'priceHT' | 'priceTTC'> & { price: number }) => {
    // On suppose que le prix passé est TTC
    const priceTTC = item.price;
    const priceHT = item.price / 1.2; // TVA à 20%
    
    // MAJ locale immédiate (optimistic UI)
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, priceHT, priceTTC }];
    });

    // Si utilisateur connecté, pousser vers l'API (non bloquant)
    if (isAuthenticated && cartId) {
      addProductToCart(cartId, Number(item.id), item.quantity).catch((e) => {
        console.error('Erreur addProductToCart :', e);
        // TODO : rollback si besoin
      });
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    if (isAuthenticated && cartId) {
      // Trouver cartItemId pour API ; on ne l'a pas → forcer reload ensuite.
      // Simplification : reload complet après suppression.
      const reload = async () => {
        try {
          const { cart: apiCart } = await removeProductFromCart(
            cartId,
            Number(id),
            0 // cartItemId inconnu ⇒ sera retrouvé côté serveur via productId
          );
          setCart(mapApiItems(apiCart));
        } catch (e) {
          console.error('Erreur removeProductFromCart :', e);
        }
      };
      reload();
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    if (isAuthenticated && cartId) {
      const cartItem = cart.find((ci) => ci.id === id);
      if (cartItem) {
        updateCartItemQuantity(cartId, Number(cartItem.id), quantity).catch((e) =>
          console.error('Erreur updateCartItemQuantity :', e)
        );
      }
    }
  };

  const isInCart = (id: string) => cart.some(item => item.id === id);

  const clearCart = () => {
    setCart([]);
    // Si connecté, on pourrait appeler clearCartServerSide, mais non implémenté par l'API.
  };

  const contextValue: CartContextType = {
    cart,
    cartId,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    clearCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 