import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaIdCard, FaSave, FaUserEdit } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  siretNumber: string;
}

interface PersonalInfoFormProps {
  user: any;
  onUpdateSuccess: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ user, onUpdateSuccess }) => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    companyName: user?.companyName || user?.client?.companyName || '',
    siretNumber: user?.siretNumber || user?.client?.siretNumber || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'siretNumber') {
      const numericValue = value.replace(/\D/g, '');
      const limitedValue = numericValue.slice(0, 14);
      setFormData(prev => ({ ...prev, [name]: limitedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (formData.siretNumber) {
      const numericSiret = formData.siretNumber.replace(/\D/g, '');
      if (numericSiret.length !== 14) {
        setError('Le numéro SIRET doit contenir exactement 14 chiffres.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    if (!validateForm()) {
      setIsSaving(false);
      return;
    }

    try {
      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        siretNumber: formData.siretNumber.replace(/\D/g, '')
      };

      const response = await authService.updateProfile(updatedData);
      
      if (response.user) {
        updateUser(response.user);
        setSuccessMessage('Votre profil a été mis à jour avec succès.');
        setIsEditing(false);
        onUpdateSuccess();
      }
    } catch (error: any) {
      let errorMessage = 'Une erreur est survenue lors de la mise à jour du profil.';
      
      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('téléphone')) {
          errorMessage = 'Le format du numéro de téléphone n\'est pas valide.';
        } else if (error.response?.data?.message?.includes('SIRET')) {
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

  return (
    <form onSubmit={handleSubmit}>
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
                  : 'border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                  : 'border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                : 'border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            }`}
            placeholder="06 12 34 56 78"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Format: 06 12 34 56 78</p>
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
                : 'border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                : 'border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            }`}
            placeholder="12345678901234"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Format: 14 chiffres uniquement</p>
      </div>
      
      <div className="mt-8 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  email: user?.email || '',
                  phoneNumber: user?.phoneNumber || '',
                  companyName: user?.companyName || '',
                  siretNumber: user?.siretNumber || '',
                });
                setError('');
                setSuccessMessage('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSaving 
                  ? 'bg-[#7CB9E8] cursor-not-allowed' 
                  : 'bg-[#007FFF] hover:bg-[#0066CC]'
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
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaUserEdit className="mr-2" />
            Modifier
          </button>
        )}
      </div>
    </form>
  );
};

export default PersonalInfoForm; 