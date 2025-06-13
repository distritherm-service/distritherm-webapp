import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/navigation/Breadcrumb';
import PromotionGrid from '../components/promotions/PromotionGrid';
import PromotionFilters from '../components/promotions/PromotionFilters';
import { getPromotions, getPromotionsCount, Promotion } from '../services/promotionService';

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
  const [hasError, setHasError] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
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
    setHasError(false);
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
      setTotalPages(Math.ceil(count / itemsPerPage));
      
      console.log('Promotions chargées:', {
        nombre: promos?.length || 0,
        total: count,
        page: currentPage,
        totalPages: Math.ceil(count / itemsPerPage)
      });
    } catch (error) {
      console.error("Erreur lors du chargement des promotions:", error);
      setPromotions([]);
      setTotalPromotions(0);
      setTotalPages(1);
      setHasError(true);
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



  const handleRetry = () => {
    setCurrentPage(1);
    loadPromotions();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <main className="flex-grow">
        {/* Section Hero moderne */}
        <section className="relative h-64 md:h-80 lg:h-[420px] w-full overflow-hidden shadow-md">
          {/* Image d'arrière-plan */}
          <div className="absolute inset-0">
            <img
              src="/icone/image-arriere-plan-promotion.png"
              alt="Promotions Distritherm Services"
              className="w-full h-full object-cover object-center"
            />
            {/* Voile sombre en dégradé pour une meilleure lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent backdrop-blur-sm" />
          </div>

          {/* Contenu : Titre + Breadcrumb */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">Nos Promotions</h1>
            <br />
            <Breadcrumb />
          </div>

          {/* Ombre courbée en bas */}
          <div className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2">
            <svg viewBox="0 0 1600 100" className="w-full h-6 md:h-8" preserveAspectRatio="none">
              <path d="M0,0 C600,100 1000,100 1600,0 L1600,100 L0,100 Z" fill="#f8f9ff"/>
            </svg>
          </div>
        </section>

        {/* Contenu principal avec layout sidebar */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar avec filtres */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-6">
                <PromotionFilters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 min-w-0">
              {/* En-tête avec résultats et statistiques */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 backdrop-blur-sm bg-white/80">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#007FFF] to-[#00BFFF] rounded-xl flex items-center justify-center mr-4 shadow-lg p-2">
                      <img 
                        src="/icone/imageremise.png" 
                        alt="Promotions" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="h-5 w-5 mr-3 rounded-full border-2 border-[#007FFF] border-t-transparent animate-spin"></div>
                          <span className="text-gray-600 font-medium">Chargement des promotions...</span>
                        </div>
                      ) : hasError ? (
                        <div className="flex items-center text-red-500">
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="font-medium">Erreur lors du chargement</span>
                          <button 
                            onClick={handleRetry}
                            className="ml-3 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            Réessayer
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold text-gray-800">
                            <span className="bg-gradient-to-r from-[#007FFF] to-[#00BFFF] bg-clip-text text-transparent">
                              {filteredPromotions.length.toLocaleString('fr-FR')}
                            </span> 
                            <span className="text-gray-600 ml-2">
                              promotion{filteredPromotions.length !== 1 ? 's' : ''} trouvée{filteredPromotions.length !== 1 ? 's' : ''}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Page {currentPage} sur {totalPages}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-lg border border-orange-100">
                      <svg className="w-4 h-4 mr-2 text-[#007FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600 font-medium">
                        Offres à durée limitée
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Afficher</span>
                      <select
                        className="border border-gray-200 rounded-md p-1 text-sm focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF]"
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        disabled={isLoading}
                      >
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="36">36</option>
                        <option value="48">48</option>
                      </select>
                      <span className="text-sm text-gray-600">par page</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Grille de promotions avec animations */}
              <div className={`transition-all duration-700 ${isLoading ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                <PromotionGrid 
                  promotions={filteredPromotions}
                  isLoading={isLoading}
                />
              </div>

              {/* Pagination moderne */}
              {totalPages > 1 && !hasError && (
                <div className="flex justify-center mt-12">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 backdrop-blur-sm bg-white/80">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all duration-300 ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#007FFF] to-[#00BFFF] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        // Afficher seulement 5 pages à la fois
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all duration-300 ${
                                currentPage === page
                                  ? 'bg-gradient-to-r from-[#007FFF] to-[#00BFFF] text-white shadow-lg transform -translate-y-0.5'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:-translate-y-0.5'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          (page === currentPage - 2 && currentPage > 3) ||
                          (page === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all duration-300 ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#007FFF] to-[#00BFFF] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Section avantages modernisée */}
        <section className="bg-gradient-to-br from-white via-blue-50/50 to-orange-50/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#007FFF] to-[#00BFFF] bg-clip-text text-transparent">
                  Pourquoi profiter de nos promotions ?
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#007FFF] to-[#00BFFF] rounded-full mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
                Découvrez des offres exceptionnelles sur nos meilleurs produits, disponibles pour une durée limitée
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm bg-white/80">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img 
                    src="/icone/imageremise.png" 
                    alt="Remises Exceptionnelles" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 group-hover:text-[#007FFF] transition-colors duration-300">
                  Remises Exceptionnelles
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Bénéficiez de réductions importantes sur une sélection de produits de qualité, avec des économies pouvant aller jusqu'à 50%.
                </p>
              </div>
              
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm bg-white/80">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img 
                    src="/icone/imageflash.png" 
                    alt="Offres Flash" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 group-hover:text-[#007FFF] transition-colors duration-300">
                  Offres Flash
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Profitez d'offres limitées dans le temps sur des produits sélectionnés. Soyez rapide, ces promotions ne durent pas !
                </p>
              </div>
              
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm bg-white/80">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img 
                    src="/icone/imagequalite.png" 
                    alt="Qualité Garantie" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 group-hover:text-[#007FFF] transition-colors duration-300">
                  Qualité Garantie
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Même en promotion, nous maintenons nos standards de qualité élevés. Tous nos produits sont garantis et certifiés.
                </p>
              </div>
            </div>
            
            
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Promotions; 