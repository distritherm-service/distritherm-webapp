import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

// Interface pour les données de connexion
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  inCart?: boolean;
  onSwitchForm: () => void;
  onShowForgotPassword: () => void;
  onGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
  onGoogleError: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  inCart = false, 
  onSwitchForm, 
  onShowForgotPassword,
  onGoogleSuccess,
  onGoogleError 
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // Gestion du changement de formulaire (login)
  const handleLoginFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value
    });
  };

  // Fonction pour gérer la connexion classique
  const handleRegularLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      
      const responseData = await authService.login(loginFormData);
      
      // Mettre à jour l'état d'authentification globale
      login(responseData);
      
      // Redirection après connexion réussie
      if (inCart) {
        setTimeout(() => {
          navigate('/panier/delivery');
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      if (error.response?.status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else if (error.response?.status === 400) {
        setError('Veuillez vérifier vos informations de connexion.');
      } else {
        setError(error.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegularLogin} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
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
            value={loginFormData.email}
            onChange={handleLoginFormChange}
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
            value={loginFormData.password}
            onChange={handleLoginFormChange}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onShowForgotPassword}
          className="text-sm text-[#007FFF] hover:underline"
        >
          Mot de passe oublié ?
        </button>
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white rounded-lg hover:from-[#6ba9d8] hover:to-[#0065cc]"
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Se connecter'}
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
              text="continue_with"
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
          Vous n'avez pas de compte ?{' '}
          <button
            type="button"
            onClick={onSwitchForm}
            className="text-[#007FFF] hover:underline font-medium"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm; 