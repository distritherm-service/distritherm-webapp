  import axiosInstance from './axiosConfig';
import {
  Cart,
  CartApiResponse,
  AddCartItemRequest,
  UpdateCartItemRequest,
  RemoveCartItemRequest
} from '../types/cart';

/**
 * Fonction utilitaire pour extraire .data et typer la réponse.
 */
const extractData = <T>(promise: Promise<any>): Promise<T> =>
  promise.then((response) => response.data as T);

/**
 * Classe d'erreur personnalisée pour le panier
 */
export class CartError extends Error {
  constructor(
    public status: number,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'CartError';
  }
}

const handleCartError = (error: any): never => {
  console.error('Erreur du panier:', error);
  
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || data?.error || `Erreur ${status}`;
    console.error(`Erreur API Cart - Status: ${status}, Message: ${message}`);
    throw new CartError(status, message, error);
  }
  
  console.error('Erreur de connexion au service panier');
  throw new CartError(0, 'Erreur de connexion au service panier', error);
};

/**
 * Service pour la gestion des paniers
 */
export const cartService = {
  /**
   * Crée un nouveau panier pour l'utilisateur
   * @param userId — Identifiant de l'utilisateur
   */
  async createCart(userId: number): Promise<CartApiResponse> {
    try {
      console.log(`[CartService] Création d'un nouveau panier pour l'utilisateur ${userId}`);
      
      // Créer un panier vide avec le statut IS_ACTIVE
      const response = await extractData<CartApiResponse>(
        axiosInstance.post('/carts', {
          userId,
          status: 'IS_ACTIVE',
          cartItems: []
        })
      );
      
      console.log(`[CartService] Panier créé avec succès:`, response);
      return response;
    } catch (error) {
      console.error(`[CartService] Erreur lors de la création du panier:`, error);
      return handleCartError(error);
    }
  },

  /**
   * Récupère le panier actif (non commandé) de l'utilisateur.
   * Si aucun panier actif n'existe, en crée un nouveau.
   * @param userId — Identifiant de l'utilisateur
   */
  async getActiveCart(userId: number): Promise<CartApiResponse> {
    try {
      console.log(`[CartService] Récupération du panier actif pour l'utilisateur ${userId}`);
      
      const response = await extractData<CartApiResponse>(
        axiosInstance.get(`/carts/active/${userId}`)
      );
      
      console.log(`[CartService] Panier actif récupéré:`, response);
      return response;
    } catch (error: any) {
      // Si erreur 404, créer un nouveau panier
      if (error.response?.status === 404) {
        console.log('[CartService] Aucun panier actif trouvé, création d\'un nouveau panier...');
        return await this.createCart(userId);
      }
      return handleCartError(error);
    }
  },

  /**
   * Récupère un panier par son ID.
   * @param cartId — Identifiant du panier
   */
  async getCartById(cartId: number): Promise<CartApiResponse> {
    try {
      console.log(`[CartService] Récupération du panier ${cartId}`);
      
      const response = await extractData<CartApiResponse>(
        axiosInstance.get(`/carts/${cartId}`)
      );
      
      console.log(`[CartService] Panier récupéré:`, response);
      return response;
    } catch (error) {
      return handleCartError(error);
    }
  },

  /**
   * Ajoute un produit au panier.
   * @param request — Données pour ajouter le produit
   */
  async addProductToCart(request: AddCartItemRequest): Promise<CartApiResponse> {
    try {
      console.log(`[CartService] Ajout du produit ${request.productId} au panier ${request.cartId}`);
      console.log(`[CartService] Quantité: ${request.quantity}`);
      
      // Appeler l'API pour ajouter le produit
      const response = await extractData<any>(
        axiosInstance.post('/carts/add-cart-item', request)
      );
      
      console.log(`[CartService] Réponse d'ajout:`, response);
      
      // Vérifier si la réponse contient un panier complet
      if (response.cart && response.cart.cartItems) {
        // La réponse contient déjà le panier complet
        return response;
      } else {
        // La réponse ne contient pas le panier complet, le récupérer
        const fullCartResponse = await this.getCartById(request.cartId);
        return {
          message: response.message || 'Produit ajouté au panier',
          cart: fullCartResponse.cart
        };
      }
    } catch (error) {
      console.error(`[CartService] Erreur lors de l'ajout du produit:`, error);
      return handleCartError(error);
    }
  },

  /**
   * Met à jour la quantité d'un produit existant dans le panier.
   * @param request — Données pour mettre à jour la quantité
   */
  async updateCartItemQuantity(request: UpdateCartItemRequest): Promise<CartApiResponse> {
    try {
      console.log(`[CartService] Mise à jour de la quantité pour l'item ${request.cartItemId}`);
      console.log(`[CartService] Nouvelle quantité: ${request.quantity}`);
      
      // L'API retourne un CartItem, pas un Cart complet
      const updateResponse = await extractData<{ message: string; cart: any }>(
        axiosInstance.post('/carts/update-cart-item', request)
      );
      
      console.log(`[CartService] Réponse de mise à jour:`, updateResponse);
      
      // Après la mise à jour, récupérer le panier complet
      // On doit d'abord récupérer l'userId depuis le cartItem retourné
      const userId = updateResponse.cart.product?.userId || 
                     updateResponse.cart.userId || 
                     request.cartId; // Fallback au cartId si pas d'userId
      
      // Récupérer le panier complet mis à jour
      const fullCartResponse = await this.getCartById(request.cartId);
      
      console.log(`[CartService] Panier complet après mise à jour:`, fullCartResponse);
      
      return {
        message: updateResponse.message,
        cart: fullCartResponse.cart
      };
    } catch (error) {
      console.error(`[CartService] Erreur lors de la mise à jour:`, error);
      return handleCartError(error);
    }
  },

  /**
   * Retire un produit du panier.
   * @param request — Données pour supprimer le produit
   */
  async removeProductFromCart(request: RemoveCartItemRequest): Promise<CartApiResponse> {
    try {
      console.log(`[CartService] Suppression du produit ${request.productId} du panier ${request.cartId}`);
      
      // L'API retourne directement un Cart complet pour remove-cart-item
      const response = await extractData<CartApiResponse>(
        axiosInstance.post('/carts/remove-cart-item', request)
      );
      
      console.log(`[CartService] Produit supprimé:`, response);
      return response;
    } catch (error) {
      console.error(`[CartService] Erreur lors de la suppression:`, error);
      return handleCartError(error);
    }
  },

  /**
   * Met à jour un panier (payload complet : statut + items).
   * @param cartId — Identifiant du panier
   * @param payload — Données à mettre à jour
   */
  async updateCart(cartId: number, payload: Partial<Cart>): Promise<CartApiResponse> {
    try {
      return await extractData<CartApiResponse>(
        axiosInstance.put(`/carts/${cartId}`, payload)
      );
    } catch (error) {
      return handleCartError(error);
    }
  },

  /**
   * Met à jour le statut d'un panier.
   * @param cartId — Identifiant du panier
   * @param status — Nouveau statut
   */
  async updateCartStatus(cartId: number, status: string): Promise<CartApiResponse> {
    try {
      return await extractData<CartApiResponse>(
        axiosInstance.patch(`/carts/${cartId}/status`, { status })
      );
    } catch (error) {
      return handleCartError(error);
    }
  },

  /**
   * Supprime un panier existant.
   * @param cartId — Identifiant du panier
   */
  async deleteCart(cartId: number): Promise<{ message: string }> {
    try {
      return await extractData<{ message: string }>(
        axiosInstance.delete(`/carts/${cartId}`)
      );
    } catch (error) {
      return handleCartError(error);
    }
  },

  /**
   * Vide complètement le panier en supprimant tous les items.
   * @param cart — Le panier à vider
   */
  async clearCart(cart: Cart): Promise<void> {
    try {
      const removePromises = cart.cartItems.map(item =>
        this.removeProductFromCart({
          cartId: cart.id,
          productId: item.productId,
          cartItemId: item.id
        })
      );
      await Promise.all(removePromises);
    } catch (error) {
      return handleCartError(error);
    }
  }
};

// Fonctions legacy pour compatibilité (à supprimer progressivement)
export const getActiveCart = cartService.getActiveCart;
export const getCartById = cartService.getCartById;
export const addProductToCart = (cartId: number, productId: number, quantity: number) =>
  cartService.addProductToCart({ cartId, productId, quantity });
export const updateCartItemQuantity = (cartId: number, cartItemId: number, quantity: number) =>
  cartService.updateCartItemQuantity({ cartId, cartItemId, quantity });
export const removeProductFromCart = (cartId: number, productId: number, cartItemId: number) =>
  cartService.removeProductFromCart({ cartId, productId, cartItemId });
export const updateCart = cartService.updateCart;
export const deleteCart = cartService.deleteCart;
export const clearCartServerSide = cartService.clearCart;

// Export des types pour compatibilité
export type { Cart, CartApiResponse } from '../types/cart'; 