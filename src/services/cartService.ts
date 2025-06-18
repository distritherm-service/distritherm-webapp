import axiosInstance from './axiosConfig';

/**
 * Interfaces TypeScript représentant la structure renvoyée par l'API.
 * Elles sont volontairement "souples" ( partial ) afin de ne pas bloquer l'exécution
 * si le back-end évolue légèrement. Ajustez-les au besoin.
 */
export interface Product {
  id: number;
  name: string;
  priceTtc: number;
  quantity: number;
  imagesUrl?: string[];
  description?: string;
  categoryId?: number;
  markId?: number;
  isInPromotion?: boolean;
  promotionPrice?: number | null;
  priceHt?: number;
  // … ajoutez d'autres champs utiles
}

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  productId: number;
  product?: Product;
}

export interface Cart {
  id: number;
  userId: number;
  cartStatus: 'IS_ACTIVE' | 'IS_ORDERED' | string;
  totalPrice: number;
  cartItems: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fonction utilitaire pour extraire .data et typer la réponse.
 */
const extractData = <T>(promise: Promise<any>) =>
  promise.then((response) => response.data as T);

/***************************
 *        Endpoints        *
 ***************************/

/**
 * Récupère le panier actif (non commandé) de l'utilisateur.
 * @param userId — Identifiant de l'utilisateur
 */
export const getActiveCart = (userId: number) =>
  extractData<{ message: string; cart: Cart }>(
    axiosInstance.get(`/carts/active/${userId}`)
  );

/**
 * Récupère un panier par son ID.
 */
export const getCartById = (cartId: number) =>
  extractData<{ message: string; cart: Cart }>(
    axiosInstance.get(`/carts/${cartId}`)
  );

/**
 * Met à jour un panier (payload complet : statut + items).
 */
export const updateCart = (cartId: number, payload: Partial<Cart>) =>
  extractData<{ message: string; cart: Cart }>(
    axiosInstance.put(`/carts/${cartId}`, payload)
  );

/**
 * Supprime un panier existant.
 */
export const deleteCart = (cartId: number) =>
  extractData<{ message: string }>(
    axiosInstance.delete(`/carts/${cartId}`)
  );

/**
 * Met à jour uniquement le statut d'un panier.
 * (ex. : IS_ORDERED une fois la commande confirmée)
 */
export const updateCartStatus = (cartId: number, status: string) =>
  extractData<{ message: string; cart: Cart }>(
    axiosInstance.patch(`/carts/${cartId}/status`, { status })
  );

/**
 * Ajoute un produit au panier.
 * L'API invalide le cache Redis du panier actif côté serveur.
 */
export const addProductToCart = (
  cartId: number,
  productId: number,
  quantity = 1
) =>
  extractData<{ message: string; cart: Cart }>(
    axiosInstance.post('/carts/add-cart-item', {
      cartId,
      productId,
      quantity,
    })
  );

/**
 * Met à jour la quantité d'un produit existant dans le panier.
 */
export const updateCartItemQuantity = (
  cartId: number,
  cartItemId: number,
  quantity: number
) =>
  extractData<{ message: string; cart: Cart }>(
    axiosInstance.post('/carts/update-cart-item', {
      cartId,
      cartItemId,
      quantity,
    })
  );

/**
 * Retire un produit du panier.
 */
export const removeProductFromCart = (
  cartId: number,
  productId: number,
  cartItemId: number
) =>
  extractData<{ message: string; cart: Cart }>(
    axiosInstance.post('/carts/remove-cart-item', {
      cartId,
      productId,
      cartItemId,
    })
  );

/**
 * Helper pour vider complètement le panier (supprime chaque item côté API).
 * Boucle sur cartItems et appelle removeProductFromCart.
 * Vous pouvez aussi ajouter une route /carts/clear-{id} côté back-end.
 */
export const clearCartServerSide = async (cart: Cart) => {
  const promises = cart.cartItems.map((item) =>
    removeProductFromCart(cart.id, item.productId, item.id)
  );
  await Promise.all(promises);
}; 