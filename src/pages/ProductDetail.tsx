import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaRuler, FaWeight, FaBox, FaChevronRight, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '../components/navigation/Breadcrumb';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { getProductById, Product, getProducts } from '../services/productService';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import Layout from '../components/layout/Layout';

// Utilisation du lazy loading pour les composants de détails non critiques
const ProductSpecifications = lazy(() => import('../components/products/ProductSpecifications'));
const ProductDocuments = lazy(() => import('../components/products/ProductDocuments'));

// Composant de chargement pour les sections lazy-loaded
const SectionLoader = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
  </div>
);

// Types pour les onglets
type TabType = 'description' | 'features' | 'specs' | 'documents';

const ImageGallery = ({ images, onImageError }: { images: string[], onImageError?: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Gérer l'erreur de chargement d'image
  const handleImageError = () => {
    if (onImageError) {
      onImageError();
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={toggleZoom}
        >
          <img
            src={images[currentIndex]}
            alt={`Product view ${currentIndex + 1}`}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onError={handleImageError}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        aria-label="Image précédente"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        aria-label="Image suivante"
      >
        <FiChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Zoom button */}
      <button
        onClick={toggleZoom}
        className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        aria-label={isZoomed ? "Dézoomer" : "Zoomer"}
      >
        {isZoomed ? (
          <FiZoomOut className="w-6 h-6 text-gray-800" />
        ) : (
          <FiZoomIn className="w-6 h-6 text-gray-800" />
        )}
      </button>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/80 rounded-full">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? 'bg-teal-600 scale-125' : 'bg-gray-400'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const ProductRelatedSlider = ({ product }: { product: Product }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Récupérer des produits de la même catégorie
        const categoryId = product.categoryId;
        const response = await getProducts({ 
          category: categoryId.toString(),
          limit: 10 // Récupérer plus de produits pour pouvoir filtrer
        });
        
        // Filtrer pour exclure le produit actuel et garder ceux de la même catégorie
        const filteredProducts = response.products.filter(p => 
          p.id !== product.id && 
          p.categoryId === product.categoryId
        );
        
        // Trier les produits: d'abord ceux de la même marque, puis les autres
        const sortedProducts = filteredProducts.sort((a, b) => {
          // Même marque que le produit actuel en premier
          if (a.markId === product.markId && b.markId !== product.markId) return -1;
          if (a.markId !== product.markId && b.markId === product.markId) return 1;
          return 0;
        });
        
        // Limiter à 5 produits maximum
        setRelatedProducts(sortedProducts.slice(0, 5));
      } catch (error) {
        console.error('Erreur lors de la récupération des produits similaires:', error);
        setRelatedProducts([]);
      }
    };
    
    fetchRelatedProducts();
  }, [product]);

  const checkScrollButtons = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const scrollAmount = 320; // Largeur d'une carte produit + espace
    const currentScroll = sliderRef.current.scrollLeft;
    
    sliderRef.current.scrollTo({
      left: direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
    
    setTimeout(checkScrollButtons, 350);
  };

  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-lg mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Produits similaires</h2>
      
      {/* Boutons de défilement */}
      {canScrollLeft && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 z-10 bg-white rounded-full shadow-lg p-3 transform -translate-y-1/2"
          aria-label="Voir produits précédents"
        >
          <FaArrowLeft className="text-gray-800 w-4 h-4" />
        </button>
      )}
      
      {canScrollRight && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 z-10 bg-white rounded-full shadow-lg p-3 transform -translate-y-1/2"
          aria-label="Voir produits suivants"
        >
          <FaArrowRight className="text-gray-800 w-4 h-4" />
        </button>
      )}
      
      {/* Liste des produits */}
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth"
        onScroll={checkScrollButtons}
      >
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[280px]">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            Aucun produit similaire trouvé
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        setError('Impossible de charger les détails du produit. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Utiliser la même logique pour l'image que dans ProductCard
    const imageUrl = imageError || !product.imagesUrl || product.imagesUrl.length === 0 
      ? '/image-produit-defaut.jpeg' 
      : `/images/products/${product.imagesUrl[0]}`;
    
    // Préparer l'objet à ajouter au panier avec la structure attendue
    const cartItem = {
      id: product.id.toString(),
      name: product.name,
      price: product.priceTtc,
      image: imageUrl,
      quantity
    };
    
    addToCart(cartItem);
  };

  const toggleFavorite = () => {
    if (!product) return;

    if (isFavorite(product.id.toString())) {
      removeFromFavorites(product.id.toString());
    } else {
      // Utiliser la même logique pour l'image que dans ProductCard
      const imageUrl = imageError || !product.imagesUrl || product.imagesUrl.length === 0 
        ? '/image-produit-defaut.jpeg' 
        : `/images/products/${product.imagesUrl[0]}`;
      
      // Adapter l'objet product à la structure attendue par addToFavorites
      const favoriteItem = {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        image: imageUrl,
        category: product.category?.name || '',
        brand: product.mark?.name || '',
        price: product.priceTtc,
        inStock: product.quantity > 0
      };
      addToFavorites(favoriteItem);
    }
  };

  // Rendu du contenu de l'onglet actif
  const renderTabContent = () => {
    if (!product) return null;

    switch (activeTab) {
      case 'description':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="prose max-w-none text-gray-600"
          >
            {product.description.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </motion.div>
        );
      case 'features':
        // Générer des caractéristiques basiques à partir des données disponibles
        const features = [
          `Marque: ${product.mark?.name || 'Non spécifiée'}`,
          `Référence: ${product.productDetail?.itemCode || 'Non spécifiée'}`,
          product.productDetail?.directorWord1 ? 
            `Caractéristique 1: ${product.productDetail.directorWord1}` : null,
          product.productDetail?.directorWord2 ? 
            `Caractéristique 2: ${product.productDetail.directorWord2}` : null,
          `Poids: ${product.productDetail?.weight ? product.productDetail.weight + ' kg' : 'Non spécifié'}`,
          `État: ${product.active ? 'Actif' : 'Inactif'}`,
          `Quantité disponible: ${product.quantity}`
        ].filter(Boolean) as string[];
        
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {features.map((feature: string, index: number) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        );
      case 'specs':
        // Générer des spécifications à partir des données disponibles
        const specifications = [
          { key: 'Catégorie', value: product.category?.name || 'Non spécifiée' },
          { key: 'Marque', value: product.mark?.name || 'Non spécifiée' },
          { key: 'Référence', value: product.productDetail?.itemCode || 'Non spécifiée' },
          product.productDetail?.designation1 ? 
            { key: 'Désignation 1', value: product.productDetail.designation1 } : null,
          product.productDetail?.designation2 ? 
            { key: 'Désignation 2', value: product.productDetail.designation2 } : null,
          product.productDetail?.complementDesignation ? 
            { key: 'Complément', value: product.productDetail.complementDesignation } : null,
          product.productDetail?.packaging ? 
            { key: 'Conditionnement', value: product.productDetail.packaging } : null,
          product.productDetail?.packagingType ? 
            { key: 'Type d\'emballage', value: product.productDetail.packagingType } : null,
          product.productDetail?.label ? 
            { key: 'Label', value: product.productDetail.label } : null,
          product.productDetail?.unity ? 
            { key: 'Unité', value: product.productDetail.unity } : null,
          { key: 'Prix HT', value: `${product.priceHt.toFixed(2)} €` },
          { key: 'Prix TTC', value: `${product.priceTtc.toFixed(2)} €` },
          product.isInPromotion && product.promotionPrice ? 
            { key: 'Prix promotionnel', value: `${product.promotionPrice.toFixed(2)} €` } : null,
          { key: 'Disponibilité', value: product.quantity > 0 ? 'En stock' : 'Rupture de stock' }
        ].filter(Boolean) as { key: string, value: string }[];
        
        return (
          <Suspense fallback={<SectionLoader />}>
            <ProductSpecifications specifications={specifications} />
          </Suspense>
        );
      case 'documents':
        // Pour l'instant, générer des documents fictifs
        const documents = [
          {
            id: '1',
            name: `Fiche technique ${product.name}`,
            type: 'fiche_technique',
            url: '#'
          },
          {
            id: '2',
            name: 'Guide d\'installation',
            type: 'manuel',
            url: '#'
          }
        ];
        
        return (
          <Suspense fallback={<SectionLoader />}>
            <ProductDocuments documents={documents} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-80 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || "Produit non trouvé"}
            </h1>
            <button
              onClick={() => navigate('/nos-produits')}
              className="bg-[#007FFF] text-white px-6 py-2 rounded-lg hover:bg-[#007FFF]/90 transition-colors"
            >
              Retour aux produits
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Breadcrumb />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 md:py-12"
      >
        {/* En-tête du produit */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            {/* Colonne gauche - Image */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 md:space-y-8"
            >
              <div className="w-full max-w-2xl mx-auto">
                <ImageGallery 
                  images={
                    imageError || !product.imagesUrl || product.imagesUrl.length === 0 
                    ? ['/image-produit-defaut.jpeg']
                    : product.imagesUrl.map(img => `/images/products/${img}`)
                  } 
                  onImageError={() => setImageError(true)}
                />
              </div>
            </motion.div>

            {/* Colonne droite - Toutes les informations */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-6"
            >
              {/* Titre et informations principales */}
              <div className="space-y-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">RÉF:</span>
                    <span className="ml-2">{product.productDetail?.itemCode || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">MARQUE:</span>
                    <span className="ml-2 text-[#007FFF]">{product.mark?.name || 'Non spécifiée'}</span>
                  </div>
                </div>
              </div>

              {/* Prix et stock */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-gray-100">
                <div className="space-y-2 flex-1">
                  {product.isInPromotion && product.promotionPrice ? (
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-sm">
                          PROMOTION
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900">
                          {product.promotionPrice.toFixed(2)} €
                        </span>
                        <span className="text-sm line-through text-gray-400">
                          {product.priceTtc.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-0.5">
                        <span>Prix HT: {(product.promotionPrice / 1.2).toFixed(2)} €</span>
                        <span className="mx-2">•</span>
                        <span>TTC</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900">
                          {product.priceTtc.toFixed(2)} €
                        </span>
                        <span className="text-sm text-gray-500">TTC</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        Prix HT: {product.priceHt.toFixed(2)} €
                      </div>
                    </div>
                  )}
                </div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <span className={`inline-flex items-center px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                    product.quantity > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {product.quantity > 0 ? 'En stock' : 'Rupture de stock'}
                  </span>
                </motion.div>
              </div>

              {/* Quantité et ajout au panier */}
              <div className="space-y-4 py-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité
                    </label>
                    <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                      <button 
                        onClick={decrementQuantity}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e)}
                        className="block w-full border-0 focus:ring-0 text-center text-lg py-2"
                      />
                      <button 
                        onClick={incrementQuantity}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.quantity}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all ${
                    !product.quantity
                      ? 'bg-gray-300 cursor-not-allowed'
                      : isInCart(product.id.toString())
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] hover:from-[#007FFF] hover:to-[#0056b3]'
                  }`}
                >
                  <FaShoppingCart className="w-5 h-5" />
                  <span className="text-base md:text-lg">
                    {!product.quantity
                      ? 'Produit indisponible'
                      : isInCart(product.id.toString())
                      ? 'Dans le panier'
                      : 'Ajouter au panier'}
                  </span>
                </motion.button>
              </div>

              {/* Caractéristiques supplémentaires */}
              {product.productDetail && (
                <div className="flex flex-wrap gap-6 py-4 border-t border-gray-100">
                  {product.productDetail.weight && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#7CB9E8] to-[#007FFF] rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaWeight className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400">Poids</div>
                        <div className="text-sm font-medium">{product.productDetail.weight} kg</div>
                      </div>
                    </div>
                  )}
                  
                  {product.productDetail.unity && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#7CB9E8] to-[#007FFF] rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaRuler className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400">Unité</div>
                        <div className="text-sm font-medium">{product.productDetail.unity}</div>
                      </div>
                    </div>
                  )}
                  
                  {product.productDetail.packaging && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#7CB9E8] to-[#007FFF] rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaBox className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400">Conditionnement</div>
                        <div className="text-sm font-medium">{product.productDetail.packaging}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Onglets d'information */}
          <div className="mt-12 md:mt-16">
            <div className="bg-white rounded-t-2xl shadow-md">
              <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === 'description' 
                      ? 'text-teal-600 border-b-2 border-teal-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Description détaillée
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === 'features' 
                      ? 'text-teal-600 border-b-2 border-teal-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Caractéristiques
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === 'specs' 
                      ? 'text-teal-600 border-b-2 border-teal-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Spécifications
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === 'documents' 
                      ? 'text-teal-600 border-b-2 border-teal-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Documents
                </button>
              </div>
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {renderTabContent()}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Produits similaires */}
          <div className="mt-12 md:mt-16">
            <ProductRelatedSlider product={product} />
          </div>
          
          {/* Navigation rapide */}
          <div className="fixed bottom-8 left-8 z-50">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="bg-teal-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
              aria-label="Retour à la page précédente"
            >
              <FaArrowLeft />
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail; 