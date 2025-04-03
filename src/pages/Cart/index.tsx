import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaTrash, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import OrderTabs from './OrderTabs';
import CartSummary from './CartSummary';
import DeliveryStep from './DeliveryStep';
import ConfirmationStep from './ConfirmationStep';
import { useCart } from '../../contexts/CartContext';
import Breadcrumb from '../../components/Breadcrumb';
import Slider from '../../components/Slider';
import Footer from '../../components/Footer';
import BrandsSection from '../../components/BrandsSection';
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
    if (activeTab < 3) {
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
        return <Connexion inCart={true} />;
      case 2:
        return <DeliveryStep />;
      case 3:
        return <ConfirmationStep />;
      default:
        return <CartSummary />;
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Slider showOnPages={['/panier']} />
        <Breadcrumb />
        <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Votre panier 
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
        
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-10 text-center">
            <div className="mb-4 sm:mb-6">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-3 sm:mb-4">Votre panier est vide</h2>
            <p className="text-gray-500 mb-6 sm:mb-8">Découvrez nos produits et commencez votre shopping</p>
            <Link 
              to="/nos-produits" 
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" />
              Voir nos produits
            </Link>
          </div>
        </div>
        <BrandsSection />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Slider showOnPages={['/panier']} />
      
      <div className="bg-gray-50 pb-8 sm:pb-16">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Breadcrumb */}
          <Breadcrumb />
          
          <div className="text-center mb-8 sm:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Votre panier
              </span>
              <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-4 sm:mt-8">
                Récapitulatif de la commande
            </p>
          </div>

          {/* Tabs */}
          <OrderTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Current step content */}
          <div className="mb-6 sm:mb-8">
            {renderStepContent()}
          </div>

          {/* Bottom navigation buttons */}
          {activeTab > 0 && activeTab < 3 && !isEmpty && (
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <button
                onClick={handlePreviousStep}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Étape précédente
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Continuer
              </button>
            </div>
          )}

          {activeTab === 0 && !isEmpty && (
            <div className="flex justify-end">
              <button
                onClick={handleNextStep}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
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