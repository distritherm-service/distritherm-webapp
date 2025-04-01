import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaPlus, FaMinus, FaShoppingCart, FaInfoCircle, FaTimes, FaEye } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { products } from '../../data/products';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ productId, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const productDetails = products.find(p => p.id === productId);
  
  if (!productDetails) return null;

  // Gestionnaire pour fermer la modal lors d'un clic en dehors
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Effet pour gérer la touche Échap
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Ajouter l'écouteur d'événement
    document.addEventListener('keydown', handleEscapeKey);

    // Nettoyer l'écouteur d'événement
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl my-2 sm:my-4 max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-teal-50">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 line-clamp-2">{productDetails.title}</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none flex-shrink-0 ml-2"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-3 sm:p-6 flex-grow">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
                <div className="md:w-1/2">
                  <div className="bg-gray-50 p-3 sm:p-6 rounded-xl flex items-center justify-center">
                    <img 
                      src={productDetails.image} 
                      alt={productDetails.title} 
                      className="w-full h-auto object-contain rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  
                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                    <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                      productDetails.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full mr-1.5 sm:mr-2 ${
                        productDetails.inStock ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {productDetails.inStock ? 'En stock' : 'Rupture de stock'}
                    </span>
                    
                    <div className="text-xs sm:text-sm text-gray-500">
                      Réf: {productDetails.id}
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-100">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase mb-2">Prix</h4>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {productDetails.price.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">TTC</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Prix HT: {(productDetails.price / 1.2).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center">
                        <span className="w-1 h-4 sm:h-5 bg-blue-500 rounded-full mr-2"></span>
                        Catégorie
                      </h4>
                      <p className="text-sm sm:text-base text-gray-800 pl-3 border-l-2 border-gray-200">{productDetails.category} &gt; {productDetails.subcategory}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center">
                        <span className="w-1 h-4 sm:h-5 bg-blue-500 rounded-full mr-2"></span>
                        Marque
                      </h4>
                      <p className="text-sm sm:text-base text-gray-800 pl-3 border-l-2 border-gray-200">{productDetails.brand}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center">
                        <span className="w-1 h-4 sm:h-5 bg-blue-500 rounded-full mr-2"></span>
                        Description
                      </h4>
                      <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{productDetails.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 sm:p-5 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-end bg-gradient-to-r from-teal-50 to-blue-50">
              <Link 
                to={`/nos-produits/${productDetails.id}`}
                className="w-full sm:w-auto px-4 py-2 mr-0 sm:mr-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium text-center"
              >
                Voir page complète
              </Link>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CartSummary: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);

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

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearCartConfirm(false);
  };

  const openProductDetail = (id: string) => {
    setDetailProductId(id);
  };

  const closeProductDetail = () => {
    setDetailProductId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-gray-900">Articles dans votre panier</h3>
        {cart.length > 0 && (
          <button
            onClick={() => setShowClearCartConfirm(true)}
            className="text-red-600 hover:text-red-800 text-sm sm:text-base flex items-center"
          >
            <FaTrash className="mr-1" />
            <span className="hidden sm:inline">Vider le panier</span>
            <span className="sm:hidden">Vider</span>
          </button>
        )}
      </div>

      {/* Confirmation de suppression du panier */}
      {showClearCartConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-xl">
            <h4 className="text-xl font-medium text-gray-900 mb-3">Confirmer la suppression</h4>
            <p className="text-gray-600 mb-5">Êtes-vous sûr de vouloir vider votre panier ?</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowClearCartConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-md"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail produit */}
      <ProductDetailModal 
        productId={detailProductId || ''} 
        isOpen={!!detailProductId} 
        onClose={closeProductDetail} 
      />

      {cart.length === 0 ? (
        <div className="text-center py-6">
          <FaShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Votre panier est vide</p>
          <Link 
            to="/nos-produits" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base shadow-md"
          >
            Voir nos produits
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 sm:mb-6">
            {cart.map((item) => (
              <div key={item.id} className="border-b border-gray-200 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-shrink-0 w-full sm:w-20 h-20 mb-2 sm:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center rounded-md"
                    />
                  </div>
                  <div className="flex-1 sm:ml-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1">{item.name}</h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                          {item.priceTTC.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </div>
                        <div className="text-xs text-gray-600">
                          Prix HT: {item.priceHT.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-3">
                      <div className="flex items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="h-3 w-3" />
                          </button>
                          <span className="px-2 sm:px-3 text-gray-700 text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                          >
                            <FaPlus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => openProductDetail(item.id)}
                          className="ml-3 text-blue-600 hover:text-blue-800 text-xs bg-blue-50 hover:bg-blue-100 transition-colors rounded-md px-2 py-1 flex items-center"
                        >
                          <FaEye className="mr-1" size={12} />
                          Détails
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      >
                        <FaTrash className="mr-1" size={12} />
                        <span className="hidden sm:inline">Supprimer</span>
                        <span className="sm:hidden">Retirer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total HT:</span>
                <span>{formattedTotalHT}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%):</span>
                <span>{formattedTVA}</span>
              </div>
              <div className="flex justify-between font-medium text-base sm:text-lg pt-2 border-t border-gray-200">
                <span>Total TTC:</span>
                <span>{formattedTotalTTC}</span>
              </div>
            </div>
            
            <div className="mt-4 text-xs sm:text-sm text-gray-500">
              Frais de livraison calculés à l'étape suivante
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary; 