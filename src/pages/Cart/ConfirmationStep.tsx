import React, { useState } from 'react';
import { 
  FaFileInvoice, 
  FaCheckCircle, 
  FaShoppingCart, 
  FaEnvelope, 
  FaUser, 
  FaBuilding, 
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
import Toast from '../../components/notifications/Toast';

const ConfirmationStep: React.FC = () => {
  const { cart, cartId, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Calculs
  const totalTTC = cart.reduce((sum, item) => sum + (item.price || item.priceTTC) * item.quantity, 0);
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
      // Créer le devis via l'API
      // L'API assignera automatiquement un commercial côté serveur
      const response = await quoteService.createQuote({
        cartId: cartId,
        commercialId: 1 // ID temporaire, sera remplacé côté serveur par le commercial assigné
      });
      
      // Afficher le succès
      setQuoteNumber(`#${response.devis.id}`);
      setShowSuccess(true);
      
      // Vider le panier après 3 secondes et rediriger
      setTimeout(() => {
        clearCart();
        navigate('/mes-devis');
      }, 3000);
      
    } catch (error: any) {
     // console.error('Erreur lors de l\'envoi du devis:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'envoi de votre demande de devis.');
      setShowError(true);
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
      className="space-y-6"
    >
      {/* Toast pour les erreurs */}
      {showError && error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setShowError(false)}
        />
      )}

      {/* Récapitulatif de la commande */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#007FFF] to-blue-600 rounded-xl flex items-center justify-center mr-4">
            <FaShoppingCart className="text-white text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Récapitulatif de votre demande</h3>
        </div>
        
        {/* Liste des produits */}
        <div className="space-y-4 mb-6">
          {cart.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center p-2">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">
                  {((item.price || item.priceTTC) * item.quantity).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {(item.price || item.priceTTC).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })} / unité
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Totaux */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Sous-total HT</span>
            <span>{totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>TVA (20%)</span>
            <span>{TVA.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-gray-200">
            <span>Total TTC</span>
            <span className="text-[#007FFF]">
              {totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Informations client */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
            <FaUser className="text-white text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Vos informations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaBuilding className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Entreprise</p>
                <p className="font-semibold text-gray-800">{user?.companyName || user?.client?.companyName || 'Non renseigné'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-semibold text-gray-800">{user?.phoneNumber || 'Non renseigné'}</p>
              </div>
            </div>
            
            {(user?.siretNumber || user?.client?.siretNumber) && (
              <div className="flex items-center space-x-3">
                <FaIdCard className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">SIRET</p>
                  <p className="font-semibold text-gray-800">{user?.siretNumber || user?.client?.siretNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bouton de soumission */}
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