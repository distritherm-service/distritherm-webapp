import React, { useState, useEffect } from 'react';
import ProductGrid from '../products/ProductGrid';
import { Product } from '../../types/product';
import { getRecommendedProducts } from '../../services/productService';

const ProduitRecommanderHome: React.FC = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true);
      try {
        const response = await getRecommendedProducts();
        setRecommendedProducts(response.products);
        setApiUnavailable(false);
      } catch (error) {
        //console.error('Erreur lors de la récupération des produits recommandés:', error);
        setApiUnavailable(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007FFF]"></div>
          </div>
        ) : (
          <>
            {apiUnavailable && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Le serveur est actuellement indisponible. Affichage des données de démonstration.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <ProductGrid 
              products={recommendedProducts} 
              title="Produits Recommandés" 
              showViewAllButton={true}
              isRecommended={true}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default ProduitRecommanderHome; 