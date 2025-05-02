import axiosInstance from './axiosConfig';
import { 
  Favorite, 
  FavoriteResponse, 
  FavoritesListResponse, 
  FavoriteCountResponse, 
  FavoriteCheckResponse 
} from '../types/favorites';

// Base URL pour les endpoints des favoris
const FAVORITES_URL = '/favorites';

/**
 * Ajoute un produit aux favoris de l'utilisateur
 * @param productId ID du produit à ajouter aux favoris
 * @returns Promesse contenant la réponse de l'API
 */
export const addToFavorites = async (productId: number): Promise<FavoriteResponse> => {
  try {
    const response = await axiosInstance.post<FavoriteResponse>(FAVORITES_URL, {
      productId
    });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Une erreur s'est produite lors de l'ajout aux favoris" };
  }
};

/**
 * Récupère la liste des favoris de l'utilisateur spécifié
 * @param userId ID de l'utilisateur
 * @param page Numéro de la page (optionnel, défaut: 1)
 * @param limit Nombre d'éléments par page (optionnel, défaut: 10)
 * @returns Promesse contenant la liste des favoris
 */
export const getFavoritesByUser = async (
  userId: number, 
  page: number = 1, 
  limit: number = 10
): Promise<FavoritesListResponse> => {
  try {
    const response = await axiosInstance.get<FavoritesListResponse>(
      `${FAVORITES_URL}/by-user/${userId}`,
      { params: { page, limit } }
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Une erreur s'est produite lors de la récupération des favoris" };
  }
};

/**
 * Récupère le nombre d'utilisateurs qui ont ajouté un produit spécifique à leurs favoris
 * @param productId ID du produit
 * @returns Promesse contenant les informations du produit et le nombre de favoris
 */
export const getFavoritesCountByProduct = async (productId: number): Promise<FavoriteCountResponse> => {
  try {
    const response = await axiosInstance.get<FavoriteCountResponse>(
      `${FAVORITES_URL}/count-by-product/${productId}`
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Une erreur s'est produite lors de la récupération du nombre de favoris" };
  }
};

/**
 * Vérifie si un produit est dans les favoris de l'utilisateur connecté
 * @param productId ID du produit à vérifier
 * @returns Promesse indiquant si le produit est dans les favoris
 */
export const checkFavorite = async (productId: number): Promise<FavoriteCheckResponse> => {
  try {
    const response = await axiosInstance.get<FavoriteCheckResponse>(
      `${FAVORITES_URL}/check`,
      { params: { productId } }
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Une erreur s'est produite lors de la vérification des favoris" };
  }
};

/**
 * Supprime un favori par son ID
 * @param favoriteId ID du favori à supprimer
 * @returns Promesse avec le message de confirmation
 */
export const deleteFavorite = async (favoriteId: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete<{ message: string }>(
      `${FAVORITES_URL}/${favoriteId}`
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Une erreur s'est produite lors de la suppression du favori" };
  }
};

/**
 * Supprime un favori en utilisant l'ID du produit
 * @param productId ID du produit à retirer des favoris
 * @returns Promesse avec le message de confirmation
 */
export const deleteFavoriteByProductId = async (productId: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete<{ message: string }>(
      `${FAVORITES_URL}/by-product/${productId}`
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Une erreur s'est produite lors de la suppression du favori" };
  }
}; 