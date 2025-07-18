import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaTrash, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import OrderTabs from './OrderTabs';
import CartSummary from './CartSummary';
import ConfirmationStep from './ConfirmationStep';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../../components/navigation/Breadcrumb';
// import Slider from '../../components/Slider';
import Footer from '../../components/layout/Footer';
import BrandsSection from '../../components/home/BrandsSection';
import { motion } from 'framer-motion';
import Connexion from '../Connexion';

const Cart: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { cart, localCart, getCartItemCount, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Utiliser les bonnes données selon l'état de connexion
  const cartItems = isAuthenticated && cart ? cart.cartItems : localCart.items;
  const isEmpty = cartItems.length === 0;
  const totalAmount = getCartTotal();
  const itemCount = getCartItemCount();

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  };

  const handleNextStep = () => {
    // Si on est sur le récapitulatif (tab 0)
    if (activeTab === 0) {
      // Si l'utilisateur est connecté, passer directement à la demande de devis (tab 2)
      // Sinon, aller à la connexion (tab 1)
      setActiveTab(isAuthenticated ? 2 : 1);
    } 
    // Si on est sur la connexion (tab 1), aller à la demande de devis (tab 2)
    else if (activeTab === 1) {
      setActiveTab(2);
    }
  };

  const handlePreviousStep = () => {
    // Si on est sur la demande de devis (tab 2)
    if (activeTab === 2) {
      // Si l'utilisateur est connecté, retourner au récapitulatif (tab 0)
      // Sinon, retourner à la connexion (tab 1)
      setActiveTab(isAuthenticated ? 0 : 1);
    }
    // Si on est sur la connexion (tab 1), retourner au récapitulatif (tab 0)
    else if (activeTab === 1) {
      setActiveTab(0);
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
        <div className="flex-grow">
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

        <div className="bg-gray-50 py-8 sm:py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8"
          >
            
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

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed"
              >
                Découvrez notre large gamme de produits et commencez vos achats dès maintenant
              </motion.p>

              {/* Bouton d'action principal */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link 
                  to="/nos-produits" 
                  className="inline-flex items-center bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
                >
                  <FaArrowLeft className="mr-2 sm:mr-3" />
                  Découvrir nos produits
                </Link>
              </motion.div>

              {/* Animation de points */}
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* En-tête du panier */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Mon Panier ({itemCount} {itemCount > 1 ? 'articles' : 'article'})
                </h2>
                <p className="text-gray-600">
                  Total: <span className="font-semibold text-teal-600">{formatPrice(totalAmount)}</span>
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Link
                  to="/nos-produits"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                >
                  <FaArrowLeft className="mr-2" />
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>

                     {/* Onglets de navigation */}
           <OrderTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Contenu de l'étape active */}
          <div className="mt-8">
            {renderStepContent()}
          </div>

          {/* Navigation entre les étapes */}
          {!isEmpty && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              {activeTab > 0 && (
                <button
                  onClick={handlePreviousStep}
                  className="flex items-center justify-center py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Étape précédente
                </button>
              )}
              
              <div className="sm:ml-auto">
                {activeTab < 2 && (
                  <button
                    onClick={handleNextStep}
                    className="w-full sm:w-auto flex items-center justify-center py-3 px-6 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
                  >
                    {activeTab === 0 
                      ? (isAuthenticated ? 'Demander un devis' : 'Continuer') 
                      : 'Finaliser la commande'}
                    <FaCreditCard className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <BrandsSection />
      <Footer />
    </div>
  );
};

export default Cart; 