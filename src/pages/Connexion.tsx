import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm
} from '../components/auth';

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
              />
            ) : (
              <RegisterForm 
                inCart={inCart}
                onSwitchForm={toggleLoginMode}
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