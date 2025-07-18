import axiosInstance from './axiosConfig';
import { 
  AddFavoriteRequest,
  AddFavoriteResponse,
  FavoritesListResponse,
  FavoriteCountResponse,
  FavoriteCheckResponse
} from '../types/favorites';

/**
 * Service de gestion des favoris
 * Basé sur l'API Swagger fournie
 */

/**
 * Ajoute un produit aux favoris
 * POST /favorites
 * @param productId ID du produit à ajouter aux favoris
 * @param userId ID de l'utilisateur - REQUIS selon l'API Swagger
 * @returns La réponse avec le favori créé
 */
export const addToFavorites = async (productId: number, userId: number): Promise<AddFavoriteResponse> => {
  try {
    // console.log(`[FavoritesService] Tentative d'ajout du produit ${productId} aux favoris pour l'utilisateur ${userId}`);
    
    // L'API Swagger exige que userId soit toujours présent dans le body
    const body: AddFavoriteRequest = { 
      productId,
      userId // Toujours inclure l'userId selon la documentation Swagger
    };
    
    // console.log(`[FavoritesService] Body de la requête:`, body);
    
    const response = await axiosInstance.post<AddFavoriteResponse>('/favorites', body);
    // console.log(`[FavoritesService] Produit ajouté aux favoris avec succès:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`[FavoritesService] Erreur lors de l'ajout aux favoris:`, {
      productId,
      userId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    // Gérer les erreurs spécifiques
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        // Si c'est un tableau d'erreurs, prendre la première
        throw { message: errorMessage[0], error: "Bad Request" };
      } else if (typeof errorMessage === 'string') {
        throw { message: errorMessage, error: "Bad Request" };
      } else {
        throw { message: "Ce produit est déjà dans les favoris", error: "Bad Request" };
      }
    }
    if (error.response?.status === 401) {
      throw { message: "Utilisateur non authentifié", error: "Unauthorized" };
    }
    if (error.response?.status === 403) {
      throw { message: "Vous n'êtes pas autorisé à ajouter des favoris pour cet utilisateur", error: "Forbidden" };
    }
    if (error.response?.status === 404) {
      throw { message: "Produit ou Utilisateur non trouvé", error: "Not Found" };
    }
    
    throw error.response?.data || { message: "Une erreur s'est produite lors de l'ajout aux favoris" };
  }
};

/**
 * Récupère les favoris d'un utilisateur spécifique avec pagination
 * GET /favorites/by-user/{userId}
 * @param userId ID de l'utilisateur
 * @param page Numéro de page (commence à 1)
 * @param limit Nombre d'éléments par page
 * @returns La liste des favoris avec les métadonnées de pagination
 */
export const getFavoritesByUser = async (
  userId: number, 
  page: number = 1, 
  limit: number = 10
): Promise<FavoritesListResponse> => {
  try {
    // console.log(`[FavoritesService] Récupération des favoris pour l'utilisateur ${userId}, page ${page}, limit ${limit}`);
    
    const response = await axiosInstance.get<FavoritesListResponse>(
      `/favorites/by-user/${userId}`,
      { 
        params: { 
          page: Math.max(1, page), // S'assurer que page >= 1
          limit: Math.max(1, Math.min(100, limit)) // Entre 1 et 100
        } 
      }
    );
    
    // console.log(`[FavoritesService] Favoris récupérés avec succès:`, {
    //   count: response.data.count,
    //   total: response.data.total,
    //   page: response.data.page,
    //   lastPage: response.data.lastPage
    // });
    
    // Log détaillé de la structure des favoris
    // console.log(`[FavoritesService] Structure détaillée des favoris:`, response.data.favorites);
    if (response.data.favorites.length > 0) {
      // console.log(`[FavoritesService] Premier favori:`, response.data.favorites[0]);
      // console.log(`[FavoritesService] Structure du premier favori:`, {
      //   id: response.data.favorites[0].id,
      //   productId: response.data.favorites[0].productId,
      //   userId: response.data.favorites[0].userId,
      //   product: response.data.favorites[0].product,
      //   hasProduct: !!response.data.favorites[0].product,
      //   productKeys: response.data.favorites[0].product ? Object.keys(response.data.favorites[0].product) : []
      // });
    }
    
    return response.data;
  } catch (error: any) {
    // console.error(`[FavoritesService] Erreur lors de la récupération des favoris:`, {
    //   userId,
    //   page,
    //   limit,
    //   status: error.response?.status,
    //   message: error.response?.data?.message || error.message,
    //   data: error.response?.data
    // });
    
    if (error.response?.status === 401) {
      throw { message: "Utilisateur non authentifié", error: "Unauthorized" };
    }
    if (error.response?.status === 403) {
      throw { message: "Vous n'êtes pas autorisé à accéder aux favoris de cet utilisateur", error: "Forbidden" };
    }
    if (error.response?.status === 404) {
      throw { message: "Utilisateur non trouvé", error: "Not Found" };
    }
    
    throw error.response?.data || { message: "Une erreur s'est produite lors de la récupération des favoris" };
  }
};

/**
 * Compte le nombre de favoris pour un produit (Admin seulement)
 * GET /favorites/count-by-product/{productId}
 * @param productId ID du produit
 * @returns Le nombre d'utilisateurs qui ont ce produit en favori
 */
