import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface CartPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ isOpen, onClose }) => {
  const { cart, localCart, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  // Déterminer quels items afficher selon l'état de connexion
  const cartItems = isAuthenticated && cart ? cart.cartItems : localCart.items;
  const totalAmount = getCartTotal();
  const itemCount = getCartItemCount();

  // Détecter si la navbar est cachée
  useEffect(() => {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const hasHiddenClass = navbar.classList.contains('nav-hidden');
          setIsNavbarHidden(hasHiddenClass);
        }
      });
    });

    observer.observe(navbar, { attributes: true });
    
    // Vérification initiale
    setIsNavbarHidden(navbar.classList.contains('nav-hidden'));

    return () => observer.disconnect();
  }, []);

  const handleViewCart = () => {
    navigate('/panier');
    onClose();
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    if (isAuthenticated && cart) {
      await updateQuantity(itemId, newQuantity);
    }
    // Pour les utilisateurs non connectés, on ne peut pas modifier ici
    // car on n'a que l'ID produit, pas l'ID item de panier
  };

  const handleRemoveItem = async (itemId: number) => {
    if (isAuthenticated && cart) {
      await removeFromCart(itemId);
    }
    // Pour les utilisateurs non connectés, rediriger vers le panier complet
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`w-96 bg-white rounded-lg shadow-xl z-[9999] ${
            isNavbarHidden 
              ? 'fixed top-4 right-4' 
              : 'absolute right-0 mt-2'
          }`}
          onMouseLeave={onClose}
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Mon Panier</h3>
              <span className="text-sm text-gray-500">
                {itemCount} {itemCount > 1 ? 'articles' : 'article'}
              </span>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-4">Votre panier est vide</p>
                <button
                  onClick={onClose}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => {
                  // Adapter l'affichage selon le type d'item (cart API vs local)
                  const isCartItem = 'product' in item; // Item du panier API
                  const displayName = isCartItem ? item.product.name : item.name;
                  const displayPrice = isCartItem ? item.priceTtc : item.priceTtc;
                  const displayImage = isCartItem 
                    ? (item.product.imagesUrl?.[0] || '/image-produit-defaut.jpeg')
                    : item.image;
                  const itemId = isCartItem ? item.id : item.productId;

                  return (
                    <div key={`${isCartItem ? 'cart' : 'local'}-${itemId}`} className="flex items-center space-x-3">
                      <img
                        src={displayImage}
                        alt={displayName}
                        className="w-12 h-12 object-cover rounded-md border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/image-produit-defaut.jpeg';
                        }}
                      />
                      
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {displayName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {displayPrice.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isAuthenticated && cart ? (
                          <>
                            <button
                              onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md hover:border-gray-400"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md hover:border-gray-400"
                            >
                              +
                            </button>
                            
                            <button
                              onClick={() => handleRemoveItem(itemId)}
                              className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <span className="text-sm font-medium px-2">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-teal-600">
                  {totalAmount.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              
              <button
                onClick={handleViewCart}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors duration-200 font-medium"
              >
                Voir le panier
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartPreview; 