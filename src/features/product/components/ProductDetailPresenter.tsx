import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ProductDetails } from '../../../types/product';
import Breadcrumb from '../../../components/Breadcrumb';
import { Spinner } from '../../../components/Spinner';

export type TabType = 'description' | 'features' | 'specs' | 'documents';

interface ProductDetailPresenterProps {
  product: ProductDetails | undefined;
  isLoading: boolean;
  quantity: number;
  activeTab: TabType;
  isInCart: boolean;
  isFavorite: boolean;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  onTabChange: (tab: TabType) => void;
  onNavigateBack: () => void;
}

export const ProductDetailPresenter: React.FC<ProductDetailPresenterProps> = ({
  product,
  isLoading,
  quantity,
  activeTab,
  isInCart,
  isFavorite,
  onQuantityChange,
  onAddToCart,
  onToggleFavorite,
  onTabChange,
  onNavigateBack,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Breadcrumb />
      <main className="container mx-auto px-4 py-8">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Image du produit */}
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover rounded-lg"
                  />
                </div>

                {/* Informations du produit */}
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <button
                      onClick={onToggleFavorite}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isFavorite ? (
                        <FaHeart className="w-6 h-6 text-[#007FFF]" />
                      ) : (
                        <FaRegHeart className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">{product.price} €</span>
                    <span className="ml-2 text-sm text-gray-500">HT</span>
                  </div>

                  <p className="text-gray-700">{product.description}</p>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => onQuantityChange(quantity - 1)}
                          className="px-3 py-1 border-r hover:bg-gray-100"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => onQuantityChange(parseInt(e.target.value))}
                          className="w-16 text-center border-none focus:ring-0"
                          min="1"
                          max="99"
                        />
                        <button
                          onClick={() => onQuantityChange(quantity + 1)}
                          className="px-3 py-1 border-l hover:bg-gray-100"
                          disabled={quantity >= 99}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={onAddToCart}
                        className="flex-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </div>

                  {/* Caractéristiques */}
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="border-t border-gray-200 pt-6">
                      <h2 className="text-lg font-semibold mb-4">Caractéristiques</h2>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        {product.specifications.map((spec) => (
                          <div key={spec.key} className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">{spec.key}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {/* Documents */}
                  {product.documents && product.documents.length > 0 && (
                    <div className="border-t border-gray-200 pt-6">
                      <h2 className="text-lg font-semibold mb-4">Documents</h2>
                      <ul className="space-y-2">
                        {product.documents.map((doc) => (
                          <li key={doc.id}>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#007FFF] hover:underline flex items-center"
                            >
                              {doc.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Description longue */}
              {product.longDescription && (
                <div className="border-t border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Description détaillée</h2>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.longDescription }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 