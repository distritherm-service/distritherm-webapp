import { axiosInstance } from './axiosConfig';

// Interface pour les agences
export interface Agency {
  id: number;
  name: string;
  address: string;
  city?: string;
  postal_code?: string;
}

export const agencyService = {
  // Récupérer toutes les agences
  async getAgencies(): Promise<Agency[]> {
    try {
      const response = await axiosInstance.get('/agencies');
      
      // Vérifier la structure de la réponse comme dans Contact.tsx
      const agenciesData = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || response.data.agencies || [];
      
      return agenciesData;  
    } catch (error) {
    //  console.error('Erreur lors de la récupération des agences:', error);
      return [];
    }
  },
  
  // Récupérer une agence par son ID
  async getAgencyById(id: number): Promise<Agency | null> {
    try {
      const response = await axiosInstance.get(`/agencies/${id}`);
      return response.data;
    } catch (error) {
    //  console.error(`Erreur lors de la récupération de l'agence ${id}:`, error);
      return null;
    }
  }
};
