import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types/product';
import { getProducts, FilterOptions } from '../services/productService';
import { getAllMarks } from '../services/markService';
import ProductCard from '../components/products/ProductCard';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/category';
import ProductFilters from '../components/products/ProductFilters';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/navigation/Breadcrumb';

const CategoryProducts: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: category || '',
    brand: 'Toutes les marques',
    priceRange: [0, 1000],
    inStockOnly: false,
    sortBy: 'featured',
    searchQuery: ''
  });

  // Charger les données initiales (prix, marques)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Charger les marques depuis l'API /marks
        const marks = await getAllMarks();
        setAvailableBrands(marks);
      } catch (error) {
        console.error('Erreur lors du chargement des données initiales:', error);
        setAvailableBrands([]);
      }
    };
    
    loadInitialData();
  }, []);

  // Charger les catégories et les produits
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Charger les catégories
        const allCategories = await categoryService.getAllCategories();
        setCategories(allCategories);
        
        // Trouver la catégorie correspondante
        const foundCategory = allCategories.find(cat => 
          cat.name.toLowerCase() === category?.toLowerCase()
        );
        setCategoryData(foundCategory || null);
        
        // Charger les produits avec les filtres
        if (foundCategory) {
          const productsResponse = await getProducts({
            ...filters,
            category: foundCategory.id.toString()
          });
          setFilteredProducts(productsResponse.products);
          
          // Calculer la plage de prix à partir des produits
          const prices = productsResponse.products.map(p => p.priceHt);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        } else {
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setFilteredProducts([]);
      } finally {
        // Simuler un délai de chargement pour une meilleure UX
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    fetchData();
  }, [category]);

  // Appliquer les filtres
  useEffect(() => {
    const applyFilters = async () => {
      if (!categoryData) return;
      
      setIsLoading(true);
      try {
        const productsResponse = await getProducts({
          ...filters,
          category: categoryData.id.toString()
        });
        setFilteredProducts(productsResponse.products);
      } catch (error) {
        console.error('Erreur lors de l\'application des filtres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Ne pas déclencher l'effet lors du premier rendu qui est géré par l'effet précédent
    if (categoryData) {
      applyFilters();
    }
  }, [filters, categoryData]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSaveFilters = () => {
    console.log('Filtres sauvegardés:', filters);
  };

  // Afficher un message si la catégorie n'existe pas
  if (!categoryData && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumb />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Catégorie non trouvée
              </h1>
              <p className="text-gray-600">
                Désolé, cette catégorie n'existe pas.
              </p>
              <Link 
                to="/"
                className="mt-4 inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Obtenir une image par défaut si aucune n'est disponible dans la catégorie
  const getCategoryImage = () => {
    // Utiliser l'URL de l'image si elle existe dans la catégorie
    // Sinon utiliser une image par défaut
    return '/images/default-category.jpg';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumb />
      <main className="flex-grow">
        <div className="bg-gradient-to-b to-white min-h-screen">
          <br />
          <div className="text-center mb-7">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                {categoryData?.name || 'Chargement...'}
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-8">
              Découvrez nos produits dans la catégorie {categoryData?.name?.toLowerCase() || '...'}
            </p>
          </div>
          <div className="container mx-auto px-4 py-12">
            {/* Image de la catégorie */}
            <div className="mb-8 relative rounded-xl overflow-hidden shadow-lg h-64">
              <img 
                src={getCategoryImage()} 
                alt={categoryData?.name || 'Catégorie'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <div className="w-12 h-12 mb-2">
                    {/* Icône de catégorie si disponible */}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filtres */}
            <div className="mb-8">
              <ProductFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onSaveFilters={handleSaveFilters}
                priceRange={priceRange}
                availableBrands={availableBrands}
              />
            </div>
            
            {/* Résumé des résultats avec animation de chargement */}
            <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-2 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div>
                    <span className="text-gray-600">Chargement des produits...</span>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    <span className="font-semibold text-teal-700">{filteredProducts.length}</span> produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Utilisez les filtres pour affiner vos résultats
              </div>
            </div>
            
            {/* Grille de produits avec effet de transition */}
            <div className={`transition-all duration-500 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-600">
                    Essayez de modifier vos filtres ou consultez nos autres catégories.
                  </p>
                </div>
              )}
            </div>
            
            {/* Section avantages */}
            <div className="mt-20 bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-10 text-center relative inline-block">
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Avantages de nos produits
                </span>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Produits de qualité</h3>
                  <p className="text-gray-600 text-center">
                    Des produits de qualité vous permettant de réaliser des économies substantielles.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Qualité garantie</h3>
                  <p className="text-gray-600 text-center">
                    Nous ne sacrifions jamais la qualité. Nos produits sont de qualité supérieure.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">Service après-vente de qualité</h3>
                  <p className="text-gray-600 text-center">
                    Service après-vente de qualité pour tous nos produits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryProducts; 