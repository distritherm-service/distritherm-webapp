import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '@/services/productService';

interface ProductGridProps {
  products: Product[];
  title: string;
  showViewAllButton?: boolean;
  isRecommended?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products = [], 
  title, 
  showViewAllButton = true,
  isRecommended = false 
}) => {
  // S'assurer que products est un tableau
  const validProducts = Array.isArray(products) ? products : [];
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 relative inline-block">
        <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          {title}
        </span>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
      </h2>
      
      {validProducts.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {isRecommended ? "Aucun produit recommandé" : "Aucun produit trouvé"}
          </h3>
          <p className="text-gray-500">
            {isRecommended 
              ? "Revenez plus tard pour découvrir nos recommandations"
              : "Essayez de modifier vos critères de recherche"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {validProducts.map((product) => (
            product ? <ProductCard key={product.id} product={product} /> : null
          ))}
        </div>
      )}
      
      {showViewAllButton && validProducts.length > 0 && (
        <div className="text-center mt-12">
          <Link 
            to="/nos-produits" 
            className="inline-block bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-teal-700 hover:to-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isRecommended ? "Voir tous les produits recommandés" : "Voir tous nos produits"}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductGrid; 