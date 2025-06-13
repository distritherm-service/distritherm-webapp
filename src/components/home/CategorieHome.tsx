import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types/category';
import { categoryService } from '../../services/categoryService';

const CategorieHome: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const mainCategories = await categoryService.getCategories();
        setCategories(mainCategories);
        setApiUnavailable(false);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setApiUnavailable(true);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category.id}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Titre de la section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
              Découvrez notre gamme
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 mt-8 max-w-3xl mx-auto">
            Une offre complète de matériaux et équipements
          </p>
        </div>

        {/* Liste des catégories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007FFF]"></div>
            </div>
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleCategoryClick(category)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Image de fond avec overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.imageUrl || '/images/categories/default.jpg'}
                    alt={category.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Contenu de la carte */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#007FFF] transition-colors duration-300">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
                
                {/* Indicateur de hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg">Aucune catégorie disponible pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorieHome; 