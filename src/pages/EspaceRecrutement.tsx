import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FaUsers, FaGraduationCap, FaHandshake, FaChartLine, FaFileUpload, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosConfig';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

interface FormData {
  desired_position: string;
  current_position: string;
  civility: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  postal_code: string;
  city: string;
  message: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const EspaceRecrutement: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    desired_position: '',
    current_position: '',
    civility: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    postal_code: '',
    city: '',
    message: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [motivationFile, setMotivationFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dragActive, setDragActive] = useState<{ cv: boolean; motivation: boolean }>({ cv: false, motivation: false });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      icon: <FaUsers className="w-8 h-8 text-[#007FFF]" />,
      title: "Équipe dynamique",
      description: "Rejoignez une équipe passionnée et collaborative"
    },
    {
      icon: <FaGraduationCap className="w-8 h-8 text-[#007FFF]" />,
      title: "Formation continue",
      description: "Développez vos compétences avec nos programmes de formation"
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-[#007FFF]" />,
      title: "Environnement stimulant",
      description: "Travaillez dans un cadre moderne et innovant"
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-[#007FFF]" />,
      title: "Évolution de carrière",
      description: "Des opportunités d'évolution au sein de l'entreprise"
    }
  ];

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `Le fichier "${file.name}" dépasse la taille maximale de 5 MB`;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `Format du fichier "${file.name}" non supporté. Utilisez PDF, DOC ou DOCX`;
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'motivation') => {
    const file = event.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        event.target.value = '';
        if (type === 'cv') {
          setCvFile(null);
        } else {
          setMotivationFile(null);
        }
        return;
      }

      if (type === 'cv') {
        setCvFile(file);
        setErrors({ ...errors, cvFile: '' });
      } else {
        setMotivationFile(file);
        setErrors({ ...errors, motivationFile: '' });
      }
    }
  };

  // Gestion des événements de glisser-déposer
  const handleDrag = (e: React.DragEvent<HTMLDivElement>, type: 'cv' | 'motivation', isDragActive: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: isDragActive }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'cv' | 'motivation') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Vérification supplémentaire pour s'assurer que le fichier est bien défini
      if (!file) {
        toast.error("Erreur lors du chargement du fichier");
        return;
      }
      
      try {
        const error = validateFile(file);
        
        if (error) {
          toast.error(error, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        if (type === 'cv') {
          setCvFile(file);
          setErrors({ ...errors, cvFile: '' });
          // Reset input value for consistency
          const inputElement = document.getElementById('cv-upload') as HTMLInputElement;
          if (inputElement) inputElement.value = '';
        } else {
          setMotivationFile(file);
          setErrors({ ...errors, motivationFile: '' });
          // Reset input value for consistency
          const inputElement = document.getElementById('motivation-upload') as HTMLInputElement;
          if (inputElement) inputElement.value = '';
        }
      } catch (error) {
        console.error("Erreur lors du traitement du fichier:", error);
        toast.error("Une erreur s'est produite lors du traitement du fichier");
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
    
    if (!formData.desired_position) newErrors.desired_position = 'Veuillez sélectionner un poste';
    if (!formData.current_position) newErrors.current_position = 'Veuillez indiquer votre poste actuel';
    if (!formData.civility) newErrors.civility = 'Veuillez sélectionner une civilité';
    if (!formData.last_name) newErrors.last_name = 'Le nom est requis';
    if (!formData.first_name) newErrors.first_name = 'Le prénom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    else {
      // Validation basique d'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Veuillez saisir un email valide';
      }
    }
    if (!formData.phone_number) newErrors.phone_number = 'Le téléphone est requis';
    if (!formData.address) newErrors.address = 'L\'adresse est requise';
    if (!formData.postal_code) newErrors.postal_code = 'Le code postal est requis';
    if (!formData.city) newErrors.city = 'La ville est requise';
    if (!formData.message) newErrors.message = 'Le message est requis';
    if (!cvFile) newErrors.cvFile = 'Le CV est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      desired_position: '',
      current_position: '',
      civility: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      postal_code: '',
      city: '',
      message: ''
    });
    setCvFile(null);
    setMotivationFile(null);
    // Reset file inputs
    const cvInput = document.getElementById('cv-upload') as HTMLInputElement;
    const motivationInput = document.getElementById('motivation-upload') as HTMLInputElement;
    if (cvInput) cvInput.value = '';
    if (motivationInput) motivationInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Vérification explicite que cvFile existe
    if (!cvFile) {
      toast.error('Le CV est obligatoire');
      setErrors(prev => ({ ...prev, cvFile: 'Le CV est obligatoire' }));
      return;
    }

    setIsLoading(true);
    setShowSuccessMessage(false);
    const formDataToSend = new FormData();

    try {
      // Append form data - s'assurer que tous les champs sont bien ajoutés
      formDataToSend.append('desired_position', formData.desired_position);
      formDataToSend.append('current_position', formData.current_position);
      formDataToSend.append('civility', formData.civility);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('postal_code', formData.postal_code);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('message', formData.message);

      // Append files - les noms des champs doivent correspondre exactement à ceux attendus par FileFieldsInterceptor
      if (cvFile instanceof File) {
        formDataToSend.append('cvFile', cvFile, cvFile.name);
      } else {
        throw new Error('Le fichier CV n\'est pas valide');
      }
      
      if (motivationFile && motivationFile instanceof File) {
        formDataToSend.append('motivationFile', motivationFile, motivationFile.name);
      }

      // Ne pas spécifier Content-Type, axios le déterminera automatiquement avec le boundary
      const response = await axiosInstance.post('/recruitment', formDataToSend, {
        headers: {
          'x-platform': 'web',
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log('Réponse du serveur:', await response.data);
      toast.success(response.data?.message || 'Votre candidature a été envoyée avec succès !');
      setShowSuccessMessage(true);
      resetForm();
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la candidature:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         error.message ||
                         'Une erreur est survenue lors de l\'envoi de votre candidature';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter une fonction pour supprimer un fichier
  const removeFile = (type: 'cv' | 'motivation') => {
    try {
      if (type === 'cv') {
        setCvFile(null);
        const inputElement = document.getElementById('cv-upload') as HTMLInputElement;
        if (inputElement) inputElement.value = '';
      } else {
        setMotivationFile(null);
        const inputElement = document.getElementById('motivation-upload') as HTMLInputElement;
        if (inputElement) inputElement.value = '';
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumb />
      <main className="flex-grow">
        <section className="relative py-20 overflow-hidden">
          {/* Arrière-plan décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-[#7CB9E8]/30">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.2]" />
            <div className="absolute w-96 h-96 -top-48 -left-48 bg-[#7CB9E8] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-[#007FFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          </div>

          <div className="container relative mx-auto px-4">
            {/* En-tête de la page */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
                <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
                  Rejoignez notre équipe
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
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
                  <div className="w-16 h-16 rounded-lg bg-[#7CB9E8]/20 flex items-center justify-center mb-4">
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
                
                {showSuccessMessage && (
                  <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <FaCheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-green-800 font-medium">Candidature envoyée avec succès!</h3>
                        <p className="text-green-700 mt-1">
                          Votre candidature a bien été reçue. Nous l'examinerons dans les plus brefs délais et reviendrons vers vous prochainement.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Poste souhaité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poste Souhaité
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="desired_position"
                      value={formData.desired_position}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.desired_position ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                    >
                      <option value="">Sélectionnez un poste</option>
                      {postes.map((poste) => (
                        <option key={poste} value={poste}>
                          {poste}
                        </option>
                      ))}
                    </select>
                    {errors.desired_position && <p className="text-red-500 text-sm mt-1">{errors.desired_position}</p>}
                  </div>

                  {/* Poste actuel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poste Actuel
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="current_position"
                      value={formData.current_position}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.current_position ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                      placeholder="Votre poste actuel"
                    />
                    {errors.current_position && <p className="text-red-500 text-sm mt-1">{errors.current_position}</p>}
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
                          name="civility"
                          value="M."
                          checked={formData.civility === 'M.'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
                        />
                        <span className="ml-2 text-gray-700">M.</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="civility"
                          value="Mme"
                          checked={formData.civility === 'Mme'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
                        />
                        <span className="ml-2 text-gray-700">Mme</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="civility"
                          value="Non précisé"
                          checked={formData.civility === 'Non précisé'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#007FFF] border-gray-300 focus:ring-[#007FFF]"
                        />
                        <span className="ml-2 text-gray-700">Non précisé</span>
                      </label>
                    </div>
                    {errors.civility && <p className="text-red-500 text-sm mt-1">{errors.civility}</p>}
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
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.last_name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                        placeholder="Nom"
                      />
                      {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
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
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.first_name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                        placeholder="Prénom"
                      />
                      {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                    </div>
                  </div>

                  {/* Email et Téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                        placeholder="Email"
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
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.phone_number ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                        placeholder="Téléphone"
                      />
                      {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                    </div>
                  </div>

                  {/* Adresse */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                      placeholder="Adresse"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.postal_code ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                        placeholder="Code Postal"
                      />
                      {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
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
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                        placeholder="Ville"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  {/* Message / Lettre de motivation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message / Lettre de motivation
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent bg-white/70`}
                      placeholder="Votre message / motivation"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  {/* Fichiers (CV et Lettre de motivation) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CV (PDF, DOC, DOCX)
                        <span className="text-red-500">*</span>
                      </label>
                      <div 
                        className={`flex items-center justify-center w-full`}
                        onDragOver={(e) => handleDrag(e, 'cv', true)}
                        onDragEnter={(e) => handleDrag(e, 'cv', true)}
                        onDragLeave={(e) => handleDrag(e, 'cv', false)}
                        onDrop={(e) => handleDrop(e, 'cv')}
                      >
                        <label
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
                            errors.cvFile ? 'border-red-500 bg-red-50' : 
                            dragActive.cv ? 'border-[#007FFF] bg-[#7CB9E8]/20' : 
                            'border-gray-300 bg-white/70'
                          } transition-colors duration-200 relative`}
                        >
                          {cvFile && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile('cv');
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                              title="Supprimer le fichier"
                            >
                              &times;
                            </button>
                          )}
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaFileUpload className={`w-8 h-8 mb-3 ${dragActive.cv ? 'text-[#007FFF]' : 'text-[#007FFF]'}`} />
                            {!cvFile ? (
                              <>
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-gray-500">PDF, DOC ou DOCX (<span className="font-medium">max 5MB</span>)</p>
                              </>
                            ) : (
                              <div className="text-center">
                                <p className="text-sm font-medium text-[#007FFF] mb-1">
                                  Fichier sélectionné:
                                </p>
                                <p className="text-xs text-gray-700 font-medium">
                                  {cvFile.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            )}
                          </div>
                          <input
                            id="cv-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'cv')}
                          />
                        </label>
                      </div>
                      {errors.cvFile && <p className="text-red-500 text-sm mt-1">{errors.cvFile}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lettre de motivation (PDF, DOC, DOCX) (optionnel)
                      </label>
                      <div 
                        className="flex items-center justify-center w-full"
                        onDragOver={(e) => handleDrag(e, 'motivation', true)}
                        onDragEnter={(e) => handleDrag(e, 'motivation', true)}
                        onDragLeave={(e) => handleDrag(e, 'motivation', false)}
                        onDrop={(e) => handleDrop(e, 'motivation')}
                      >
                        <label
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
                            dragActive.motivation ? 'border-[#007FFF] bg-[#7CB9E8]/20' : 'border-gray-300 bg-white/70'
                          } transition-colors duration-200 relative`}
                        >
                          {motivationFile && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile('motivation');
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                              title="Supprimer le fichier"
                            >
                              &times;
                            </button>
                          )}
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaFileUpload className={`w-8 h-8 mb-3 ${dragActive.motivation ? 'text-[#007FFF]' : 'text-[#007FFF]'}`} />
                            {!motivationFile ? (
                              <>
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-gray-500">PDF, DOC ou DOCX (<span className="font-medium">max 5MB</span>)</p>
                              </>
                            ) : (
                              <div className="text-center">
                                <p className="text-sm font-medium text-[#007FFF] mb-1">
                                  Fichier sélectionné:
                                </p>
                                <p className="text-xs text-gray-700 font-medium">
                                  {motivationFile.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {(motivationFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            )}
                          </div>
                          <input
                            id="motivation-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'motivation')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Note sur les champs obligatoires */}
                  <div className="text-sm text-gray-500 mb-4">
                    Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires
                  </div>

                  {/* Bouton d'envoi */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-6 py-4 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white font-medium rounded-lg hover:from-[#6ba9d8] hover:to-[#0065cc] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <FaSpinner className="animate-spin mr-2" /> Envoi en cours...
                        </span>
                      ) : 'Envoyer ma candidature'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EspaceRecrutement; 