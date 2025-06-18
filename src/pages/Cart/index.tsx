import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaTrash, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import OrderTabs from './OrderTabs';
import CartSummary from './CartSummary';
import ConfirmationStep from './ConfirmationStep';
import { useCart } from '../../contexts/CartContext';
import Breadcrumb from '../../components/navigation/Breadcrumb';
// import Slider from '../../components/Slider';
import Footer from '../../components/layout/Footer';
import BrandsSection from '../../components/home/BrandsSection';
import { motion } from 'framer-motion';
import Connexion from '../../pages/Connexion';

const Cart: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const isEmpty = cart.length === 0;

  const totalTTC = cart.reduce((sum, item) => sum + (item.priceTTC * item.quantity), 0);
  const totalHT = cart.reduce((sum, item) => sum + (item.priceHT * item.quantity), 0);
  
  const formattedTotalTTC = totalTTC.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
  const formattedTotalHT = totalHT.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
  const tva = totalTTC - totalHT;
  const formattedTVA = tva.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });

  const handleNextStep = () => {
    if (activeTab < 2) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const renderStepContent = () => {
    switch (activeTab) {
      case 0:
        return <CartSummary />;
      case 1:
        return <Connexion inCart={true} onSuccess={handleNextStep} />;
      case 2:
        return <ConfirmationStep />;
      default:
        return <CartSummary />;
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Slider showOnPages={['/panier']} /> */}
        <div className="lex-grow">
        <section className="relative h-64 md:h-80 lg:h-[420px] w-full overflow-hidden shadow-md">
          {/* Image d'arrière-plan */}
          <div className="absolute inset-0">
            <img
              src="/icone/image-panier.png"
              alt="Recrutement Distritherm Services"
              className="w-full h-full object-cover object-center"
            />
            {/* Voile sombre en dégradé pour une meilleure lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm" />
          </div>

          {/* Contenu : Titre + Breadcrumb */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">Votre panier</h1>
            <br />
            <Breadcrumb />
          </div>

          {/* Ombre courbée en bas */}
          <div className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2">
            <svg viewBox="0 0 1600 100" className="w-full h-6 md:h-8" preserveAspectRatio="none">
              <path d="M0,0 C600,100 1000,100 1600,0 L1600,100 L0,100 Z" fill="#f8f9ff"/>
            </svg>
          </div>
        </section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center overflow-hidden"
          >
            {/* Gradient background decoratif */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"></div>
            
            {/* Cercles décoratifs en arrière-plan */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full opacity-15"></div>
            
            <div className="relative z-10">
              {/* Icône animée avec arrière-plan stylé */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mx-auto mb-6 sm:mb-8"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-teal-50 to-blue-50 rounded-full flex items-center justify-center shadow-lg border border-teal-100">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  >
                    <FaShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
                  </motion.div>
                </div>
                {/* Points décoratifs autour de l'icône */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
              </motion.div>

              {/* Titre avec gradient */}
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4"
              >
                <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Votre panier est vide
                </span>
              </motion.h2>

              {/* Description avec style amélioré */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-600 mb-8 sm:mb-10 text-base sm:text-lg max-w-md mx-auto leading-relaxed"
              >
                Explorez notre catalogue et découvrez des produits 
                <span className="font-medium text-teal-600"> exceptionnels</span> qui vous attendent
              </motion.p>

              {/* Bouton call-to-action amélioré */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link 
                  to="/nos-produits" 
                  className="group relative inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                  <FaArrowLeft className="mr-3 transition-transform group-hover:-translate-x-1" />
                  <span className="relative">Découvrir nos produits</span>
                  
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse rounded-xl"></div>
                </Link>
              </motion.div>

              {/* Indicateurs décoratifs */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 flex justify-center space-x-2"
              >
                <div className="w-2 h-2 bg-teal-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce delay-200"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <BrandsSection />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
      
      <div className="bg-gray-50 pb-8 sm:pb-16">
      <section className="relative h-64 md:h-80 lg:h-[420px] w-full overflow-hidden shadow-md">
          {/* Image d'arrière-plan */}
          <div className="absolute inset-0">
            <img
              src="/icone/image-panier.png"
              alt="Recrutement Distritherm Services"
              className="w-full h-full object-cover object-center"
            />
            {/* Voile sombre en dégradé pour une meilleure lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm" />
          </div>

          {/* Contenu : Titre + Breadcrumb */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">Votre panier</h1>
            <br />
            <Breadcrumb />
          </div>

          {/* Ombre courbée en bas */}
          <div className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2">
            <svg viewBox="0 0 1600 100" className="w-full h-6 md:h-8" preserveAspectRatio="none">
              <path d="M0,0 C600,100 1000,100 1600,0 L1600,100 L0,100 Z" fill="#f8f9ff"/>
            </svg>
          </div>
        </section>

        <div className="container mx-auto px-3 sm:px-4 p-20">
          {/* Tabs */}
          <OrderTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Current step content */}
          <div className="mb-6 sm:mb-8">
            {renderStepContent()}
          </div>

          {/* Bottom navigation buttons */}
          {activeTab > 0 && activeTab < 2 && !isEmpty && (
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <button
                onClick={handlePreviousStep}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-300 ease-in-out text-sm sm:text-base"
              >
                Étape précédente
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out text-sm sm:text-base"
              >
                Continuer
              </button>
            </div>
          )}

          {activeTab === 0 && !isEmpty && (
            <div className="flex justify-end">
              <button
                onClick={handleNextStep}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out text-sm sm:text-base"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Section des marques */}
      <BrandsSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Cart; 