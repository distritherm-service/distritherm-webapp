import React, { useState } from 'react';
import { Product } from '../../types/product';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation lors du clic sur le bouton favoris
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/produit/${product.id}`}>
        <div className="relative pb-[75%]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">
              ({product.reviews} avis)
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">
              {product.price.toFixed(2)} €
            </span>
            <div className="flex gap-2">
              <button 
                onClick={toggleFavorite}
                className="bg-white border border-blue-600 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <FaShoppingCart className="mr-2" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 