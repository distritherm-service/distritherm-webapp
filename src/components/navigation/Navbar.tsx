import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '/logo-Transparent.png';
import VerticalMenu from './VerticalMenu';
import {  FaChevronDown, FaBriefcase } from 'react-icons/fa';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiOutlineSearch, HiOutlineLocationMarker, HiOutlineLogout } from 'react-icons/hi';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../contexts/AuthContext';
import { agencyService, Agency } from '../../services/agencyService';
import CallbackForm from '../common/CallbackForm';
import 'react-toastify/dist/ReactToastify.css';
import MobileVerticalMenu from './MobileVerticalMenu';
import { AnimatePresence, motion } from 'framer-motion';
import FavoritesCounter from '../favorites/FavoritesCounter';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Choisir votre magasin');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const storeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navbarHeight = useRef<number>(0);
  const { favorites } = useFavorites();
  const { getCartItemCount } = useCart();
  const { 
    searchQuery, 
    searchResults, 
    searchHistory,
    isSearching,
    openSearch,
    setSearchQuery,
    clearSearch,
    deleteHistoryEntry 
  } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const navigate = useNavigate();
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuContentRef = useRef<HTMLDivElement>(null);

  // Calcul du nombre total d'articles dans le panier
  const cartItemsCount = getCartItemCount();

  const handleStoreSelect = (agency: Agency) => {
    setSelectedAgency(agency);
    setSelectedStore(agency.name);
    setIsStoreMenuOpen(false);
  };

  // Charger les agences au montage du composant
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoadingAgencies(true);
        const agenciesData = await agencyService.getAgencies();
        setAgencies(agenciesData);
      } catch (error) {
        console.error('Erreur lors du chargement des agences:', error);
      } finally {
        setLoadingAgencies(false);
      }
    };

    fetchAgencies();
  }, []);

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
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Ouvrir la recherche pour charger l'historique côté contexte
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

  // Gestion ouverture/fermeture du menu utilisateur
  const closeUserMenu = () => setIsUserMenuOpen(false);

  // Ouvre le menu au clic ou au survol
  const handleUserMenuButtonClick = () => setIsUserMenuOpen((open) => !open);

  // Gestionnaire de recherche
  const handleSearchFocus = () => {
    setShowSearchResults(true);
    // Charger l'historique si nécessaire
    openSearch();
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Vérifier si on clique sur un résultat de recherche
    if (searchRef.current && !searchRef.current.contains(e.relatedTarget as Node)) {
      setTimeout(() => {
        setShowSearchResults(false);
      }, 200);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/produit/${searchResults[0].id}`);
      setShowSearchResults(false);
      clearSearch();
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  const handleResultClick = (productId: string) => {
    navigate(`/produit/${productId}`);
    setShowSearchResults(false);
    clearSearch();
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Fermer les résultats de recherche au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div id="main-navbar" className={`fixed top-0 left-0 right-0 z-[100] flex flex-col w-full bg-white transition-all duration-500 ${scrolled ? 'shadow-2xl' : 'shadow-xl'}`}>
        <style>{`
          .navbar-spacer {
            height: var(--navbar-height, 0px);
          }
        `}</style>

        {/* Barre supérieure avec informations de contact - Design moderne et agrandi */}
        <div className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-gray-300 transition-all duration-500 ${scrolled ? 'py-1 lg:py-1.5' : 'py-1.5 lg:py-2'}`}>
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center">
              {/* Partie gauche - Contact agrandi */}
              <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                <a 
                  href="tel:0171687212" 
                  className="hidden md:flex items-center space-x-2 hover:text-white transition-all duration-300 group px-3 py-1.5 rounded-lg hover:bg-white/10 hover:shadow-md"
                >
                  <div className="relative">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs lg:text-sm xl:text-base text-white hover:text-emerald-400 transition-colors duration-300">01 71 68 72 12</span>
                  </div>
                </a>
                
                <div className="hidden xl:block w-px h-6 bg-gray-600"></div>
                
                <a 
                  href="mailto:info@distritherm-services.fr" 
                  className="hidden lg:flex items-center space-x-2 hover:text-white transition-all duration-300 group px-3 py-1.5 rounded-lg hover:bg-white/10 hover:shadow-md"
                >
                  <div className="relative">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs lg:text-sm xl:text-base text-white">info@distritherm-services.fr</span>
                  </div>
                </a>
                
                {/* Version mobile - icônes agrandies */}
                <div className="flex md:hidden items-center space-x-2">
                  <a href="tel:0171687212" className="p-2 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                  <a href="mailto:info@distritherm-services.fr" className="p-2 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Partie droite - Actions agrandie */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Bouton Rappel agrandi avec animation Tailwind - Responsive */}
                <button 
                  onClick={() => setIsCallbackFormOpen(true)}
                  className="group relative flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-1.5
                           border-2 border-emerald-400 text-emerald-400 bg-transparent 
                           rounded-full transition-all duration-300 text-xs sm:text-sm lg:text-base xl:text-lg font-bold 
                           shadow-lg sm:shadow-xl shadow-emerald-400/30 
                           hover:border-emerald-300 hover:text-emerald-300 hover:bg-emerald-50/10 
                           hover:shadow-emerald-400/50 hover:scale-105
                           animate-pulse
                           ring-1 ring-emerald-400/40 ring-offset-1 ring-offset-slate-900
                           hover:ring-emerald-300/60 hover:ring-offset-emerald-400/20
                           focus:outline-none focus:ring-2 focus:ring-emerald-300/50
                           backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/15 via-emerald-300/10 to-emerald-400/15 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-center">
                    <svg className="relative z-10 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="absolute -inset-1.5 bg-emerald-400/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-start">
                    <span className="tracking-wide">Rappelez-moi</span>
                  </div>
                  
                  <div className="absolute -inset-2 bg-emerald-400/20 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Barre principale avec logo et navigation - Design moderne */}
        <div className={`bg-white transition-all duration-500 ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}>
              {/* Logo - Section améliorée */}
              <div className="flex-shrink-0">
                <Link to="/" className="block group relative">
                  <img 
                    src={logo} 
                    alt="DistriTherm Services" 
                    className={`transition-all duration-300 group-hover:scale-105 ${scrolled ? 'h-12 sm:h-14' : 'h-14 sm:h-16'} w-auto`} 
                  />
                </Link>
              </div>

              {/* Boutons mobiles - Design amélioré */}
              <div className="flex items-center space-x-2 sm:hidden">
                <button
                  onClick={handleSearchClick}
                  className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  aria-label="Rechercher"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                </button>
                <Link
                  to="/favoris"
                  className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-all duration-300"
                >
                  <HiOutlineHeart className="h-5 w-5" />
                  <FavoritesCounter size="sm" />
                </Link>
                <Link
                  to="/panier"
                  className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-300"
                >
                  <HiOutlineShoppingBag className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  aria-label="Menu"
                  id="mobile-menu-button"
                >
                  {isMobileMenuOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
                </button>
              </div>

              {/* Barre de recherche desktop - Design moderne et amélioré */}
              <div className="flex-1 max-w-2xl hidden sm:flex items-center justify-center px-4 lg:px-8">
                <div ref={searchRef} className="relative w-full">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      placeholder="Rechercher des produits..."
                      className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 placeholder:text-gray-400 text-gray-700 text-sm lg:text-base"
                    />
                    <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          clearSearch();
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                    )}
                  </form>

                  <AnimatePresence>
                    {showSearchResults && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[400px] overflow-y-auto z-[150]"
                      >
                        {isSearching ? (
                          <div className="flex justify-center items-center h-20">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                          </div>
                        ) : searchQuery.trim() === '' ? (
                          searchHistory.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                              <p>Aucune recherche récente</p>
                            </div>
                          ) : (
                            <>
                              <div className="px-4 py-2 text-xs uppercase text-gray-400 font-semibold">Recherches récentes</div>
                              {searchHistory.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between text-left transition-colors duration-200"
                                >
                                  <button
                                    onClick={() => {
                                      setSearchQuery(entry.value);
                                      searchInputRef.current?.focus();
                                    }}
                                    className="flex items-center flex-1 min-w-0 text-left"
                                  >
                                    <HiOutlineSearch className="w-5 h-5 text-gray-400" />
                                    <span className="ml-3 text-sm text-gray-700 truncate">{entry.value}</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteHistoryEntry(entry.id);
                                    }}
                                    aria-label="Supprimer cette recherche"
                                    className="ml-3 text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <HiOutlineX className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </>
                          )
                        ) : searchResults.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <HiOutlineSearch className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Aucun résultat trouvé pour "{searchQuery}"</p>
                          </div>
                        ) : (
                          <div className="py-2">
                            {searchResults.slice(0, 6).map((product) => (
                              <button
                                key={product.id}
                                onClick={() => handleResultClick(product.id.toString())}
                                className="w-full px-4 py-3 hover:bg-gray-50 flex items-center text-left transition-colors duration-200"
                              >
                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={product.imagesUrl && product.imagesUrl.length > 0 ? product.imagesUrl[0] : '/image-produit-defaut.jpeg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-blue-600 font-semibold">
                                    {product.priceHt.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} HT
                                  </p>
                                </div>
                              </button>
                            ))}
                            {searchResults.length > 6 && (
                              <div className="px-4 py-3 border-t border-gray-100">
                                <button
                                  onClick={() => {
                                    navigate('/nos-produits', { state: { searchQuery } });
                                    setShowSearchResults(false);
                                  }}
                                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Voir tous les résultats ({searchResults.length})
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Actions et panier desktop - Design moderne et amélioré */}
              <div className="hidden sm:flex items-center space-x-3">
                {/* Sélection du magasin - Design moderne */}
                <div className="relative" ref={storeMenuRef}>
                  <button
                    onClick={toggleStoreMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group"
                    aria-expanded={isStoreMenuOpen}
                    aria-haspopup="true"
                  >
                    <HiOutlineLocationMarker className="text-blue-600 w-5 h-5" />
                    <span className="max-w-[150px] truncate text-sm font-medium text-gray-700">{selectedStore}</span>
                    <FaChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-300 ${isStoreMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isStoreMenuOpen && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl py-2 z-[200] border border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                      style={{ position: 'absolute' }}
                    >
                      {loadingAgencies ? (
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-sm text-gray-500">Chargement...</span>
                        </div>
                      ) : agencies.length === 0 ? (
                        <div className="px-6 py-3 text-sm text-gray-500 text-center">
                          Aucune agence disponible
                        </div>
                      ) : (
                        agencies.map((agency) => (
                          <button
                            key={agency.id}
                            onClick={() => handleStoreSelect(agency)}
                            className="block w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                          >
                            <div className="font-medium">{agency.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {agency.postal_code && agency.city 
                                ? `${agency.postal_code} ${agency.city}`
                                : agency.address
                              }
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                
                {/* Séparateur vertical */}
                <div className="h-8 w-px bg-gray-200"></div>
                
                {/* Favoris avec design amélioré */}
                <Link
                  to="/favoris"
                  className="relative flex items-center justify-center w-11 h-11 text-gray-600 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-all duration-300 group"
                >
                  <HiOutlineHeart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <FavoritesCounter size="md" />
                </Link>
                
                {/* Panier avec design amélioré */}
                <Link
                  to="/panier"
                  className="relative flex items-center justify-center w-11 h-11 text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-300 group"
                >
                  <HiOutlineShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barre de navigation catégories - Design moderne et agrandi */}
        <div 
          className={`bg-white transition-all duration-500 ${
            scrolled ? 'py-1.5' : 'py-2.5'
          } ${isMobileMenuOpen ? 'block' : 'hidden sm:block'} border-b border-gray-200`}
        >
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between gap-4">
              {/* Bouton "Nos Catégories" à gauche - Agrandi et moderne */}
              <div className="hidden sm:block">
                <button 
                  onClick={toggleProductsMenu}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:from-blue-600 hover:to-sky-600 font-semibold transform hover:scale-105"
                  aria-label="Nos catégories"
                  aria-expanded={isMenuOpen}
                  aria-controls="vertical-menu"
                  data-testid="all-products-button"
                >
                  <HiOutlineMenu className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} />
                  <span className="hidden lg:inline text-sm">Nos Catégories</span>
                </button>
              </div>
              
              {/* Liens de navigation au centre - Agrandis et modernes */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive('/') 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/80'
                  }`}
                >
                  Accueil
                </Link>
                <Link
                  to="/nos-produits"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive('/nos-produits') 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/80'
                  }`}
                >
                  Produits
                </Link>
                <Link
                  to="/promotions"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive('/promotions') 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/80'
                  }`}
                >
                  Promotions
                </Link>
                <Link
                  to="/nous-contact"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive('/nous-contact') 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/80'
                  }`}
                >
                  Contact
                </Link>
              </div>
              
              {/* Bouton de connexion à droite - Agrandi et moderne */}
              <div className="hidden md:flex items-center">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      ref={userMenuButtonRef}
                      onClick={handleUserMenuButtonClick}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:from-blue-600 hover:to-sky-600 font-semibold transform hover:scale-105"
                      aria-label="Mon compte"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                      id="user-menu-button"
                      type="button"
                    >
                      <div className="relative">
                        {user?.urlPicture ? (
                          <img
                            src={user.urlPicture}
                            alt="Photo de profil"
                            className="w-7 h-7 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <HiOutlineUser className="w-5 h-5" />
                        )}
                        {user && !user?.client?.emailVerified && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center border border-white">
                            <span className="text-[8px] text-gray-800 font-bold">!</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">{formatUserName()}</span>
                      <FaChevronDown className={`h-3 w-3 text-white transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                      <div
                        ref={userMenuContentRef}
                        className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[200] overflow-hidden"
                        id="user-menu-content"
                        style={{ position: 'absolute' }}
                      >
                        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sky-50">
                          <p className="text-sm font-semibold text-gray-800">Profil utilisateur</p>
                          <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
                          {user && !user?.client?.emailVerified && (
                            <div className="mt-3 p-2 bg-yellow-50 rounded-lg flex items-center justify-between text-xs text-yellow-800">
                              <div className="flex items-center">
                                <span className="mr-1">⚠️</span>
                                <span>Email non vérifié</span>
                              </div>
                              <Link
                                to="/verification-email"
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                onClick={closeUserMenu}
                              >
                                Vérifier →
                              </Link>
                            </div>
                          )}
                        </div>
                        <Link
                          to="/mon-profil"
                          className="flex items-center gap-3 w-full px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200 group"
                          onClick={closeUserMenu}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-sky-100 text-blue-600">
                            <HiOutlineUser className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Modifier mon profil</span>
                        </Link>
                        <Link
                          to="/favoris"
                          className="flex items-center gap-3 w-full px-5 py-3 text-sm text-gray-700 hover:bg-red-50 transition-all duration-200 group"
                          onClick={closeUserMenu}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <HiOutlineHeart className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Mes Favoris</span>
                        </Link>

                        <Link
                          to="/mes-devis"
                          className="flex items-center gap-3 w-full px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition-all duration-200 group"
                          onClick={closeUserMenu}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="font-medium">Mes Devis</span>
                        </Link>
                        {user && user.type !== 'PROVIDER' && (
                          <Link
                            to="/demande-espace-pro"
                            className="flex items-center gap-3 w-full px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-all duration-200 group"
                            onClick={closeUserMenu}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600">
                              <FaBriefcase className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Espace Pro</span>
                          </Link>
                        )}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              closeUserMenu();
                            }}
                            className="flex items-center gap-3 w-full px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 group"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                              <HiOutlineLogout className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/connexion"
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 rounded-lg transition-all duration-300 hover:shadow-lg font-semibold transform hover:scale-105"
                    aria-label="Connexion"
                  >
                    <HiOutlineUser className="w-5 h-5" />
                    <span className="text-sm">Connexion</span>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Version mobile des liens - Design moderne */}
            <div 
              id="mobile-menu" 
              className={`sm:hidden mt-3 sm:mt-4 space-y-2 sm:space-y-3 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            >
              {/* Menu principal mobile */}
              <div className="space-y-2 sm:space-y-3">
                {/* Bouton Voir toutes les catégories */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsMenuOpen(true);
                  }}
                  className="group relative flex w-full items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 transition-all duration-300 rounded-lg shadow-lg"
                  id="mobile-categories-button"
                  aria-label="Voir toutes les catégories"
                >
                  <span className="font-semibold text-sm">Voir toutes les catégories</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Liens de navigation */}
                <nav className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Link
                    to="/"
                    className={`flex items-center w-full py-3 px-4 ${
                      isActive('/') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700'
                    } hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 text-sm`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Accueil
                  </Link>
                  <Link
                    to="/nos-produits"
                    className={`flex items-center w-full py-3 px-4 ${
                      isActive('/nos-produits') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700'
                    } hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 text-sm`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Produits
                  </Link>
                  <Link
                    to="/promotions"
                    className={`flex items-center w-full py-3 px-4 ${
                      isActive('/promotions') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700'
                    } hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 text-sm`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Promotions
                  </Link>
                  <Link
                    to="/nous-contact"
                    className={`flex items-center w-full py-3 px-4 ${
                      isActive('/nous-contact') 
                        ? 'text-blue-600 bg-blue-50 font-semibold' 
                        : 'text-gray-700'
                    } hover:bg-gray-50 transition-all duration-200 text-sm`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  {isAuthenticated && user && user.type !== 'PROVIDER' && (
                    <Link
                      to="/demande-espace-pro"
                      className={`flex items-center w-full py-3 px-4 ${
                        isActive('/demande-espace-pro') 
                          ? 'text-blue-600 bg-blue-50 font-semibold' 
                          : 'text-gray-700'
                      } hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 text-sm`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Espace Pro
                    </Link>
                  )}
                </nav>

                {/* Bouton Connexion/Profil */}
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/mon-profil');
                    }}
                    className="group flex w-full items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 transition-all duration-300 rounded-lg shadow-lg"
                  >
                    <span className="flex items-center">
                      <HiOutlineUser className="w-5 h-5 mr-2" />
                      <span className="font-semibold text-sm">{user?.name || 'Mon profil'}</span>
                    </span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    to="/connexion"
                    className="group flex w-full items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 transition-all duration-300 rounded-lg shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <HiOutlineUser className="w-5 h-5 mr-2" />
                      <span className="font-semibold text-sm">Connexion</span>
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
        
      </div>
      
      {/* Menus verticaux avec z-index élevé */}
      {/* Menu vertical déroulant desktop */}
      {isMenuOpen && window.innerWidth >= 768 && (
        <div className="fixed top-0 left-0 w-full h-full z-[110]">
          <VerticalMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
          />
        </div>
      )}
      
      {/* Menu vertical mobile (en dehors du conteneur principal) */}
      {isMenuOpen && window.innerWidth < 768 && (
        <div className="fixed top-0 left-0 w-full h-full z-[110]">
          <MobileVerticalMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
          />
        </div>
      )}

      {/* Formulaire de rappel */}
      <CallbackForm isOpen={isCallbackFormOpen} onClose={() => setIsCallbackFormOpen(false)} />
    </>
  );
};

export default Navbar;