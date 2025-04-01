import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaBuilding } from 'react-icons/fa';

const Contact: React.FC = () => {
  const [selectedMagasin, setSelectedMagasin] = useState('');
  const [civilite, setCivilite] = useState('');

  const magasins = [
    { id: 'taverny', name: 'Taverny', address: '16 rue Condorcet, 95150 Taverny' },
    { id: 'drancy', name: 'Drancy', address: '23 rue des Bois, 93700 Drancy' },
  ];

  return (
    <Layout>
      <section className="relative py-20 overflow-hidden">
        {/* Arrière-plan décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.2]" />
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        </div>

        <div className="container relative mx-auto px-4">
          {/* En-tête de la page */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Contacter votre magasin
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-8">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Informations de contact */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Nos coordonnées</h3>
                
                {/* Liste des magasins */}
                {magasins.map((magasin) => (
                  <div key={magasin.id} className="mb-8 last:mb-0">
                    <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md">
                      <div className="flex-shrink-0">
                        <FaBuilding className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{magasin.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">{magasin.address}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Autres informations de contact */}
                <div className="space-y-4 mt-8">
                  <div className="flex items-center space-x-4">
                    <FaPhone className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-600">01 23 45 67 89</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FaEnvelope className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-600">contact@distritherm.fr</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FaClock className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-600">Lun-Ven: 8h-18h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Formulaire de contact</h3>
                
                <form className="space-y-6">
                  {/* Sélection du magasin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre Magasin
                    </label>
                    <select
                      value={selectedMagasin}
                      onChange={(e) => setSelectedMagasin(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                    >
                      <option value="">Choisissez votre Magasin</option>
                      {magasins.map((magasin) => (
                        <option key={magasin.id} value={magasin.id}>
                          {magasin.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Civilité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Civilité
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="M."
                          checked={civilite === 'M.'}
                          onChange={(e) => setCivilite(e.target.value)}
                          className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-gray-700">M.</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="Mme"
                          checked={civilite === 'Mme'}
                          onChange={(e) => setCivilite(e.target.value)}
                          className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-gray-700">Mme</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="Non précisé"
                          checked={civilite === 'Non précisé'}
                          onChange={(e) => setCivilite(e.target.value)}
                          className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-gray-700">Non précisé</span>
                      </label>
                    </div>
                  </div>

                  {/* Nom et Prénom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="Nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="Prénom"
                      />
                    </div>
                  </div>

                  {/* Email et Téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse e-mail
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="Adresse e-mail"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="Téléphone"
                      />
                    </div>
                  </div>

                  {/* Adresse */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse 
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                      placeholder="Adresse"
                    />
                  </div>

                  {/* Code Postal et Ville */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code Postal
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="Code Postal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="Ville"
                      />
                    </div>
                  </div>

                  {/* Activité Principale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activité Principale
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                      placeholder="Activité Principale"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                      placeholder="Message"
                    />
                  </div>

                  {/* Bouton d'envoi */}
                  <div>
                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact; 