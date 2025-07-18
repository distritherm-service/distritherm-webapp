import React from 'react';
import { Link } from 'react-router-dom';
import PromotionCard from './PromotionCard';
import { Promotion } from '../../services/promotionService';

interface PromotionGridProps {
  promotions: Promotion[];
  title?: string;
  showViewAllButton?: boolean;
  isLoading?: boolean;
}

const PromotionGrid: React.FC<PromotionGridProps> = ({ 
  promotions = [], 
  title, 
  showViewAllButton = false,
  isLoading = false
}) => {
  // Vérification que promotions est un tableau valide
  const validPromotions = Array.isArray(promotions) ? promotions : [];
  

  
  return (
    <div>
      {title && (
        <div className="flex flex-col items-start mb-8">
          <div className="relative">
            <h2 className="text-3xl font-bold text-left">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            <div className="absolute -bottom-3 left-0 w-32 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse h-96">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : validPromotions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 max-w-xl mx-auto">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune promotion trouvée</h3>
          <p className="text-gray-500 mb-6">Actuellement, aucune promotion n'est disponible.</p>
          <Link 
            to="/nos-produits" 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg inline-block"
          >
            Voir Nos produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {validPromotions.map((promotion) => (
            <PromotionCard key={promotion?.id || Math.random()} promotion={promotion} />
          ))}
        </div>
      )}
      
      {showViewAllButton && validPromotions.length > 0 && (
        <div className="text-center mt-12">
          <Link 
            to="/promotions" 
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Voir toutes nos promotions
          </Link>
        </div>
      )}
      

      

    </div>
  );
};

export default PromotionGrid; 