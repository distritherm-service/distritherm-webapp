import React from 'react';
import { ProductSpecification } from '../types/product';

interface ProductSpecificationsProps {
  specifications: ProductSpecification[];
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Spécifications techniques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">{spec.key}</p>
              <p className="text-base font-semibold text-gray-900">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications; 