import React, { useState, useEffect } from 'react';
import { FilterOptions } from "@/services/productService";
import { Category, categoryService } from "@/services/categoryService";
import axios from 'axios';

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onSaveFilters?: () => void;
  priceRange: [number, number];
  availableBrands: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onSaveFilters,
  priceRange,
  availableBrands
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [brands, setBrands] = useState<string[]>(['Toutes les marques']);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    filters.priceRange || priceRange
  );
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [level1Categories, setLevel1Categories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour les marques quand elles sont disponibles
  useEffect(() => {
    if (availableBrands && availableBrands.length > 0) {
      setBrands(['Toutes les marques', ...availableBrands]);
    }
  }, [availableBrands]);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await categoryService.getAllCategories();
        setCategories(fetchedCategories);
        
        // Filtrer les catégories de niveau 1
        const level1 = fetchedCategories.filter(cat => cat.level === 1);
        setLevel1Categories(level1);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Mettre à jour localPriceRange quand filters.priceRange change
  useEffect(() => {
    if (filters.priceRange) {
      setLocalPriceRange(filters.priceRange);
    } else if (priceRange) {
      setLocalPriceRange(priceRange);
    }
  }, [filters.priceRange, priceRange]);

  // Mettre à jour searchQuery quand filters.searchQuery change
  useEffect(() => {
    setSearchQuery(filters.searchQuery || '');
  }, [filters.searchQuery]);

  const handleFilterChange = (filterName: keyof FilterOptions, value: any) => {
    onFilterChange({ [filterName]: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilterChange({ searchQuery });
  };

  const handlePriceRangeApply = () => {
    onFilterChange({ 
      priceRange: localPriceRange
    });
  };

  const handleSaveFilters = () => {
    // Sauvegarde des filtres actuels (localStorage ou autre mécanisme)
    if (onSaveFilters) {
      onSaveFilters();
    }
    
    // Pour cette démonstration, afficher juste une notification
    const notification = document.createElement('div');
    notification.classList.add('fixed', 'bottom-4', 'right-4', 'bg-teal-600', 'text-white', 'p-4', 'rounded-lg', 'shadow-lg', 'z-50', 'animate-fade-in');
    notification.textContent = 'Filtres sauvegardés avec succès';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'featured', label: 'Produits vedettes' },
    { value: 'stock_first', label: 'En stock d\'abord' },
    { value: 'order_first', label: 'Sur commande d\'abord' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'name_asc', label: 'Nom (A-Z)' },
    { value: 'name_desc', label: 'Nom (Z-A)' }
  ];

  // Helper pour vérifier si les filtres de prix sont actifs
  const isPriceFilterActive = () => {
    if (!filters.priceRange) return false;
    return filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1];
  };

  // Afficher un indicateur de chargement pendant le chargement des données
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

  // Afficher un message d'erreur si le chargement a échoué
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
        className="md:hidden w-full p-4 flex items-center justify-between text-gray-800 font-medium bg-gradient-to-r from-teal-50 to-blue-50 border-b border-gray-100 sticky top-0 z-30"
        onClick={() => setIsOpen(!isOpen)}
        style={{ minHeight: 56 }}
      >
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 md:gap-6">
          {/* Catégorie */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
              Catégorie
            </label>
            <div className="relative">
              <select
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white pr-8 hover:border-teal-300 transition-colors"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="Toutes les catégories">Toutes les catégories</option>
                {level1Categories.map((category) => (
                  <option key={category.id} value={category.name}>
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

          {/* Recherche */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
              Recherche
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Rechercher un produit..."
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-300 transition-colors pr-10"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-teal-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Marque */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
              Marque
            </label>
            <div className="relative">
              <select
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white pr-8 hover:border-teal-300 transition-colors"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
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

          {/* Fourchette de prix */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
              Prix (€)
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={localPriceRange[0]}
                  onChange={(e) => setLocalPriceRange([parseInt(e.target.value) || priceRange[0], localPriceRange[1]])}
                  className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-300 transition-colors"
                  placeholder="Min"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="number"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={localPriceRange[1]}
                  onChange={(e) => setLocalPriceRange([localPriceRange[0], parseInt(e.target.value) || priceRange[1]])}
                  className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-300 transition-colors"
                  placeholder="Max"
                />
              </div>
              <button
                onClick={handlePriceRangeApply}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-1.5 px-3 rounded-lg text-sm transition-colors shadow-sm hover:shadow"
              >
                Appliquer
              </button>
            </div>
          </div>

          {/* Tri et options supplémentaires */}
          <div className="space-y-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
                Trier par
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white pr-8 hover:border-teal-300 transition-colors"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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

            <div className="flex items-center pb-1">
              <input
                type="checkbox"
                id="inStockOnly"
                checked={filters.inStockOnly}
                onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="inStockOnly" className="ml-2 block text-sm text-gray-700 hover:text-teal-600 cursor-pointer transition-colors">
                Produits en stock uniquement
              </label>
            </div>
            
            <button
              onClick={handleSaveFilters}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Sauvegarder ce filtre
            </button>
          </div>
        </div>

        {/* Filtres actifs et bouton réinitialiser */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {filters.category !== 'Toutes les catégories' && (
            <span className="inline-flex items-center bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-sm px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
              <svg className="w-3.5 h-3.5 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l3-3 3 3M7 7h10v10l-3 3-3-3H7V7z" />
              </svg>
              {filters.category}
              <button
                onClick={() => handleFilterChange('category', 'Toutes les catégories')}
                className="ml-1.5 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Supprimer le filtre de catégorie"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.searchQuery && (
            <span className="inline-flex items-center bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-sm px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
              <svg className="w-3.5 h-3.5 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {filters.searchQuery}
              <button
                onClick={() => handleFilterChange('searchQuery', '')}
                className="ml-1.5 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Supprimer la recherche"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.brand !== 'Toutes les marques' && (
            <span className="inline-flex items-center bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-sm px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
              <svg className="w-3.5 h-3.5 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {filters.brand}
              <button
                onClick={() => handleFilterChange('brand', 'Toutes les marques')}
                className="ml-1.5 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Supprimer le filtre de marque"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {isPriceFilterActive() && (
            <span className="inline-flex items-center bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-sm px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
              <svg className="w-3.5 h-3.5 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {filters.priceRange && `${filters.priceRange[0].toLocaleString('fr-FR')}€ - ${filters.priceRange[1].toLocaleString('fr-FR')}€`}
              <button
                onClick={() => {
                  handleFilterChange('priceRange', [priceRange[0], priceRange[1]]);
                }}
                className="ml-1.5 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Supprimer le filtre de prix"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-sm px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
              <svg className="w-3.5 h-3.5 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              En stock uniquement
              <button
                onClick={() => handleFilterChange('inStockOnly', false)}
                className="ml-1.5 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Supprimer le filtre en stock uniquement"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {(filters.category !== 'Toutes les catégories' ||
            filters.brand !== 'Toutes les marques' ||
            filters.searchQuery ||
            isPriceFilterActive()) && (
            <button
              onClick={() => onFilterChange({
                category: 'Toutes les catégories',
                brand: 'Toutes les marques',
                priceRange: [priceRange[0], priceRange[1]],
                inStockOnly: false,
                searchQuery: ''
              })}
              className="ml-auto text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Réinitialiser
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters; 