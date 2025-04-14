import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '/logo-Transparent.png';
import VerticalMenu from './VerticalMenu';
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaSignOutAlt, FaPhone } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';
//import UserProfileModal from './UserProfileModal';
import CartPreview from './CartPreview';
import FavoritesPreview from './FavoritesPreview';
import CallbackForm from './CallbackForm';
import 'react-toastify/dist/ReactToastify.css';
//import { AnimatePresence } from 'framer-motion';
import MobileVerticalMenu from './MobileVerticalMenu';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Choisir votre magasin');
  const [scrolled, setScrolled] = useState(false);
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const storeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navbarHeight = useRef<number>(0);
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const { openSearch, isSearchOpen } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  const [isFavoritesPreviewOpen, setIsFavoritesPreviewOpen] = useState(false);
  const cartPreviewRef = useRef<HTMLDivElement>(null);
  const favoritesPreviewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Calcul du nombre total d'articles dans le panier
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleStoreSelect = (store: string) => {
    setSelectedStore(store);
    setIsStoreMenuOpen(false);
  };

  // Détecter le défilement pour appliquer des effets visuels
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fermer les menus au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Vérifier si on clique sur un élément du DOM
      if (!(event.target instanceof Node)) {
        return;
      }

      // Fermer le menu du magasin si on clique en dehors
      if (storeMenuRef.current && !storeMenuRef.current.contains(event.target as Node)) {
        setIsStoreMenuOpen(false);
      }
      
      // Fermer le menu utilisateur si on clique en dehors
      const userMenuButton = document.getElementById('user-menu-button');
      const userMenuContent = document.getElementById('user-menu-content');
      
      // Si on clique en dehors du bouton et du contenu du menu
      if (
        isUserMenuOpen &&
        userMenuButton &&
        userMenuContent &&
        !userMenuButton.contains(event.target as Node) &&
        !userMenuContent.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }

      // Fermer le menu mobile si on clique en dehors
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      if (
        isMobileMenuOpen && 
        mobileMenuButton && 
        mobileMenu && 
        !mobileMenuButton.contains(event.target as Node) && 
        !mobileMenu.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Ajouter l'événement de clic au document entier
    document.addEventListener('mousedown', handleClickOutside);
    
    // Nettoyage lors du démontage du composant
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserMenuOpen]);

  // Ajouter un gestionnaire pour les clics sur Escape
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsStoreMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Fermer le menu du magasin lors d'un changement de page
  useEffect(() => {
    setIsStoreMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Mettre à jour la hauteur de la navbar pour l'espacement
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.getElementById('main-navbar');
      if (navbar) {
        const height = navbar.offsetHeight;
        navbarHeight.current = height;
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);

    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    // Si le menu des produits est ouvert, on le ferme d'abord
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Version simplifiée de la fonction pour ouvrir/fermer le menu des produits
  const toggleProductsMenu = (e: React.MouseEvent) => {
    // Empêcher l'événement de se propager et de déclencher d'autres gestionnaires
    e.preventDefault();
    e.stopPropagation();
    
    // Basculer l'état du menu
    setIsMenuOpen(!isMenuOpen);
    
    // Fermer le menu mobile s'il est ouvert
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    // Ajouter un log pour déboguer
   // console.log("Menu des produits toggled:", !isMenuOpen);
  };

  const handleSearchClick = () => {
    openSearch();
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setIsUserMenuOpen(false); // Fermer le menu déroulant si ouvert
  };

  // Basculer l'état du menu magasin
  const toggleStoreMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la propagation pour éviter la fermeture immédiate
    setIsStoreMenuOpen(!isStoreMenuOpen);
  };

  // Format le nom de l'utilisateur pour l'affichage
  const formatUserName = () => {
    if (!user) return 'Mon compte';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName.charAt(0)}.`;
    } else if (user.email) {
      // Extraire le nom d'utilisateur de l'email (avant le @)
      const username = user.email.split('@')[0];
      return username.length > 10 ? username.substring(0, 10) + '...' : username;
    }
    
    return 'Mon compte';
  };

  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleCartMouseEnter = () => {
    setIsCartPreviewOpen(true);
    setIsFavoritesPreviewOpen(false);
  };

  const handleFavoritesMouseEnter = () => {
    setIsFavoritesPreviewOpen(true);
    setIsCartPreviewOpen(false);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const cartPreview = cartPreviewRef.current;
    const favoritesPreview = favoritesPreviewRef.current;
    const target = e.relatedTarget as Node;

    if (cartPreview && !cartPreview.contains(target) && favoritesPreview && !favoritesPreview.contains(target)) {
      setIsCartPreviewOpen(false);
      setIsFavoritesPreviewOpen(false);
    }
  };

  return (
    <>
      <div id="main-navbar" className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full">
        <style>{`
          .navbar-spacer {
            height: var(--navbar-height, 0px);
          }
        `}</style>

        {/* Barre supérieure avec informations de contact */}
        <div className={`bg-gray-900 text-white py-2 transition-all duration-300 ${scrolled ? 'py-1 opacity-90' : 'py-2'}`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="hidden md:flex items-center space-x-6">
                <a href="tel:+33123456789" className="flex items-center hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  01 48 30 45 70
                </a>
                <a href="mailto:contact@distritherm.fr" className="flex items-center hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@distritherm.fr 
                </a>
              </div>
              
              {/* Version mobile du téléphone et email */}
              <div className="flex md:hidden items-center space-x-3">
                <a href="tel:+330148304570" className="flex items-center hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
                <a href="mailto:contact@distritherm.fr" className="flex items-center hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link 
                  to={isAuthenticated ? "/mon-profil" : "/connexion"}
                  className="flex items-center hover:text-blue-400 transition-colors"
                >
                  <FaUser className="h-4 w-4 mr-1 text-blue-400" />
                  <span></span>
                </Link>
                <span className="text-gray-500">|</span>
                <div className="border-r pr-4 mr-4">
                  <Link 
                    to="/nous-contact" 
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </Link>
                </div>
                <div>
                  <button 
                    onClick={() => setIsCallbackFormOpen(true)}
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors font-medium"
                  >
                    <FaPhone className="mr-1 text-xs" />
                    Rappel-moi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre principale avec logo et navigation */}
        <div className={`bg-white border-b transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
          <div className="container mx-auto px-4">
            <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="block">
                  <img 
                    src={logo} 
                    alt="DistriTherm Services" 
                    className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-12'} w-auto`} 
                  />
                </Link>
              </div>

              {/* Boutons mobiles */}
              <div className="flex items-center space-x-3 sm:hidden">
                <button
                  onClick={handleSearchClick}
                  className="p-2 text-gray-600 hover:text-teal-600"
                  aria-label="Rechercher"
                >
                  <FaSearch className="w-5 h-5" />
                </button>
                <div className="relative">
                  <Link
                    to="/favoris"
                    className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                    onMouseEnter={handleFavoritesMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FaHeart className="h-6 w-6" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  <div ref={favoritesPreviewRef} onMouseLeave={handleMouseLeave}>
                    <FavoritesPreview 
                      isOpen={isFavoritesPreviewOpen} 
                      onClose={() => setIsFavoritesPreviewOpen(false)} 
                    />
                  </div>
                </div>
                <div className="relative">
                  <Link
                    to="/panier"
                    className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                    onMouseEnter={handleCartMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FaShoppingCart className="h-6 w-6" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <div ref={cartPreviewRef} onMouseLeave={handleMouseLeave}>
                    <CartPreview 
                      isOpen={isCartPreviewOpen} 
                      onClose={() => setIsCartPreviewOpen(false)} 
                    />
                  </div>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-600 hover:text-teal-600"
                  aria-label="Menu"
                  id="mobile-menu-button"
                >
                  {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                </button>
              </div>

              {/* Barre de recherche desktop */}
              <div className="flex-1 max-w-3xl mx-8 hidden sm:block">
                <div className="relative">
                  <button
                    onClick={handleSearchClick}
                    className={`w-full px-6 pr-12 text-left text-gray-500 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      scrolled ? 'py-2' : 'py-2.5'
                    }`}
                  >
                    Que recherchez-vous ?
                  </button>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400">
                    <FaSearch className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Actions et panier desktop */}
              <div className="hidden sm:flex items-center space-x-5">
                {/* Sélection du magasin */}
                <div className="relative" ref={storeMenuRef}>
                  <button
                    onClick={toggleStoreMenu}
                    className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
                    aria-expanded={isStoreMenuOpen}
                    aria-haspopup="true"
                  >
                    <FaMapMarkerAlt className="text-teal-600" />
                    <span className="max-w-[150px] truncate">{selectedStore}</span>
                    <svg className={`h-4 w-4 transition-transform ${isStoreMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isStoreMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                      onClick={(e) => e.stopPropagation()} // Empêcher la fermeture lors du clic sur le contenu du menu
                    >
                      <button
                        onClick={() => handleStoreSelect('Magasin Taverny')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Magasin Taverny
                      </button>
                      <button
                        onClick={() => handleStoreSelect('Magasin Drancy')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Magasin Drancy
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <Link
                    to="/favoris"
                    className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                    onMouseEnter={handleFavoritesMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FaHeart className="h-6 w-6" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-8 -right-8 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  <div ref={favoritesPreviewRef} onMouseLeave={handleMouseLeave}>
                    <FavoritesPreview 
                      isOpen={isFavoritesPreviewOpen} 
                      onClose={() => setIsFavoritesPreviewOpen(false)} 
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Link
                    to="/panier"
                    className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                    onMouseEnter={handleCartMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FaShoppingCart className="h-6 w-6" />
                    {cart.length > 0 && (
                      <span className="absolute -top-8 -right-8 bg-teal-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <div ref={cartPreviewRef} onMouseLeave={handleMouseLeave}>
                    <CartPreview 
                      isOpen={isCartPreviewOpen} 
                      onClose={() => setIsCartPreviewOpen(false)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barre de navigation catégories */}
        <div 
          className={`relative transition-all duration-300 ${
            scrolled ? 'py-2' : 'py-3'
          } ${isMobileMenuOpen ? 'block bg-white shadow-lg' : 'hidden sm:block bg-gray-100'}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Bouton "Tous nos produits" à gauche - visible uniquement sur desktop */}
              <div className="hidden sm:block">
                <button 
                  onClick={toggleProductsMenu}
                  className="px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors rounded-lg flex items-center space-x-2 focus:outline-none"
                  aria-label="Tous nos produits"
                  aria-expanded={isMenuOpen}
                  aria-controls="vertical-menu"
                  data-testid="all-products-button"
                >
                  <FaBars className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} />
                  <span className="hidden lg:inline">Nos Catégories</span>
                </button>
              </div>
              
              {/* Liens de navigation au centre - Desktop */}
              <div className="hidden sm:flex space-x-2 lg:space-x-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <Link
                  to="/"
                  className={`px-2 lg:px-3 py-2 text-sm lg:text-base ${isActive('/') ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors whitespace-nowrap`}
                >
                  Accueil
                </Link>
                <Link
                  to="/a-propos"
                  className={`px-2 lg:px-3 py-2 text-sm lg:text-base ${isActive('/a-propos') ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors whitespace-nowrap`}
                >
                  À propos
                </Link>
                <Link
                  to="/nos-produits"
                  className={`px-2 lg:px-3 py-2 text-sm lg:text-base ${isActive('/nos-produits') ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors whitespace-nowrap`}
                >
                Produits
                </Link>
                <Link
                  to="/promotions"
                  className={`px-2 lg:px-3 py-2 text-sm lg:text-base ${isActive('/promotions') ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors whitespace-nowrap`}
                >
                  Promotions
                </Link>
                <Link
                  to="/espace-recrutement"
                  className={`px-2 lg:px-3 py-2 text-sm lg:text-base ${isActive('/espace-recrutement') ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors whitespace-nowrap`}
                >
                  Recrutement
                </Link>
                <Link
                  to="/nous-contact"
                  className={`px-2 lg:px-3 py-2 text-sm lg:text-base ${isActive('/nous-contact') ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors whitespace-nowrap`}
                >
                  Contact
                </Link>
              </div>
              
              {/* Bouton de connexion à droite */}
              <div className="hidden md:flex items-center">
                {isAuthenticated ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 transition-colors duration-200 rounded-md relative"
                      aria-label="Mon compte"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                      id="user-menu-button"
                    >
                      <div className="relative inline-block">
                        <FaUser className="w-4 h-4 mr-2" />
                        {user && !user?.client?.emailVerified && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-teal-600">
                            <span className="text-[10px] text-teal-600 font-bold">!</span>
                          </div>
                        )}
                      </div>
                      <span>{formatUserName()}</span>
                      <svg 
                        className={`h-4 w-4 ml-1 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isUserMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                        id="user-menu-content"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-700">Profil utilisateur</p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                          {user && !user?.client?.emailVerified && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-yellow-700 flex items-center">
                                  <span className="mr-1">⚠️</span>
                                  Email non vérifié
                                </p>
                                <Link
                                  to="/verification-email"
                                  className="text-xs font-medium text-teal-600 hover:text-teal-500"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  Vérifier
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <Link
                          to="/mon-profil"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUser className="mr-2 text-gray-500" />
                          Modifier mon profil
                        </Link>
                        
                        <Link
                          to="/mes-commandes"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Mes commandes
                        </Link>
                        <Link
                          to="/Mes-devis"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Mes Devis
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/connexion"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-md"
                    aria-label="Connexion"
                  >
                    <FaUser className="w-4 h-4 mr-2" />
                    <span>Connexion</span>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Version mobile des liens */}
            <div 
              id="mobile-menu" 
              className={`sm:hidden mt-4 space-y-2 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            >
              {/* Menu principal mobile */}
              <div className="space-y-2">
                {/* Bouton Voir toutes les catégories */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsMobileMenuVisible(true);
                  }}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors rounded-lg shadow-sm"
                >
                  <span>Voir toutes les catégories</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </button>

                {/* Liens de navigation */}
                <nav className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                  <Link
                    to="/"
                    className={`flex items-center w-full py-3.5 px-4 ${
                      isActive('/') ? 'text-teal-600 bg-teal-50 font-medium' : 'text-gray-700'
                    } hover:bg-gray-50 transition-colors first:rounded-t-lg`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Accueil
                  </Link>
           
                  <Link
                    to="/a-propos"
                    className={`flex items-center w-full py-3.5 px-4 ${
                      isActive('/a-propos') ? 'text-teal-600 bg-teal-50 font-medium' : 'text-gray-700'
                    } hover:bg-gray-50 transition-colors`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    À propos
                  </Link>
                  <Link
                    to="/nos-produits"
                    className={`flex items-center w-full py-3.5 px-4 ${
                      isActive('/nos-produits') ? 'text-teal-600 bg-teal-50 font-medium' : 'text-gray-700'
                    } hover:bg-gray-50 transition-colors`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Produits
                  </Link>
                  <Link
                    to="/promotions"
                    className={`flex items-center w-full py-3.5 px-4 ${
                      isActive('/promotions') ? 'text-teal-600 bg-teal-50 font-medium' : 'text-gray-700'
                    } hover:bg-gray-50 transition-colors`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Promotions
                  </Link>
                  <Link
                    to="/espace-recrutement"
                    className={`flex items-center w-full py-3.5 px-4 ${
                      isActive('/espace-recrutement') ? 'text-teal-600 bg-teal-50 font-medium' : 'text-gray-700'
                    } hover:bg-gray-50 transition-colors`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Recrutement
                  </Link>
                  <Link
                    to="/nous-contact"
                    className={`flex items-center w-full py-3.5 px-4 ${
                      isActive('/nous-contact') ? 'text-teal-600 bg-teal-50 font-medium' : 'text-gray-700'
                    } hover:bg-gray-50 transition-colors last:rounded-b-lg`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>

                {/* Bouton Connexion/Profil */}
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/mon-profil');
                    }}
                    className="flex w-full items-center justify-between py-3.5 px-4 bg-teal-600 text-white hover:bg-teal-700 transition-colors rounded-lg shadow-sm"
                  >
                    <span className="flex items-center">
                      <FaUser className="w-4 h-4 mr-2" />
                      <span className="font-medium">{user?.name || 'Mon profil'}</span>
                    </span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    to="/connexion"
                    className="flex w-full items-center justify-between py-3.5 px-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <FaUser className="w-4 h-4 mr-2" />
                      <span className="font-medium">Connexion</span>
                    </span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Menu vertical déroulant desktop */}
        {isMenuOpen && window.innerWidth >= 768 && (
          <VerticalMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
          />
        )}
      </div>
      
      {/* Menu vertical mobile (en dehors du conteneur principal) */}
      <MobileVerticalMenu 
        isOpen={isMobileMenuVisible} 
        onClose={() => setIsMobileMenuVisible(false)} 
      />
      
      {/* Overlay pour la recherche */}
      {isSearchOpen && <SearchBar />}

      {/* Formulaire de rappel */}
      <CallbackForm isOpen={isCallbackFormOpen} onClose={() => setIsCallbackFormOpen(false)} />
    </>
  );
};

export default Navbar;