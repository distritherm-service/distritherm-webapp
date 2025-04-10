import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { Product } from '../data/products';
import FavoriteButton from './FavoriteButton';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { title, description, image, category, subcategory, brand, price } = product;
  const inStock = product.stock > 0;
  const featured = product.isNew || product.isPromo || false;
  const { addToCart, isInCart } = useCart();
  const [showNotification, setShowNotification] = useState<string | null>(null);
  
  // Calculer le prix HT (en supposant que le prix actuel est TTC)
  const prixTTC = price;
  const prixHT = price / 1.2; // TVA à 20%
  
  const formattedPriceHT = prixHT.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
  const formattedPriceTTC = prixTTC.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });

  const handleAddToCart = () => {
    if (!inStock) return;
    
    addToCart({
      id: product.id,
      name: product.title,
      price: price,
      image: product.image,
      quantity: 1
    });
    
    showToast("Produit ajouté au panier");
  };
  
  const showToast = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 2000);
  };

  const productInCart = isInCart(product.id);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col relative">
      {/* Toast notification */}
      {showNotification && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in-down">
          {showNotification}
        </div>
      )}
      
      <div className="relative aspect-[4/3]">
        <img 
          src={image.startsWith('http') ? image : `/image-produit-defaut.jpeg`}
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `/image-produit-defaut.jpeg`;
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
              {product.isNew ? 'Nouveau' : 'Promotion'}
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
          <div className="space-y-1 mb-4">
            <div className="text-2xl font-bold text-teal-600">{formattedPriceTTC}</div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Prix HT:</div>
              <div className="text-sm font-semibold">{formattedPriceHT}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Prix TTC:</div>
              <div className="text-sm font-semibold">{formattedPriceTTC}</div>
            </div>
          </div>
          
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
                onClick={handleAddToCart}
                className={`${!inStock ? 'opacity-50 cursor-not-allowed text-gray-400' : 
                  productInCart ? 'text-green-500' : 'text-gray-400 hover:text-teal-600'} 
                  transition-colors duration-200`}
                disabled={!inStock}
                aria-label="Ajouter au panier"
              >
                {productInCart ? <FaCheck className="w-5 h-5" /> : <FaShoppingCart className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 