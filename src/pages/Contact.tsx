import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaClock, FaBuilding, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { axiosInstance } from '../services/axiosConfig';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Layout from '../components/layout/Layout';

// Interface pour les agences
interface Agency {
  id: number;
  name: string;
  address: string;
  city?: string;
  postal_code?: string;
}

// Interface pour le formulaire de contact
interface ContactFormData {
  civility: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  address: string;
  postal_code: string;
  city: string;
  principal_activity: string;
  message: string;
  agency_id: number | null;
  attachments: File[];
}

const Contact: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // État pour le formulaire
  const [formData, setFormData] = useState<ContactFormData>({
    civility: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    company_name: '',
    address: '',
    postal_code: '',
    city: '',
    principal_activity: '',
    message: '',
    agency_id: null,
    attachments: []
  });

  // Récupérer les agences depuis l'API
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/agencies');
        // Vérifier la structure de la réponse
        const agenciesData = Array.isArray(response.data) 
          ? response.data 
          : response.data.data || response.data.agencies || [];
        setAgencies(agenciesData);
      } catch (err) {
        console.error('Erreur lors de la récupération des agences:', err);
        setError('Impossible de récupérer la liste des agences. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Gérer les changements de civilité (radio buttons)
  const handleCivilityChange = (civility: string) => {
    setFormData({
      ...formData,
      civility
    });
  };

  // Gérer les changements d'agence
  const handleAgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      agency_id: value ? parseInt(value, 10) : null
    });
  };

  // Gérer l'ajout de pièces jointes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convertir FileList en Array pour pouvoir le manipuler
      const filesArray = Array.from(e.target.files);
      
      // Vérifier la taille des fichiers (limite à 5MB par fichier)
      const validFiles = filesArray.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (validFiles.length !== filesArray.length) {
        setError('Certains fichiers dépassent la limite de 5MB et ont été ignorés.');
      }
      
      // Maximum 3 fichiers
      const limitedFiles = validFiles.slice(0, 3);
      
      if (validFiles.length > 3) {
        setError('Vous pouvez joindre jusqu\'à 3 fichiers maximum.');
      }
      
      setFormData({
        ...formData,
        attachments: limitedFiles
      });
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation du formulaire
    if (!formData.civility) {
      setError('Veuillez sélectionner une civilité.');
      return;
    }

    if (!formData.first_name || !formData.last_name) {
      setError('Veuillez renseigner votre nom et prénom.');
      return;
    }

    if (!formData.email) {
      setError('Veuillez renseigner votre email.');
      return;
    }

    // Validation basique d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez saisir un email valide.');
      return;
    }

    if (!formData.phone_number) {
      setError('Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    if (!formData.address || !formData.postal_code || !formData.city) {
      setError('Veuillez renseigner votre adresse complète.');
      return;
    }

    if (!formData.agency_id) {
      setError('Veuillez sélectionner une agence.');
      return;
    }

    // Formater le numéro de téléphone (supprimer les espaces)
    const formattedPhoneNumber = formData.phone_number.replace(/\s+/g, '');

    // Préparer les données à envoyer
    const contactData = {
      ...formData,
      phone_number: formattedPhoneNumber,
      agency_id: formData.agency_id
    };

    try {
      setFormLoading(true);
      console.log('Données envoyées:', contactData);
      
      // Créer un FormData pour envoyer les fichiers
      const formDataToSend = new FormData();
      
      // Ajouter toutes les données du formulaire
      Object.entries(contactData).forEach(([key, value]) => {
        // Ne pas ajouter les pièces jointes ici, on les traite séparément
        if (key !== 'attachments') {
          formDataToSend.append(key, String(value));
        }
      });
      
      // Ajouter les pièces jointes
      formData.attachments.forEach((file, index) => {
        formDataToSend.append(`attachments[${index}]`, file);
      });
      
      // Envoyer les données
      const response = await axiosInstance.post('/contact', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Réponse:', response.data);
      setSuccess('Votre message a été envoyé avec succès. Notre équipe vous contactera prochainement.');
      
      // Réinitialiser le formulaire
      setFormData({
        civility: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        company_name: '',
        address: '',
        postal_code: '',
        city: '',
        principal_activity: '',
        message: '',
        agency_id: null,
        attachments: []
      });
    } catch (err: any) {
      console.error('Erreur lors de l\'envoi du message:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error ||
                         'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.';
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow">
      <section className="relative h-64 md:h-80 lg:h-[420px] w-full overflow-hidden shadow-md">
          {/* Image d'arrière-plan */}
          <div className="absolute inset-0">
            <img
              src="/icone/image-contact.png"
              alt="Recrutement Distritherm Services"
              className="w-full h-full object-cover object-center"
            />
            {/* Voile sombre en dégradé pour une meilleure lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm" />
          </div>

          {/* Contenu : Titre + Breadcrumb */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">Besoin d'aide ?</h1>
            <br />
            <Breadcrumb />
          </div>

          {/* Ombre courbée en bas */}
          <div className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2">
            <svg viewBox="0 0 1600 100" className="w-full h-6 md:h-8" preserveAspectRatio="none">
              <path d="M0,0 C600,100 1000,100 1600,0 L1600,100 L0,100 Z" fill="#f8f9ff"/>
            </svg>
          </div>
        </section>
        <section className="relative py-20 overflow-hidden">
          {/* Arrière-plan décoratif */}
        

          <div className="container relative mx-auto px-4">
            {/* En-tête de la page */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
                <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                  Contactez-nous
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
              </h1>
              <p className="text-gray-600 max-w-4xl mx-auto mt-7">
                Nous sommes à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos projets
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Informations de contact */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 sticky top-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Nos coordonnées</h3>
                  
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <FaSpinner className="animate-spin h-8 w-8 text-[#007FFF]" />
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 rounded-lg text-red-700 mb-6">
                      {error}
                    </div>
                  ) : (
                    /* Liste des agences */
                    agencies && agencies.length > 0 ? agencies.map((agency) => (
                      <div key={agency.id} className="mb-8 last:mb-0">
                        <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md">
                          <div className="flex-shrink-0">
                            <FaBuilding className="w-6 h-6 text-[#007FFF]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{agency.name}</h4>
                            <p className="text-gray-600 text-sm mt-1">{agency.address}</p>
                            {agency.postal_code && agency.city && (
                              <p className="text-gray-600 text-sm">{agency.postal_code} {agency.city}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700">
                        Aucune agence disponible pour le moment.
                      </div>
                    )
                  )}

                  {/* Autres informations de contact */}
                  <div className="space-y-4 mt-8">
                    <div className="flex items-center space-x-4">
                      <FaPhone className="w-5 h-5 text-[#007FFF]" />
                      <span className="text-gray-600">01 48 30 45 70</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FaEnvelope className="w-5 h-5 text-[#007FFF]" />
                      <span className="text-gray-600">info@distritherm.fr</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FaClock className="w-5 h-5 text-[#007FFF]" />
                      <span className="text-gray-600">Lun-Ven: 6h30-17h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire de contact */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Formulaire de contact</h3>
                  
                  {error && (
                    <div className="p-4 bg-red-50 rounded-lg text-red-700 mb-6">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 bg-green-50 rounded-lg text-green-700 mb-6 flex items-start">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <span>{success}</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sélection de l'agence */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Votre Agence
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="agency_id"
                        value={formData.agency_id || ''}
                        onChange={handleAgencyChange}
                        className="w-full px-4 h-[45px] rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                        required
                      >
                        <option value="">Choisissez votre Agence</option>
                        {agencies && agencies.length > 0 && agencies.map((agency) => (
                          <option key={agency.id} value={agency.id}>
                            {agency.name}
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
                            checked={formData.civility === 'M.'}
                            onChange={() => handleCivilityChange('M.')}
                            className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
                            required
                          />
                          <span className="ml-2 text-gray-700">M.</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="Mme"
                            checked={formData.civility === 'Mme'}
                            onChange={() => handleCivilityChange('Mme')}
                            className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
                          />
                          <span className="ml-2 text-gray-700">Mme</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="Non précisé"
                            checked={formData.civility === 'Non précisé'}
                            onChange={() => handleCivilityChange('Non précisé')}
                            className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
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
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                          placeholder="Nom"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                          placeholder="Prénom"
                          required
                        />
                      </div>
                    </div>

                    {/* Nom de l'entreprise */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                        placeholder="Nom de votre entreprise"
                      />
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
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                          placeholder="Adresse e-mail"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                          placeholder="Téléphone"
                          required
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
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                        placeholder="Adresse"
                        required
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
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                          placeholder="Code Postal"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                          placeholder="Ville"
                          required
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
                        name="principal_activity"
                        value={formData.principal_activity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                        placeholder="Activité Principale"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                        placeholder="Message"
                      />
                    </div>

                    {/* Pièces jointes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pièces jointes
                        <span className="text-xs text-gray-500 ml-2">(3 fichiers max, 5MB par fichier)</span>
                      </label>
                      <div className="flex flex-col space-y-2">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        />
                        {formData.attachments.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Fichiers sélectionnés :</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600">
                              {formData.attachments.map((file, index) => (
                                <li key={index} className="flex items-center justify-between">
                                  <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newAttachments = [...formData.attachments];
                                      newAttachments.splice(index, 1);
                                      setFormData({
                                        ...formData,
                                        attachments: newAttachments
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 text-sm ml-2"
                                  >
                                    Supprimer
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Formats acceptés: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX</p>
                    </div>

                    {/* Bouton d'envoi */}
                    <div>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full px-6 py-4 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white font-medium rounded-lg hover:from-[#6ba9d8] hover:to-[#0065cc] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {formLoading ? (
                          <span className="flex items-center justify-center">
                            <FaSpinner className="animate-spin mr-2" /> Envoi en cours...
                          </span>
                        ) : 'Envoyer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact; 