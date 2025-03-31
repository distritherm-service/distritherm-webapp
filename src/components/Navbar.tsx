import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo-Transparent.png';
import VerticalMenu from './VerticalMenu';
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Choisir votre magasin');
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const storeMenuRef = useRef<HTMLDivElement>(null);
  const navbarHeight = useRef<number>(0);
  const { favorites } = useFavorites();

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

  // Fermer le menu au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (storeMenuRef.current && !storeMenuRef.current.contains(event.target as Node)) {
        setIsStoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMobileMenuOpen(false);
  };

  return (
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
                01 23 45 67 89
              </a>
              <a href="mailto:contact@distritherm.fr" className="flex items-center hover:text-blue-400 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@distritherm.fr
              </a>
            </div>
            
            {/* Version mobile du téléphone et email */}
            <div className="flex md:hidden items-center space-x-3">
              <a href="tel:+33123456789" className="flex items-center hover:text-blue-400 transition-colors">
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
              <Link to="/connexion" className="hover:text-blue-400 transition-colors">Mon compte</Link>
              <span className="text-gray-500">|</span>
              <Link to="/aide" className="hover:text-blue-400 transition-colors">Aide</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barre principale avec logo et navigation */}
      <div className={`bg-white border-b transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-sm'}`}>
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
            <div className="flex items-center space-x-3 md:hidden">
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-600 hover:text-teal-600"
                aria-label="Rechercher"
              >
                <FaSearch className="w-5 h-5" />
              </button>
              <Link to="/favoris" className="p-2 text-gray-600 hover:text-teal-600 relative">
                <FaHeart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link to="/panier" className="p-2 text-gray-600 hover:text-teal-600">
                <FaShoppingCart className="w-5 h-5" />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-teal-600"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </button>
            </div>

            {/* Barre de recherche desktop */}
            <div className="flex-1 max-w-3xl mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  className={`w-full px-6 pr-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    scrolled ? 'py-2' : 'py-2.5'
                  }`}
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaSearch className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative" ref={storeMenuRef}>
                <button
                  onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
                >
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  <span className="ml-2 font-medium">{selectedStore}</span>
                </button>

                {isStoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <button
                      onClick={() => handleStoreSelect('Tous les magasins')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <FaMapMarkerAlt className="w-5 h-5 text-teal-600" />
                      <span className="font-medium">Tous les magasins</span>
                    </button>
                    <button
                      onClick={() => handleStoreSelect('Magasin Taverny')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <FaMapMarkerAlt className="w-5 h-5 text-teal-600" />
                      <div>
                        <span className="font-medium block">Magasin Taverny</span>
                        <span className="text-sm text-gray-500">95150 Taverny</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStoreSelect('Magasin Drancy')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <FaMapMarkerAlt className="w-5 h-5 text-teal-600" />
                      <div>
                        <span className="font-medium block">Magasin Drancy</span>
                        <span className="text-sm text-gray-500">93700 Drancy</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/favoris"
                className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                <FaHeart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link
                to="/panier"
                className="p-2 text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                <FaShoppingCart className="w-6 h-6" />
              </Link>
              <Link
                to="/connexion"
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
              >
                <FaUser className="w-5 h-5" />
                <span>Connexion</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche mobile */}
      <div className={`${isSearchOpen ? 'block' : 'hidden'} md:hidden bg-white border-b px-4 py-3`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Que recherchez-vous ?"
            className="w-full px-4 pr-10 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <FaSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-b`}>
        <nav className="px-4 py-2">
          {/* Bouton Tous nos produits */}
          <button
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors border-b border-gray-100"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsMobileMenuOpen(false);
            }}
          >
            <FaBars className="w-5 h-5 mr-2" />
            <span>Tous nos produits</span>
          </button>

          <Link to="/" className="block px-4 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100">
            Accueil
          </Link>
          <Link to="/nos-produits" className="block px-4 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100">
            Nos Produits
          </Link>
          <Link to="/promotions" className="block px-4 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100">
            Promotions
          </Link>
          <Link to="/espace-recrutement" className="block px-4 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100">
            Espace Recrutement
          </Link>
          <Link to="/nous-contact" className="block px-4 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100">
            Nous Contact
          </Link>

          {/* Sélection du magasin */}
          <div className="px-4 py-3 border-b border-gray-100">
            <button
              onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
              className="flex items-center w-full text-gray-700 hover:text-blue-600"
            >
              <FaMapMarkerAlt className="w-5 h-5 mr-2" />
              <span>{selectedStore}</span>
            </button>
            {isStoreMenuOpen && (
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => handleStoreSelect('Tous les magasins')}
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded"
                >
                  Tous les magasins
                </button>
                <button
                  onClick={() => handleStoreSelect('Magasin Taverny')}
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded"
                >
                  <span className="block font-medium">Magasin Taverny</span>
                  <span className="text-sm text-gray-500">95150 Taverny</span>
                </button>
                <button
                  onClick={() => handleStoreSelect('Magasin Drancy')}
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded"
                >
                  <span className="block font-medium">Magasin Drancy</span>
                  <span className="text-sm text-gray-500">93700 Drancy</span>
                </button>
              </div>
            )}
          </div>

          <Link
            to="/connexion"
            className="block mx-4 mt-4 mb-2 px-6 py-3 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700"
          >
            <span className="flex items-center justify-center">
              <FaUser className="w-5 h-5 mr-2" />
              Connexion
            </span>
          </Link>
        </nav>
      </div>

      {/* Navigation desktop */}
      <div className={`bg-white border-b hidden md:block transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-12' : 'h-14'}`}>
            {/* Bouton Tous nos produits */}
            <button
              className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaBars className="w-5 h-5 mr-2" />
              <span>Tous nos produits</span>
            </button>

            {/* Menu principal */}
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">
                Accueil
              </Link>
              <Link to="/nos-produits" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">
                Nos Produits
              </Link>
              <Link to="/promotions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">
                Promotions
              </Link>
              <Link to="/espace-recrutement" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">
                Espace Recrutement
              </Link>
              <Link to="/nous-contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">
                Nous Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Menu vertical */}
      <VerticalMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Navbar;