import React from 'react';
import { Link } from 'react-router-dom';

const LocationSection: React.FC = () => {
  return (
    <div className="w-full bg-[#f8f8f8] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Texte de présentation */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Acteur de la transition énergétique en France
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
            Distritherm Services est plus qu'une société de distribution de matériaux pour le résidentiel ou le tertiaire. Soucieux de notre impact sur la planète, notre entreprise, basée sur des principes
            solides et une passion pour l'innovation, s'engage à fournir à nos clients une expérience remarquable à chaque chantier grâce à des produits de choix et de qualité respectant les normes
            environnementales en s’entourant des fabricants français et européens partageant les mêmes valeurs.
            </p>
            <Link 
              to="/a-propos"
              className="inline-block px-6 py-3 bg-[#008080] text-white text-sm font-semibold rounded hover:bg-teal-700 transition-colors duration-200 w-fit"
            >
              EN SAVOIR PLUS
            </Link>
          </div>

          {/* Carte */}
          <div className="relative">
            <div className="flex justify-end">
              <img 
                src="/Taverny.png" 
                alt="Carte des zones d'intervention" 
                className="w-full max-w-lg h-auto"
              />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection; 