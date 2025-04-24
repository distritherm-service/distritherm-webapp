import React, { useState, useEffect } from 'react';
//import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/navigation/Breadcrumb';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import { 
  getProducts, 
  getPriceRange,
  getAllBrands,
  type Product,
  type ProductsResponse,
  type FilterOptions,
  type PriceRange
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
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Charger la plage de prix
        try {
          const priceRangeData: PriceRange = await getPriceRange();
          const minMax: [number, number] = [priceRangeData.min, priceRangeData.max];
          setPriceRange(minMax);
          setFilters(prev => ({
            ...prev,
            priceRange: minMax
          }));
        } catch (priceError) {
          console.error('Erreur lors du chargement de la plage de prix:', priceError);
          // Utiliser des valeurs par défaut
          const defaultRange: [number, number] = [0, 1000];
          setPriceRange(defaultRange);
          setFilters(prev => ({
            ...prev,
            priceRange: defaultRange
          }));
        }

        // Charger les marques
        try {
          const brandsData = await getAllBrands();
          setBrands(brandsData);
        } catch (brandsError) {
          console.error('Erreur lors du chargement des marques:', brandsError);
          // Utiliser des marques par défaut
          setBrands(['Daikin', 'Atlantic', 'Samsung', 'Mitsubishi', 'LG', 'Toshiba']);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données initiales:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Charger les produits en fonction des filtres
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await getProducts({
          ...filters,
          page: currentPage
        });
        
        // Vérifier si response et response.products sont définis
        if (response && Array.isArray(response.products)) {
          setFilteredProducts(response.products);
          setTotalProducts(response.total || response.products.length);
          setTotalPages(Math.ceil((response.total || response.products.length) / itemsPerPage));
        } else {
          // En cas de réponse inattendue, utiliser un tableau vide
          setFilteredProducts([]);
          setTotalProducts(0);
          setTotalPages(1);
          console.error("Réponse API inattendue:", response);
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
    <div className="min-h-screen flex flex-col">
      <Breadcrumb />
      <main className="flex-grow">
        <div className="bg-gradient-to-b to-white min-h-screen">
          <br />
          <div className="text-center mb-7">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 relative inline-block">
              <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                Nos Produits
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-8">
              Découvrez nos produits et services
            </p>
          </div>
          <div className="container mx-auto px-4 py-12">
            {/* Filtres */}
            <div className="mb-8">
              <ProductFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onSaveFilters={handleSaveFilters}
                priceRange={priceRange}
                availableBrands={brands}
              />
            </div>
            
            {/* Résumé des résultats avec animation de chargement */}
            <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#7CB9E8] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full border-2 border-[#7CB9E8] border-t-transparent animate-spin"></div>
                    <span className="text-gray-600">Chargement des produits...</span>
                  </div>
                ) : hasError ? (
                  <div className="flex items-center text-red-500">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Erreur lors du chargement des produits
                    <button 
                      onClick={handleRetry}
                      className="ml-3 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    <span className="font-semibold text-[#7CB9E8]">{totalProducts}</span> produit{totalProducts !== 1 ? 's' : ''} trouvé{totalProducts !== 1 ? 's' : ''}
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
            
            {/* Grille de produits avec effet de transition */}
            <div className={`transition-all duration-500 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
              <ProductGrid 
                products={filteredProducts} 
                title="Nos Produits" 
                showViewAllButton={false}
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && !hasError && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#007FFF] text-white hover:bg-[#007FFF]/90'
                    }`}
                  >
                    &laquo;
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
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? 'bg-[#007FFF] text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={page}>...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#007FFF] text-white hover:bg-[#007FFF]/90'
                    }`}
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}
            
            {/* Section avantages */}
            <div className="mt-20 bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-10 text-center relative inline-block">
                <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                  Avantages de nos produits
                </span>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7CB9E8]/20 to-[#007FFF]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-[#007FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Produits de qualité</h3>
                  <p className="text-gray-600 text-center">
                    Des produits de qualité vous permettant de réaliser des économies substantielles.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7CB9E8]/20 to-[#007FFF]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-[#7CB9E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Qualité garantie</h3>
                  <p className="text-gray-600 text-center">
                    Nous ne sacrifions jamais la qualité. Nos produits sont de qualité supérieure.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7CB9E8]/20 to-[#007FFF]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-[#007FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Service rapide</h3>
                  <p className="text-gray-600 text-center">
                    Livraison rapide et service après-vente de qualité pour tous nos produits. 
                    Nous vous livrons vos produits dans les meilleures conditions et dans les détails les plus courts, en général dans les 48 heures ou en 72 heures dans tout la France.
                  </p>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <button className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] hover:from-[#7CB9E8]/90 hover:to-[#007FFF]/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow hover:shadow-lg transform hover:-translate-y-0.5">
                  Demander un devis personnalisé
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

export default NosProducts; 