import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { FavoriteItem, Favorite } from '../types/favorites';
import * as favoriteService from '../services/favoriteService';
import { useToast } from '../hooks/useToast';
import { getProductById } from '../services/productService';

// Métadonnées de pagination
interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

// Type du contexte
interface FavoritesContextType {
  // État
  favorites: FavoriteItem[];
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  paginationMeta: PaginationMeta;
  
  // Actions
  addToFavorites: (productId: number) => Promise<boolean>;
  removeFromFavorites: (productId: number) => Promise<boolean>;
  toggleFavorite: (productId: number) => Promise<boolean>;
  isFavorite: (productId: number) => boolean;
  refreshFavorites: () => Promise<void>;
  fetchFavoritesPage: (page: number, limit?: number) => Promise<void>;
  
  // Utilitaires
  favoritesCount: number;
  favoriteIds: Set<number>;
}

// Valeurs par défaut
const defaultPaginationMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  lastPage: 1
};

// Création du contexte avec une valeur par défaut
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isLoading: false,
  error: null,
  paginationMeta: defaultPaginationMeta,
  addToFavorites: async () => {
    throw new Error('FavoritesContext not initialized');
  },
  removeFromFavorites: async () => {
    throw new Error('FavoritesContext not initialized');
  },
  toggleFavorite: async () => {
    throw new Error('FavoritesContext not initialized');
  },
  isFavorite: () => false,
  refreshFavorites: async () => {
    throw new Error('FavoritesContext not initialized');
  },
  fetchFavoritesPage: async () => {
    throw new Error('FavoritesContext not initialized');
  },
  favoritesCount: 0,
  favoriteIds: new Set(),
});

/**
 * Helper pour convertir l'ID utilisateur en number
 */
