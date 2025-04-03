import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FaUsers, FaGraduationCap, FaHandshake, FaChartLine, FaFileUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosConfig';

interface FormData {
  poste: string;
  civilite: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  posteActuel: string;
  message: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const EspaceRecrutement: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    poste: '',
    civilite: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    ville: '',
    posteActuel: '',
    message: ''
  });
  const [cv, setCv] = useState<File | null>(null);
  const [lettre, setLettre] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'Le fichier ne doit pas dépasser 5MB';
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Format de fichier non supporté. Utilisez PDF, DOC ou DOCX';
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'lettre') => {
    const file = event.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        event.target.value = '';
        return;
      }

      if (type === 'cv') {
        setCv(file);
        setErrors({ ...errors, cv: '' });
      } else {
        setLettre(file);
        setErrors({ ...errors, lettre: '' });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.poste) newErrors.poste = 'Veuillez sélectionner un poste';
    if (!formData.civilite) newErrors.civilite = 'Veuillez sélectionner une civilité';
    if (!formData.nom) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.telephone) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.adresse) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.codePostal) newErrors.codePostal = 'Le code postal est requis';
    if (!formData.ville) newErrors.ville = 'La ville est requise';
    if (!cv) newErrors.cv = 'Le CV est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      poste: '',
      civilite: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      codePostal: '',
      ville: '',
      posteActuel: '',
      message: ''
    });
    setCv(null);
    setLettre(null);
    // Reset file inputs
    const cvInput = document.getElementById('cv-upload') as HTMLInputElement;
    const lettreInput = document.getElementById('lettre-upload') as HTMLInputElement;
    if (cvInput) cvInput.value = '';
    if (lettreInput) lettreInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();

    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append files
    if (cv) formDataToSend.append('cv', cv);
    if (lettre) formDataToSend.append('lettre', lettre);

    try {
      const response = await axiosInstance.post('/recruitment/apply', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Votre candidature a été envoyée avec succès !');
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la candidature:', error);
      toast.error('Une erreur est survenue lors de l\'envoi de votre candidature');
    } finally {
      setIsLoading(false);
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
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Poste souhaité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste Souhaité
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="poste"
                    value={formData.poste}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.poste ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                  >
                    <option value="">Sélectionnez un poste</option>
                    {postes.map((poste) => (
                      <option key={poste} value={poste}>
                        {poste}
                      </option>
                    ))}
                  </select>
                  {errors.poste && <p className="text-red-500 text-sm mt-1">{errors.poste}</p>}
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
                        checked={formData.civilite === 'M.'}
                        onChange={(e) => handleInputChange(e)}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-700">M.</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="Mme"
                        checked={formData.civilite === 'Mme'}
                        onChange={(e) => handleInputChange(e)}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-700">Mme</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="Non précisé"
                        checked={formData.civilite === 'Non précisé'}
                        onChange={(e) => handleInputChange(e)}
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
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.nom ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                      placeholder="Mohamed"
                    />
                    {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.prenom ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                      placeholder="Ali"
                    />
                    {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
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
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                      placeholder="mohamed@gmail.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.telephone ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                      placeholder="06 06 06 06 06"
                    />
                    {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
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
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.adresse ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                    placeholder="16 rue du condorcet"
                  />
                  {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
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
                      name="codePostal"
                      value={formData.codePostal}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.codePostal ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                      placeholder="75000"
                    />
                    {errors.codePostal && <p className="text-red-500 text-sm mt-1">{errors.codePostal}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.ville ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                      placeholder="Paris"
                    />
                    {errors.ville && <p className="text-red-500 text-sm mt-1">{errors.ville}</p>}
                  </div>
                </div>

                {/* Poste Actuel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste Actuel
                  </label>
                  <input
                    type="text"
                    name="posteActuel"
                    value={formData.posteActuel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.posteActuel ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                    placeholder="Technicien(ne) de maintenance"
                  />
                  {errors.posteActuel && <p className="text-red-500 text-sm mt-1">{errors.posteActuel}</p>}
                </div>

                {/* CV et Lettre de motivation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre CV
                      <span className="text-red-500">*</span>
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
                        className={`flex items-center justify-center w-full px-4 py-3 rounded-lg border-2 border-dashed ${
                          errors.cv ? 'border-red-500' : 'border-gray-300'
                        } hover:border-teal-500 cursor-pointer bg-white/70 transition-colors duration-200`}
                      >
                        <FaFileUpload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {cv ? cv.name : "Choisir un fichier"}
                        </span>
                      </label>
                      {errors.cv && <p className="text-red-500 text-sm mt-1">{errors.cv}</p>}
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
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70`}
                    placeholder="Présentez-vous brièvement et expliquez-nous votre motivation..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                {/* Bouton d'envoi */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-teal-700 hover:to-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      'Envoyer ma candidature'
                    )}
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