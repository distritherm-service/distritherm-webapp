import React from 'react';
import { FaRulerCombined, FaBoxOpen, FaTruckFast, FaLock } from 'react-icons/fa6';
import { FaShoppingCart, FaShieldAlt } from 'react-icons/fa';

const ValueProposition: React.FC = () => {
  const features = [
    {
      icon: <FaRulerCombined className="w-12 h-12 text-teal-600" />,
      title: 'Étude et dimensionnement',
      description: 'de vos projets'
    },
    {
      icon: <FaBoxOpen className="w-12 h-12 text-teal-600" />,
      title: 'Produits en stock',
      description: 'disponibilité immédiate'
    },
    {
      icon: <FaShoppingCart className="w-12 h-12 text-teal-600" />,
      title: 'E-commerce',
      description: 'commandez vos produits en ligne'
    },
    {
      icon: <FaShieldAlt className="w-12 h-12 text-teal-600" />,
      title: 'Garantie et services',
      description: 'assurés'
    },
    {
      icon: <FaTruckFast className="w-12 h-12 text-teal-600" />,
      title: 'Livraison rapide',
      description: 'sous 24 ou 72h'
    },
    {
      icon: <FaLock className="w-12 h-12 text-teal-600" />,
      title: 'Paiement',
      description: 'sécurisé'
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.2]" />
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Notre valeur ajoutée
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-8">
            Découvrez nos services exclusifs conçus pour répondre à tous vos besoins
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-white to-teal-50 shadow-lg flex items-center justify-center mb-6 group-hover:shadow-2xl group-hover:bg-gradient-to-br group-hover:from-teal-50 group-hover:to-blue-50 transition-all duration-300 relative">
                <div className="absolute inset-0 bg-white/40 rounded-xl backdrop-blur-sm group-hover:bg-white/0 transition-all duration-300" />
                <div className="relative">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 px-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section Newsletter */}
        <div className="mt-24 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 relative overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5" />
            <div className="relative">
              <div className="flex flex-col items-center text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Abonnez-vous à notre newsletter</h3>
              </div>
              
              <form className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Votre adresse e-mail svp..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  S'ABONNER
                </button>
              </form>
              
              <p className="mt-6 text-xs text-gray-500 leading-relaxed text-center">
                EN SOUMETTANT CE FORMULAIRE, J'ACCEPTE QUE LES DONNÉES RENSEIGNÉES SOIENT UTILISÉES PAR DISTRITHERM SERVICES POUR PERMETTRE DE ME RECONTACTER, DANS LE CADRE DE MA DEMANDE. JE RECONNAIS ÉGALEMENT QUE LES DONNÉES COLLECTÉES SERONT UTILISÉES POUR LA GESTION DE LA RELATION COMMERCIALE (CONFORMÉMENT AU RGPD).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition; 