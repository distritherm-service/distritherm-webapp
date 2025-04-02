import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import axiosInstance, { 
  clearAuthData, 
  getAccessToken, 
  getUserData, 
  STORAGE_KEYS 
} from '../services/axiosConfig';

// Interface pour l'utilisateur
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  siretNumber?: string;
  phoneNumber?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: any) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        const localUserData = getUserData();
        
        if (token && localUserData) {
          console.log('Restauration de la session utilisateur depuis localStorage');
          setAccessToken(token);
          setUser(localUserData);
          
          // Après avoir initialisé avec les données locales, essayer de récupérer les données à jour depuis l'API
          try {
            console.log('Tentative de récupération des données utilisateur à jour depuis l\'API');
            const updatedUserData = await authService.getCurrentUserFromApi();
            
            if (updatedUserData) {
              console.log('Données utilisateur mises à jour depuis l\'API');
              setUser(updatedUserData);
            }
          } catch (apiError) {
            console.error('Erreur lors de la récupération des données utilisateur depuis l\'API:', apiError);
            // Ne pas déconnecter l'utilisateur en cas d'erreur, conserver les données locales
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        setError('Impossible de restaurer votre session.');
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Écouter les événements d'authentification
    const handleLogout = () => {
      console.log('Événement de déconnexion détecté');
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
  const login = (data: any) => {
    try {
      if (data.accessToken && data.user) {
        console.log('Connexion réussie, données utilisateur reçues:', data.user);
        
        // Si l'utilisateur était déjà connecté et avait des données en mémoire
        const existingUser = getUserData();
        if (existingUser) {
          // Préserver les données companyName et siretNumber si elles ne sont pas dans la réponse
          if (!data.user.companyName && existingUser.companyName) {
            data.user.companyName = existingUser.companyName;
          }
          
          if (!data.user.siretNumber && existingUser.siretNumber) {
            data.user.siretNumber = existingUser.siretNumber;
          }
        }
        
        setAccessToken(data.accessToken);
        setUser(data.user);
        setError(null);
      } else {
        throw new Error('Données d\'authentification invalides');
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
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
      console.error('Erreur lors de la déconnexion:', error);
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
        
        // Mettre à jour les données dans le localStorage
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        console.log('Données utilisateur mises à jour');
      } else {
        throw new Error('Aucun utilisateur connecté');
      }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour des données utilisateur:', error);
      setError(error.message || 'Une erreur est survenue lors de la mise à jour du profil.');
    }
  };

  // Valeur du contexte
  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    clearError
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