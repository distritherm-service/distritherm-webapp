import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#7CB9E8] border-t-transparent" role="status">
      <span className="sr-only">Chargement...</span>
    </div>
  );
}; 