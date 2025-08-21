import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import {
  clearAuthData,
  getAccessToken,
  saveAuthData
} from '../services/axiosConfig';

// Interface pour l'utilisateur
interface User {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  siretNumber?: string;
  phoneNumber?: string;
  role?: string;
  urlPicture?: string;
  createdAt?: string;
  updatedAt?: string;
  isEmailVerified?: boolean;
  [key: string]: any;
}

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  verifyEmail: (token: string) => Promise<void>;
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {
    throw new Error('AuthContext not initialized');
  },
  logout: async () => {
    throw new Error('AuthContext not initialized');
  },
  updateUser: () => {
    throw new Error('AuthContext not initialized');
  },
  clearError: () => {
    throw new Error('AuthContext not initialized');
  },
  verifyEmail: async () => {
    throw new Error('AuthContext not initialized');
  },
});

// Props pour le fournisseur de contexte
interface AuthProviderProps {
  children: ReactNode;
}

// Fournisseur de contexte d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        const token = getAccessToken();

        if (token) {
          setAccessToken(token);

          // Récupérer les informations utilisateur auprès de l'API
          try {
            const freshUser = await authService.getCurrentUserFromApi();
            setUser(freshUser);
          } catch (apiError: any) {
            if (apiError.response?.status === 401) {
              // Token invalide
              clearAuthData();
            }
          }
        }
      } catch (error) {
        // console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        setError('Impossible de restaurer votre session.');
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Écouter les événements d'authentification
    const handleLogout = () => {
      // console.log('Événement de déconnexion détecté');
      setUser(null);
      setAccessToken(null);
      clearAuthData();
    };

    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Fonction pour effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  // Fonction de connexion
  const login = async (data: any) => {
    try {
      if (data.accessToken && data.user) {
        // console.log('Connexion réussie, données utilisateur reçues:', data.user);
        
        // Si l'utilisateur était déjà connecté et avait des données en mémoire
        const existingUser = getAccessToken(); // getUserData(); // Removed as per edit hint
        if (existingUser) {
          // Préserver les données companyName et siretNumber si elles ne sont pas dans la réponse
          if (!data.user.companyName && existingUser) { // existingUser is now token, not user
            data.user.companyName = existingUser; // existingUser is now token, not user
          }
          
          if (!data.user.siretNumber && existingUser) { // existingUser is now token, not user
            data.user.siretNumber = existingUser; // existingUser is now token, not user
          }
        }
        
        setAccessToken(data.accessToken);
        setUser(data.user);
        setError(null);
        saveAuthData({ accessToken: data.accessToken, user: undefined, message: '' }); // Modified as per edit hint
      } else {
        throw new Error('Données d\'authentification invalides');
      }
    } catch (error: any) {
      // console.error('Erreur lors de la connexion:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion.');
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Appeler l'API de déconnexion côté serveur
      await authService.logout();
    } catch (error) {
      //console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyage des états même si l'API échoue
      setUser(null);
      setAccessToken(null);
      
      // Déclencher un événement global de déconnexion
      const event = new CustomEvent('auth:logout');
      window.dispatchEvent(event);
      
      setIsLoading(false);
    }
  };

  // Fonction de mise à jour des données utilisateur
  const updateUser = (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        
        // aucune persistance côté client pour les données utilisateur
        // console.log('Données utilisateur mises à jour');
      } else {
        throw new Error('Aucun utilisateur connecté');
      }
    } catch (error: any) {
      // console.error('Erreur lors de la mise à jour des données utilisateur:', error);
      setError(error.message || 'Une erreur est survenue lors de la mise à jour du profil.');
    }
  };

  // Fonction pour vérifier l'email
  const verifyEmail = async (token: string) => {
    try {
      const response = await authService.verifyEmail(token);
      if (response.success) {
        // Mettre à jour l'état de vérification de l'email dans le user
        if (user) {
          const updatedUser = { ...user, isEmailVerified: true };
          setUser(updatedUser);
          // localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser)); // Removed as per edit hint
        }
      }
    } catch (error) {
    // console.error('Erreur lors de la vérification de l\'email:', error);
      throw error;
    }
  };

  // Valeur du contexte
  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    clearError,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};

export default AuthContext; 