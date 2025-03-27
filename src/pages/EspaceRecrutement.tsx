import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FaUsers, FaGraduationCap, FaHandshake, FaChartLine, FaFileUpload } from 'react-icons/fa';

const EspaceRecrutement: React.FC = () => {
  const [selectedPoste, setSelectedPoste] = useState('');
  const [civilite, setCivilite] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [lettre, setLettre] = useState<File | null>(null);

  const postes = [
    "Commercial(e) B2B",
    "Technicien(ne) SAV",
    "Responsable logistique",
    "Assistant(e) commercial(e)",
    "Chargé(e) de clientèle",
    "Technicien(ne) de maintenance"
  ];

  const avantages = [
    {
      icon: <FaUsers className="w-8 h-8 text-teal-600" />,
      title: "Équipe dynamique",
      description: "Rejoignez une équipe passionnée et collaborative"
    },
    {
      icon: <FaGraduationCap className="w-8 h-8 text-teal-600" />,
      title: "Formation continue",
      description: "Développez vos compétences avec nos programmes de formation"
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-teal-600" />,
      title: "Environnement stimulant",
      description: "Travaillez dans un cadre moderne et innovant"
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-teal-600" />,
      title: "Évolution de carrière",
      description: "Des opportunités d'évolution au sein de l'entreprise"
    }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'lettre') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'cv') {
        setCv(file);
      } else {
        setLettre(file);
      }
    }
  };

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
                Rejoignez notre équipe
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-8">
              Découvrez les opportunités de carrière chez Distritherm Services et participez à notre développement
            </p>
          </div>

          {/* Section des avantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {avantages.map((avantage, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                  {avantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{avantage.title}</h3>
                <p className="text-gray-600">{avantage.description}</p>
              </div>
            ))}
          </div>

          {/* Formulaire de candidature */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Formulaire de recrutement</h2>
              
              <form className="space-y-6">
                {/* Poste souhaité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste Souhaité
                  </label>
                  <select
                    value={selectedPoste}
                    onChange={(e) => setSelectedPoste(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                  >
                    <option value="">Sélectionnez un poste</option>
                    {postes.map((poste) => (
                      <option key={poste} value={poste}>
                        {poste}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Civilité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Civilité
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
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                    />
                  </div>
                </div>

                {/* Email et Téléphone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                  />
                </div>

                {/* Code Postal et Ville */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code Postal
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                    />
                  </div>
                </div>

                {/* Poste Actuel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste Actuel
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                  />
                </div>

                {/* CV et Lettre de motivation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre CV
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'cv')}
                        className="hidden"
                        id="cv-upload"
                        accept=".pdf,.doc,.docx"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="flex items-center justify-center w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-500 cursor-pointer bg-white/70 transition-colors duration-200"
                      >
                        <FaFileUpload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {cv ? cv.name : "Choisir un fichier"}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lettre de motivation
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'lettre')}
                        className="hidden"
                        id="lettre-upload"
                        accept=".pdf,.doc,.docx"
                      />
                      <label
                        htmlFor="lettre-upload"
                        className="flex items-center justify-center w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-500 cursor-pointer bg-white/70 transition-colors duration-200"
                      >
                        <FaFileUpload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {lettre ? lettre.name : "Choisir un fichier"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                    placeholder="Présentez-vous brièvement et expliquez-nous votre motivation..."
                  />
                </div>

                {/* Bouton d'envoi */}
                <div>
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    Envoyer ma candidature
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EspaceRecrutement; 