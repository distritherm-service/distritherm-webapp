import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useFavorites } from '../../../contexts/FavoritesContext';
import { ProductDetails } from '../../../types/product';
import { products } from '../../../data/products';
import { promotions } from '../../../data/promotions';
import { ProductDetailPresenter } from '../components/ProductDetailPresenter';

export type TabType = 'description' | 'features' | 'specs' | 'documents';

const ProductDetailContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      const foundProduct = products.find(p => p.id === id);

      if (!foundProduct) {
        // Vérifier si c'est une promotion
        const promo = promotions?.find((p: any) => p.id === id);
        
        if (promo) {
          const productDetails: ProductDetails = {
            id: promo.id,
            name: promo.title,
            description: promo.description,
            longDescription: promo.description,
            image: promo.image,
            category: { id: promo.category, name: promo.category },
            // Suppression de la propriété subcategory qui n'existe pas dans le type ProductDetails
            brand: { id: promo.brand, name: promo.brand, logo: `/brands/${promo.brand}.png` },
            price: promo.discountPrice,
            inStock: promo.inStock,
            specifications: [
              { key: 'Catégorie', value: promo.category },
              { key: 'Marque', value: promo.brand },
              { key: 'Code promo', value: promo.code },
              { key: 'Disponibilité', value: promo.inStock ? 'En stock' : 'Rupture de stock' },
              { key: 'Remise', value: `${promo.discountPercentage}%` }
            ],
            documents: [
              {
                id: 'doc1',
                name: `Fiche technique ${promo.title}`,
                type: 'fiche_technique',
                url: '/documents/fiche-technique.pdf'
              },
              {
                id: 'doc2',
                name: 'Manuel d\'installation',
                type: 'manuel',
                url: '/documents/manuel-installation.pdf'
              }
            ],
            features: [
              'Haute performance',
              'Installation professionnelle',
              'Garantie fabricant',
              'Service après-vente'
            ],
            relatedProducts: ['1', '2', '3'],
            warranty: '2 ans pièces et main d\'œuvre',
            dimensions: {
              height: 100,
              width: 60,
              depth: 30,
              weight: 50
            },
            energyClass: 'A+',
            installationRequirements: 'Installation par un professionnel certifié recommandée'
          };
          
          setProduct(productDetails);
        } else {
          navigate('/nos-produits');
        }
      } else {
        const productDetails: ProductDetails = {
          ...foundProduct,
          name: foundProduct.title,
          longDescription: foundProduct.description,
          category: {
            id: foundProduct.category,
            name: foundProduct.category
          },
          brand: {
            id: foundProduct.brand,
            name: foundProduct.brand,
            logo: `/brands/${foundProduct.brand}.png`
          },
          specifications: [
            { key: 'Catégorie', value: foundProduct.category },
            { key: 'Marque', value: foundProduct.brand },
            { key: 'Disponibilité', value: foundProduct.inStock ? 'En stock' : 'Rupture de stock' }
          ],
          documents: [
            {
              id: 'doc1',
              name: `Fiche technique ${foundProduct.title}`,
              type: 'fiche_technique',
              url: '/documents/fiche-technique.pdf'
            },
            {
              id: 'doc2',
              name: 'Manuel d\'installation',
              type: 'manuel',
              url: '/documents/manuel-installation.pdf'
            }
          ],
          features: [
            'Haute performance',
            'Installation professionnelle',
            'Garantie fabricant',
            'Service après-vente'
          ],
          warranty: '2 ans pièces et main d\'œuvre',
          dimensions: {
            height: 100,
            width: 60,
            depth: 30,
            weight: 50
          },
          energyClass: 'A+',
          installationRequirements: 'Installation par un professionnel certifié recommandée'
        };

        setProduct(productDetails);
      }
      
      setIsLoading(false);
    };

    loadProduct();
  }, [id, navigate]);

  const handleQuantityChange = (value: number) => {
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  };

  const handleToggleFavorite = async () => {
    if (!product || isTogglingFavorite) return;

    setIsTogglingFavorite(true);
    try {
      const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
      await toggleFavorite(productId);
    } finally {
      setIsTogglingFavorite(false);
    }
  };
  
  // Convertir l'ID en nombre pour la vérification des favoris
  const productIdAsNumber = product && typeof product.id === 'string' ? parseInt(product.id) : (product?.id || 0);

  return (
    <ProductDetailPresenter
      product={product || undefined}
      isLoading={isLoading}
      quantity={quantity}
      activeTab={activeTab}
      isInCart={product ? isInCart(product.id) : false}
      isFavorite={product ? isFavorite(productIdAsNumber) : false}
      onQuantityChange={handleQuantityChange}
      onAddToCart={handleAddToCart}
      onToggleFavorite={handleToggleFavorite}
      onTabChange={setActiveTab}
      onNavigateBack={() => navigate(-1)}
    />
  );
};

export default ProductDetailContainer; 