const parseUserId = (userId: string | number): number | null => {
  if (typeof userId === 'number') {
    return userId;
  }
  const parsed = parseInt(userId, 10);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Provider pour la gestion des favoris
 */
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // États
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>(defaultPaginationMeta);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hooks
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  
  // Set des IDs de produits favoris pour une vérification rapide
  const favoriteIds = useMemo(() => {
    return new Set(favorites.map(fav => fav.id));
  }, [favorites]);
  
  // Nombre total de favoris
  const favoritesCount = paginationMeta.total;
  
  /**
   * Récupère les détails d'un produit par son ID
   */
  const fetchProductDetails = useCallback(async (productId: number): Promise<any> => {
    try {
      const product = await getProductById(productId.toString());
      return product;
    } catch (error) {
      console.error(`[FavoritesContext] Erreur lors de la récupération du produit ${productId}:`, error);
      return null;
    }
  }, []);

  /**
   * Convertit un favori de l'API en FavoriteItem pour l'interface
   */
  const convertToFavoriteItem = useCallback((favorite: Favorite): FavoriteItem | null => {
    // Structure 1: favorite.product.product (structure imbriquée)
    if (favorite.product?.product) {
      const product = favorite.product.product;
      
      return {
        // Données du favori
        favoriteId: favorite.id,
        
        // Données du produit
        id: product.id,
        name: product.name,
        priceTtc: product.priceTtc,
        priceHt: product.priceHt,
        quantity: product.quantity,
        imagesUrl: product.imagesUrl || [],
        description: product.description,
        
        // Relations
        categoryId: product.categoryId,
        markId: product.markId,
        category: product.category,
        mark: product.mark,
        
        // Promotions
        isInPromotion: product.isInPromotion,
        promotionPrice: product.promotionPrice,
        promotionEndDate: product.promotionEndDate,
        promotionPercentage: product.promotionPercentage,
        
        // Métadonnées
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        favoriteCreatedAt: favorite.createdAt
      };
    }
    
    // Structure 2: favorite.product (structure directe)
    if (favorite.product && typeof favorite.product === 'object' && 'id' in favorite.product) {
      const product = favorite.product as any;
      
      return {
        // Données du favori
        favoriteId: favorite.id,
        
        // Données du produit
        id: product.id,
        name: product.name,
        priceTtc: product.priceTtc,
        priceHt: product.priceHt,
        quantity: product.quantity,
        imagesUrl: product.imagesUrl || [],
        description: product.description,
        
        // Relations
        categoryId: product.categoryId,
        markId: product.markId,
        category: product.category,
        mark: product.mark,
        
        // Promotions
        isInPromotion: product.isInPromotion,
        promotionPrice: product.promotionPrice,
        promotionEndDate: product.promotionEndDate,
        promotionPercentage: product.promotionPercentage,
        
        // Métadonnées
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        favoriteCreatedAt: favorite.createdAt
      };
    }
    
    // Structure 3: Pas de données produit, créer un favori minimal
    return {
      // Données du favori
      favoriteId: favorite.id,
      
      // Données du produit (minimales)
      id: favorite.productId,
      name: `Produit ${favorite.productId}`,
      priceTtc: 0,
      priceHt: 0,
      quantity: 0,
      imagesUrl: [],
      description: 'Produit en cours de chargement...',
      
      // Relations
      categoryId: undefined,
      markId: undefined,
      category: undefined,
      mark: undefined,
      
      // Promotions
      isInPromotion: false,
      promotionPrice: undefined,
      promotionEndDate: undefined,
      promotionPercentage: undefined,
      
      // Métadonnées
      createdAt: undefined,
      updatedAt: undefined,
      favoriteCreatedAt: favorite.createdAt
    };
  }, []);
  
  /**
   * Récupère une page de favoris
   */
  const fetchFavoritesPage = useCallback(async (page: number = 1, limit: number = 10) => {
    if (!isAuthenticated || !user) {
      setFavorites([]);
      setPaginationMeta(defaultPaginationMeta);
      return;
    }
    
    const userId = parseUserId(user.id);
    if (!userId) {
      console.warn('ID utilisateur invalide, annulation de fetchFavorites');
      setError('ID utilisateur invalide');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await favoriteService.getFavoritesByUser(userId, page, limit);
      
      // Convertir les favoris
      let convertedFavorites = response.favorites
        .map(fav => convertToFavoriteItem(fav))
        .filter((item): item is FavoriteItem => item !== null);
      
      // Si certains favoris n'ont pas de détails produit complets, essayer de les récupérer
      const favoritesWithoutDetails = convertedFavorites.filter(fav => 
        fav.name === `Produit ${fav.id}` || !fav.name || fav.priceTtc === 0
      );
      
      if (favoritesWithoutDetails.length > 0) {
        // Récupérer les détails des produits manquants
        const updatedFavorites = await Promise.all(
          convertedFavorites.map(async (fav) => {
            if (fav.name === `Produit ${fav.id}` || !fav.name || fav.priceTtc === 0) {
              const productDetails = await fetchProductDetails(fav.id);
              if (productDetails) {
                return {
                  ...fav,
                  name: productDetails.name || fav.name,
                  priceTtc: productDetails.priceTtc || fav.priceTtc,
                  priceHt: productDetails.priceHt || fav.priceHt,
                  quantity: productDetails.quantity || fav.quantity,
                  imagesUrl: productDetails.imagesUrl || fav.imagesUrl,
                  description: productDetails.description || fav.description,
                  categoryId: productDetails.categoryId || fav.categoryId,
                  markId: productDetails.markId || fav.markId,
                  category: productDetails.category || fav.category,
                  mark: productDetails.mark || fav.mark,
                  isInPromotion: productDetails.isInPromotion || fav.isInPromotion,
                  promotionPrice: productDetails.promotionPrice || fav.promotionPrice,
                  promotionEndDate: productDetails.promotionEndDate || fav.promotionEndDate,
                  promotionPercentage: productDetails.promotionPercentage || fav.promotionPercentage,
                };
              }
            }
            return fav;
          })
        );
        
        convertedFavorites = updatedFavorites;
      }
      
      setFavorites(convertedFavorites);
      
      // Mettre à jour les métadonnées de pagination
      setPaginationMeta({
        total: response.total,
        page: response.page,
        limit: response.limit,
        lastPage: response.lastPage
      });
    } catch (error: any) {
      console.error('Erreur lors du chargement des favoris:', error);
      setError(error.message || 'Erreur lors du chargement des favoris');
      
      // En cas d'erreur 401, réinitialiser les favoris
      if (error.error === 'Unauthorized') {
        setFavorites([]);
        setPaginationMeta(defaultPaginationMeta);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, convertToFavoriteItem, fetchProductDetails]);
  
  /**
   * Rafraîchit la liste des favoris
   */
  const refreshFavorites = useCallback(async () => {
    await fetchFavoritesPage(paginationMeta.page, paginationMeta.limit);
  }, [fetchFavoritesPage, paginationMeta.page, paginationMeta.limit]);
  
  /**
   * Ajoute un produit aux favoris avec mise à jour optimiste
   */
  const addToFavorites = useCallback(async (productId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      showToast('Vous devez être connecté pour ajouter des favoris', 'warning');
      return false;
    }
    
    const userId = parseUserId(user.id);
    if (!userId) {
      showToast('Erreur: ID utilisateur invalide', 'error');
      return false;
    }
    
    // Vérifier si déjà en favori localement
    if (favoriteIds.has(productId)) {
      showToast('Ce produit est déjà dans vos favoris', 'info');
      return true;
    }
    
    try {
      // Mise à jour optimiste : ajouter temporairement aux favoris
      const tempFavorite: FavoriteItem = {
        favoriteId: Date.now(), // ID temporaire
        id: productId,
        name: `Produit ${productId}`,
        priceTtc: 0,
        priceHt: 0,
        quantity: 0,
        imagesUrl: [],
        description: 'Ajout en cours...',
        categoryId: undefined,
        markId: undefined,
        category: undefined,
        mark: undefined,
        isInPromotion: false,
        promotionPrice: undefined,
        promotionEndDate: undefined,
        promotionPercentage: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        favoriteCreatedAt: new Date().toISOString()
      };
      
      setFavorites(prev => [tempFavorite, ...prev]);
      setPaginationMeta(prev => ({ ...prev, total: prev.total + 1 }));
      
      // Appel API
      await favoriteService.addToFavorites(productId, userId);
      
      // Récupérer les détails du produit et mettre à jour
      const productDetails = await fetchProductDetails(productId);
      if (productDetails) {
        setFavorites(prev => prev.map(fav => 
          fav.id === productId 
            ? {
                ...fav,
                name: productDetails.name,
                priceTtc: productDetails.priceTtc,
                priceHt: productDetails.priceHt,
                quantity: productDetails.quantity,
                imagesUrl: productDetails.imagesUrl || [],
                description: productDetails.description,
                categoryId: productDetails.categoryId,
                markId: productDetails.markId,
                category: productDetails.category,
                mark: productDetails.mark,
                isInPromotion: productDetails.isInPromotion,
                promotionPrice: productDetails.promotionPrice,
                promotionEndDate: productDetails.promotionEndDate,
                promotionPercentage: productDetails.promotionPercentage,
              }
            : fav
        ));
      }
      
      showToast('Produit ajouté aux favoris', 'success');
      return true;
    } catch (error: any) {
      // Annuler la mise à jour optimiste en cas d'erreur
      setFavorites(prev => prev.filter(fav => fav.id !== productId));
      setPaginationMeta(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      
      // Gérer les erreurs spécifiques
      if (error.message === 'Ce produit est déjà dans les favoris') {
        showToast('Ce produit est déjà dans vos favoris', 'info');
        // Rafraîchir pour s'assurer que l'état est à jour
        await refreshFavorites();
        return true;
      } else if (error.error === 'Bad Request' && error.message?.includes('déjà dans les favoris')) {
        showToast('Ce produit est déjà dans vos favoris', 'info');
        await refreshFavorites();
        return true;
      } else {
        showToast(error.message || 'Erreur lors de l\'ajout aux favoris', 'error');
      }
      
      return false;
    }
  }, [isAuthenticated, user, favoriteIds, fetchProductDetails, refreshFavorites, showToast]);
  
  /**
   * Retire un produit des favoris avec mise à jour optimiste
   */
  const removeFromFavorites = useCallback(async (productId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      showToast('Vous devez être connecté pour gérer vos favoris', 'warning');
      return false;
    }
    
    // Sauvegarder le favori avant de le supprimer pour pouvoir le restaurer en cas d'erreur
    const removedFavorite = favorites.find(fav => fav.id === productId);
    
    try {
      // Mise à jour optimiste : retirer temporairement des favoris
      setFavorites(prev => prev.filter(fav => fav.id !== productId));
      setPaginationMeta(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      
      // Appel API
      await favoriteService.deleteFavoriteByProductId(productId);
      
      showToast('Produit retiré des favoris', 'info');
      return true;
    } catch (error: any) {
      // Annuler la mise à jour optimiste en cas d'erreur
      if (removedFavorite) {
        setFavorites(prev => [...prev, removedFavorite]);
        setPaginationMeta(prev => ({ ...prev, total: prev.total + 1 }));
      }
      
      console.error('Erreur lors de la suppression du favori:', error);
      showToast(error.message || 'Erreur lors de la suppression du favori', 'error');
      return false;
    }
  }, [isAuthenticated, user, favorites, showToast]);
  
  /**
   * Vérifie si un produit est dans les favoris
   */
  const isFavorite = useCallback((productId: number): boolean => {
    return favoriteIds.has(productId);
  }, [favoriteIds]);
  
  /**
   * Bascule l'état favori d'un produit
   */
  const toggleFavorite = useCallback(async (productId: number): Promise<boolean> => {
    if (isFavorite(productId)) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  }, [addToFavorites, removeFromFavorites, isFavorite]);
  
  // Charger les favoris au montage et lors du changement d'authentification
  useEffect(() => {
    fetchFavoritesPage(1, paginationMeta.limit);
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Valeur du contexte
  const contextValue: FavoritesContextType = {
    // État
    favorites,
    isLoading,
    error,
    
    // Pagination
    paginationMeta,
    
    // Actions
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refreshFavorites,
    fetchFavoritesPage,
    
    // Utilitaires
    favoritesCount,
    favoriteIds
  };
  
  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte des favoris
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites doit être utilisé dans un FavoritesProvider');
  }
  return context;
}; 