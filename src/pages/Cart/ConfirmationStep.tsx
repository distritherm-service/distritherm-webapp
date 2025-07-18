import React, { useState } from 'react';
import { 
  FaFileInvoice, 
  FaCheckCircle, 
  FaShoppingCart, 
  FaEnvelope, 
  FaUser, 
  FaPhone,
  FaPaperPlane,
  FaSpinner,
  FaIdCard
} from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quoteService } from '../../services/quoteService';
import { toast } from 'react-hot-toast';

const ConfirmationStep: React.FC = () => {
  const { cart, localCart, clearCart, getCartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Utiliser les bonnes données selon l'état de connexion
  const cartItems = isAuthenticated && cart ? cart.cartItems : localCart.items;
  const cartId = cart?.id || null;

  // Calculs
  const totalTTC = getCartTotal();
  const totalHT = totalTTC / 1.2; // TVA à 20%
  const TVA = totalTTC - totalHT;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const handleSubmitQuote = async () => {
    if (!user || !cartId) {
      setError('Impossible de créer le devis. Veuillez vous reconnecter.');
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Créer le devis via l'API - seulement avec le cartId
      const response = await quoteService.createQuote({
        cartId: cartId
      });
      
      // Afficher le succès
      setQuoteNumber(`#${response.devis.id}`);
      setShowSuccess(true);
      toast.success('Votre demande de devis a été envoyée avec succès !');
      
      // Vider le panier après 3 secondes et rediriger
      setTimeout(() => {
        clearCart();
        navigate('/mes-devis');
      }, 3000);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'envoi de votre demande de devis.');
      setShowError(true);
      toast.error(error.message || 'Erreur lors de l\'envoi du devis');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <FaCheckCircle className="text-5xl text-green-500" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Demande de devis envoyée !
        </h2>
        
        <p className="text-lg text-gray-600 mb-2">
          Votre demande de devis <span className="font-semibold text-[#007FFF]">{quoteNumber}</span> a été envoyée avec succès.
        </p>
        
        <p className="text-gray-500 mb-8">
          Notre équipe commerciale vous contactera dans les plus brefs délais.
        </p>
        
        <div className="animate-pulse text-sm text-gray-400">
          Redirection vers vos devis...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* En-tête */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-[#007FFF] bg-opacity-10 rounded-full">
            <FaFileInvoice className="text-2xl text-[#007FFF]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Confirmation de votre demande de devis</h2>
            <p className="text-gray-600">Vérifiez les informations avant l'envoi</p>
          </div>
        </div>

        {/* Informations client */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 flex items-center">
            <FaUser className="mr-2 text-[#007FFF]" />
            Vos informations
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Nom :</span> {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email :</span> {user?.email}
              </p>
            </div>
            <div className="space-y-2">
              {user?.phoneNumber && (
                <p className="text-sm flex items-center">
                  <FaPhone className="mr-2 text-gray-400 text-xs" />
                  <span className="font-medium">Téléphone :</span> {user.phoneNumber}
                </p>
              )}
              {user?.siretNumber && (
                <p className="text-sm flex items-center">
                  <FaIdCard className="mr-2 text-gray-400 text-xs" />
                  <span className="font-medium">SIRET :</span> {user.siretNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Récapitulatif du panier */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="font-semibold text-gray-700 flex items-center mb-4">
          <FaShoppingCart className="mr-2 text-[#007FFF]" />
          Récapitulatif de votre demande
        </h3>

        <div className="space-y-4">
          {cartItems.map((item, index) => {
            // Déterminer si c'est un CartItem ou LocalCartItem
            const isCartItem = 'product' in item;
            const itemId = isCartItem ? item.id : item.productId;
            const itemName = isCartItem ? item.product.name : item.name;
            const itemPrice = item.priceTtc;
            
            return (
              <div key={itemId || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">
                    {itemName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Quantité : {item.quantity} × {itemPrice.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  {(itemPrice * item.quantity).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
              </div>
            );
          })}
        </div>

        {/* Totaux */}
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total HT</span>
            <span className="font-medium">{totalHT.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">TVA (20%)</span>
            <span className="font-medium">{TVA.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total TTC</span>
            <span className="text-[#007FFF]">{totalTTC.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}</span>
          </div>
        </div>
      </motion.div>

      {/* Message d'erreur */}
      {showError && error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
        >
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
        </motion.div>
      )}

      {/* Bouton d'envoi */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center"
      >
        <button
          onClick={handleSubmitQuote}
          disabled={isSubmitting || !cartId}
          className={`
            relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
            ${(isSubmitting || !cartId)
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#007FFF] to-blue-600 hover:from-blue-600 hover:to-[#007FFF] text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          <span className="flex items-center space-x-3">
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <FaPaperPlane />
                <span>Envoyer ma demande de devis</span>
              </>
            )}
          </span>
          
          {!isSubmitting && cartId && (
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
          )}
        </button>
      </motion.div>

      {/* Note d'information */}
      <motion.div 
        variants={itemVariants}
        className="text-center"
      >
        <p className="text-sm text-gray-500 bg-blue-50 rounded-lg p-4 inline-block">
          <FaFileInvoice className="inline mr-2 text-[#007FFF]" />
          Votre demande sera traitée par notre équipe commerciale dans un délai de 24 à 48 heures.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationStep; 