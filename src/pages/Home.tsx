import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';

// import ProductGrid from '../components/products/ProductGrid';
import { Product } from '../types/product';
import { getProducts } from '../services/productService';
import { FaMapMarkerAlt, FaUserPlus, FaTools, FaFileAlt, FaCheckCircle, FaExternalLinkAlt, FaPhone, FaEnvelope, FaHeadset, FaTruck, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProduitRecommanderHome from '../components/home/ProduitRecommanderHome';
import CategorieHome from '../components/home/CategorieHome';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les produits
        const response = await getProducts({ limit: 8 });
        setFeaturedProducts(response.products);
        
        // Si on arrive ici, l'API est disponible
        setApiUnavailable(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setApiUnavailable(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);



  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/a-propos');
    // Petit délai pour permettre à la page de se charger
    setTimeout(() => {
      const mapSection = document.getElementById('map-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <Layout>
      {/* Section titre et services */}
      <section className=" bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-none mx-auto px-0 sm:px-4">
          {/* Titre principal */}
          <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-800 mb-4 relative inline-block">
                <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                  Distritherm Services
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
              </h2>
              <p className="text-xl text-gray-600 mt-8 max-w-6xl mx-auto">
                Distritherm <span className="font-medium text-[#007FFF]">partenaire </span> independant spécialisé dans la distribution de matériel pour la <span className="font-medium text-[#007FFF]">renovation énergétique</span> de l'habitat
              </p>
            </div>

          {/* Grille des services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-20">
            {/* Nos Agences en France */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out border border-blue-100/50 hover:border-blue-300/50 transform hover:-translate-y-3">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8 flex flex-col items-center text-center h-full">
                {/* Icon Container */}
                <div className="w-20 h-20 flex items-center justify-center mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <img 
                    src="/icone/localisation.png" 
                    alt="Localisation" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                  Nos Agences en France
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                  Trouvez l'agence la plus proche de vous et bénéficiez d'un accompagnement personnalisé.
                </p>
                
                {/* Modern CTA Button */}
                <button 
                  onClick={handleMapClick}
                  className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  aria-label="Voir nos agences sur la carte"
                >
                  <span className="relative z-10">Voir la carte</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>

            {/* Ouverture de compte */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out border border-blue-100/50 hover:border-blue-300/50 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8 flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 flex items-center justify-center mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <img 
                    src="/icone/ouverture-compte.png" 
                    alt="Ouverture de compte" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                  Ouverture de compte
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                  Ouvrez votre compte PRO en ligne et bénéficiez de tous les avantages DISTRITHERM.
                </p>
                
                <button 
                  onClick={() => navigate('/connexion')}
                  className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  aria-label="Créer un compte"
                >
                  <span className="relative z-10">Créer mon compte</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
           </div>

            {/* SAV en ligne */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out border border-blue-100/50 hover:border-blue-300/50 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8 flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 flex items-center justify-center mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <img 
                    src="/icone/sav.png" 
                    alt="SAV" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                  SAV en ligne
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                  Bénéficiez d'un service après-vente en ligne et gérez vos demandes en direct.
                </p>
                
                <button 
                  onClick={() => navigate('/nous-contact')}
                  className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  aria-label="Accéder au SAV en ligne"
                >
                  <span className="relative z-10">Accéder au SAV</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>

            {/* Devis en ligne */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out border border-blue-100/50 hover:border-blue-300/50 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8 flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 flex items-center justify-center mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <img 
                    src="/icone/devis.png" 
                    alt="Devis" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                  Devis en ligne
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                  Demandez vos devis en ligne et recevez nos offres personnalisées rapidement.
                </p>
                
                <button 
                  onClick={() => navigate('/nos-produits')}
                  className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  aria-label="Accéder aux produits pour devis"
                >
                  <span className="relative z-10">Demander un devis</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Section Présentation */}
          <div className="max-w-7xl mx-auto">
            {/* Titre de la section */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
                <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                  À Propos de Distritherm Services
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
              </h2>
              <p className="text-xl text-gray-600 mt-8 max-w-6xl mx-auto">
                Votre <span className="font-medium text-[#007FFF]">partenaire de confiance</span> de confiance pour la distribution de matériaux de construction et de <span className="font-medium text-[#007FFF]">renovation énergétique</span> 
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Présentation principale */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white to-[#7CB9E8]/10 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,127,255,0.15)] transition-all duration-300 border border-[#7CB9E8]/20 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
                    Votre Expert en Distribution
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full transform origin-left transition-transform duration-300"></div>
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    Depuis 2022, Distritherm Services s'est imposé comme le partenaire privilégié des professionnels du bâtiment en Île-de-France. 
                    Avec nos deux agences à Taverny et Drancy, nous offrons une proximité et une réactivité inégalées.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start space-x-3">
                      <FaCheckCircle className="w-5 h-5 text-[#007FFF] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Large gamme de produits : plâtrerie, isolation, chauffage, climatisation, plomberie et énergies renouvelables</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FaCheckCircle className="w-5 h-5 text-[#007FFF] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Conseils personnalisés par des experts du secteur</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FaCheckCircle className="w-5 h-5 text-[#007FFF] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Service après-vente de qualité</span>
                    </div>
                  </div>
                  <a 
                    href="https://distritcherm-site-vitrine.vercel.app/qui-sommes-nous" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#007FFF] to-[#7CB9E8] text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <span>En savoir plus sur notre entreprise</span>
                    <FaExternalLinkAlt className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Cartes des points forts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Chiffres clés */}
                <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,127,255,0.15)] transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7CB9E8]/20 to-[#007FFF]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaChartLine className="w-7 h-7 text-[#007FFF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Nos Chiffres</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="font-bold text-2xl text-[#007FFF]">2 agences</p>
                    <p className="text-sm">en Île-de-France</p>
                    <p className="font-bold text-2xl text-[#007FFF] mt-3">+1000</p>
                    <p className="text-sm">références produits</p>
                  </div>
                </div>

                {/* Services */}
                <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,127,255,0.15)] transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#007FFF]/20 to-[#7CB9E8]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaTruck className="w-7 h-7 text-[#007FFF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Services Premium</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-[#007FFF] rounded-full"></span>
                      <span>Devis en ligne</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-[#007FFF] rounded-full"></span>
                      <span>Support technique</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-[#007FFF] rounded-full"></span>
                      <span>Conseils experts</span>
                    </li>
                  </ul>
                </div>

                {/* Contact rapide */}
                <div className="bg-gradient-to-br from-[#007FFF] to-[#7CB9E8] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,127,255,0.15)] transition-all duration-300 sm:col-span-2 group text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Besoin d'informations ?</h3>
                      <p className="text-white/90 mb-4">Notre équipe est à votre écoute du lundi au vendredi</p>
                      <div className="flex items-center space-x-4">
                        <a href="tel:0171687212" className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                          <FaPhone className="w-4 h-4" />
                          <span className="font-medium">01 71 68 72 12</span>
                        </a>
                        <a href="mailto:info@distritherm-services.fr" className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                          <FaEnvelope className="w-4 h-4" />
                          <span className="font-medium">Email</span>
                        </a>
                      </div>
                    </div>
                    <FaHeadset className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Catégories */}
      <CategorieHome />

      {/* Section Produits Recommandés */}
      <ProduitRecommanderHome />


      
    </Layout>
  );
};

export default Home; 