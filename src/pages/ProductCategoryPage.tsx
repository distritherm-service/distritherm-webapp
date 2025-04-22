import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/productsData';
import ProductCategoryGrid from '../components/ProductCategoryGrid';
import { menuItems } from '../data/menuData';

const ProductCategoryPage: React.FC = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();

  // Trouver le titre de la catégorie à partir des données du menu
  const findCategoryTitle = () => {
    const menuItem = menuItems.find(item => item.slug === category);
    if (!subcategory) return menuItem?.title;

    const subItem = menuItem?.subItems?.find(sub => sub.slug === subcategory);
    return subItem?.title;
  };

  const categoryTitle = findCategoryTitle();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {categoryTitle || 'Catégorie non trouvée'}
        </h1>
        <nav className="text-sm text-gray-500">
          <span>Accueil</span>
          <span className="mx-2">/</span>
          <span>Produits</span>
          <span className="mx-2">/</span>
          <span className="text-teal-600">{categoryTitle}</span>
          {subcategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-teal-600">{findCategoryTitle()}</span>
            </>
          )}
        </nav>
      </div>

      {category && (
        <ProductCategoryGrid
          products={products}
          category={category}
          subCategory={subcategory}
        />
      )}

      {!category && (
        <div className="text-center py-12">
          <h2 className="text-2xl text-gray-600">
            Catégorie non trouvée
          </h2>
          <p className="mt-4 text-gray-500">
            Veuillez sélectionner une catégorie valide dans le menu.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryPage; 