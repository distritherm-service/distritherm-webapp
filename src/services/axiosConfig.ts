import axios from 'axios';

export const BASE_API_URL = 'http://192.168.1.8:3000';

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000, // 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    // Ajout des headers par défaut
    config.headers['x-api-key'] = import.meta.env.VITE_API_KEY || '';
    config.headers['x-platform'] = 'web';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion globale des erreurs
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      console.error('Erreur de réponse:', error.response.status);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Erreur de requête:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
