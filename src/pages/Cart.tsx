import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Breadcrumb from '../components/Breadcrumb';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const formattedTotal = totalPrice.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb />
        <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Votre panier 
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
         
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 md:p-10 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-4">Votre panier est vide</h2>
            <p className="text-gray-500 mb-8">Découvrez nos produits et commencez votre shopping</p>
            <Link 
              to="/nos-produits" 
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" />
              Voir nos produits
              
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center">Votre Panier</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Liste des produits */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-100 text-sm font-medium text-gray-500">
                <div className="col-span-6">Produit</div>
                <div className="col-span-2 text-center">Prix</div>
                <div className="col-span-2 text-center">Quantité</div>
                <div className="col-span-2 text-center">Total</div>
              </div>
              
              {cart.map((item) => {
                const itemTotal = item.price * item.quantity;
                const formattedPrice = item.price.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2
                });
                const formattedItemTotal = itemTotal.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2
                });
                
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-12 p-4 border-b border-gray-100 items-center"
                  >
                    {/* Mobile: Layout vertical */}
                    <div className="md:hidden mb-4">
                      <div className="flex items-center">
                        <div className="w-20 h-20 flex-shrink-0 mr-4">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-lg font-semibold text-teal-600">{formattedPrice}</div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                              aria-label="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <label className="text-sm text-gray-500 mr-2">Quantité:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 py-1 px-2 border border-gray-300 rounded text-center"
                          />
                        </div>
                        <div className="text-lg font-bold">{formattedItemTotal}</div>
                      </div>
                    </div>
                    
                    {/* Desktop: Layout horizontal */}
                    <div className="hidden md:flex md:col-span-6 items-center">
                      <div className="w-16 h-16 flex-shrink-0 mr-4">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-2 text-center">
                      {formattedPrice}
                    </div>
                    <div className="hidden md:flex md:col-span-2 justify-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 py-1 px-2 border border-gray-300 rounded text-center"
                      />
                    </div>
                    <div className="hidden md:flex md:col-span-2 justify-between items-center">
                      <span className="font-semibold">{formattedItemTotal}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              
              <div className="p-4 flex justify-between">
                <button 
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center transition-colors duration-200"
                >
                  <FaTrash className="mr-1" />
                  Vider le panier
                </button>
                <Link 
                  to="/nos-produits"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center transition-colors duration-200"
                >
                  <FaArrowLeft className="mr-1" />
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
          
          {/* Résumé de la commande */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Résumé de la commande</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>Calculée à l'étape suivante</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">TTC</div>
              </div>
              
              <button 
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaCreditCard className="mr-2" />
                Procéder au paiement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 