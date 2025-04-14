import React from 'react';
import Layout from '../components/Layout';
import { FaMapMarkerAlt, FaUsers, FaHistory, FaStar, FaHandshake, FaTruck, FaEye, FaAward, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const APropos: React.FC = () => {
  const navigate = useNavigate();

  const magasins = [
    { 
      id: 'taverny', 
      name: 'Taverny', 
      address: '16 rue Condorcet, 95150 Taverny',
      tel: '01 23 45 67 89',
      email: 'taverny@distritherm.fr',
      image: '/Taverny.png'
    },
    { 
      id: 'drancy', 
      name: 'Drancy', 
      address: '23 rue des Bois, 93700 Drancy',
      tel: '01 23 45 67 90',
      email: 'drancy@distritherm.fr',
      image: '/slider-2.jpeg'
    },
  ];

  const fournisseurs = [
    { id: 1, image: '/fournisseur1.png' },
    { id: 2, image: '/fournisseur2.jpg' },
    { id: 3, image: '/fournisseur3.png' },
    { id: 4, image: '/fournisseur4.png' },
    { id: 5, image: '/fournisseur5.jpg' },
    { id: 6, image: '/fournisseur6.jpg' }
  ];

  const valeurs = [
    { 
      icon: <FaUsers />, 
      title: "Proximité client", 
      description: "Nous plaçons la satisfaction et l'écoute de nos clients au centre de nos préoccupations." 
    },
    { 
      icon: <FaAward />, 
      title: "Expertise", 
      description: "Notre équipe d'experts qualifiés vous garantit des conseils professionnels et pertinents." 
    },
    { 
      icon: <FaShieldAlt />, 
      title: "Qualité", 
      description: "Nous sélectionnons rigoureusement nos produits pour vous offrir le meilleur rapport qualité-prix." 
    },
    { 
      icon: <FaTruck />, 
      title: "Réactivité", 
      description: "Notre service de livraison rapide vous permet de disposer de vos produits dans les meilleurs délais." 
    }
  ];

  return (
    <Layout>
      {/* Arrière-plan décoratif */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.2]" />
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        </div>
        
        {/* En-tête de la page */}
        <div className="relative pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
                <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                  À propos de Distritherm Service
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto mt-8">
                Découvrez notre histoire, nos valeurs et notre engagement envers nos clients et partenaires
              </p>
            </div>
          </div>
        </div>

        {/* Section Notre Histoire */}
        <section className="relative py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  <FaHistory className="text-3xl text-[#007FFF] mr-4" />
                  <h2 className="text-3xl font-bold text-gray-800">Notre Histoire</h2>
                </div>
                <p className="text-gray-600 mb-4">
                DISTRITHERM SERVICES est une entreprise spécialisée dans la distribution de matériaux et équipements pour l'amélioration et le confort de l'habitat. Fondée en 2022, l'entreprise propose une vaste gamme de plus de 10 000 références produits, couvrant des domaines tels que la plâtrerie, l'isolation, les pompes à chaleur, et bien d'autres. Avec deux entrepôts situés à Taverny et Drancy, DISTRITHERM SERVICES s'engage à fournir des produits de qualité et un service client exceptionnel, notamment grâce à une disponibilité constante des produits et des livraisons rapides dans toute l'Île-de-France et au-delà.
                </p>
                <p className="text-gray-600 mb-4">
                  Aujourd'hui, avec nos deux points de vente à Taverny et Drancy, nous sommes fiers de servir une clientèle professionnelle et particulière dans toute l'Île-de-France, proposant une large gamme de produits et services dans le domaine du bâtiment.
                </p>
                <p className="text-gray-600">
                  Notre mission reste inchangée : fournir des produits de qualité supérieure, offrir un service client exemplaire et contribuer à la réussite de vos projets.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-80 md:h-[450px]">
                <img 
                  src="/slider-1.jpeg" 
                  alt="L'histoire de Distritherm" 
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-white text-xl font-bold">Négoce en matériaux indépendant</h3>
                    <p className="text-white/90">Spécialisé dans plusieurs domaines d'activités</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Valeurs */}
        <section className="relative py-16 bg-gradient-to-r from-[#0000FF]/5 to-[#007FFF]/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                <span className="relative inline-block">
                  Nos Valeurs
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Les principes qui guident nos actions au quotidien
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {valeurs.map((valeur, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl text-white bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-lg transform -rotate-6">
                    {valeur.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{valeur.title}</h3>
                  <p className="text-gray-600">{valeur.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Nos Magasins */}
        <section className="relative py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                <span className="relative inline-block">
                  Nos Magasins
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Retrouvez-nous dans nos points de vente en Île-de-France
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {magasins.map((magasin) => (
                <div 
                  key={magasin.id} 
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl group"
                >
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={magasin.image} 
                      alt={`Magasin de ${magasin.name}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-white text-2xl font-bold">{magasin.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start space-x-3 mb-3">
                      <FaMapMarkerAlt className="flex-shrink-0 w-5 h-5 text-[#1E90FF] mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">Adresse</h4>
                        <p className="text-gray-600">{magasin.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 text-[#1E90FF] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Téléphone</h4>
                        <p className="text-gray-600">{magasin.tel}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 text-[#1E90FF] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Email</h4>
                        <p className="text-gray-600">{magasin.email}</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <a 
                        href={magasin.id === 'taverny' 
                          ? "https://www.google.com/maps/place/Distritherm+Services/@49.028085,2.1898189,17z/data=!3m1!4b1!4m6!3m5!1s0x47e65f83bd01199d:0x6c3662d8abbc2b5b!8m2!3d49.028085!4d2.1898189!16s%2Fg%2F11k4qzz8tm?entry=ttu" 
                          : "https://www.google.com/maps?q=151+Rue+Diderot,+93700+Drancy&ftid=0x47e66c92695024a9:0xa36405cf30ef2e2f"
                        } 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] hover:from-[#0000CC] hover:to-[#0470dd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E90FF] transition-colors duration-300"
                      >
                        <FaMapMarkerAlt className="mr-2" />
                        Voir sur la carte
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div id="map-section" className="mt-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 overflow-hidden">
              <div className="rounded-xl overflow-hidden aspect-video">
                <iframe 
                  src="https://www.google.com/maps/d/u/0/embed?mid=1tpn6GOXi0kycdEFSlFyv95Jy_X-lUgY&ehbc=2E312F" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '400px' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Section Notre Vision */}
        <section className="relative py-16 bg-gradient-to-r from-[#0000FF]/5 to-[#1E90FF]/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <FaEye className="text-3xl text-[#1E90FF] mr-4" />
                  <h2 className="text-3xl font-bold text-gray-800">Notre Vision</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Distritherm Service aspire à devenir le distributeur de référence en matériaux et solutions pour les professionnels du bâtiment en Île-de-France.
                </p>
                <p className="text-gray-600">
                  Nous nous engageons à accompagner la transition énergétique en proposant des solutions innovantes et écologiques, tout en maintenant notre engagement envers l'excellence du service client et la qualité des produits.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Nos Engagements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007FFF]/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Qualité garantie</h4>
                        <p className="text-gray-600 text-sm">Nous sélectionnons avec soin les meilleurs produits du marché</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007FFF]/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Conseils d'experts</h4>
                        <p className="text-gray-600 text-sm">Notre équipe de professionnels vous guide dans vos choix</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007FFF]/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Livraison rapide</h4>
                        <p className="text-gray-600 text-sm">Nous assurons une livraison efficace sur tous vos chantiers</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007FFF]/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Prix compétitifs</h4>
                        <p className="text-gray-600 text-sm">Nous négocions les meilleurs tarifs pour nos clients</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007FFF]/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Solutions durables</h4>
                        <p className="text-gray-600 text-sm">Nous favorisons les produits respectueux de l'environnement</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007FFF]/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Service après-vente</h4>
                        <p className="text-gray-600 text-sm">Notre support client reste à votre écoute après l'achat</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Partenaires */}
        <section className="relative py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                <span className="relative inline-block">
                  Nos Partenaires
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nous travaillons avec les meilleures marques pour vous offrir des produits de qualité
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
              {fournisseurs.map((fournisseur) => (
                <div 
                  key={fournisseur.id} 
                  className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md p-4 flex items-center justify-center transition-transform hover:scale-105 duration-300"
                >
                  <img 
                    src={fournisseur.image} 
                    alt={`Partenaire ${fournisseur.id}`} 
                    className="max-h-16 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-16 bg-gradient-to-r from-[#0000FF] to-[#1E90FF] rounded-3xl mx-4 md:mx-8 lg:mx-12 my-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-100" />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Prêt à démarrer votre projet ?</h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8">
                Nos équipes sont à votre disposition pour vous accompagner dans tous vos projets de construction et de rénovation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#1E90FF] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E90FF] focus:ring-white transition-colors duration-300"
                >
                  Contactez-nous
                </a>
                <a 
                  href="/nos-products" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E90FF] focus:ring-white transition-colors duration-300 border-white"
                >
                  Découvrir nos produits
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section Service de Livraison */}
        <section className="relative py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                <span className="relative inline-block">
                  Notre Service de Livraison
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
                </span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Fiabilité et réactivité au service de vos chantiers
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] order-2 lg:order-1">
                <img 
                  src="/camion-livraison.png" 
                  alt="Camion de livraison DISTRITHERM Services" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 order-1 lg:order-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Livraison sur mesure</h3>
                <p className="text-gray-600 mb-4">
                  Nous livrons en direct sur chantier, à votre dépôt ou proposons le retrait à notre magasin. Vos commandes sont soigneusement préparées par notre équipe logistique.
                </p>
                <p className="text-gray-600 mb-4">
                  Notre service est organisé de manière à vous garantir des délais de livraison courts et un accueil en magasin de 6h30 à 17h pour le retrait de vos commandes ou pour accéder à notre espace libre-service.
                </p>
                <div className="flex flex-col md:flex-row gap-6 mt-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#7CB9E8]/20 rounded-full flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Livraison rapide</h4>
                      <p className="text-gray-600 text-sm">Délais optimisés</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#7CB9E8]/20 rounded-full flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Sécurité garantie</h4>
                      <p className="text-gray-600 text-sm">Emballage soigné</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Équipement spécialisé</h3>
                <p className="text-gray-600 mb-4">
                  Vous avez en main toutes les cartes pour livrer vos chantiers dans le respect des délais, que vous interveniez en plomberie, électricité ou tout autre type de travaux techniques dans le domaine du bâtiment.
                </p>
                <p className="text-gray-600 mb-4">
                  Avec DISTRITHERM Services Taverny ou Drancy, vous avez l'assurance d'un partenaire fiable et réactif, qui comprend vos enjeux et s'engage à vos côtés pour la réussite de vos projets.
                </p>
                <div className="flex flex-col md:flex-row gap-6 mt-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#7CB9E8]/20 rounded-full flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Équipe dédiée</h4>
                      <p className="text-gray-600 text-sm">Personnel qualifié</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#7CB9E8]/20 rounded-full flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Retrait sur site</h4>
                      <p className="text-gray-600 text-sm">Ouvert de 6h30 à 17h</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img 
                  src="/camion-grue.png" 
                  alt="Camion grue DISTRITHERM Services" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#318CE7]/10 to-[#1E90FF]/10 rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Distritherm Services votre partenaire de confiance</h3>
                <p className="text-gray-600 max-w-4xl mx-auto mb-6">
                  Notre large gamme de produits, notre expertise technique et notre sens du service font de nous un négoce de matériaux de référence pour les professionnels du bâtiment en région parisienne et partout en France.
                </p>
                <a 
                  href="/nos-produits" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] hover:from-[#0000CC] hover:to-[#0470dd] transition-colors duration-300 shadow-md"
                >
                  Choisir vos produits
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation rapide - Bouton retour */}
        {/* <div className="fixed bottom-8 left-8 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="bg-[#1E90FF] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
            aria-label="Retour à la page précédente"
          >
            <FaArrowLeft />
          </motion.button>
        </div> */}
      </div>
    </Layout>
  );
};

export default APropos; 