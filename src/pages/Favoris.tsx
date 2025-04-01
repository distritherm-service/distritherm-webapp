import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Slider from '../components/Slider';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import { Product } from '../data/products';
import { Promotion } from '../data/promotions';
import { useCart } from '../contexts/CartContext';  

const Favoris: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart, isInCart } = useCart();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getItemName = (item: Product | Promotion): string => {
    return 'name' in item && typeof item.name === 'string' 
      ? item.name 
      : (item as Promotion).title;
  };

  const getItemPrice = (item: Product | Promotion): string => {
    if ('price' in item) {
      return `${(item as Product).price.toFixed(2)} €`;
    }
    const promotion = item as Promotion;
    return `${promotion.discountPrice.toFixed(2)} €`;
  };

  const handleAddToCart = (item: Product | Promotion) => {
    addToCart({
      id: item.id,
      name: getItemName(item),
      price: 'price' in item ? item.price : (item as Promotion).discountPrice,
      image: item.image,
      quantity: 1
    });
  };

  return (
    <>
      <Slider />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 relative inline-block text-center">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Mes Favoris
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
            <FaHeart className="text-teal-600 w-8 h-8" />
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <FaHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-600 mb-2">
                Vous n'avez pas encore de favoris
              </h2>
              <p className="text-gray-500 mb-6">
                Explorez nos produits et promotions pour en ajouter !
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/nos-produits"
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                >
                  Voir les produits
                </Link>
                <Link
                  to="/promotions"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Voir les promotions
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favorites.map((favorite) => (
                <motion.div
                  key={favorite.id}
                  variants={item}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative">
                    <img
                      src={favorite.item.image}
                      alt={getItemName(favorite.item)}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <button
                      onClick={() => removeFromFavorites(favorite.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200 group"
                    >
                      <FaTrash className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        favorite.type === 'product'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {favorite.type === 'product' ? 'Produit' : 'Promotion'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {getItemPrice(favorite.item)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {getItemName(favorite.item)}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {favorite.item.description.slice(0, 100)}...
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={favorite.type === 'product' ? `/nos-produits/${favorite.id}` : `/promotions/${favorite.id}`}
                        className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        Voir les détails
                      </Link>
                      <button
                        onClick={() => handleAddToCart(favorite.item)}
                        disabled={isInCart(favorite.id)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                          isInCart(favorite.id)
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-teal-600 text-white hover:bg-teal-700'
                        }`}
                      >
                        <FaShoppingCart className="w-4 h-4" />
                        {isInCart(favorite.id) ? 'Dans le panier' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Favoris; 