import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { FavoriteItem } from '../../types/favorites';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

interface FavoritesSearchProps {
  favorites: FavoriteItem[];
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filterBy: string) => void;
  favoritesCount: number;
}

const FavoritesSearch: React.FC<FavoritesSearchProps> = ({
  favorites,
  onSearch,
  onSort,
  onFilter,
  favoritesCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState('all');
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Gestion du clic à l'extérieur pour fermer les menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortOptions(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSort(value);
    setShowSortOptions(false);
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    onFilter(value);
    setShowFilterOptions(false);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name-asc': return 'Nom (A-Z)';
      case 'name-desc': return 'Nom (Z-A)';
      case 'price-asc': return 'Prix croissant';
      case 'price-desc': return 'Prix décroissant';
      case 'date-added': return 'Date d\'ajout';
      default: return 'Trier par';
    }
  };

  const getFilterLabel = () => {
    switch (filterBy) {
      case 'promotion': return 'En promotion';
      case 'normal': return 'Prix normal';
      default: return 'Tous';
    }
  };

  return (
    <div className="mb-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Titre à gauche */}
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            Mes favoris
            <FaHeart className="ml-2.5 text-red-500" />
          </h1>
          <motion.div 
            className="ml-3 flex items-center justify-center min-w-6 h-6 bg-teal-600 text-white text-sm font-bold rounded-full px-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 10 
            }}
          >
            {favoritesCount}
          </motion.div>
        </div>

        {/* Éléments de recherche et filtrage à droite */}
        <div className="flex sm:flex-row md:justify-end gap-3">
          {/* Barre de recherche */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rechercher dans mes favoris..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Tri */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto whitespace-nowrap"
            >
              <span className="text-gray-700">{getSortLabel()}</span>
              <ArrowUpDown size={18} className="text-gray-500" />
            </button>
            <AnimatePresence>
              {showSortOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleSortChange('name-asc')}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${sortBy === 'name-asc' ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    >
                      Nom (A-Z)
                    </button>
                    <button
                      onClick={() => handleSortChange('name-desc')}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${sortBy === 'name-desc' ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    >
                      Nom (Z-A)
                    </button>
                    <button
                      onClick={() => handleSortChange('price-asc')}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${sortBy === 'price-asc' ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    >
                      Prix croissant
                    </button>
                    <button
                      onClick={() => handleSortChange('price-desc')}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${sortBy === 'price-desc' ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    >
                      Prix décroissant
                    </button>
                    <button
                      onClick={() => handleSortChange('date-added')}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${sortBy === 'date-added' ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    >
                      Date d'ajout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filtre */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterOptions(!showFilterOptions)}
              className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto whitespace-nowrap"
            >
              <span className="text-gray-700">{getFilterLabel()}</span>
              <Filter size={18} className="text-gray-500" />
            </button>
            <AnimatePresence>
              {showFilterOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleFilterChange('all')}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${filterBy === 'all' ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    >
                      Tous les produits
                    </button>
                    <button
                      onClick={() => handleFilterChange('promotion')}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${filterBy === 'promotion' ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    >
                      En promotion
                    </button>
                    <button
                      onClick={() => handleFilterChange('normal')}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${filterBy === 'normal' ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                    >
                      Prix normal
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Message pour les résultats de recherche */}
      {searchQuery && (
        <div className="mt-4 text-sm text-gray-600 text-right">
          {favorites.length === 0 
            ? `Aucun résultat trouvé pour "${searchQuery}"`
            : `${favorites.length} résultat(s) trouvé(s) pour "${searchQuery}"`
          }
        </div>
      )}
    </div>
  );
};

export default FavoritesSearch; 