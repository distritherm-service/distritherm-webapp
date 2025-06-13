import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { getAllMarks } from '../../services/markService';
import { Category } from '../../types/category';

interface FilterState {
  category: string;
  subcategory?: string;
  mark?: string;
  priceRange: [number, number];
  sortBy: string;
  inStockOnly: boolean;
  priceRangeTouched: boolean;
  searchQuery?: string;
  discountLevel: string;
}

interface PromotionFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

const PromotionFilters: React.FC<PromotionFiltersProps> = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [marks, setMarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'info', message: string} | null>(null);
  
  // Définir les plages de prix directement dans le frontend
  const [priceRange] = useState({ min: 0, max: 10000 });
  
  // État local pour stocker les valeurs des filtres avant de les appliquer
  const [localFilters, setLocalFilters] = useState<FilterState>({...filters});
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

  // Charger les catégories et les marques depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupération des données en parallèle
        const [fetchedCategories, fetchedMarks] = await Promise.all([
          categoryService.getAllCategories(),
          getAllMarks()
        ]);
        
        setCategories(fetchedCategories);
        setMarks(fetchedMarks);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données de filtrage');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Mettre à jour localFilters quand filters change
  useEffect(() => {
    setLocalFilters({...filters});
    setSearchQuery(filters.searchQuery || '');
  }, [filters]);

  // Vérifier si des changements locaux ont été faits
  const hasUnappliedChanges = () => {
    return JSON.stringify(localFilters) !== JSON.stringify({...filters, searchQuery: filters.searchQuery || ''});
  };

  const handleLocalFilterChange = (filterName: keyof FilterState, value: any) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      [filterName]: value 
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setLocalFilters(prev => ({ 
      ...prev, 
      searchQuery: e.target.value 
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  // Appliquer tous les filtres en une seule fois avec animation
  const applyFilters = async () => {
    setIsApplying(true);
    
    // Petite animation de chargement
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onFilterChange({
      ...localFilters,
      priceRangeTouched: true
    });
    
    setIsApplying(false);
    showNotification('success', 'Filtres appliqués avec succès !');
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    const defaultFilters: FilterState = {
      category: 'Toutes les catégories',
      mark: '',
      priceRange: [priceRange.min, priceRange.max],
      sortBy: 'featured',
      inStockOnly: false,
      priceRangeTouched: false,
      searchQuery: '',
      discountLevel: 'all'
    };
    
    setLocalFilters(defaultFilters);
    setSearchQuery('');
    onFilterChange(defaultFilters);
    showNotification('info', 'Filtres réinitialisés');
  };

  const showNotification = (type: 'success' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const sortOptions = [
    { value: 'featured', label: 'Offres vedettes' },
    { value: 'discount_high', label: 'Réduction : plus élevée d\'abord' },
    { value: 'discount_low', label: 'Réduction : plus faible d\'abord' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'ending_soon', label: 'Se termine bientôt' }
  ];

  // Helper pour vérifier si les filtres sont actifs
  const isPriceFilterActive = () => {
    return localFilters.priceRange[0] > priceRange.min || localFilters.priceRange[1] < priceRange.max;
  };

  const hasActiveFilters = () => {
    return localFilters.category !== 'Toutes les catégories' ||
           localFilters.mark !== '' ||
           isPriceFilterActive() ||
           localFilters.inStockOnly ||
           localFilters.discountLevel !== 'all' ||
           searchQuery !== '';
  };

  if (loading) {
    return (
      <div className="w-full max-w-xs bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-xs bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="text-red-500 text-center text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`absolute top-4 left-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-bounce-in ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* En-tête avec titre et indicateur de changements */}
      <div className="bg-gradient-to-r from-[#EBF4FF] to-[#E6F7FF] border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#007FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtres Promotions
          </h3>
          {hasUnappliedChanges() && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-orange-600 ml-1 font-medium">Non appliqués</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Barre de recherche */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Recherche
          </label>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rechercher une promotion..."
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF] pr-10 hover:border-[#007FFF] transition-colors"
            />
            <button 
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-[#007FFF] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Catégorie */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Catégorie
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF] appearance-none bg-white pr-8 hover:border-[#007FFF] transition-colors"
              value={localFilters.category}
              onChange={(e) => handleLocalFilterChange('category', e.target.value)}
            >
              <option value="Toutes les catégories">Toutes les catégories</option>
              {categories.filter(cat => cat.level === 1).map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Marque */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Marque
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF] appearance-none bg-white pr-8 hover:border-[#007FFF] transition-colors"
              value={localFilters.mark || ''}
              onChange={(e) => handleLocalFilterChange('mark', e.target.value)}
            >
              <option value="">Toutes les marques</option>
              {marks.map((mark) => (
                <option key={mark} value={mark}>
                  {mark}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Prix après réduction */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Prix après réduction (€)
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.priceRange[0]}
                onChange={(e) => handleLocalFilterChange('priceRange', [Number(e.target.value), localFilters.priceRange[1]])}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF] hover:border-[#007FFF] transition-colors"
                placeholder="Min"
              />
              <span className="text-gray-500 text-sm">à</span>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.priceRange[1]}
                onChange={(e) => handleLocalFilterChange('priceRange', [localFilters.priceRange[0], Number(e.target.value)])}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF] hover:border-[#007FFF] transition-colors"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Niveau de remise */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Niveau de remise
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="discount-all"
                type="radio"
                checked={localFilters.discountLevel === 'all'}
                onChange={() => handleLocalFilterChange('discountLevel', 'all')}
                className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
              />
              <label htmlFor="discount-all" className="ml-2 text-sm text-gray-700">
                Toutes les remises
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="discount-low"
                type="radio"
                checked={localFilters.discountLevel === 'low'}
                onChange={() => handleLocalFilterChange('discountLevel', 'low')}
                className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
              />
              <label htmlFor="discount-low" className="ml-2 text-sm text-gray-700">
                Moins de 10%
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="discount-medium"
                type="radio"
                checked={localFilters.discountLevel === 'medium'}
                onChange={() => handleLocalFilterChange('discountLevel', 'medium')}
                className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
              />
              <label htmlFor="discount-medium" className="ml-2 text-sm text-gray-700">
                10% à 25%
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="discount-high"
                type="radio"
                checked={localFilters.discountLevel === 'high'}
                onChange={() => handleLocalFilterChange('discountLevel', 'high')}
                className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
              />
              <label htmlFor="discount-high" className="ml-2 text-sm text-gray-700">
                Plus de 25%
              </label>
            </div>
          </div>
        </div>

        {/* Tri */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Trier par
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF] appearance-none bg-white pr-8 hover:border-[#007FFF] transition-colors"
              value={localFilters.sortBy}
              onChange={(e) => handleLocalFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Checkbox En stock uniquement */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStockOnly"
            checked={localFilters.inStockOnly}
            onChange={(e) => handleLocalFilterChange('inStockOnly', e.target.checked)}
            className="h-4 w-4 text-[#007FFF] focus:ring-[#007FFF] border-gray-300 rounded"
          />
          <label htmlFor="inStockOnly" className="ml-2 block text-sm text-gray-700">
            En stock uniquement
          </label>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          {/* Bouton Appliquer avec animation */}
          <button
            onClick={applyFilters}
            disabled={isApplying || !hasUnappliedChanges()}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform flex items-center justify-center gap-2 ${
              isApplying 
                ? 'bg-green-500 text-white cursor-not-allowed scale-105' 
                : hasUnappliedChanges()
                  ? 'bg-gradient-to-r from-[#007FFF] to-[#00BFFF] hover:from-[#007FFF]/90 hover:to-[#00BFFF]/90 text-white hover:scale-105 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isApplying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Application en cours...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {hasUnappliedChanges() ? 'Appliquer les filtres' : 'Filtres appliqués'}
              </>
            )}
          </button>

          {/* Bouton Réinitialiser */}
          {hasActiveFilters() && (
            <button
              onClick={resetFilters}
              className="w-full border border-red-300 text-red-600 bg-white hover:bg-red-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2 hover:border-red-400"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser les filtres
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PromotionFilters; 