import axiosInstance from './axiosConfig';

export interface Category {
  id: number;
  name: string;
  level: number;
  haveParent: boolean;
  haveChildren: boolean;
  description: string;
  parentCategoryId: number | null;
  agenceId: number;
  createdAt: string;
  updatedAt: string;
  products?: any[];
  childCategories?: Category[];
}

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get('/categories');
      if (!response.data.categories) {
        throw new Error('Aucune catégorie trouvée');
      }
      return response.data.categories;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  getCategoryById: async (id: number): Promise<Category | null> => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      if (!response.data.category) {
        return null;
      }
      return response.data.category;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
      throw error;
    }
  },

  getCategoryChildren: async (id: number): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(`/categories/${id}/childrens`);
      return response.data.categories || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des sous-catégories de ${id}:`, error);
      throw error;
    }
  },

  searchCategories: async (query: string): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(`/categories/search?q=${encodeURIComponent(query)}`);
      return response.data.categories || [];
    } catch (error) {
      console.error('Erreur lors de la recherche des catégories:', error);
      throw error;
    }
  },

  getCategoriesByAgency: async (agencyId: number): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(`/categories/agency/${agencyId}`);
      return response.data.categories || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des catégories de l'agence ${agencyId}:`, error);
      throw error;
    }
  }
}; 