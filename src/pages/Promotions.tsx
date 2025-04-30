import React, { useState, useEffect } from 'react';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/navigation/Breadcrumb';
import PromotionGrid from '../components/promotions/PromotionGrid';
import PromotionFilters from '../components/promotions/PromotionFilters';
import { getPromotions, Promotion } from '../services/promotionService';
//import Layout from '../components/layout/Layout';

const Promotions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [filters, setFilters] = useState({
    category: 'Toutes les catégories',
    subcategory: 'Toutes les sous-catégories',
    brand: 'Toutes les marques',
    priceRange: [0, 10000] as [number, number],
    sortBy: 'featured',
    inStockOnly: false,
    discountLevel: 'all',
    priceRangeTouched: false,
  });

  useEffect(() => {
    setIsLoading(true);
    getPromotions(1, 20)
      .then((promos) => {
        setFilteredPromotions(promos);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Fonction pour trier les promotions
  const sortPromotions = (promotionsList: Promotion[], sortBy: string): Promotion[] => {
    const sorted = [...promotionsList];
    
    switch (sortBy) {
      case 'featured':
        // Montrer d'abord les promotions vedettes
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        
      case 'discount_high':
        return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
      
      case 'discount_low':
        return sorted.sort((a, b) => a.discountPercentage - b.discountPercentage);
        
      case 'price_asc':
        return sorted.sort((a, b) => a.discountPrice - b.discountPrice);
        
      case 'price_desc':
        return sorted.sort((a, b) => b.discountPrice - a.discountPrice);
        
      case 'ending_soon':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.validUntil).getTime();
          const dateB = new Date(b.validUntil).getTime();
          return dateA - dateB;
        });
        
      default:
        return sorted;
    }
  };

  // Gestionnaire de changement de filtre
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Gestionnaire pour sauvegarder les filtres
  const handleSaveFilters = () => {
    // Simulation de sauvegarde des filtres
    console.log('Filtres sauvegardés:', filters);
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb />
      <main className="container mx-auto px-4 py-8">
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

        {/* Filtres */}
        <div className="mb-8">
          <PromotionFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onSaveFilters={handleSaveFilters}
          />
        </div>
        
        {/* Résumé des résultats avec animation de chargement */}
        <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-[#007FFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {isLoading ? (
              <div className="flex items-center">
                <div className="h-5 w-5 mr-2 rounded-full border-2 border-[#007FFF] border-t-transparent animate-spin"></div>
                <span className="text-gray-600">Chargement des promotions...</span>
              </div>
            ) : (
              <p className="text-gray-700">
                <span className="font-semibold text-[#007FFF]">{filteredPromotions.length}</span> promotion{filteredPromotions.length !== 1 ? 's' : ''} trouvée{filteredPromotions.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1 text-[#007FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Utilisez les filtres pour affiner vos résultats
          </div>
        </div>
        
        {/* Grille de promotions avec effet de transition */}
        <div className={`transition-all duration-500 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
          <PromotionGrid 
            promotions={isLoading ? [] : filteredPromotions} 
            title="Offres Spéciales & Réductions" 
            showViewAllButton={false}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Promotions; 