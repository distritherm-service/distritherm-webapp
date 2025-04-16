import axiosInstance from './axiosConfig';

interface RemindMeRequest {
  fullName: string;
  phoneNumber: string;
}

export const remindService = {
  requestCallback: async (data: RemindMeRequest) => {
    try {
      // S'assurer que les données sont dans le bon format
      const formattedData = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber.replace(/\s/g, '') // Enlever tous les espaces
      };

      const response = await axiosInstance.post('/users/remind-me', formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'X-Platform': 'web'
        }
      });
      
      return response.data;
    } catch (error: any) {
      // Améliorer la gestion des erreurs
      if (error.response) {
        // Le serveur a répondu avec un statut d'erreur
        throw new Error(error.response.data.message || 'Erreur lors de la demande de rappel');
      }
      throw error;
    }
  }
}; 