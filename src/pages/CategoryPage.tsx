import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid } from '@mui/material';
import { products } from '../data/productsData';
import { menuItems } from '../data/menuData';
import ProductCategoryGrid from '../components/ProductCategoryGrid';

const CategoryPage: React.FC = () => {
  const { slug = '', subcategory, level3 } = useParams<{ 
    slug: string;
    subcategory?: string;
    level3?: string;
  }>();

  // Trouver la catégorie dans les données du menu
  const category = menuItems.find(item => item.slug === slug);
  const subCategory = category?.subItems?.find(sub => sub.slug === subcategory);
  const level3Category = subCategory?.level3Items?.find(level3Item => level3Item.slug === level3);

  // Filtrer les produits en fonction des paramètres d'URL
  const filteredProducts = products.filter(product => {
    if (level3 && subcategory) {
      return product.category === slug && 
             product.subCategory === subcategory && 
             product.level3Category === level3;
    } else if (subcategory) {
      return product.category === slug && 
             product.subCategory === subcategory;
    } else {
      return product.category === slug;
    }
  });

  // Construire le titre de la page
  const getPageTitle = () => {
    if (level3Category) {
      return level3Category.title;
    } else if (subCategory) {
      return subCategory.title;
    } else if (category) {
      return category.title;
    }
    return 'Catégorie non trouvée';
  };

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {getPageTitle()}
        </Typography>
        
        {filteredProducts.length > 0 ? (
          <ProductCategoryGrid 
            products={filteredProducts}
            category={slug}
            subCategory={subcategory}
          />
        ) : (
          <Typography variant="body1" color="text.secondary">
            Aucun produit trouvé dans cette catégorie.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CategoryPage; 