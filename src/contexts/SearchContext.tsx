import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/product';
import { getProducts } from '../services/productService';

interface SearchContextType {
  searchQuery: string;
  searchResults: Product[];
  isSearchOpen: boolean;
  isSearching: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

// Création du contexte avec une valeur par défaut
const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  searchResults: [],
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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

  const openSearch = () => setIsSearchOpen(true);
  
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
    isSearchOpen,
    isSearching,
    openSearch,
    closeSearch,
    setSearchQuery: (query) => {
      performSearch(query);
    },
    clearSearch
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}; 