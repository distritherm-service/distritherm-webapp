import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/productsData';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ProductCategoryGridProps {
  products: Product[];
  category: string;
  subCategory?: string;
}

const ProductCategoryGrid: React.FC<ProductCategoryGridProps> = ({ products, category, subCategory }) => {
  const filteredProducts = products.filter(product => {
    if (subCategory) {
      return product.category === category && product.subCategory === subCategory;
    }
    return product.category === category;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filteredProducts.map((product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            {product.isNew && (
              <span className="absolute top-2 left-2 bg-teal-500 text-white px-2 py-1 text-sm rounded-md">
                Nouveau
              </span>
            )}
            {product.isPromo && (
              <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md">
                Promo
              </span>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{product.brand}</span>
              <span className="text-sm text-gray-500">Réf: {product.reference}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.isPromo ? (
                  <>
                    <span className="text-lg font-bold text-red-500">
                      {product.promoPrice?.toFixed(2)}€
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.price.toFixed(2)}€
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-800">
                    {product.price.toFixed(2)}€
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  aria-label="Ajouter aux favoris"
                >
                  <FaHeart />
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-teal-500 transition-colors"
                  aria-label="Ajouter au panier"
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>

            <Link
              to={`/produit/${product.id}`}
              className="block mt-4 text-center bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              Voir le produit
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductCategoryGrid; 