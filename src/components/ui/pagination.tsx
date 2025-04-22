import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Limiter le nombre de pages affichées
  const getVisiblePages = () => {
    const delta = 2; // Nombre de pages à afficher de chaque côté de la page courante
    const range = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Première page
        i === totalPages || // Dernière page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages autour de la page courante
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== null) {
        range.push(null); // Ajouter des points de suspension
      }
    }
    
    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={cn(
        'flex items-center justify-center space-x-2',
        className
      )}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Précédent
      </button>

      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === null) {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-1">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'px-3 py-1 rounded-md',
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Suivant
      </button>
    </nav>
  );
} 