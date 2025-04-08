import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import PromotionGrid from '../components/PromotionGrid';
import PromotionFilters from '../components/PromotionFilters';
import { promotions, Promotion, getPromotionPriceRange } from '../data/promotions';

const Promotions: React.FC = () => {
  const initialPriceRange = getPromotionPriceRange();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [filters, setFilters] = useState({
    category: 'Toutes les catégories',
    subcategory: 'Toutes les sous-catégories',
    brand: 'Toutes les marques',
    priceRange: [initialPriceRange.min, initialPriceRange.max] as [number, number],
    sortBy: 'featured',
    inStockOnly: false,
    discountLevel: 'all'
  });

  useEffect(() => {
    // Simuler un temps de chargement
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      // Appliquer les filtres
      let filtered = [...promotions];
      
      // Filtrer par catégorie
      if (filters.category !== 'Toutes les catégories') {
        filtered = filtered.filter(promo => promo.category === filters.category);
      }
      
      // Filtrer par sous-catégorie
      if (filters.subcategory !== 'Toutes les sous-catégories') {
        filtered = filtered.filter(promo => promo.subcategory === filters.subcategory);
      }
      
      // Filtrer par marque
      if (filters.brand !== 'Toutes les marques') {
        filtered = filtered.filter(promo => promo.brand === filters.brand);
      }
      
      // Filtrer par prix après réduction
      filtered = filtered.filter(
        promo => promo.discountPrice >= filters.priceRange[0] && promo.discountPrice <= filters.priceRange[1]
      );
      
      // Filtrer par niveau de réduction
      if (filters.discountLevel !== 'all') {
        filtered = filtered.filter(promo => {
          const discount = promo.discountPercentage;
          switch(filters.discountLevel) {
            case 'upto10':
              return discount <= 10;
            case '10to20':
              return discount > 10 && discount <= 20;
            case '20to30':
              return discount > 20 && discount <= 30;
            case 'over30':
              return discount > 30;
            default:
              return true;
          }
        });
      }
      
      // Filtrer les promotions en stock
      if (filters.inStockOnly) {
        filtered = filtered.filter(promo => promo.inStock);
      }
      
      // Trier les promotions
      filtered = sortPromotions(filtered, filters.sortBy);
      
      setFilteredPromotions(filtered);
      setIsLoading(false);
    }, 400); // Délai de simulation

    return () => clearTimeout(timer);
  }, [filters]);

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
    // Dans une vraie application, on pourrait les sauvegarder dans localStorage ou sur un serveur
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumb />
      <main className="flex-grow">
        <div className="bg-gradient-to-b to-white min-h-screen">
          <br />
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Nos Promotions
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-8">
              Découvrez nos offres spéciales et réductions exclusives
            </p>
          </div>
          <div className="container mx-auto px-4 py-12">
            
           
            
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
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                    <span className="text-gray-600">Chargement des promotions...</span>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-700">{filteredPromotions.length}</span> promotion{filteredPromotions.length !== 1 ? 's' : ''} trouvée{filteredPromotions.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            
            {/* Section avantages */}
            <div className="mt-20 bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-10 text-center relative inline-block">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Avantages de nos promotions
                </span>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Économies Garanties</h3>
                  <p className="text-gray-600 text-center">
                    Des promotions exclusives vous permettant de réaliser des économies substantielles sur des produits de qualité.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Qualité Premium</h3>
                  <p className="text-gray-600 text-center">
                    Nous ne sacrifions jamais la qualité. Nos promotions concernent uniquement des produits qui répondent à nos standards élevés.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Offres Limitées</h3>
                  <p className="text-gray-600 text-center">
                    Ne tardez pas ! Nos promotions sont disponibles pour une durée limitée et renouvelées régulièrement.
                  </p>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow hover:shadow-lg transform hover:-translate-y-0.5">
                  Demander une offre sur mesure
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Promotions; 