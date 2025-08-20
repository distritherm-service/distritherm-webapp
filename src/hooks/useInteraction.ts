import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import interactionService from '../services/interactionService';
import { InteractionType } from '../types/interaction';

/**
 * Hook personnalisé pour gérer les interactions utilisateur-produit
 * Facilite l'enregistrement des interactions avec gestion automatique de l'utilisateur connecté
 */
export const useInteraction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Enregistre une interaction générique
   */
  const trackInteraction = useCallback(async (
    type: InteractionType | string,
    productId: number
  ) => {
    if (!user?.id) {
      console.warn('[useInteraction] Utilisateur non connecté, interaction non enregistrée');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      const response = await interactionService.create(type, productId, userId);
      
      // Ne pas logger si c'est une réponse factice (id = 0)
      if (response.interaction.id !== 0) {
        console.log('[useInteraction] Interaction enregistrée:', response);
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'enregistrement de l\'interaction';
      setError(errorMessage);
      console.error('[useInteraction] Erreur:', errorMessage);
      
      // Ne pas afficher de notification d'erreur pour les interactions
      // car ce n'est pas critique pour l'expérience utilisateur
      // showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Enregistre un clic sur un produit
   */
  const trackProductClick = useCallback(async (productId: number) => {
    return trackInteraction(InteractionType.CLICK_PRODUCT, productId);
  }, [trackInteraction]);

  /**
   * Enregistre un like sur un produit
   */
  const trackProductLike = useCallback(async (productId: number) => {
    return trackInteraction(InteractionType.LIKE, productId);
  }, [trackInteraction]);

  /**
   * Enregistre un ajout au panier
   * Note: L'API ne supporte pas encore ADD_TO_CART, on utilise CLICK_PRODUCT comme fallback
   * ou on désactive complètement le tracking pour les ajouts au panier
   */
  const trackAddToCart = useCallback(async (_productId: number) => {
    // L'API ne supporte pas ADD_TO_CART, on ne track pas cette action pour le moment
    console.log('[useInteraction] ADD_TO_CART non supporté par l\'API, tracking ignoré');
    return Promise.resolve({
      message: 'Tracking d\'ajout au panier ignoré (non supporté)',
      interaction: {
        id: 0,
        type: 'ADD_TO_CART',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {} as any,
        user: {} as any
      }
    });
  }, []);

  return {
    trackInteraction,
    trackProductClick,
    trackProductLike,
    trackAddToCart,
    isLoading,
    error
  };
};

export default useInteraction;
