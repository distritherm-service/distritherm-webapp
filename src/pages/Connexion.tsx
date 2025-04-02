import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { FaBuilding, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaGoogle, FaIdCard } from 'react-icons/fa';
import axiosInstance, { saveAuthData } from '../services/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

interface ConnexionProps {
  inCart?: boolean;
}

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

// Interface pour les informations supplémentaires d'inscription
interface AdditionalInfo {
  phoneNumber: string;
  companyName: string;
  siretNumber: string;
}

const Connexion: React.FC<ConnexionProps> = ({ inCart = false }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [googleCredential, setGoogleCredential] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    phoneNumber: '',
    companyName: '',
    siretNumber: ''
  });
  const [showAdditionalInfoForm, setShowAdditionalInfoForm] = useState(false);
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);

  // Gestion de la réponse Google réussie
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const formBody = {
        providerAuthToken: credentialResponse.credential,
        providerName: "GOOGLE",
      }

      setGoogleCredential(credentialResponse.credential || null);
      const response = await axiosInstance.post("/auth/provider-login", formBody);
      
      // Gestion de la réponse réussie
      if (response.status === 200) {
        // Mettre à jour l'état d'authentification globale
        login(await response.data);
        
        setLoginResponse(response.data);
        
        // Si on est dans le panier, on passe à l'étape suivante
        if (inCart) {
          setTimeout(() => {
            navigate('/panier/delivery');
          }, 2000);
        } else {
          // Sinon, on peut rediriger vers la page d'accueil
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setShowAdditionalInfoForm(true);
      } else {
        console.error("Erreur lors de la connexion avec Google:", error);
        setError("Une erreur est survenue lors de la connexion avec Google. Veuillez réessayer.");
      }
    }   
  }

  const handleAdditionalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formBody = {
        providerAuthToken: googleCredential,
        providerName: "GOOGLE",
        additionalInfo
      }

      const response = await axiosInstance.post("/auth/provider-register", formBody);
      
      if (response.status === 201) {
        // Mettre à jour l'état d'authentification globale
        login(response.data);
        
        setLoginResponse(response.data);
        setShowAdditionalInfoForm(false);
        
        // Si on est dans le panier, on passe à l'étape suivante
        if (inCart) {
          setTimeout(() => {
            navigate('/panier/delivery');
          }, 2000); // Redirection après 2 secondes
        } else {
          // Sinon, on peut rediriger vers la page d'accueil
          setTimeout(() => {
            navigate('/');
          }, 2000); // Redirection après 2 secondes
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription avec Google:", error);
      setError("Une erreur est survenue lors de l'inscription avec Google. Veuillez réessayer.");
    }
  }

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    // Tentative de connexion d'abord
    handleGoogleLogin(credentialResponse);
  };
  
  // Gestion de l'erreur Google
  const handleGoogleError = () => {
    setError("La connexion avec Google a échoué. Veuillez réessayer ou utiliser le formulaire de connexion classique.");
  };

  // Rendu du formulaire d'informations supplémentaires
  const renderAdditionalInfoForm = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 w-full">
        <h2 className="text-xl font-bold mb-4 text-teal-600">Informations supplémentaires requises</h2>
        <p className="text-gray-700 mb-4">Pour finaliser votre inscription, veuillez fournir les informations suivantes :</p>
        
        <form onSubmit={handleAdditionalInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone
              <span className="text-red-500">*</span> 
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="06 12 34 56 78"
                value={additionalInfo.phoneNumber}
                onChange={(e) => setAdditionalInfo({...additionalInfo, phoneNumber: e.target.value})}
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
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Distritherm Services"
                value={additionalInfo.companyName}
                onChange={(e) => setAdditionalInfo({...additionalInfo, companyName: e.target.value})}
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
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="123 456 789 00012"
                value={additionalInfo.siretNumber}
                onChange={(e) => setAdditionalInfo({...additionalInfo, siretNumber: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAdditionalInfoForm(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Rendu de la réponse de connexion
  const renderLoginResponse = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-teal-600">Connexion réussie</h2>
        <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-80">
          <pre className="text-sm">
            {JSON.stringify(loginResponse, null, 2)}
          </pre>
        </div>
        <button
          onClick={() => {
            setLoginResponse(null);
            navigate('/');
          }}
          className="mt-6 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Continuer
        </button>
      </div>
    </div>
  );

  const renderContent = () => (
    <section className={`relative ${!inCart ? 'py-20' : 'py-4'} overflow-hidden`}>
      {/* Arrière-plan décoratif */}
      {!inCart && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.2]" />
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        </div>
      )}

      <div className="container relative mx-auto px-4">
        {/* En-tête de la page */}
        {!inCart && (
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                {isLogin ? 'Connectez-vous' : 'Créez votre compte'}
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"></div>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-8">
              {isLogin 
                ? 'Accédez à votre espace client pour gérer vos commandes et profiter de nos services'
                : 'Rejoignez Distritherm Services pour bénéficier de tous nos avantages'
              }
            </p>
          </div>
        )}

        {/* Formulaires */}
        <div className={`${inCart ? 'max-w-2xl' : 'max-w-4xl'} mx-auto`}>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            {inCart && (
              <h2 className="text-2xl font-bold text-center mb-6">
                {isLogin ? 'Connectez-vous pour continuer' : 'Créez votre compte pour continuer'}
              </h2>
            )}
            
            {/* Onglets */}
            <div className="flex mb-8 border-b border-gray-200">
              <button
                className={`flex-1 pb-4 text-center font-medium transition-all duration-200 ${
                  isLogin
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-teal-600'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Déjà inscrit ?
              </button>
              <button
                className={`flex-1 pb-4 text-center font-medium transition-all duration-200 ${
                  !isLogin
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-teal-600'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Créer votre compte
              </button>
            </div>

            {/* Bouton Google */}
            <div className="mb-8">
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  size="large"
                  text={isLogin ? "signin_with" : "signup_with"}
                  locale="fr"
                  context={isLogin ? "signin" : "signup"}
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-500">
              </p>
            </div>

            {/* Séparateur */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {isLogin ? (
              // Formulaire de connexion
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse e-mail
                    <span className="text-red-500">*</span> 
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                      placeholder="mohamed@gmail.com"
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
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-teal-600 hover:text-teal-500"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  Connexion
                </button>
              </form>
            ) : (
              // Formulaire de création de compte
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="Mohamed"
                      />
                    </div>
                  </div>
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
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="ismael"
                      />
                    </div>
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
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                      placeholder="123 456 789 00012"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de votre Entreprise
                      <span className="text-red-500">*</span> 
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBuilding className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="Distritherm Services"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      N° de téléphone
                      <span className="text-red-500">*</span> 
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse e-mail
                    <span className="text-red-500">*</span> 
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de Passe
                      <span className="text-red-500">*</span> 
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmation mot de passe
                      <span className="text-red-500">*</span> 
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  Créer votre compte
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {inCart ? (
        renderContent()
      ) : (
        <Layout>
          {renderContent()}
        </Layout>
      )}
      
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-red-600">Erreur</h2>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-6 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      
      {showAdditionalInfoForm && renderAdditionalInfoForm()}
      {loginResponse && renderLoginResponse()}
    </>
  );
};

export default Connexion; 