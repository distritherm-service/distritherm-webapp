import React from 'react';
import Layout from '../components/Layout';
import { FaMapMarkerAlt, FaUserPlus, FaTools, FaFileAlt, FaCalendarAlt, FaIndustry, FaHandshake, FaMapMarkedAlt } from 'react-icons/fa';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import ExpertAdviceSection from '../components/ExpertAdviceSection';
import QuoteSection from '../components/QuoteSection';
import LocationSection from '../components/LocationSection';
import BrandsSection from '../components/BrandsSection';
import ValueProposition from '../components/ValueProposition';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { Link, useNavigate } from 'react-router-dom';
// import Layout from '../components/Layout';
// import FeaturedProducts from '../components/FeaturedProducts';
// import PromoSection from '../components/PromoSection';
// import ServicesSection from '../components/ServicesSection';

const Home: React.FC = () => {
  const navigate = useNavigate();

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
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Titre principal */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 relative">
              <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                Distritherm Services
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mt-8 leading-relaxed font-light">
              Distritherm votre <span className="font-medium text-[#007FFF]">partenaire</span> independant spécialisé dans la distribution de matériel pour la {' '}
              <span className="font-medium text-[#007FFF]">rénovation énergetique </span>de l'habitat
            </p>
          </div>

          {/* Grille des services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Nos Agences en France */}
            <div className="group flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,127,255,0.2)] transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-[#7CB9E8]/20 rounded-full group-hover:bg-[#7CB9E8]/30 transition-colors">
                <FaMapMarkerAlt className="w-8 h-8 text-[#007FFF]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nos Agences en France</h3>
              <p className="text-gray-600 mb-4 text-sm">Trouvez l'agence la plus proche de vous.</p>
              <button 
                onClick={handleMapClick}
                className="mt-auto w-8 h-8 rounded-full bg-[#007FFF] text-white flex items-center justify-center hover:bg-[#0066CC] transition-all duration-300 transform group-hover:scale-110"
                aria-label="Voir nos agences sur la carte"
              >
                +
              </button>
            </div>

            {/* Ouverture de compte */}
            <div className="group flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,127,255,0.2)] transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-[#7CB9E8]/20 rounded-full group-hover:bg-[#7CB9E8]/30 transition-colors">
                <FaUserPlus className="w-8 h-8 text-[#007FFF]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ouverture de compte</h3>
              <p className="text-gray-600 mb-4 text-sm">Ouvrez votre compte PRO en ligne et bénéficiez de tous les avantages DISTRITHERM.</p>
              <button 
                onClick={() => navigate('/connexion')}
                className="mt-auto w-8 h-8 rounded-full bg-[#007FFF] text-white flex items-center justify-center hover:bg-[#0066CC] transition-all duration-300 transform group-hover:scale-110"
                aria-label="Créer un compte"
              >
                +
              </button>
            </div>

            {/* SAV en ligne */}
            <div className="group flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,127,255,0.2)] transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-[#7CB9E8]/20 rounded-full group-hover:bg-[#7CB9E8]/30 transition-colors">
                <FaTools className="w-8 h-8 text-[#007FFF]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">SAV en ligne</h3>
              <p className="text-gray-600 mb-4 text-sm">Bénéficiez d'un service en ligne et gérez vos SAV en direct.</p>
              <button 
                onClick={() => navigate('/nous-contact')}
                className="mt-auto w-8 h-8 rounded-full bg-[#007FFF] text-white flex items-center justify-center hover:bg-[#0066CC] transition-all duration-300 transform group-hover:scale-110"
                aria-label="Accéder au SAV en ligne"
              >
                +
              </button>
            </div>

            {/* Devis en ligne */}
            <div className="group flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,127,255,0.2)] transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-[#7CB9E8]/20 rounded-full group-hover:bg-[#7CB9E8]/30 transition-colors">
                <FaFileAlt className="w-8 h-8 text-[#007FFF]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Devis en ligne</h3>
              <p className="text-gray-600 mb-4 text-sm">Demandez vos devis en ligne et recevez nos offres dans les plus brefs délais.</p>
              <button 
                onClick={() => navigate('/nos-produits')}
                className="mt-auto w-8 h-8 rounded-full bg-[#007FFF] text-white flex items-center justify-center hover:bg-[#0066CC] transition-all duration-300 transform group-hover:scale-110"
                aria-label="Accéder aux produits pour devis"
              >
                +
              </button>
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
              <p className="text-xl text-gray-600 mt-8 max-w-3xl mx-auto">
                Découvrez notre histoire, nos engagements et notre expertise dans la distribution de matériaux de construction
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Texte de présentation */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white to-[#7CB9E8]/10 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,127,255,0.15)] transition-all duration-300 border border-[#7CB9E8]/20 backdrop-blur-sm">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
                    Bienvenue Chez Distritherm Services
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full transform origin-left transition-transform duration-300"></div>
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                    Distritherm Services, installé à Taverny (95), vous serez accueilli au sein d'un magasin par une équipe compétente 
                    et professionnelle, à votre écoute et à votre disponibilité pour répondre à l'ensemble de vos besoins en matériels ou en conseils. 
                    Nous connaissons vos attentes : rapidité, disponibilité et économie.
                    Au service des professionnels, nous misons sur la proximité, l'efficacité, et le professionnalisme pour vous accompagner au quotidien 
                    sur vos chantiers et projets de construction et de rénovation. 
                  </p>
                  <div className="flex items-center space-x-3 text-[#007FFF] bg-[#7CB9E8]/20 py-2 px-4 rounded-full inline-flex">
                    <FaCalendarAlt className="w-5 h-5" />
                    <span className="font-medium">Depuis 2022</span>
                  </div>
                </div>
              </div>

              {/* Cartes d'activités */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Expertise */}
                <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,127,255,0.15)] transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7CB9E8]/20 to-[#007FFF]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaIndustry className="w-7 h-7 text-[#007FFF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Notre Expertise</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Spécialistes en climatisation, chauffage, électricité, et installations sanitaires.
                    Nous vous accompagnons dans la réalisation de vos projets de construction, de rénovation et d'amélioration de votre habitat residenciel ou commercial.
                  </p>
                </div>

                {/* Engagement */}
                <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,127,255,0.15)] transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#007FFF]/20 to-[#7CB9E8]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaHandshake className="w-7 h-7 text-[#007FFF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Notre Engagement</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Solutions de haute qualité adaptées aux besoins spécifiques de nos clients.
                    Tous nos produits sont certifiés et répondent aux normes de qualité les plus strictes.
                  </p>
                </div>

                {/* Localisation */}
                <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,127,255,0.15)] transition-all duration-300 border border-gray-100 sm:col-span-2 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7CB9E8]/20 to-[#007FFF]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaMapMarkedAlt className="w-7 h-7 text-[#007FFF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Notre Emplacement Stratégique</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Situés à Taverny et à drancy, en Île-de-France, nous sommes idéalement positionnés pour servir les professionnels du bâtiment dans toute la région.
                  </p>
                  <div className="text-sm text-gray-500 bg-gray-50 py-2 px-4 rounded-full inline-flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#007FFF]" />
                    16 rue Condorcet, 95150 Taverny, France
                  </div>
                  <br />
                  <br />
                  <div className="text-sm text-gray-500 bg-gray-50 py-2 px-4 rounded-full inline-flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#007FFF]" />
                    151 rue Diderot, 93700 Drancy, France
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Catégories de Produits */}
      <section className="py-16 bg-white">
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

          {/* Grille de catégories */}
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Section Produits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductGrid 
            products={products} 
            title="CONSULTER NOS PRODUITS" 
          />
        </div>
      </section>

      {/* Section Devis */}
      <QuoteSection />

      {/* Section Localisation */}
      <LocationSection />
      {/* Section Conseil Expert */}
      <ExpertAdviceSection />
      {/* Section Marques Partenaires */}
      <BrandsSection />

      {/* Section Valeur Ajoutée */}
      <ValueProposition />

      
    </Layout>
  );
};

export default Home; 