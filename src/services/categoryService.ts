import { Category } from '@/types/category';
import axiosInstance from './axiosConfig';



export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get('/categories');
      
      // Vérification plus robuste des données de réponse
      if (response.data && Array.isArray(response.data.categories)) {
        return response.data.categories;
      }
      
      // Si la réponse n'a pas le format attendu, retourner un tableau vide
      console.warn('Format de réponse inattendu pour les catégories:', response.data);
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      // Retourner un tableau vide au lieu de propager l'erreur
      return [];
    }
  },

  getCategoriesByLevel: async (level: number): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(`/categories/level/${level}`);
      
      if (response.data && Array.isArray(response.data.categories)) {
        return response.data.categories;
      }
      
      console.warn('Format de réponse inattendu pour les catégories par niveau:', response.data);
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des catégories de niveau ${level}:`, error);
      return [];
    }
  },

  getCategoryById: async (id: number): Promise<Category | null> => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      if (response.data && response.data.category) {
        return response.data.category;
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
      return null;
    }
  },

  getCategoryChildren: async (id: number): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(`/categories/${id}/childrens`);
      if (response.data && Array.isArray(response.data.categories)) {
        return response.data.categories;
      }
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des sous-catégories de ${id}:`, error);
      return [];
    }
  },

  searchCategories: async (query: string): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(`/categories/search?q=${encodeURIComponent(query)}`);
      if (response.data && Array.isArray(response.data.categories)) {
        return response.data.categories;
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la recherche des catégories:', error);
      return [];
    }
  },

  getCategoriesByAgency: async (agencyId: number): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(`/categories/agency/${agencyId}`);
      if (response.data && Array.isArray(response.data.categories)) {
        return response.data.categories;
      }
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des catégories de l'agence ${agencyId}:`, error);
      return [];
    }
  }
}; 