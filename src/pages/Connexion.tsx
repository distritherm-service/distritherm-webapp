import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  AdditionalInfoForm
} from '../components/auth';

// Interface pour l'utilisateur Google décodé
interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
  given_name?: string;
  family_name?: string;
}

// Interface pour la réponse de connexion réussie
interface LoginResponse {
  accessToken: string;
  user: any;
  message: string;
}

interface ConnexionProps {
  inCart?: boolean;
  onSuccess?: () => void;
}

const Connexion: React.FC<ConnexionProps> = ({ inCart = false, onSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated, error: authError, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [googleCredential, setGoogleCredential] = useState<string | null>(null);
  const [showAdditionalInfoForm, setShowAdditionalInfoForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);
  const [resetToken, setResetToken] = useState<string>('');

  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  useEffect(() => {
    if (isAuthenticated) {
      if (inCart && onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, inCart, onSuccess]);

  // Surveillance des erreurs d'authentification
  useEffect(() => {
    if (authError) {
      setError(authError);
      clearError();
    }
  }, [authError, clearError]);

  // Vérifie si un token de réinitialisation est présent dans l'URL au chargement
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      setResetToken(token);
      setShowResetPasswordForm(true);
      
      // Nettoyer l'URL pour supprimer le token
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Gestion de la réponse Google réussie
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      setError('');
      
      if (!credentialResponse.credential) {
        throw new Error('Aucun credential Google reçu');
      }

      setGoogleCredential(credentialResponse.credential);
      
      await authService.loginWithGoogle(credentialResponse.credential);
      
      // La redirection se fera automatiquement via le useEffect qui surveille isAuthenticated
    } catch (error: any) {
     // console.error('Erreur Google Login:', error);
      
      if (error.response?.status === 404) {
        // Utilisateur non trouvé, afficher le formulaire d'informations supplémentaires
        setShowAdditionalInfoForm(true);
      } else {
        setError(error.response?.data?.message || 'Une erreur est survenue lors de la connexion avec Google.');
      }
    }
  };
  
  // Gestion de l'erreur Google
  const handleGoogleError = () => {
    setError('La connexion avec Google a échoué. Veuillez réessayer ou utiliser le formulaire de connexion classique.');
  };

  // Fonction pour basculer entre connexion et inscription
  const toggleLoginMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  // Afficher le formulaire de mot de passe oublié
  const showForgotPassword = () => {
    setShowForgotPasswordForm(true);
    setError('');
  };

  // Masquer le formulaire de mot de passe oublié
  const hideForgotPassword = () => {
    setShowForgotPasswordForm(false);
    setError('');
  };

  // Gestion du succès de la réinitialisation du mot de passe
  const handleResetPasswordSuccess = () => {
    setShowResetPasswordForm(false);
    setIsLogin(true);
  };

  // Annuler la réinitialisation du mot de passe
  const cancelResetPassword = () => {
    setShowResetPasswordForm(false);
    setIsLogin(true);
  };

  // Annuler le formulaire d'informations supplémentaires
  const cancelAdditionalInfo = () => {
    setShowAdditionalInfoForm(false);
    setGoogleCredential(null);
    setError('');
  };

  // Rendu du contenu principal
  const renderContent = () => (
    <section className={`relative ${!inCart ? 'py-20' : 'py-4'} overflow-hidden`}>
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Connectez-vous à votre compte pour continuer' 
                  : 'Créez un compte pour accéder à tous nos services'}
              </p>
            </div>
            
            {isLogin ? (
              <LoginForm 
                inCart={inCart}
                onSwitchForm={toggleLoginMode}
                onShowForgotPassword={showForgotPassword}
                onGoogleSuccess={handleGoogleLogin}
                onGoogleError={handleGoogleError}
              />
            ) : (
              <RegisterForm 
                inCart={inCart}
                onSwitchForm={toggleLoginMode}
                onGoogleSuccess={handleGoogleLogin}
                onGoogleError={handleGoogleError}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );

  // Si on est dans le panier, ne pas inclure le Layout
  if (inCart) {
    return (
      <>
        {/* Affichage du formulaire d'informations supplémentaires */}
        {showAdditionalInfoForm && googleCredential && (
          <AdditionalInfoForm
            googleCredential={googleCredential}
            onCancel={cancelAdditionalInfo}
            inCart={inCart}
          />
        )}
        
        {/* Formulaire de mot de passe oublié */}
        {showForgotPasswordForm && (
          <ForgotPasswordForm 
            onCancel={hideForgotPassword}
          />
        )}
        
        {/* Formulaire de réinitialisation du mot de passe */}
        {showResetPasswordForm && resetToken && (
          <ResetPasswordForm
            token={resetToken}
            onCancel={cancelResetPassword}
            onSuccess={handleResetPasswordSuccess}
          />
        )}
        
        {renderContent()}
      </>
    );
  }

  // Sinon, inclure le Layout normalement
  return (
    <Layout>
      {/* Affichage du formulaire d'informations supplémentaires */}
      {showAdditionalInfoForm && googleCredential && (
        <AdditionalInfoForm
          googleCredential={googleCredential}
          onCancel={cancelAdditionalInfo}
          inCart={inCart}
        />
      )}
      
      {/* Formulaire de mot de passe oublié */}
      {showForgotPasswordForm && (
        <ForgotPasswordForm 
          onCancel={hideForgotPassword}
        />
      )}
      
      {/* Formulaire de réinitialisation du mot de passe */}
      {showResetPasswordForm && resetToken && (
        <ResetPasswordForm
          token={resetToken}
          onCancel={cancelResetPassword}
          onSuccess={handleResetPasswordSuccess}
        />
      )}
      
      {renderContent()}
    </Layout>
  );
};

export default Connexion; 