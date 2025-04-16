import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { FavoriteItem } from '../types/favorites';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Charger les favoris depuis le localStorage au démarrage
  useEffect(() => {
    if (isAuthenticated && user) {
      // Si l'utilisateur est connecté, charger ses favoris
      const key = `favorites_${user.id}`;
      const savedFavorites = localStorage.getItem(key);
      if (savedFavorites) {
        try {
          const userFavorites = JSON.parse(savedFavorites);
          // Fusionner avec les favoris temporaires
          const tempFavorites = localStorage.getItem('temp_favorites') || '[]';
          const combinedFavorites = [...JSON.parse(tempFavorites), ...userFavorites];
          // Supprimer les doublons
          const uniqueFavorites = combinedFavorites.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          );
          setFavorites(uniqueFavorites);
          // Sauvegarder les favoris fusionnés
          localStorage.setItem(key, JSON.stringify(uniqueFavorites));
          // Nettoyer les favoris temporaires
          localStorage.removeItem('temp_favorites');
        } catch (error) {
          console.error('Erreur lors du chargement des favoris:', error);
        }
      }
    } else {
      // Si l'utilisateur n'est pas connecté, charger les favoris temporaires
      const tempFavorites = localStorage.getItem('temp_favorites');
      if (tempFavorites) {
        try {
          setFavorites(JSON.parse(tempFavorites));
        } catch (error) {
          console.error('Erreur lors du chargement des favoris temporaires:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Sauvegarder les favoris dans le localStorage à chaque modification
  useEffect(() => {
    if (isAuthenticated && user) {
      const key = `favorites_${user.id}`;
      localStorage.setItem(key, JSON.stringify(favorites));
    } else {
      localStorage.setItem('temp_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated, user]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === item.id)) {
        return prev;
      }
      showToast('Produit ajouté aux favoris', 'success');
      return [...prev, item];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
    showToast('Produit retiré des favoris', 'info');
  };

  const isFavorite = (id: string) => favorites.some(item => item.id === id);

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite, 
      showToast,
      favoritesCount 
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