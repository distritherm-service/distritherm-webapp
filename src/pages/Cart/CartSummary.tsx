import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaPlus, FaMinus, FaShoppingCart, FaInfoCircle, FaTimes, FaEye, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const CartSummary: React.FC = () => {
  const { cart, localCart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  // Utiliser le bon panier selon l'état de connexion
  const cartItems = isAuthenticated && cart ? cart.cartItems : localCart.items;
  const totalAmount = getCartTotal();

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity >= 1 && isAuthenticated && cart) {
      setUpdatingItemId(itemId);
      await updateQuantity(itemId, newQuantity);
      setUpdatingItemId(null);
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    if (isAuthenticated && cart) {
      setRemovingItemId(itemId);
      await removeFromCart(itemId);
      setRemovingItemId(null);
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearCartConfirm(false);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Articles dans votre panier</h3>
          <p className="text-sm text-gray-600 mt-1">
            {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
          </p>
        </div>
        {cartItems.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowClearCartConfirm(true)}
            className="text-red-500 hover:text-red-700 text-sm sm:text-base flex items-center gap-2 transition-all duration-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
          >
            <FaTrash className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Vider le panier</span>
            <span className="sm:hidden font-medium">Vider</span>
          </motion.button>
        )}
      </div>

      {/* Confirmation de suppression du panier */}
      <AnimatePresence>
        {showClearCartConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Vider le panier ?</h4>
                <p className="text-gray-600 mb-6">
                  Cette action supprimera tous les articles de votre panier. Êtes-vous sûr ?
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowClearCartConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-all duration-200"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearCart}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
                >
                  Vider le panier
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Découvrez notre large sélection de produits et commencez vos achats
          </p>
          <Link
            to="/nos-produits"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaArrowLeft className="w-4 h-4" />
            Explorer nos produits
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Liste des articles */}
          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {cartItems.map((item) => {
                // Adapter selon le type d'item (API vs local)
                const isCartItem = 'product' in item;
                const displayName = isCartItem ? item.product.name : item.name;
                const displayPrice = isCartItem ? item.priceTtc : item.priceTtc;
                const displayImage = isCartItem 
                  ? (item.product.imagesUrl?.[0] || '/image-produit-defaut.jpeg')
                  : item.image;
                const itemId = isCartItem ? item.id : item.productId;
                const productId = isCartItem ? item.productId : item.productId;

                return (
                  <motion.div
                    key={`${isCartItem ? 'cart' : 'local'}-${itemId}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group bg-gray-50 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image du produit */}
                      <div className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
                        <img
                          src={displayImage}
                          alt={displayName}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/image-produit-defaut.jpeg';
                          }}
                        />
                      </div>

                      {/* Détails du produit */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 pr-4">
                            <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-teal-600 transition-colors">
                              {displayName}
                            </h4>
                            {isCartItem && item.product.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {item.product.description}
                              </p>
                            )}
                          </div>
                          <p className="text-xl font-bold text-teal-600 whitespace-nowrap">
                            {formatPrice(displayPrice)}
                          </p>
                        </div>

                        {/* Contrôles et actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          
                          {/* Contrôles de quantité */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">Quantité :</span>
                            
                            {isAuthenticated && cart ? (
                              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || removingItemId === itemId || updatingItemId === itemId}
                                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                  <FaMinus className="w-3 h-3" />
                                </motion.button>
                                
                                <span className="text-base font-semibold w-14 text-center py-2 bg-white">
                                  {updatingItemId === itemId ? (
                                    <div className="w-4 h-4 mx-auto animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
                                  ) : (
                                    item.quantity
                                  )}
                                </span>
                                
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                                  disabled={removingItemId === itemId || updatingItemId === itemId}
                                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                  <FaPlus className="w-3 h-3" />
                                </motion.button>
                              </div>
                            ) : (
                              <span className="text-base font-semibold px-4 py-2 bg-gray-100 rounded-lg">
                                {item.quantity}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            
                            {/* Voir le détail du produit */}
                            <Link
                              to={`/produit/${productId}`}
                              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200 hover:underline"
                            >
                              <FaEye className="w-4 h-4" />
                              Détails
                            </Link>

                            {/* Supprimer le produit (seulement pour utilisateurs connectés) */}
                            {isAuthenticated && cart && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRemoveFromCart(itemId)}
                                disabled={removingItemId === itemId}
                                className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-all duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg disabled:opacity-50"
                              >
                                {removingItemId === itemId ? (
                                  <>
                                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                                    <span>Suppression...</span>
                                  </>
                                ) : (
                                  <>
                                    <FaTrash className="w-4 h-4" />
                                    <span>Retirer</span>
                                  </>
                                )}
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Total pour cet article */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Sous-total ({item.quantity} article{item.quantity > 1 ? 's' : ''})
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(displayPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Résumé des totaux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200"
          >
            <div className="space-y-3">
              {isAuthenticated && cart && (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>Total HT</span>
                    <span className="font-medium">{formatPrice(totalAmount / 1.2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA (20%)</span>
                    <span className="font-medium">{formatPrice(totalAmount - (totalAmount / 1.2))}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                <span>Total TTC</span>
                <span className="text-2xl text-teal-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>
            
            {/* Badges de garantie */}
            
          </motion.div>

          {/* Message pour les utilisateurs non connectés */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Connectez-vous pour continuer</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Pour modifier les quantités, supprimer des articles et finaliser votre commande, veuillez vous connecter ou créer un compte.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CartSummary; 