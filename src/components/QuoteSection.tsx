import React from 'react';
import { Link } from 'react-router-dom';

const QuoteSection: React.FC = () => {
  return (
    <div className="w-full relative py-16 overflow-hidden">
      {/* Image de fond */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/image-section-devis.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/90 z-1" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d'un devis pour votre projet ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Obtenez rapidement un devis personnalisé pour tous vos besoins en matériaux de construction
          </p>
          <Link 
            to="/devis"
            className="inline-block px-8 py-4 bg-white text-teal-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Demander un devis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuoteSection; 