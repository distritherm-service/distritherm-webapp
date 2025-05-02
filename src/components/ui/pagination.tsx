import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = ''
}) => {
  // Ne pas afficher la pagination s'il n'y a qu'une page
  if (totalPages <= 1) return null;

  // Fonction pour générer la plage de pages à afficher
  const generatePagination = () => {
    // Toujours inclure la première et la dernière page
    const startPage = Math.max(1, currentPage - siblingCount);
    const endPage = Math.min(totalPages, currentPage + siblingCount);
    
    const pages: (number | string)[] = [];
    
    // Première page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        // Ajouter des ellipses si nécessaire
        pages.push('...');
      }
    }
    
    // Pages intermédiaires
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Dernière page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        // Ajouter des ellipses si nécessaire
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pages = generatePagination();
  
  // Désactiver les boutons de navigation si nécessaire
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Bouton première page */}
      <button 
        onClick={() => onPageChange(1)} 
        disabled={isFirstPage}
        className={`p-2 rounded-md ${
          isFirstPage 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Première page"
      >
        <ChevronsLeft size={16} />
      </button>
      
      {/* Bouton page précédente */}
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={isFirstPage}
        className={`p-2 rounded-md ${
          isFirstPage 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Page précédente"
      >
        <ChevronLeft size={16} />
      </button>
      
      {/* Pages */}
      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <button
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === page
                  ? 'bg-primary-600 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ) : (
            <span className="text-gray-400 px-1">...</span>
          )}
        </React.Fragment>
      ))}
      
      {/* Bouton page suivante */}
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={isLastPage}
        className={`p-2 rounded-md ${
          isLastPage 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Page suivante"
      >
        <ChevronRight size={16} />
      </button>
      
      {/* Bouton dernière page */}
      <button 
        onClick={() => onPageChange(totalPages)} 
        disabled={isLastPage}
        className={`p-2 rounded-md ${
          isLastPage 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Dernière page"
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
};

export default Pagination; 