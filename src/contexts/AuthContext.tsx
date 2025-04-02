import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance, { 
  saveAuthData, 
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
  login: (data: any) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getAccessToken();
        const userData = getUserData();
        
        if (token && userData) {
          setAccessToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Écouter les événements d'authentification
    const handleLogout = () => {
      setUser(null);
      setAccessToken(null);
      clearAuthData();
    };

    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Fonction de connexion
  const login = (data: any) => {
    if (data.accessToken && data.user) {
      saveAuthData(data);
      setAccessToken(data.accessToken);
      setUser(data.user);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Optionnel: appeler une API de déconnexion côté serveur
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      clearAuthData();
      
      // Déclencher un événement global de déconnexion
      const event = new CustomEvent('auth:logout');
      window.dispatchEvent(event);
    }
  };

  // Fonction de mise à jour des données utilisateur
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Mettre à jour les données dans le localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    }
  };

  // Valeur du contexte
  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    logout,
    updateUser
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