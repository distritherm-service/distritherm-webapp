import { AxiosResponse } from 'axios';
import api from './axiosConfig';
import { 
  Order, 
  OrderResponse, 
  OrdersResponse, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  ErrorResponse 
} from '../types/order';

const BASE_URL = '/orders';

/**
 * Récupère toutes les commandes de l'utilisateur connecté
 * @param page Numéro de page (commence à 1)
 * @param limit Nombre d'éléments par page
 * @returns Réponse contenant les commandes et les métadonnées de pagination
 */
export const getAllOrders = async (
  page: number = 1,
  limit: number = 10
): Promise<OrdersResponse> => {
  try {
    console.log(`Récupération des commandes - page: ${page}, limit: ${limit}`);
    
    // Vérifier l'état de l'authentification
    const token = localStorage.getItem('distritherm_access_token');
    if (!token) {
      console.error('Authentification manquante: token absent');
      throw new Error('Vous devez être connecté pour accéder à vos commandes');
    }
    
    console.log('Envoi de la requête API avec authentification');
    const response: AxiosResponse<OrdersResponse> = await api.get(
      `${BASE_URL}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Réponse API commandes:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erreur getAllOrders:', error);
    
    // Logging détaillé de l'erreur
    if (error.response) {
      console.error('Réponse d\'erreur:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('Erreur de requête (pas de réponse):', error.request);
    } else {
      console.error('Erreur de configuration:', error.message);
    }
    
    throw handleApiError(error);
  }
};

/**
 * Récupère les commandes d'un client spécifique
 * @param userId ID de l'utilisateur
 * @param page Numéro de page (commence à 1)
 * @param limit Nombre d'éléments par page
 * @returns Réponse contenant les commandes et les métadonnées de pagination
 */
export const getClientOrders = async (
  userId: number,
  page: number = 1,
  limit: number = 10
): Promise<OrdersResponse> => {
  try {
    const response: AxiosResponse<OrdersResponse> = await api.get(
      `${BASE_URL}/client/${userId}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Récupère les détails d'une commande spécifique
 * @param id ID de la commande
 * @returns Réponse contenant les détails de la commande
 */
export const getOrderById = async (id: number): Promise<OrderResponse> => {
  try {
    const response: AxiosResponse<OrderResponse> = await api.get(
      `${BASE_URL}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Crée une nouvelle commande à partir d'un panier
 * @param orderData Données pour créer la commande
 * @returns Réponse confirmant la création de la commande
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  try {
    const response: AxiosResponse<OrderResponse> = await api.post(
      BASE_URL,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Met à jour une commande existante
 * @param id ID de la commande à mettre à jour
 * @param orderData Données pour mettre à jour la commande
 * @returns Réponse confirmant la mise à jour de la commande
 */
export const updateOrder = async (
  id: number,
  orderData: UpdateOrderRequest
): Promise<OrderResponse> => {
  try {
    const response: AxiosResponse<OrderResponse> = await api.patch(
      `${BASE_URL}/${id}`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Supprime une commande
 * @param id ID de la commande à supprimer
 * @returns Réponse confirmant la suppression
 */
export const deleteOrder = async (id: number): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.delete(
      `${BASE_URL}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Gère les erreurs API et renvoie un message d'erreur approprié
 * @param error Erreur à traiter
 * @returns Erreur formatée avec message
 */
const handleApiError = (error: any): Error => {
  console.error('Détails de l\'erreur API:', error);
  if (error.response) {
    const errorData = error.response.data as ErrorResponse;
    return new Error(errorData.message || 'Une erreur est survenue lors de la communication avec le serveur');
  }
  return new Error('Impossible de se connecter au serveur');
}; 