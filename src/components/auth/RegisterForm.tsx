import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaEnvelope, FaLock, FaUser, FaPhone, FaIdCard } from 'react-icons/fa';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

// Interface pour les données d'inscription
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  siretNumber: string;
  phoneNumber: string;
}

interface RegisterFormProps {
  inCart?: boolean;
  onSwitchForm: () => void;
  onGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
  onGoogleError: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  inCart = false, 
  onSwitchForm, 
  onGoogleSuccess, 
  onGoogleError 
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    siretNumber: '',
    phoneNumber: ''
  });

  // Gestion du changement de formulaire (register)
  const handleRegisterFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterFormData({
      ...registerFormData,
      [name]: value
    });
  };

  // Fonction pour gérer l'inscription classique
  const handleRegularRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // console.log('Does d\'inscription à envoyer:', registerFormData);
      
      const responseData = await authService.register(registerFormData);
      
      // Mettre à jour l'état d'authentification globale
      login(responseData);
      
      // Redirection après inscription réussie
      if (inCart) {
        setTimeout(() => {
          navigate('/panier/delivery');
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/inscription-reussie');
        }, 1000);
      }
    } catch (error: any) {
      // console.error('eur d\'inscription:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegularRegister} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="firstName"
              className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent"
              placeholder="Jean"
              value={registerFormData.firstName}
              onChange={handleRegisterFormChange}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="lastName"
              className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent"
              placeholder="Dupont"
              value={registerFormData.lastName}
              onChange={handleRegisterFormChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adresse email
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent"
            placeholder="votreemail@exemple.com"
            value={registerFormData.email}
            onChange={handleRegisterFormChange}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="password"
            className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent"
            placeholder="********"
            value={registerFormData.password}
            onChange={handleRegisterFormChange}
            required
            minLength={8}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Le mot de passe doit contenir au moins 8 caractères.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaPhone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phoneNumber"
            className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent"
            placeholder="06 12 34 56 78"
            value={registerFormData.phoneNumber}
            onChange={handleRegisterFormChange}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom de l'entreprise
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaBuilding className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="companyName"
            className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent"
            placeholder="Votre entreprise"
            value={registerFormData.companyName}
            onChange={handleRegisterFormChange}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro SIRET
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaIdCard className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="siretNumber"
            className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-transparent"
            placeholder="123 456 789 00012"
            value={registerFormData.siretNumber}
            onChange={handleRegisterFormChange}
            required
          />
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white rounded-lg hover:from-[#6ba9d8] hover:to-[#0065cc]"
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Créer un compte'}
        </button>
      </div>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-full">
            <GoogleLogin
              width="100%"
              size="large"
              text="signup_with"
              shape="rectangular"
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              useOneTap={false}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <button
            type="button"
            onClick={onSwitchForm}
            className="text-[#007FFF] hover:underline font-medium"
          >
            Se connecter
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm; 