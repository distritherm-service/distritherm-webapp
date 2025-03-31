import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaRuler, FaWeight, FaBox, FaChevronRight, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';
import { ProductDetails } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { products, Product } from '../data/products';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Slider from '../components/Slider';

// Utilisation du lazy loading pour les composants de détails non critiques
const ProductSpecifications = lazy(() => import('../components/ProductSpecifications'));
const ProductDocuments = lazy(() => import('../components/ProductDocuments'));

// Composant de chargement pour les sections lazy-loaded
const SectionLoader = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
  </div>
);

// Types pour les onglets
type TabType = 'description' | 'features' | 'specs' | 'documents';

const ImageGallery = ({ images }: { images: string[] }) => {
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

const ProductRelatedSlider = ({ relatedProductIds }: { relatedProductIds: string[] }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Filtrer les produits reliés
  const relatedProducts = products.filter(p => relatedProductIds.includes(p.id));

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

  if (relatedProducts.length === 0) return null;

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
        {relatedProducts.map(product => (
          <div key={product.id} className="flex-shrink-0 w-[280px]">
            <ProductCard product={product} />
          </div>
        ))}
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
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [isLoading, setIsLoading] = useState(true);

  // Trouver le produit par ID
  const foundProduct = products.find(p => p.id === id);
  
  // Simulation du chargement des données
  useEffect(() => {
    // Dans une application réelle, ici on ferait un appel API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!foundProduct) {
      // Récupérer la promotion correspondante si elle existe
      const promotionData = import.meta.glob('../data/promotions.ts', { eager: true });
      // @ts-ignore
      const { promotions } = promotionData['../data/promotions.ts'];
      
      const promo = promotions?.find((p: any) => p.id === id);
      
      if (promo) {
        // Si c'est une promotion, créer un produit à partir des données de la promotion
        const productDetails: ProductDetails = {
          id: promo.id,
          name: promo.title,
          description: promo.description,
          longDescription: promo.description,
          image: promo.image,
          category: promo.category,
          subcategory: promo.subcategory,
          brand: promo.brand,
          price: promo.discountPrice,
          inStock: promo.inStock,
          model: `MOD-${promo.id}`,
          reference: `REF-${promo.id}`,
          specifications: [
            { key: 'Catégorie', value: promo.category },
            { key: 'Sous-catégorie', value: promo.subcategory },
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
        return;
      }
      
      // Si ni produit ni promotion n'est trouvé, rediriger
      navigate('/nos-produits');
      return;
    }

    // Créer un objet ProductDetails à partir du produit trouvé
    const productDetails: ProductDetails = {
      ...foundProduct,
      name: foundProduct.title, // Mapper title vers name
      longDescription: foundProduct.description,
      model: `MOD-${foundProduct.id}`,
      reference: `REF-${foundProduct.id}`,
      specifications: [
        { key: 'Catégorie', value: foundProduct.category },
        { key: 'Sous-catégorie', value: foundProduct.subcategory },
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
  }, [id, navigate]);

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
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  };

  const toggleFavorite = () => {
    if (!product) return;

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      const productForFavorites = {
        id: product.id,
        title: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        price: product.price,
        inStock: product.inStock
      };
      addToFavorites(productForFavorites, 'product');
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
            {product.longDescription.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </motion.div>
        );
      case 'features':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {product.features.map((feature, index) => (
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
        return (
          <Suspense fallback={<SectionLoader />}>
            <ProductSpecifications specifications={product.specifications} />
          </Suspense>
        );
      case 'documents':
        return (
          <Suspense fallback={<SectionLoader />}>
            <ProductDocuments documents={product.documents} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Slider showOnPages={[`/nos-produits/${id}`, `/produit/${id}`]} />
      <Breadcrumb />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 md:py-12"
      >
        {/* En-tête du produit */}
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3 md:mb-4">
              <span>{product.category}</span>
              <FaChevronRight className="mx-2 w-3 h-3" />
              <span>{product.subcategory}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="font-medium">RÉF:</span>
                <span className="ml-2">{product.reference}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium">MARQUE:</span>
                <span className="ml-2 text-teal-600">{product.brand}</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            {/* Colonne gauche - Image */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 md:space-y-8"
            >
              <div className="w-full max-w-2xl mx-auto">
                <ImageGallery images={[product.image, product.image, product.image, product.image]} />
              </div>
            </motion.div>

            {/* Colonne droite - Informations */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Description */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Prix et stock */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-2xl md:text-4xl font-bold text-gray-900">
                      {product.price.toFixed(2)} €
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">Prix HT</div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <span className={`inline-flex items-center px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                      product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        product.inStock ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {product.inStock ? 'En stock' : 'Rupture de stock'}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg space-y-6">
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
                        onChange={handleQuantityChange}
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFavorite}
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-colors duration-200 ${
                      isFavorite(product.id)
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                    aria-label={isFavorite(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <FaHeart className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isInCart(product.id)}
                  className={`w-full flex items-center justify-center space-x-3 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-white font-medium transition-all duration-200 ${
                    !product.inStock
                      ? 'bg-gray-300 cursor-not-allowed'
                      : isInCart(product.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl'
                  }`}
                  aria-label={!product.inStock 
                    ? "Produit indisponible" 
                    : isInCart(product.id) 
                      ? "Déjà dans le panier" 
                      : "Ajouter au panier"}
                >
                  <FaShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base md:text-lg">
                    {!product.inStock
                      ? 'Produit indisponible'
                      : isInCart(product.id)
                      ? 'Dans le panier'
                      : 'Ajouter au panier'}
                  </span>
                </motion.button>
              </div>

              {/* Caractéristiques */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-7 shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Caractéristiques techniques</h3>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                      <FaRuler className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400">Dimensions</div>
                      <div className="text-sm font-medium">{product.dimensions.height}×{product.dimensions.width}×{product.dimensions.depth} cm</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                      <FaWeight className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400">Poids</div>
                      <div className="text-sm font-medium">{product.dimensions.weight} kg</div>
                    </div>
                  </div>
                </div>
              </div>
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
            {product.relatedProducts.length > 0 && (
              <ProductRelatedSlider relatedProductIds={product.relatedProducts} />
            )}
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