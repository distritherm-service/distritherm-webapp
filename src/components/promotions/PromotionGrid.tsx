import React from 'react';
import { Link } from 'react-router-dom';
import PromotionCard from './PromotionCard';
import { Promotion } from '../../services/promotionService';

interface PromotionGridProps {
  promotions: Promotion[];
  title?: string;
  showViewAllButton?: boolean;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
}

const PromotionGrid: React.FC<PromotionGridProps> = ({ 
  promotions = [], 
  title, 
  showViewAllButton = false,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0
}) => {
  // Vérification que promotions est un tableau valide
  const validPromotions = Array.isArray(promotions) ? promotions : [];
  
  // Fonction pour générer les boutons de pagination de manière dynamique
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5; // Nombre maximum de boutons numériques à afficher
    
    // Calculer la plage de boutons à afficher
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
    
    // Ajuster si nous sommes proches de la fin
    if (endPage - startPage + 1 < maxButtonsToShow && startPage > 1) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }
    
    // Bouton pour la première page si on n'y est pas déjà
    if (startPage > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => onPageChange?.(1)}
          className="px-3 py-1.5 rounded-md bg-white text-gray-700 hover:bg-blue-50 border border-gray-300"
          aria-label="Première page"
        >
          1
        </button>
      );
      
      // Ajouter des points de suspension si on n'est pas juste après la première page
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 py-1.5 text-gray-500">
            ...
          </span>
        );
      }
    }
    
    // Pages numériques
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange?.(i)}
          className={`px-3 py-1.5 rounded-md ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
          }`}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    
    // Bouton pour la dernière page si on n'y est pas déjà
    if (endPage < totalPages) {
      // Ajouter des points de suspension si on n'est pas juste avant la dernière page
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 py-1.5 text-gray-500">
            ...
          </span>
        );
      }
      
      buttons.push(
        <button
          key="last"
          onClick={() => onPageChange?.(totalPages)}
          className="px-3 py-1.5 rounded-md bg-white text-gray-700 hover:bg-blue-50 border border-gray-300"
          aria-label="Dernière page"
        >
          {totalPages}
        </button>
      );
    }
    
    return buttons;
  };
  
  // Calcul des indices de début et de fin pour l'affichage
  const startIndex = (currentPage - 1) * validPromotions.length + 1;
  const endIndex = Math.min(currentPage * validPromotions.length, totalItems || validPromotions.length * totalPages);
  
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
      
      {/* Pagination améliorée */}
      {!isLoading && totalPages > 1 && onPageChange && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md flex items-center ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
              }`}
              aria-label="Page précédente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Précédent</span>
            </button>
            
            <div className="hidden md:flex space-x-1">
              {renderPaginationButtons()}
            </div>
            
            <div className="md:hidden flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
            </div>
            
            <button 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-md flex items-center ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
              }`}
              aria-label="Page suivante"
            >
              <span>Suivant</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}
      
      {/* Information sur le nombre total de résultats */}
      {!isLoading && validPromotions.length > 0 && totalItems > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Affichage des produits <span className="font-medium">{startIndex}</span> 
          à <span className="font-medium">{endIndex}</span> 
          sur un total de <span className="font-medium">{totalItems}</span>
        </div>
      )}
    </div>
  );
};

export default PromotionGrid; 