import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

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
  if (totalPages <= 1) {
    console.log("Pagination non affichée car totalPages <= 1:", { currentPage, totalPages });
    return null;
  }

  console.log("Pagination rendue avec:", { currentPage, totalPages, siblingCount });

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
        pages.push('dots-left');
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
        pages.push('dots-right');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pages = generatePagination();
  console.log("Pages générées:", pages);
  
  // Désactiver les boutons de navigation si nécessaire
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  
  return (
    <nav 
      aria-label="Pagination" 
      className={`flex flex-wrap items-center justify-center mt-6 ${className}`}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ul className="flex items-center">
          {/* Bouton première page */}
          <li>
            <button
              onClick={() => onPageChange(1)}
              disabled={isFirstPage}
              className={`flex items-center justify-center h-10 px-4 border-r ${
                isFirstPage
                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-100 hover:text-teal-600'
              }`}
              aria-label="Première page"
            >
              <ChevronsLeft size={18} className="h-5 w-5" />
            </button>
          </li>
          
          {/* Bouton page précédente */}
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirstPage}
              className={`flex items-center justify-center h-10 px-4 border-r ${
                isFirstPage
                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-100 hover:text-teal-600'
              }`}
              aria-label="Page précédente"
            >
              <ChevronLeft size={18} className="h-5 w-5" />
            </button>
          </li>
          
          {/* Pages */}
          {pages.map((page, index) => {
            if (typeof page === 'number') {
              return (
                <li key={index}>
                  <button
                    onClick={() => onPageChange(page)}
                    className={`flex items-center justify-center h-10 w-12 text-sm border-r ${
                      currentPage === page
                        ? 'z-10 bg-teal-600 text-white font-medium hover:bg-teal-700'
                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-teal-600'
                    }`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                </li>
              );
            } else {
              return (
                <li key={index}>
                  <span className="flex items-center justify-center h-10 w-12 text-gray-500 border-r bg-white">
                    <MoreHorizontal size={16} className="h-5 w-5" />
                  </span>
                </li>
              );
            }
          })}
          
          {/* Bouton page suivante */}
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isLastPage}
              className={`flex items-center justify-center h-10 px-4 border-r ${
                isLastPage
                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-100 hover:text-teal-600'
              }`}
              aria-label="Page suivante"
            >
              <ChevronRight size={18} className="h-5 w-5" />
            </button>
          </li>
          
          {/* Bouton dernière page */}
          <li>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={isLastPage}
              className={`flex items-center justify-center h-10 px-4 ${
                isLastPage
                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-100 hover:text-teal-600'
              }`}
              aria-label="Dernière page"
            >
              <ChevronsRight size={18} className="h-5 w-5" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Pagination; 