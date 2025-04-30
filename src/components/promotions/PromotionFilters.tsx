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
  onSaveFilters?: () => void;
}

const PromotionFilters: React.FC<PromotionFiltersProps> = ({ filters, onFilterChange, onSaveFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [marks, setMarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Appliquer tous les filtres en une seule fois
  const applyFilters = () => {
    onFilterChange({
      ...localFilters,
      priceRangeTouched: true
    });
    
    // Notification de confirmation
    showNotification('Filtres appliqués avec succès');
  };

  const handleSaveFilters = () => {
    if (onSaveFilters) {
      onSaveFilters();
    }
    showNotification('Filtres sauvegardés avec succès');
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.classList.add('fixed', 'bottom-4', 'right-4', 'bg-blue-600', 'text-white', 'p-4', 'rounded-lg', 'shadow-lg', 'z-50', 'animate-fade-in');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  const sortOptions = [
    { value: 'featured', label: 'Offres vedettes' },
    { value: 'discount_high', label: 'Réduction : plus élevée d\'abord' },
    { value: 'discount_low', label: 'Réduction : plus faible d\'abord' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'ending_soon', label: 'Se termine bientôt' }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="text-red-500 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Mobile toggle */}
      <button
        className="md:hidden w-full p-4 flex items-center justify-between text-gray-800 font-medium bg-gradient-to-r from-[#EBF4FF] to-[#E6F7FF] border-b border-gray-100 sticky top-0 z-30"
        onClick={() => setIsOpen(!isOpen)}
        style={{ minHeight: 56 }}
      >
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#007FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtres et Tri
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block p-4 md:p-6`}>
        {/* Filtres principaux sur une seule ligne (Catégorie, Marque, Recherche, Prix) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix après réduction (€)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.priceRange[0]}
                onChange={(e) => handleLocalFilterChange('priceRange', [Number(e.target.value), localFilters.priceRange[1]])}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF] hover:border-[#007FFF] transition-colors"
                placeholder="Min"
              />
              <span className="text-gray-500">à</span>
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

          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Rechercher une promotion..."
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF] hover:border-[#007FFF] transition-colors pr-10"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-[#007FFF] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Tri et filtres supplémentaires */}
        <div className="mt-4 md:flex items-center justify-between">
          <div className="md:w-1/4 mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tri
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

          {/* Filtres supplémentaires */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Stock uniquement */}
            <div className="flex items-center">
              <input
                id="inStockOnly"
                type="checkbox"
                checked={localFilters.inStockOnly}
                onChange={(e) => handleLocalFilterChange('inStockOnly', e.target.checked)}
                className="w-4 h-4 text-[#007FFF] border-gray-300 rounded focus:ring-[#007FFF]"
              />
              <label htmlFor="inStockOnly" className="ml-2 text-sm text-gray-700">
                En stock uniquement
              </label>
            </div>

            {/* Niveau de remise */}
            <div className="flex items-center flex-wrap">
              <span className="text-sm text-gray-700 mr-3">Niveau de remise:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    id="discount-all"
                    type="radio"
                    checked={localFilters.discountLevel === 'all'}
                    onChange={() => handleLocalFilterChange('discountLevel', 'all')}
                    className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
                  />
                  <label htmlFor="discount-all" className="ml-2 text-sm text-gray-700">
                    Toutes
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
                    &lt; 10%
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
                    10-25%
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
                    &gt; 25%
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-6 flex flex-wrap justify-end gap-4">
          {/* Bouton appliquer les filtres */}
          <button
            onClick={applyFilters}
            className="px-6 py-2.5 bg-gradient-to-r from-[#007FFF] to-[#00BFFF] text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:ring-offset-2 flex items-center font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Appliquer les filtres
          </button>
          
          {/* Bouton sauvegarder les filtres */}
          {onSaveFilters && (
            <button
              onClick={handleSaveFilters}
              className="px-6 py-2.5 border border-[#007FFF] text-[#007FFF] bg-white rounded-lg hover:bg-[#EBF4FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:ring-offset-2 flex items-center font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Sauvegarder ces filtres
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionFilters; 