export const getFavoritesCountByProduct = async (productId: number): Promise<FavoriteCountResponse> => {
  try {
    // console.log(`[FavoritesService] Comptage des favoris pour le produit ${productId}`);
    
    const response = await axiosInstance.get<FavoriteCountResponse>(
      `/favorites/count-by-product/${productId}`
    );
    
    // console.log(`[FavoritesService] Nombre de favoris récupéré:`, response.data.favoritesCount);
    return response.data;
  } catch (error: any) {
    // console.error(`[FavoritesService] Erreur lors du comptage des favoris:`, {
    //   productId,
    //   status: error.response?.status,
    //   message: error.response?.data?.message || error.message
    // });
    
    if (error.response?.status === 401) {
      throw { message: "Utilisateur non authentifié", error: "Unauthorized" };
    }
    if (error.response?.status === 403) {
      throw { message: "Seuls les administrateurs peuvent accéder à cette ressource", error: "Forbidden" };
    }
    if (error.response?.status === 404) {
      throw { message: "Produit non trouvé", error: "Not Found" };
    }
    
    throw error.response?.data || { message: "Une erreur s'est produite lors de la récupération du nombre de favoris" };
  }
};

/**
 * Vérifie si un produit est dans les favoris d'un utilisateur
 * GET /favorites/check/{productId}/users/{userId}
 * @param productId ID du produit à vérifier
 * @param userId ID de l'utilisateur
 * @returns Un objet indiquant si le produit est dans les favoris
 */
export const checkFavorite = async (productId: number, userId: number): Promise<FavoriteCheckResponse> => {
  try {
    console.log(`[FavoritesService] Vérification si le produit ${productId} est dans les favoris de l'utilisateur ${userId}`);
    
    const response = await axiosInstance.get<FavoriteCheckResponse>(
      `/favorites/check/${productId}/users/${userId}`
    );
    
    // console.log(`[FavoritesService] Résultat de la vérification:`, response.data);
    return response.data;
  } catch (error: any) {
    // console.error(`[FavoritesService] Erreur lors de la vérification des favoris:`, {
    //   productId,
    //   userId,
    //   status: error.response?.status,
    //   message: error.response?.data?.message || error.message
    // });
    
    if (error.response?.status === 401) {
      throw { message: "Utilisateur non authentifié", error: "Unauthorized" };
    }
    if (error.response?.status === 403) {
      throw { message: "Vous n'êtes pas autorisé à vérifier les favoris de cet utilisateur", error: "Forbidden" };
    }
    if (error.response?.status === 404) {
      throw { message: "Produit ou Utilisateur non trouvé", error: "Not Found" };
    }
    
    throw error.response?.data || { message: "Une erreur s'est produite lors de la vérification des favoris" };
  }
};

/**
 * Supprime un favori par son ID
 * DELETE /favorites/{id}
 * @param favoriteId ID du favori à supprimer
 * @returns Un message de confirmation
 */
export const deleteFavorite = async (favoriteId: number): Promise<{ message: string }> => {
  try {
    // console.log(`[FavoritesService] Suppression du favori ${favoriteId}`);
    
    const response = await axiosInstance.delete<{ message: string }>(`/favorites/${favoriteId}`);
    
    // console.log(`[FavoritesService] Favori supprimé avec succès:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`[FavoritesService] Erreur lors de la suppression du favori:`, {
      favoriteId,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      throw { message: "Utilisateur non authentifié", error: "Unauthorized" };
    }
    if (error.response?.status === 403) {
      throw { message: "Vous n'êtes pas autorisé à supprimer ce favori", error: "Forbidden" };
    }
    if (error.response?.status === 404) {
      throw { message: "Favori non trouvé", error: "Not Found" };
    }
    
    throw error.response?.data || { message: "Une erreur s'est produite lors de la suppression du favori" };
  }
};

/**
 * Supprime un favori par l'ID du produit pour l'utilisateur connecté
 * DELETE /favorites/by-product/{productId}
 * @param productId ID du produit à retirer des favoris
 * @returns Un message de confirmation
 */
export const deleteFavoriteByProductId = async (productId: number): Promise<{ message: string }> => {
  try {
    // console.log(`[FavoritesService] Suppression du favori pour le produit ${productId}`);
    
    const response = await axiosInstance.delete<{ message: string }>(`/favorites/by-product/${productId}`);
    
    // console.log(`[FavoritesService] Favori supprimé avec succès:`, response.data);
    return response.data;
  } catch (error: any) {
    // console.error(`[FavoritesService] Erreur lors de la suppression du favori:`, {
    //   productId,
    //   status: error.response?.status,
    //   message: error.response?.data?.message || error.message
    // });
    
    if (error.response?.status === 401) {
      throw { message: "Utilisateur non authentifié", error: "Unauthorized" };
    }
    if (error.response?.status === 403) {
      throw { message: "Vous n'êtes pas autorisé à supprimer ce favori", error: "Forbidden" };
    }
    if (error.response?.status === 404) {
      throw { message: "Favori non trouvé", error: "Not Found" };
    }
    
    throw error.response?.data || { message: "Une erreur s'est produite lors de la suppression du favori" };
  }
};

/**
 * Helper pour vérifier si un produit est dans les favoris de l'utilisateur connecté
 * Utilise l'ID de l'utilisateur depuis le contexte d'authentification
 * @param productId ID du produit
 * @param userId ID de l'utilisateur connecté
 * @returns Boolean indiquant si le produit est favori
 */
export const isProductFavorited = async (productId: number, userId: number): Promise<boolean> => {
  try {
    // console.log(`[FavoritesService] Vérification rapide si le produit ${productId} est favori pour l'utilisateur ${userId}`);
    
    const response = await checkFavorite(productId, userId);
    const result = response.isFavorite;
    
    // console.log(`[FavoritesService] Résultat de la vérification rapide:`, result);
    return result;
  } catch (error) {
    // console.error(`[FavoritesService] Erreur lors de la vérification du favori:`, error);
    return false;
  }
}; 