import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../types/product';
import { getProducts } from '../services/productService';
import { addSearchHistory, deleteSearchHistory } from '../services/searchHistoryService';
import { useAuth } from './AuthContext';
import { getSearchHistoryByUser, SearchHistoryEntry } from '../services/searchHistoryService';

interface SearchContextType {
  searchQuery: string;
  searchResults: Product[];
  searchHistory: SearchHistoryEntry[];
  isSearchOpen: boolean;
  isSearching: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  deleteHistoryEntry: (id: number) => Promise<void>;
}

// Création du contexte avec une valeur par défaut
const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  searchResults: [],
  searchHistory: [],
  isSearchOpen: false,
  isSearching: false,
  openSearch: () => {
    throw new Error('SearchContext not initialized');
  },
  closeSearch: () => {
    throw new Error('SearchContext not initialized');
  },
  setSearchQuery: () => {
    throw new Error('SearchContext not initialized');
  },
  clearSearch: () => {
    throw new Error('SearchContext not initialized');
  },
  deleteHistoryEntry: async () => {
    throw new Error('SearchContext not initialized');
  },
});

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  // Récupération de l’utilisateur connecté
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSavedQuery, setLastSavedQuery] = useState('');

  // Charger l’historique au focus ou quand l’utilisateur change
  const loadSearchHistory = async () => {
    try {
      if (user?.id) {
        const response = await getSearchHistoryByUser(Number(user.id));
        setSearchHistory(response.searchhistory || []);
      }
    } catch (err) {
      console.error('[SearchHistory] Échec du chargement de l’historique:', err);
    }
  };

  // Recharger automatiquement l'historique quand l'utilisateur est (re)chargé après un rafraîchissement
  useEffect(() => {
    if (user?.id) {
      loadSearchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    // Si la requête est vide, réinitialiser les résultats
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      // Enregistrer la recherche côté serveur (déduplication simple + longueur minimale)
      const normalized = query.trim();
      if (user?.id && normalized.length >= 2 && normalized.toLowerCase() !== lastSavedQuery.toLowerCase()) {
        addSearchHistory(normalized, Number(user.id))
          .then((res) => {
            if (res?.searchhistory) {
              setSearchHistory((prev) => {
                // Éviter les doublons côté UI
                const withoutDup = prev.filter((h) => h.value.toLowerCase() !== res.searchhistory.value.toLowerCase());
                return [res.searchhistory, ...withoutDup].slice(0, 10);
              });
              setLastSavedQuery(normalized.toLowerCase());
            }
          })
          .catch((err) => {
            console.error('[SearchHistory] Échec de l’enregistrement de la recherche:', err);
          });
      }

      // Recherche de produits via l'API
      const response = await getProducts({ searchQuery: query.toLowerCase().trim() });
      
      // Simuler un temps de chargement pour l'expérience utilisateur
      setTimeout(() => {
        setSearchResults(response.products || []);
        setIsSearching(false);
      }, 300);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    // Toujours rafraîchir l’historique pour afficher les dernières recherches
    loadSearchHistory();
  };
  
  const closeSearch = () => {
    setIsSearchOpen(false);
    // Ne pas effacer les résultats immédiatement pour permettre une transition fluide
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const contextValue: SearchContextType = {
    searchQuery,
    searchResults,
    searchHistory,
    isSearchOpen,
    isSearching,
    openSearch,
    closeSearch,
    setSearchQuery: (query) => {
      performSearch(query);
    },
    clearSearch,
    deleteHistoryEntry: async (id: number) => {
      try {
        // Optimiste: retirer localement
        setSearchHistory(prev => prev.filter(e => e.id !== id));
        await deleteSearchHistory(id);
      } catch (err) {
        // En cas d’échec, recharger l’historique depuis l’API
        await loadSearchHistory();
        console.error('[SearchHistory] Échec de la suppression:', err);
      }
    }
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}; 