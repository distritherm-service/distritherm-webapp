import React from 'react';
import { Link } from 'react-router-dom';

const ExpertAdviceSection: React.FC = () => {
  return (
    <div className="w-full bg-[#DCDCDC] h-[250px] relative overflow-visible mt-20">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex items-center h-full px-4 relative">
          <div className="text-left z-10 mt-8 ml-20">
            <h2 className="text-[24px] leading-tight font-bold text-gray-800 mb-6">
              "Besoin d'un conseil sur votre
         
              commande ou votre projet ?"
            </h2>
            <div className="text-center">
              <Link 
                to="/contact"
                className="inline-block px-10 py-3 bg-[#8B0000] text-white text-sm font-semibold rounded hover:bg-red-900 transition-colors duration-200 shadow-md"
              >
                Contacter un expert
              </Link>
            </div>
          </div>
          <div className="absolute right-32 bottom-0 h-[400px]" style={{ transform: 'translateY(-30px)' }}>
            <img 
              src="/src/assets/image-section-expert.png" 
              alt="Expert conseil" 
              className="h-full w-auto object-contain"
              style={{ minWidth: '300px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertAdviceSection; 