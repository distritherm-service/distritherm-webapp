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
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  À propos de Distritherm Service
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto mt-8">
                Découvrez notre histoire, nos valeurs et notre engagement envers nos clients et partenaires
              </p>
            </div>
          </div>
        </div>

        {/* Section Notre Histoire */}
        <section className="relative py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  <FaHistory className="text-3xl text-teal-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-800">Notre Histoire</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Fondée en 2005, Distritherm Service est née de la passion d'experts du secteur de la plomberie, du chauffage et des matériaux de construction. Nous avons débuté avec un petit magasin à Taverny, et grâce à la confiance de nos clients, nous avons pu développer notre activité.
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
                    <h3 className="text-white text-xl font-bold">Croissance et Innovation</h3>
                    <p className="text-white/90">Plus de 15 ans d'expertise à votre service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Valeurs */}
        <section className="relative py-16 bg-gradient-to-r from-teal-500/5 to-blue-500/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                <span className="relative inline-block">
                  Nos Valeurs
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
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
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl text-white bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg transform -rotate-6">
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
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
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
                      <FaMapMarkerAlt className="flex-shrink-0 w-5 h-5 text-teal-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">Adresse</h4>
                        <p className="text-gray-600">{magasin.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 text-teal-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Téléphone</h4>
                        <p className="text-gray-600">{magasin.tel}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 text-teal-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Email</h4>
                        <p className="text-gray-600">{magasin.email}</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <a 
                        href="https://www.google.com/maps/d/edit?mid=1tpn6GOXi0kycdEFSlFyv95Jy_X-lUgY&usp=sharing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300"
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
            <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 overflow-hidden">
              <div className="rounded-xl overflow-hidden aspect-video">
                <iframe 
                  src="https://www.google.com/maps/d/embed?mid=1tpn6GOXi0kycdEFSlFyv95Jy_X-lUgY&ehbc=2E312F" 
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
        <section className="relative py-16 bg-gradient-to-r from-teal-500/5 to-blue-500/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <FaEye className="text-3xl text-teal-600 mr-4" />
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
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Qualité garantie</h4>
                        <p className="text-gray-600 text-sm">Nous sélectionnons avec soin les meilleurs produits du marché</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Conseils d'experts</h4>
                        <p className="text-gray-600 text-sm">Notre équipe de professionnels vous guide dans vos choix</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Livraison rapide</h4>
                        <p className="text-gray-600 text-sm">Nous assurons une livraison efficace sur tous vos chantiers</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Prix compétitifs</h4>
                        <p className="text-gray-600 text-sm">Nous négocions les meilleurs tarifs pour nos clients</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Solutions durables</h4>
                        <p className="text-gray-600 text-sm">Nous favorisons les produits respectueux de l'environnement</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
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
        <section className="relative py-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-3xl mx-4 md:mx-8 lg:mx-12 my-8 overflow-hidden">
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
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-600 focus:ring-white transition-colors duration-300"
                >
                  Contactez-nous
                </a>
                <a 
                  href="/nos-products" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-600 focus:ring-white transition-colors duration-300 border-white"
                >
                  Découvrir nos produits
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation rapide - Bouton retour */}
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
    </Layout>
  );
};

export default APropos; 