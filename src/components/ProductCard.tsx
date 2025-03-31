import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { Product } from '../data/products';
import FavoriteButton from './FavoriteButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { title, description, image, category, subcategory, brand, price, inStock, featured } = product;
  
  const formattedPrice = price.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="relative aspect-[4/3]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://via.placeholder.com/400x300?text=Distritherm';
          }}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-teal-600 text-white text-sm px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
        
        {featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-amber-500 text-white text-sm px-3 py-1 rounded-full">
              Produit vedette
            </span>
          </div>
        )}
        
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12">
              Rupture de stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm font-semibold text-indigo-600">{brand}</span>
          <span className="text-xs text-gray-500">{subcategory}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>
        
        <div className="mt-auto">
          <div className="text-2xl font-bold text-teal-600 mb-4">{formattedPrice}</div>
          
          <div className="flex justify-between items-center">
            <Link 
              to={`/nos-produits/${product.id}`}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-2"
            >
              En savoir plus
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <div className="flex gap-3">
              <FavoriteButton
                item={product}
                type="product"
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              />
              <button 
                className={`text-gray-400 hover:text-teal-600 transition-colors duration-200 ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!inStock}
                aria-label="Ajouter au panier"
              >
                <FaShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 