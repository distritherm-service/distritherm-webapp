import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/navigation/Breadcrumb';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import { 
  products, 
  getAllCategories, 
  getSubcategoriesByCategory, 
  getAllBrands,
  getPriceRange,
  Product 
} from '../data/products';
import Footer from '../components/layout/Footer';

const NosProducts: React.FC = () => {
  // Obtenir la plage de prix des produits
  const priceRangeObj = getPriceRange();
  const initialPriceRange: [number, number] = [priceRangeObj.min, priceRangeObj.max];

  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState({
    category: 'Toutes les catégories',
    subcategory: 'Toutes les sous-catégories',
    brand: 'Toutes les marques',
    priceRange: initialPriceRange,
    inStockOnly: false,
    sortBy: 'featured',
    priceRangeTouched: false
  });

  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let result = [...products];

    // Filtrer par catégorie
    if (filters.category && filters.category !== 'Toutes les catégories') {
      result = result.filter(product => product.category === filters.category);
    }

    // Filtrer par sous-catégorie
    if (filters.subcategory && filters.subcategory !== 'Toutes les sous-catégories') {
      result = result.filter(product => product.subcategory === filters.subcategory);
    }

    // Filtrer par marque
    if (filters.brand && filters.brand !== 'Toutes les marques') {
      result = result.filter(product => product.brand === filters.brand);
    }

    // Filtrer par prix
    result = result.filter(
      product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
    );

    // Filtrer par stock
    if (filters.inStockOnly) {
      result = result.filter(product => product.stock > 0);
    }

    // Trier les produits
    if (filters.sortBy === 'order_first') {
      // Si le tri est "Sur commande", ne garder que les produits avec stock = 0
      result = result.filter(product => product.stock === 0);
    } else if (filters.sortBy) {
      result = sortProducts(result, filters.sortBy);
    }

    setFilteredProducts(result);
  }, [filters]);

  // Fonction pour trier les produits
  const sortProducts = (productsToSort: Product[], sortBy: string): Product[] => {
    const sortedProducts = [...productsToSort];
    
    switch (sortBy) {
      case 'stock_first':
        return sortedProducts.sort((a, b) => (b.stock > 0 ? 1 : -1) - (a.stock > 0 ? 1 : -1));
      case 'price_asc':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'name_asc':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sortedProducts;
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSaveFilters = () => {
    console.log('Filtres sauvegardés:', filters);
    // Dans une application réelle, on sauvegarderait ces filtres dans le localStorage ou un backend
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
                ) : (
                  <p className="text-gray-700">
                    <span className="font-semibold text-[#7CB9E8]">{filteredProducts.length}</span> produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
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
                products={isLoading ? [] : filteredProducts} 
                title="Nos Produits" 
                showViewAllButton={false}
              />
            </div>
            
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