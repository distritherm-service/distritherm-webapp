import React from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, title, description, category }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[4/3]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-teal-600 text-white text-sm px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <button className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-2">
            En savoir plus
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="text-gray-400 hover:text-red-500 transition-colors duration-200">
              <FaHeart className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-teal-600 transition-colors duration-200">
              <FaShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 