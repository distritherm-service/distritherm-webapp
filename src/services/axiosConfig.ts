import axios, { AxiosError, AxiosResponse } from 'axios';

// URL de l'API backend
export const BASE_API_URL = 'https://distritherm-backend.onrender.com';
// export const BASE_API_URL = 'http://192.168.1.8:3000';

// Clés pour le localStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'distritherm_access_token',
  USER_DATA: 'distritherm_user_data',
};

// Interface pour la réponse d'authentification
interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user?: any;
  message: string;
}

// Interface pour la réponse de rafraîchissement du token
interface RefreshTokenResponse {
  accessToken: string;
  message: string;
}

// Création de l'instance axios avec la configuration de base
const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Important pour les cookies de session et refresh token
});

// Export de l'instance axios (à la fois par défaut et nommé)
export { axiosInstance };

// Fonction pour sauvegarder les données d'authentification
export const saveAuthData = (data: AuthResponse): void => {
  if (data.accessToken) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
  }
  
  if (data.user) {
    // Vérifier s'il existe déjà des données utilisateur
    const existingUserData = getUserData();
    
    if (existingUserData) {
      // Préserver companyName et siretNumber s'ils ne sont pas présents dans les nouvelles données
      if (!data.user.companyName && existingUserData.companyName) {
        data.user.companyName = existingUserData.companyName;
      }
      
      if (!data.user.siretNumber && existingUserData.siretNumber) {
        data.user.siretNumber = existingUserData.siretNumber;
      }
    }
    
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
  }
  
  // Log pour débogage
  // console.log('Données d\'authentification sauvegardées:', {
  //   token: !!data.accessToken,
  //   user: !!data.user
  // });
};

// Fonction pour supprimer les données d'authentification
export const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  // console.log('Données d\'authentification supprimées');
};

// Fonction pour récupérer le token d'accès
export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Fonction pour récupérer les données utilisateur
export const getUserData = (): any | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

// Indicateur pour éviter plusieurs rafraîchissements simultanés
let isRefreshing = false;
// File d'attente pour les requêtes en attente pendant le rafraîchissement
let refreshSubscribers: Array<(token: string) => void> = [];

// Fonction pour rafraîchir le token
const refreshToken = async (): Promise<string> => {
  try {
    // console.log('Tentative de rafraîchissement du token...');
    const response = await axios.post<RefreshTokenResponse>(
      `${BASE_API_URL}/auth/refresh-token`,
      {},
      {
        withCredentials: true, // Important pour envoyer les cookies (dont le refresh token httpOnly)
      }
    );
    
    const { accessToken } = response.data;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    // console.log('Token rafraîchi avec succès');
    return accessToken;
  } catch (error) {
    // console.error('Échec du rafraîchissement du token:', error);
    clearAuthData();
    throw error;
  }
};

// Fonction pour ajouter les requêtes à la file d'attente
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Fonction pour exécuter toutes les requêtes en attente avec le nouveau token
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    // Ajout des headers par défaut
    config.headers['x-platform'] = 'web';
    
    // Ajout du token d'authentification s'il existe
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // S'assurer que les données sont bien formatées pour l'API
    if (config.data) {
      // Nettoyer les chaînes de caractères
      Object.keys(config.data).forEach(key => {
        if (typeof config.data[key] === 'string') {
          config.data[key] = config.data[key].trim();
        }
      });
    }

    return config;
  },
  (error) => {
    // console.error('Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Si la réponse contient des données d'authentification, les sauvegarder
    if (response.data && response.data.accessToken) {
      saveAuthData(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const errorResponse = error.response?.data as any;
    
    // console.error('Erreur de réponse:', {
    //   status: error.response?.status,
    //   message: errorResponse?.message || error.message
    // });
    
    // Vérifier si l'erreur est liée à un token invalide (401)
    if (
      error.response?.status === 401 &&
      (errorResponse?.message === 'Token invalide' || errorResponse?.message === 'Non autorisé') &&
      !originalRequest._retry
    ) {
      // console.log('Token invalide détecté, tentative de rafraîchissement...');
      
      // Marquer la requête pour éviter les boucles infinies
      originalRequest._retry = true;
      
      // Si un rafraîchissement est déjà en cours, mettre la requête en attente
      if (isRefreshing) {
        // console.log('Rafraîchissement déjà en cours, mise en file d\'attente de la requête');
        try {
          // Attendre le nouveau token et réessayer la requête
          const newToken = await new Promise<string>((resolve) => {
            subscribeTokenRefresh((token: string) => {
              resolve(token);
            });
          });
          
          // Mettre à jour le header d'autorisation avec le nouveau token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // console.error('Erreur lors de l\'attente du rafraîchissement:', refreshError);
          return Promise.reject(refreshError);
        }
      }
      
      // Démarrer le processus de rafraîchissement
      isRefreshing = true;
      
      try {
        // Obtenir un nouveau token
        const newToken = await refreshToken();
        
        // Mettre à jour l'en-tête d'autorisation
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Exécuter toutes les requêtes en attente
        onTokenRefreshed(newToken);
        
        // Réessayer la requête originale
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Gérer les erreurs de rafraîchissement
        // console.error('Échec du processus de rafraîchissement:', refreshError);
        
        // Déclencher un événement pour informer l'application
        const event = new CustomEvent('auth:logout', { detail: 'Session expirée' });
        window.dispatchEvent(event);
        
        return Promise.reject(refreshError);
      } finally {
        // Réinitialiser l'indicateur
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;