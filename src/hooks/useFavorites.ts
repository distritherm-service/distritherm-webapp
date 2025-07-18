import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // S'assurer que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger les favoris depuis localStorage seulement côté client
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }, [isClient]);

  // Sauvegarder les favoris dans localStorage seulement côté client
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }, [favorites, isClient]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId);
      }
      return [...prevFavorites, productId];
    });
  };

  const isFavorite = (productId: string) => {
    if (!isClient) return false;
    return favorites.includes(productId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isClient
  };
}; 