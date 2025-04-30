import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/navigation/Breadcrumb';
import PromotionGrid from '../components/promotions/PromotionGrid';
import PromotionFilters from '../components/promotions/PromotionFilters';
import { getPromotions, getPromotionsCount, Promotion } from '../services/promotionService';
//import Layout from '../components/layout/Layout';

// Fonction de tri des promotions (définie en dehors du composant)
const sortPromotions = (promos: Promotion[], sortBy: string): Promotion[] => {
  const sorted = [...promos];
  
  switch (sortBy) {
    case 'featured':
      return sorted.sort((a, b) => (a.featured === b.featured) ? 0 : a.featured ? -1 : 1);
    case 'discount_high':
      return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
    case 'discount_low':
      return sorted.sort((a, b) => a.discountPercentage - b.discountPercentage);
    case 'price_asc':
      return sorted.sort((a, b) => a.discountPrice - b.discountPrice);
    case 'price_desc':
      return sorted.sort((a, b) => b.discountPrice - a.discountPrice);
    case 'ending_soon':
      return sorted.sort((a, b) => new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime());
    default:
      return sorted;
  }
};

const Promotions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    category: 'Toutes les catégories',
    subcategory: 'Toutes les sous-catégories',
    mark: '',
    priceRange: [0, 10000] as [number, number],
    sortBy: 'featured',
    inStockOnly: false,
    discountLevel: 'all',
    priceRangeTouched: false,
    searchQuery: '',
  });

  // Fonction pour charger les promotions
  const loadPromotions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Charger les promotions avec pagination et filtres
      const promos = await getPromotions(
        currentPage, 
        itemsPerPage, 
        filters.category,
        filters.mark
      );
      setPromotions(promos || []);
      
      // Charger le nombre total de promotions
      const count = await getPromotionsCount(filters.category, filters.mark);
      setTotalPromotions(count);
    } catch (error) {
      console.error("Erreur lors du chargement des promotions:", error);
      setPromotions([]);
      setTotalPromotions(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, filters.category, filters.mark]);

  // Charger les promotions quand les paramètres changent
  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  // Calculer les promotions filtrées côté client (uniquement pour les filtres qui ne sont pas envoyés à l'API)
  const filteredPromotions = React.useMemo(() => {
    // S'assurer que promotions est un tableau valide
    if (!promotions || !Array.isArray(promotions)) {
      return [];
    }
    
    let filtered = [...promotions];
    
    // Filtrer par recherche
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(promo => 
        promo.title?.toLowerCase().includes(searchLower) || 
        promo.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrer par prix
    if (filters.priceRangeTouched) {
      filtered = filtered.filter(
        promo => promo.discountPrice >= filters.priceRange[0] && 
                 promo.discountPrice <= filters.priceRange[1]
      );
    }
    
    // Filtrer par stock
    if (filters.inStockOnly) {
      filtered = filtered.filter(promo => promo.inStock);
    }
    
    // Filtrer par niveau de remise
    if (filters.discountLevel !== 'all') {
      switch (filters.discountLevel) {
        case 'low': // Remises < 10%
          filtered = filtered.filter(promo => promo.discountPercentage < 10);
          break;
        case 'medium': // Remises 10-25%
          filtered = filtered.filter(promo => 
            promo.discountPercentage >= 10 && promo.discountPercentage <= 25
          );
          break;
        case 'high': // Remises > 25%
          filtered = filtered.filter(promo => promo.discountPercentage > 25);
          break;
      }
    }
    
    // Appliquer le tri
    return sortPromotions(filtered, filters.sortBy);
  }, [promotions, filters]);

  // Gestion du changement de filtre
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    // Pour certains filtres qui nécessitent un rechargement des données,
    // on réinitialise la page à 1
    if ('category' in newFilters || 'searchQuery' in newFilters || 'mark' in newFilters) {
      setCurrentPage(1);
    }
    
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      // Remonter en haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Gestion du changement d'items par page
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  // Calcul du nombre total de pages
  const totalPages = Math.max(1, Math.ceil(totalPromotions / itemsPerPage));

  // Les items pour le fil d'Ariane
  const breadcrumbItems = [
    { path: '/', label: 'Accueil' },
    { path: '/promotions', label: 'Promotions' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
              Nos Promotions
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mt-8">
            Découvrez nos offres spéciales et réductions exclusives
          </p>
        </div>

        
        <div className="mb-6">
          <PromotionFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <p className="text-gray-600">
            {isLoading ? (
              <span className="animate-pulse">Chargement des promotions...</span>
            ) : (
              <span>
                {totalPromotions === 0 ? (
                  "Aucune promotion trouvée"
                ) : (
                  <>
                    <span className="font-medium">{totalPromotions}</span> promotion{totalPromotions > 1 ? 's' : ''} trouvée{totalPromotions > 1 ? 's' : ''}
                  </>
                )}
              </span>
            )}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Afficher</span>
            <select
              className="border border-gray-200 rounded-md p-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              disabled={isLoading}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600">par page</span>
          </div>
        </div>
        
        <PromotionGrid 
          promotions={filteredPromotions}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalPromotions}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Promotions; 