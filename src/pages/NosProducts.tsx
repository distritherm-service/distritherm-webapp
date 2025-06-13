import React, { useState, useEffect } from 'react';
//import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/navigation/Breadcrumb';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import { 
  getProducts, 
  getAllBrands,
  type Product,
  type ProductsResponse,
  type FilterOptions
} from '../services/productService';
import Footer from '../components/layout/Footer';

const NosProducts: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [brands, setBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState<FilterOptions>({
    category: 'Toutes les catégories',
    brand: 'Toutes les marques',
    priceRange: [0, 1000],
    inStockOnly: false,
    sortBy: 'newest',
    searchQuery: '',
    page: 1,
    limit: itemsPerPage
  });

  // Charger les plages de prix et les marques au premier chargement
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const productsData = await getProducts();
        setFilteredProducts(productsData.products);
        setTotalProducts(productsData.total || productsData.products.length);
        setTotalPages(Math.ceil((productsData.total || productsData.products.length) / itemsPerPage));
        
        // Calculer la plage de prix à partir des produits
        if (productsData.products.length > 0) {
          const prices = productsData.products.map(p => p.priceHt || p.priceTtc || 0);
          const validPrices = prices.filter(price => price > 0);
          if (validPrices.length > 0) {
            setPriceRange([Math.min(...validPrices), Math.max(...validPrices)]);
          }
        }
        
        const brandsData = await getAllBrands();
        setBrands(brandsData);
        
        console.log('Données initiales chargées:', {
          produits: productsData.products.length,
          total: productsData.total,
          marques: brandsData.length
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Charger les produits en fonction des filtres
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        console.log('Chargement des produits avec filtres:', { filters, currentPage });
        
        const response = await getProducts({
          ...filters,
          page: currentPage
        });
        
        console.log('Réponse reçue:', response);
        
        // Vérifier si response et response.products sont définis
        if (response && Array.isArray(response.products)) {
          setFilteredProducts(response.products);
          setTotalProducts(response.total || response.products.length);
          setTotalPages(Math.ceil((response.total || response.products.length) / itemsPerPage));
          
          console.log('Produits mis à jour:', {
            nombre: response.products.length,
            total: response.total,
            page: currentPage,
            totalPages: Math.ceil((response.total || response.products.length) / itemsPerPage)
          });
        } else {
          // En cas de réponse inattendue, utiliser un tableau vide
          setFilteredProducts([]);
          setTotalProducts(0);
          setTotalPages(1);
          console.error("Réponse API inattendue:", response);
          setHasError(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setFilteredProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    // Si on change un filtre, revenir à la première page
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      setCurrentPage(1);
      setFilters({ ...filters, ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, ...newFilters });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSaveFilters = () => {
    console.log('Filtres sauvegardés:', filters);
    // Dans une application réelle, on sauvegarderait ces filtres dans le localStorage ou un backend
  };

  const handleRetry = () => {
    // Recharge les produits
    setCurrentPage(1);
    const fetchProducts = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await getProducts({
          ...filters,
          page: 1
        });
        
        if (response && Array.isArray(response.products)) {
          setFilteredProducts(response.products);
          setTotalProducts(response.total || response.products.length);
          setTotalPages(Math.ceil((response.total || response.products.length) / itemsPerPage));
        } else {
          setFilteredProducts([]);
          setTotalProducts(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setFilteredProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <main className="flex-grow">
        {/* Section Hero moderne */}
        <section className="relative h-64 md:h-80 lg:h-[420px] w-full overflow-hidden shadow-md">
          {/* Image d'arrière-plan */}
          <div className="absolute inset-0">
            <img
              src="/icone/image-arriere-plan-produit.png"
              alt="Recrutement Distritherm Services"
              className="w-full h-full object-cover object-center"
            />
            {/* Voile sombre en dégradé pour une meilleure lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent backdrop-blur-sm" />
          </div>
          {/* Contenu : Titre + Breadcrumb */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">Nos produits</h1>
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
                <ProductFilters 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onSaveFilters={handleSaveFilters}
                  priceRange={priceRange}
                  availableBrands={brands}
                />
              </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 min-w-0">
              {/* En-tête avec résultats et statistiques */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 backdrop-blur-sm bg-white/80">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7CB9E8] to-[#007FFF] rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-4H3m16 8H7m14 4H3" />
                      </svg>
                    </div>
                    <div>
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="h-5 w-5 mr-3 rounded-full border-2 border-[#7CB9E8] border-t-transparent animate-spin"></div>
                          <span className="text-gray-600 font-medium">Chargement des produits...</span>
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
                            <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                              {totalProducts.toLocaleString('fr-FR')}
                            </span> 
                            <span className="text-gray-600 ml-2">
                              produit{totalProducts !== 1 ? 's' : ''} trouvé{totalProducts !== 1 ? 's' : ''}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Page {currentPage} sur {totalPages}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-teal-50 px-4 py-2 rounded-lg border border-blue-100">
                    <svg className="w-4 h-4 mr-2 text-[#007FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600 font-medium">
                      Utilisez les filtres pour affiner vos résultats
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Grille de produits avec animations */}
              <div className={`transition-all duration-700 ${isLoading ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                <ProductGrid 
                  products={filteredProducts} 
                  title="" 
                  showViewAllButton={false}
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
                            : 'bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white hover:shadow-lg transform hover:-translate-y-0.5'
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
                                  ? 'bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white shadow-lg transform -translate-y-0.5'
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
                            : 'bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white hover:shadow-lg transform hover:-translate-y-0.5'
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
        <section className="bg-gradient-to-br from-white via-blue-50/50 to-teal-50/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                  Pourquoi choisir nos produits ?
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
                Découvrez les avantages qui font de nos produits le choix idéal pour vos projets professionnels
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm bg-white/80">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img 
                    src="/icone/imageprix.png" 
                    alt="Prix Compétitifs" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 group-hover:text-[#007FFF] transition-colors duration-300">
                  Prix Compétitifs
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Des produits de qualité vous permettant de réaliser des économies substantielles sans compromis sur la performance.
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
                  Nous ne sacrifions jamais la qualité. Nos produits sont rigoureusement sélectionnés et testés pour répondre aux standards les plus élevés.
                </p>
              </div>
              
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm bg-white/80">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img 
                    src="/icone/imageservice.png" 
                    alt="Service Express" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 group-hover:text-[#007FFF] transition-colors duration-300">
                  Service Express
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Service après-vente d'excellence. Nous vous accompagnons dans vos projets avec des produits de qualité.
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

export default NosProducts; 