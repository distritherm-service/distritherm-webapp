import axiosInstance from './axiosConfig';
import {
  CreateInteractionRequest,
  CreateInteractionResponse,
  InteractionType,
  InteractionErrorResponse
} from '../types/interaction';

/**
 * Service de gestion des interactions utilisateur-produit
 * Permet de suivre le comportement des utilisateurs sur la plateforme
 */

/**
 * Enregistre une interaction d'un utilisateur avec un produit
 * POST /interactions
 * 
 * Rôles autorisés: ADMIN, CLIENT
 * 
 * Fonctionnalités:
 * - Suivi des interactions utilisateur-produit
 * - Types d'interaction : CLICK_PRODUCT, LIKE, ADD_TO_CART, etc.
 * - Analytics comportementales pour l'optimisation de l'expérience utilisateur
 * - Données pour les recommandations personnalisées
 * 
 * Usage typique:
 * - Enregistrement des clics sur les produits
 * - Suivi des likes et préférences
 * - Tracking des ajouts au panier
 * - Collecte de données pour l'amélioration de l'UX
 * 
 * @param type Type d'interaction (CLICK_PRODUCT, LIKE, ADD_TO_CART, etc.)
 * @param productId ID du produit concerné
 * @param userId ID de l'utilisateur effectuant l'interaction
 * @returns La réponse avec l'interaction créée
 */
export const createInteraction = async (
  type: InteractionType | string,
  productId: number,
  userId: number
): Promise<CreateInteractionResponse> => {
  // Vérifier si le type est supporté par l'API
  const supportedTypes = ['CLICK_PRODUCT', 'LIKE'];
  if (!supportedTypes.includes(type)) {
    console.warn(`[InteractionService] Type d'interaction "${type}" non supporté par l'API. Types supportés: ${supportedTypes.join(', ')}`);
    // Retourner une réponse factice pour ne pas bloquer l'utilisateur
    return {
      message: 'Type d\'interaction non supporté',
      interaction: {
        id: 0,
        type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {} as any,
        user: {} as any
      }
    };
  }

  try {
    console.log(`[InteractionService] Enregistrement de l'interaction ${type} pour le produit ${productId} par l'utilisateur ${userId}`);
    
    const body: CreateInteractionRequest = {
      type,
      productId,
      userId
    };
    
    console.log('[InteractionService] Body de la requête:', body);
    
    const response = await axiosInstance.post<CreateInteractionResponse>('/interactions', body);
    
    console.log('[InteractionService] Interaction enregistrée avec succès:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[InteractionService] Erreur lors de l\'enregistrement de l\'interaction:', error);
    
    if (error.response) {
      const errorData = error.response.data as InteractionErrorResponse;
      
      // Gestion des erreurs spécifiques selon le code de statut
      switch (error.response.status) {
        case 400:
          // Si l'API retourne 400, logger l'erreur mais ne pas bloquer l'utilisateur
          console.warn('[InteractionService] Erreur 400:', errorData.message || 'Type d\'interaction invalide');
          // Retourner une réponse factice pour ne pas bloquer l'utilisateur
          return {
            message: 'Interaction non enregistrée',
            interaction: {
              id: 0,
              type,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {} as any,
              user: {} as any
            }
          };
        case 401:
          console.warn('[InteractionService] Non autorisé - utilisateur non connecté ou token invalide');
          // Ne pas lever d'erreur pour ne pas bloquer l'UX
          return {
            message: 'Interaction non enregistrée (non autorisé)',
            interaction: {
              id: 0,
              type,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {} as any,
              user: {} as any
            }
          };
        case 403:
          console.warn('[InteractionService] Accès refusé');
          return {
            message: 'Interaction non enregistrée (accès refusé)',
            interaction: {
              id: 0,
              type,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {} as any,
              user: {} as any
            }
          };
        case 404:
          console.warn('[InteractionService] Produit non trouvé');
          return {
            message: 'Interaction non enregistrée (produit non trouvé)',
            interaction: {
              id: 0,
              type,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {} as any,
              user: {} as any
            }
          };
        case 500:
          console.error('[InteractionService] Erreur serveur');
          return {
            message: 'Interaction non enregistrée (erreur serveur)',
            interaction: {
              id: 0,
              type,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {} as any,
              user: {} as any
            }
          };
        default:
          console.error('[InteractionService] Erreur inconnue:', error.response.status);
          return {
            message: 'Interaction non enregistrée',
            interaction: {
              id: 0,
              type,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {} as any,
              user: {} as any
            }
          };
      }
    }
    
    console.error('[InteractionService] Erreur réseau');
    return {
      message: 'Interaction non enregistrée (erreur réseau)',
      interaction: {
        id: 0,
        type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {} as any,
        user: {} as any
      }
    };
  }
};

/**
 * Service d'interaction avec toutes les méthodes disponibles
 */
export const interactionService = {
  /**
   * Crée une nouvelle interaction
   */
  create: createInteraction,
  
  /**
   * Enregistre un clic sur un produit
   */
  trackProductClick: async (productId: number, userId: number) => {
    return createInteraction(InteractionType.CLICK_PRODUCT, productId, userId);
  },
  
  /**
   * Enregistre un like sur un produit
   */
  trackProductLike: async (productId: number, userId: number) => {
    return createInteraction(InteractionType.LIKE, productId, userId);
  },
  
  /**
   * Enregistre un ajout au panier
   * Note: ADD_TO_CART n'est pas supporté par l'API, cette méthode retourne une réponse factice
   */
  trackAddToCart: async (productId: number, userId: number) => {
    // L'API ne supporte pas ADD_TO_CART
    console.log('[InteractionService] ADD_TO_CART non supporté, retour d\'une réponse factice');
    return Promise.resolve({
      message: 'ADD_TO_CART non supporté',
      interaction: {
        id: 0,
        type: 'ADD_TO_CART',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {} as any,
        user: {} as any
      }
    });
  }
};

export default interactionService;
