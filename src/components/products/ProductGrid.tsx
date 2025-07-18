import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  title?: string;
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
    <div className="space-y-12">
      {/* Enhanced Modern Title - Afficher seulement si title est défini et non vide */}
      {title && title.trim() !== '' && (
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
              {title}
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 mt-8 max-w-6xl mx-auto">
            {isRecommended 
              ? "Découvrez notre sélection de produits recommandés spécialement pour vous"
              : "Explorez notre large gamme de produits de qualité professionnelle"
            }
          </p>
        </div>
      )}
      
      {validProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 mx-auto max-w-lg border border-blue-200/30">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-3">
              {isRecommended ? "Aucun produit recommandé" : "Aucun produit trouvé"}
            </h3>
            <p className="text-blue-600 leading-relaxed">
              {isRecommended 
                ? "Nos recommandations arriveront bientôt. Revenez plus tard pour découvrir nos sélections personnalisées."
                : "Aucun produit ne correspond à vos critères actuels. Essayez de modifier vos filtres de recherche."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Products Grid with improved spacing and responsive design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {validProducts.map((product, index) => (
              product ? (
                <ProductCard key={product.id} product={product} index={index} />
              ) : null
            ))}
          </div>

          {/* Enhanced View All Button */}
          {showViewAllButton && (
            <div className="text-center pt-8">
              <Link 
                to="/nos-produits" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span>{isRecommended ? "Voir tous les produits recommandés" : "Découvrir tous nos produits"}</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </>
      )}
      
      
    </div>
  );
};

export default ProductGrid; 