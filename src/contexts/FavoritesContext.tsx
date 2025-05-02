import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { FavoriteItem, Product } from '../types/favorites';
import * as favoriteService from '../services/favoriteService';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string | number) => void;
  isFavorite: (id: string | number) => boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  favoritesCount: number;
  isLoading: boolean;
  paginationMeta: PaginationMeta;
  fetchFavoritesPage: (page: number, limit?: number) => Promise<void>;
  allFavorites: FavoriteItem[]; // Stocke tous les favoris sans pagination pour faciliter la recherche locale
}

const defaultPaginationMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  lastPage: 1
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [allFavorites, setAllFavorites] = useState<FavoriteItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>(defaultPaginationMeta);
  const { isAuthenticated, user } = useAuth();

  // Fonction pour formater un produit en FavoriteItem
  const formatProductToFavoriteItem = (product: Product): FavoriteItem => {
    return {
      id: product.id.toString(), // Convertir en string pour compatibilité
      name: product.name,
      priceTtc: product.priceTtc,
      imagesUrl: product.imagesUrl,
      image: product.imagesUrl?.[0], // Pour compatibilité
      description: product.description,
      categoryId: product.categoryId,
      markId: product.markId,
      category: product.category,
      mark: product.mark,
      isInPromotion: product.isInPromotion,
      promotionPrice: product.promotionPrice,
      promotionEndDate: product.promotionEndDate,
      promotionPercentage: product.promotionPercentage,
      quantity: product.quantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  };

  // Charger tous les favoris pour la recherche locale
  const loadAllFavorites = async () => {
    if (isAuthenticated && user) {
      try {
        // S'assurer que l'ID est un nombre
        const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
        const response = await favoriteService.getFavoritesByUser(userId, 1, 100); // Récupérer un grand nombre pour les avoir tous
        
        const formattedFavorites: FavoriteItem[] = response.favorites.map(favorite => {
          return favorite.product 
            ? formatProductToFavoriteItem(favorite.product)
            : { 
                id: favorite.productId.toString(), 
                name: "Produit non disponible", 
                priceTtc: 0
              };
        });
        
        setAllFavorites(formattedFavorites);
      } catch (error) {
        console.error("Erreur lors du chargement de tous les favoris:", error);
      }
    }
  };

  // Méthode pour récupérer une page spécifique de favoris
  const fetchFavoritesPage = async (page: number = 1, limit: number = 10): Promise<void> => {
    console.log("Appel fetchFavoritesPage avec:", { page, limit });
    if (!isAuthenticated || !user) {
      // Pagination locale pour les utilisateurs non connectés
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const localFavorites = getLocalFavorites();
      
      setFavorites(localFavorites.slice(startIndex, endIndex));
      const newMeta = {
        total: localFavorites.length,
        page,
        limit,
        lastPage: Math.ceil(localFavorites.length / limit) || 1
      };
      console.log("Nouvelles métadonnées de pagination (local):", newMeta);
      setPaginationMeta(newMeta);
      return;
    }
    
    try {
      setIsLoading(true);
      const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      const response = await favoriteService.getFavoritesByUser(userId, page, limit);
      
      const formattedFavorites: FavoriteItem[] = response.favorites.map(favorite => {
        return favorite.product 
          ? formatProductToFavoriteItem(favorite.product)
          : { 
              id: favorite.productId.toString(), 
              name: "Produit non disponible", 
              priceTtc: 0
            };
      });
      
      setFavorites(formattedFavorites);
      
      const meta = response.meta || {
        total: response.count || formattedFavorites.length,
        page: page,
        limit: limit,
        lastPage: Math.max(1, Math.ceil((response.count || formattedFavorites.length) / limit))
      };
      
      console.log("Nouvelles métadonnées de pagination (API):", meta);
      setPaginationMeta(meta);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      // Utiliser la pagination locale en cas d'erreur
      const localFavorites = getLocalFavorites();
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      setFavorites(localFavorites.slice(startIndex, endIndex));
      const fallbackMeta = {
        total: localFavorites.length,
        page,
        limit,
        lastPage: Math.ceil(localFavorites.length / limit) || 1
      };
      console.log("Métadonnées de pagination de secours:", fallbackMeta);
      setPaginationMeta(fallbackMeta);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les favoris depuis l'API si l'utilisateur est connecté
  useEffect(() => {
    const loadInitialFavorites = async () => {
      await fetchFavoritesPage(1);
      if (isAuthenticated && user) {
        await loadAllFavorites();
      }
    };
    
    loadInitialFavorites();
  }, [isAuthenticated, user]);

  // Obtenir les favoris du localStorage
  const getLocalFavorites = (): FavoriteItem[] => {
    try {
      const key = isAuthenticated && user ? `favorites_${user.id}` : 'temp_favorites';
      const savedFavorites = localStorage.getItem(key);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris locaux:", error);
      return [];
    }
  };

  // Charger les favoris depuis le localStorage
  const loadFromLocalStorage = () => {
    const localFavorites = getLocalFavorites();
    setFavorites(localFavorites.slice(0, paginationMeta.limit));
    setAllFavorites(localFavorites);
    
    setPaginationMeta({
      ...paginationMeta,
      total: localFavorites.length,
      lastPage: Math.ceil(localFavorites.length / paginationMeta.limit) || 1
    });
  };

  // Sauvegarder les favoris localement
  const saveToLocalStorage = (updatedFavorites: FavoriteItem[]) => {
    try {
      const key = isAuthenticated && user ? `favorites_${user.id}` : 'temp_favorites';
      localStorage.setItem(key, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des favoris dans le localStorage:", error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToFavorites = async (item: FavoriteItem) => {
    // Vérifier si l'article est déjà dans les favoris
    if (allFavorites.some(fav => fav.id.toString() === item.id.toString())) {
      return; // Déjà dans les favoris
    }

    // Ajouter à l'état local d'abord pour une réponse UI immédiate
    const updatedAllFavorites = [...allFavorites, item];
    setAllFavorites(updatedAllFavorites);
    
    // Mettre à jour la page actuelle si nécessaire
    const currentPageFavorites = [...favorites];
    if (currentPageFavorites.length < paginationMeta.limit) {
      currentPageFavorites.push(item);
      setFavorites(currentPageFavorites);
    }
    
    saveToLocalStorage(updatedAllFavorites);
    
    // Si l'utilisateur est connecté, également ajouter à l'API
    if (isAuthenticated && user) {
      try {
        setIsLoading(true);
        // Convertir l'ID en nombre si c'est une chaîne
        const productId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
        await favoriteService.addToFavorites(productId);
        
        // Rafraîchir la page actuelle pour assurer la cohérence avec l'API
        await fetchFavoritesPage(paginationMeta.page, paginationMeta.limit);
        await loadAllFavorites();
        
        showToast("Produit ajouté aux favoris", "success");
      } catch (error: any) {
        console.error("Erreur lors de l'ajout aux favoris via l'API:", error);
        // Si l'erreur indique que le produit est déjà dans les favoris, ne pas afficher d'erreur
        if (error.message !== "Ce produit est déjà dans vos favoris") {
          showToast(error.message || "Erreur lors de l'ajout aux favoris", "error");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      showToast("Produit ajouté aux favoris", "success");
    }
  };

  const removeFromFavorites = async (id: string | number) => {
    // Convertir en string pour la comparaison
    const idStr = id.toString();
    
    // Retirer de l'état local d'abord
    const updatedAllFavorites = allFavorites.filter(item => item.id.toString() !== idStr);
    setAllFavorites(updatedAllFavorites);
    
    const updatedFavorites = favorites.filter(item => item.id.toString() !== idStr);
    setFavorites(updatedFavorites);
    
    // Mettre à jour les métadonnées de pagination
    setPaginationMeta({
      ...paginationMeta,
      total: Math.max(0, paginationMeta.total - 1),
      lastPage: Math.max(1, Math.ceil((paginationMeta.total - 1) / paginationMeta.limit))
    });
    
    saveToLocalStorage(updatedAllFavorites);
    
    // Si l'utilisateur est connecté, également retirer de l'API
    if (isAuthenticated && user) {
      try {
        setIsLoading(true);
        // Convertir l'ID en nombre pour l'API
        const productId = typeof id === 'string' ? parseInt(id) : id;
        await favoriteService.deleteFavoriteByProductId(productId);
        
        // Si la page actuelle est vide et ce n'est pas la première page, charger la page précédente
        if (updatedFavorites.length === 0 && paginationMeta.page > 1) {
          await fetchFavoritesPage(paginationMeta.page - 1, paginationMeta.limit);
        } 
        // Sinon, si nous sommes toujours sur la même page mais qu'il manque des produits, rafraîchir
        else if (updatedFavorites.length < paginationMeta.limit && paginationMeta.total > updatedFavorites.length) {
          await fetchFavoritesPage(paginationMeta.page, paginationMeta.limit);
        }
        
        // Mettre à jour la liste complète des favoris
        await loadAllFavorites();
        
        showToast("Produit retiré des favoris", "info");
      } catch (error: any) {
        console.error("Erreur lors de la suppression des favoris via l'API:", error);
        showToast(error.message || "Erreur lors de la suppression du favori", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showToast("Produit retiré des favoris", "info");
    }
  };

  const isFavorite = (id: string | number): boolean => {
    // Convertir en string pour la comparaison
    const idStr = id.toString();
    return allFavorites.some(item => item.id.toString() === idStr);
  };

  const favoritesCount = allFavorites.length;

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite, 
      showToast,
      favoritesCount,
      isLoading,
      paginationMeta,
      fetchFavoritesPage,
      allFavorites
    }}>
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 