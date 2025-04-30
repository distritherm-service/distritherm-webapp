import { Category } from '@/types/category';
import axiosInstance from './axiosConfig';

// Cache pour stocker les catégories récupérées de l'API
let categoriesCache: Category[] = [];

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get('/categories');
      
      // Vérification plus robuste des données de réponse
      if (response.data && Array.isArray(response.data.categories)) {
        categoriesCache = response.data.categories;
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

  // Fonction pour récupérer les catégories principales
  getCategories: async (): Promise<Category[]> => {
    try {
      // Utiliser le cache si disponible
      if (categoriesCache.length > 0) {
        return categoriesCache.filter(cat => cat.level === 1);
      }
      
      // Sinon, récupérer depuis l'API
      const categories = await categoryService.getAllCategories();
      return categories.filter(cat => cat.level === 1);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      // Retourner des catégories par défaut avec des images par défaut
      return [
        {
          id: 1,
          name: 'Chauffage',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Systèmes de chauffage',
          imageUrl: '/images/categories/default.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Isolation',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Matériaux d\'isolation',
          imageUrl: '/images/category-placeholder.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Chauffage',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Systèmes de chauffage',
          imageUrl: '/images/category-placeholder.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Climatisation',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Systèmes de climatisation',
          imageUrl: '/images/category-placeholder.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 5,
          name: 'Sanitaire',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Équipements sanitaires',
          imageUrl: '/images/category-placeholder.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 6,
          name: 'Plomberie',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Matériel de plomberie',
          imageUrl: '/images/category-placeholder.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 7,
          name: 'Électricité',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Matériel électrique',
          imageUrl: '/images/category-placeholder.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 8,
          name: 'Outillage',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Outils et équipements',
          imageUrl: '/images/category-placeholder.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 9,
          name: 'EPI',
          level: 1,
          haveParent: false,
          haveChildren: true,
          description: 'Équipements de protection individuelle',
          imageUrl: '/images/category-placeholder.jpg',
          parentCategoryId: null,
          agenceId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  },

  // Nouvelle fonction pour récupérer uniquement les catégories principales
  getMainCategories: async (): Promise<Category[]> => {
    try {
      // Utilise l'endpoint /categories/level/0 pour récupérer les catégories principales
      const response = await axiosInstance.get('/categories/level/0');
      
      if (response.data && Array.isArray(response.data.categories)) {
        return response.data.categories;
      }
      
      console.warn('Format de réponse inattendu pour les catégories principales:', response.data);
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories principales:', error);
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