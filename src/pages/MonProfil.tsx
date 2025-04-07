import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FaBuilding, FaEnvelope, FaLock, FaUser, FaPhone, FaIdCard, FaSave, FaKey, FaUserEdit } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

// Interface pour les données du formulaire
interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  siretNumber: string;
}

// Interface pour le formulaire de mot de passe
interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type ProfileTab = 'informations' | 'motDePasse';

const MonProfil: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    siretNumber: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<ProfileTab>('informations');

  // Rediriger si non authentifié et initialiser les données
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connexion');
    } else if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        companyName: user.companyName || '',
        siretNumber: user.siretNumber || '',
      });
    }
  }, [isAuthenticated, navigate, user]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Si c'est le numéro SIRET, on s'assure qu'il ne contient que des chiffres
    if (name === 'siretNumber') {
      // Enlever tous les caractères non numériques
      const numericValue = value.replace(/\D/g, '');
      
      // Limiter à 14 chiffres
      const limitedValue = numericValue.slice(0, 14);
      
      setFormData(prev => ({
        ...prev,
        [name]: limitedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Gérer les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Valider le formulaire avant soumission
  const validateForm = () => {
    // Vérifier que le numéro SIRET contient exactement 14 chiffres
    if (formData.siretNumber) {
      const numericSiret = formData.siretNumber.replace(/\D/g, '');
      if (numericSiret.length !== 14) {
        setError('Le numéro SIRET doit contenir exactement 14 chiffres.');
        return false;
      }
    }
    
    return true;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    // Valider le formulaire
    if (!validateForm()) {
      setIsSaving(false);
      return;
    }

    try {
      // Formater les données avant envoi
      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        siretNumber: formData.siretNumber.replace(/\D/g, '')
      };

      console.log('Envoi des données de mise à jour:', updatedData);
      
      // Utiliser la fonction updateProfile du service authService qui gère correctement le formatage
      const response = await authService.updateProfile(updatedData);
      
      console.log('Réponse complète de mise à jour du profil:', response);
      console.log('Structure de la réponse:', Object.keys(response));
      
      if (response.user) {
        console.log('Données utilisateur reçues:', response.user);
        updateUser(response.user);
        setSuccessMessage('Votre profil a été mis à jour avec succès.');
        setIsEditing(false);
      } else {
        console.log('Aucune donnée utilisateur dans la réponse');
        // Essayons quand même de conserver les données saisies par l'utilisateur
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            companyName: formData.companyName,
            siretNumber: formData.siretNumber
          };
          updateUser(updatedUser);
          setSuccessMessage('Votre profil a été mis à jour avec succès.');
          setIsEditing(false);
        }
      }
    } catch (error: any) {
      console.error('Erreur de mise à jour du profil:', error);
      let errorMessage = 'Une erreur est survenue lors de la mise à jour du profil.';
      
      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('téléphone')) {
          errorMessage = 'Le format du numéro de téléphone n\'est pas valide.';
        } else if (error.response?.data?.message?.includes('SIRET') || error.response?.data?.message?.includes('numeric')) {
          errorMessage = 'Le format du numéro SIRET n\'est pas valide. Il doit contenir exactement 14 chiffres.';
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Soumettre le formulaire de changement de mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    // Vérifier que les nouveaux mots de passe correspondent
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      setIsSaving(false);
      return;
    }

    // Vérifier la longueur du mot de passe
    if (passwordData.newPassword.length < 8) {
      setError('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      setIsSaving(false);
      return;
    }

    try {
      await authService.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      setSuccessMessage('Votre mot de passe a été mis à jour avec succès.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Le mot de passe actuel est incorrect.');
      } else {
        setError(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du mot de passe.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const switchTab = (tab: ProfileTab) => {
    setActiveTab(tab);
    setError('');
    setSuccessMessage('');
    if (tab === 'informations') {
      setIsEditing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
          </div>
          
          {/* Tabs de navigation */}
          <div className="flex border-b">
            <button
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === 'informations'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => switchTab('informations')}
            >
              <FaUserEdit className="mr-2" />
              Informations personnelles
            </button>
            {user && user.type !== 'PROVIDER' && (
              <button
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'motDePasse'
                    ? 'border-b-2 border-teal-500 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => switchTab('motDePasse')}
              >
                <FaKey className="mr-2" />
                Changer de mot de passe
              </button>
            )}
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p>{error}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                <p>{successMessage}</p>
              </div>
            )}
            
            {/* Tab d'informations personnelles */}
            {activeTab === 'informations' && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                          !isEditing 
                            ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                            : 'border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                        }`}
                        placeholder="Prénom"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                          !isEditing 
                            ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                            : 'border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                        }`}
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 cursor-not-allowed"
                      placeholder="Email"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">L'adresse e-mail ne peut pas être modifiée.</p>
                  {user && !user?.client?.emailVerified && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-700 flex items-center">
                        <span className="mr-2">⚠️</span>
                        Votre email n'est pas vérifié. Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                        !isEditing 
                          ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                          : 'border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Format: 06 12 34 56 78 (sera automatiquement converti au format international)</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                        !isEditing 
                          ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                          : 'border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro SIRET
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="siretNumber"
                      value={formData.siretNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                        !isEditing 
                          ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                          : 'border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      placeholder="12345678901234"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Format: 14 chiffres uniquement, sans espaces ni caractères spéciaux</p>
                </div>
                
                <div className="mt-8 flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Réinitialiser le formulaire avec les données utilisateur
                          if (user) {
                            setFormData({
                              firstName: user.firstName || '',
                              lastName: user.lastName || '',
                              email: user.email || '',
                              phoneNumber: user.phoneNumber || '',
                              companyName: user.companyName || '',
                              siretNumber: user.siretNumber || '',
                            });
                          }
                          setError('');
                          setSuccessMessage('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          isSaving 
                            ? 'bg-teal-400 cursor-not-allowed' 
                            : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Enregistrer
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setError('');
                        setSuccessMessage('');
                      }}
                      className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      <FaUserEdit className="mr-2" />
                      Modifier
                    </button>
                  )}
                </div>
              </form>
            )}
            
            {/* Tab de changement de mot de passe */}
            {activeTab === 'motDePasse' && (
              <form onSubmit={handlePasswordSubmit} className="mt-4">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="********"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={8}
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="********"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Le mot de passe doit contenir au moins 8 caractères.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="********"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-2" />
                          Changer le mot de passe
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MonProfil; 