import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format';

interface CartPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

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
                {cart.length} {cart.length > 1 ? 'articles' : 'article'}
              </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-4 text-center">
                <FaShoppingCart className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">Votre panier est vide</p>
              </div>
            ) : (
              <div className="py-2">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <button
                onClick={handleViewCart}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FaShoppingCart className="h-5 w-5" />
                <span>Voir mon panier</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartPreview; 