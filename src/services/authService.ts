import axios from 'axios';
import axiosInstance, {
  saveAuthData,
  clearAuthData,
  getAccessToken,
  getUserData,
  BASE_API_URL,
} from './axiosConfig';

// Interface pour les données de connexion
interface LoginRequest {
  email: string;
  password: string;
}

// Interface pour les données d'inscription
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  siretNumber: string;
  phoneNumber: string;
}

// Interface pour le mot de passe oublié
interface ForgotPasswordRequest {
  email: string;
}

// Interface pour la réinitialisation du mot de passe
interface ResetPasswordRequest {
  password: string;
  token: string;
}

// Interface pour la mise à jour du profil
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companyName?: string;
  siretNumber?: string;
  [key: string]: any;
}

// Service d'authentification
export const authService = {
  // Connexion classique avec email/mot de passe
  async login(data: LoginRequest) {
    try {
      // console.log('Tentative de connexion avec email/mot de passe');
      const response = await axiosInstance.post('/auth/regular-login', data, {
        headers: {
          'x-platform': 'web',
        },
      });

      // Sauvegarder les données d'authentification
      if (response.data.accessToken) {
        saveAuthData(response.data);
      }

      return response.data;
    } catch (error) {
      // console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Inscription classique
  async register(data: RegisterRequest) {
    try {
      // console.log("Tentative d'inscription");

      // Formater le numéro de téléphone
      let formattedPhoneNumber = data.phoneNumber;
      formattedPhoneNumber = formattedPhoneNumber
        .replace(/\s+/g, '')
        .replace(/[^0-9]/g, '');

      if (formattedPhoneNumber.startsWith('0')) {
        formattedPhoneNumber = '+33' + formattedPhoneNumber.substring(1);
      } else if (!formattedPhoneNumber.startsWith('+33')) {
        formattedPhoneNumber = '+33' + formattedPhoneNumber;
      }

      // Supprimer les espaces éventuels du numéro SIRET
      const formattedSiretNumber = data.siretNumber.replace(/\s+/g, '');

      const formattedData = {
        ...data,
        phoneNumber: formattedPhoneNumber,
        siretNumber: formattedSiretNumber,
      };

      // console.log('Données formatées pour inscription:', formattedData);

      const response = await axiosInstance.post(
        '/auth/regular-register',
        formattedData,
        {
          headers: {
            'x-platform': 'web',
            'Content-Type': 'application/json',
          },
        }
      );

      // Vérifier si les données de l'utilisateur sont complètes
      if (response.data.user) {
        // S'assurer que companyName et siretNumber sont inclus dans les données utilisateur
        // même si le backend ne les retourne pas
        if (!response.data.user.companyName && formattedData.companyName) {
          response.data.user.companyName = formattedData.companyName;
        }

        if (!response.data.user.siretNumber && formattedData.siretNumber) {
          response.data.user.siretNumber = formattedData.siretNumber;
        }
      }

      // Sauvegarder les données d'authentification
      if (response.data.accessToken) {
        saveAuthData(response.data);
      }

      // console.log(
      //   'Données utilisateur sauvegardées après inscription:',
      //   response.data.user
      // );

      return response.data;
    } catch (error) {
      // console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  },

  // Connexion avec Google
  async loginWithGoogle(providerAuthToken: string) {
    try {
      // console.log('Tentative de connexion avec Google');
      const payload = {
        providerAuthToken,
        providerName: 'GOOGLE',
      };

      const response = await axiosInstance.post(
        '/auth/provider-login',
        payload
      );

      // Sauvegarder les données d'authentification
      if (response.data.accessToken) {
        saveAuthData(response.data);
      }

      return response.data;
    } catch (error) {
      // console.error('Erreur lors de la connexion avec Google:', error);
      throw error;
    }
  },

  // Inscription avec Google
  async registerWithGoogle(providerAuthToken: string, additionalInfo: any) {
    try {
      // console.log("Tentative d'inscription avec Google");

      // Formater le numéro de téléphone
      let formattedPhoneNumber = additionalInfo.phoneNumber;
      formattedPhoneNumber = formattedPhoneNumber
        .replace(/\s+/g, '')
        .replace(/[^0-9]/g, '');

      if (formattedPhoneNumber.startsWith('0')) {
        formattedPhoneNumber = '+33' + formattedPhoneNumber.substring(1);
      } else if (!formattedPhoneNumber.startsWith('+33')) {
        formattedPhoneNumber = '+33' + formattedPhoneNumber;
      }

      // Supprimer les espaces éventuels du numéro SIRET
      const formattedSiretNumber = additionalInfo.siretNumber.replace(
        /\s+/g,
        ''
      );

      const formattedAdditionalInfo = {
        ...additionalInfo,
        phoneNumber: formattedPhoneNumber,
        siretNumber: formattedSiretNumber,
      };

      const payload = {
        providerAuthToken,
        providerName: 'GOOGLE',
        additionalInfo: formattedAdditionalInfo,
      };

      // console.log('Données formatées pour inscription Google:', payload);

      const response = await axiosInstance.post(
        '/auth/provider-register',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Vérifier si les données de l'utilisateur sont complètes
      if (response.data.user) {
        // S'assurer que companyName et siretNumber sont inclus dans les données utilisateur
        // même si le backend ne les retourne pas
        if (
          !response.data.user.companyName &&
          formattedAdditionalInfo.companyName
        ) {
          response.data.user.companyName = formattedAdditionalInfo.companyName;
        }

        if (
          !response.data.user.siretNumber &&
          formattedAdditionalInfo.siretNumber
        ) {
          response.data.user.siretNumber = formattedAdditionalInfo.siretNumber;
        }
      }

      // Sauvegarder les données d'authentification
      if (response.data.accessToken) {
        saveAuthData(response.data);
      }

      // console.log(
      //   'Données utilisateur sauvegardées après inscription Google:',
      //   response.data.user
      // );

      return response.data;
    } catch (error) {
      // console.error("Erreur lors de l'inscription avec Google:", error);
      throw error;
    }
  },

  // Demande de réinitialisation de mot de passe
  async forgotPassword(data: ForgotPasswordRequest) {
    try {
      // console.log('Demande de réinitialisation de mot de passe');
      const response = await axiosInstance.post(
        '/users/send-update-password-forgot',
        data,
        {
          headers: {
            'x-platform': 'web',
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log(
      //   'Réponse de la demande de réinitialisation:',
      //   await response.data
      // );
      return response.data;
    } catch (error: any) {
      // console.error('Erreur détaillée:', {
      //   message: error.message,
      //   response: error.response,
      //   status: error.response?.status,
      //   data: error.response?.data,
      // });
      throw error;
    }
  },

  // Réinitialisation de mot de passe
  async resetPassword(data: ResetPasswordRequest) {
    try {
      // console.log('Réinitialisation de mot de passe');
      const response = await axiosInstance.post('/auth/reset-password', data, {
        headers: {
          'x-platform': 'web',
          'Content-Type': 'application/json',
        },
      });

      // console.log('Réponse de la réinitialisation:', response.data);
      return response.data;
    } catch (error: any) {
      // console.error('Erreur détaillée:', {
      //   message: error.message,
      //   response: error.response,
      //   status: error.response?.status,
      //   data: error.response?.data,
      // });
      throw error;
    }
  },

  // Déconnexion
  async logout() {
    try {
      // console.log('Déconnexion en cours...');
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      // console.error('Erreur lors de la déconnexion:', error);
    } finally {
      clearAuthData();
    }
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser() {
    return getUserData();
  },

  // Récupérer les données de l'utilisateur actuel depuis l'API
  async getCurrentUserFromApi(): Promise<any> {
    try {
      // Vérifier d'abord si nous avons un token
      const token = getAccessToken();
      if (!token) {
        throw new Error('Aucun token d\'authentification disponible');
      }
      
      const response = await axiosInstance.get('/users/me');
      // Normaliser la réponse éventuelle de l'API (peut renvoyer { user: {...} } ou directement l'objet utilisateur)
      const data: any = response?.data ?? {};
      const normalizedUser = data.user ?? data.data?.user ?? data;
      return normalizedUser;
    } catch (error) {
      throw error;
    }
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    const token = getAccessToken();
    const user = this.getCurrentUser();
    return !!token && !!user;
  },

  // Mettre à jour le profil utilisateur
  async updateProfile(userData: UpdateProfileRequest) {
    try {
      // console.log('Mise à jour du profil utilisateur avec:', userData);

      // Créer une copie des données pour les formater
      const formattedData: UpdateProfileRequest = { ...userData };

      // Formater le numéro de téléphone si présent
      if (formattedData.phoneNumber) {
        let formattedPhoneNumber = formattedData.phoneNumber;
        formattedPhoneNumber = formattedPhoneNumber
          .replace(/\s+/g, '')
          .replace(/[^0-9]/g, '');

        if (formattedPhoneNumber.startsWith('0')) {
          formattedPhoneNumber = '+33' + formattedPhoneNumber.substring(1);
        } else if (!formattedPhoneNumber.startsWith('+33')) {
          formattedPhoneNumber = '+33' + formattedPhoneNumber;
        }

        formattedData.phoneNumber = formattedPhoneNumber;
      }

      // Formater le numéro SIRET si présent
      if (formattedData.siretNumber !== undefined) {
        // Supprimer tous les caractères non numériques
        const numericSiret = String(formattedData.siretNumber).replace(
          /\D/g,
          ''
        );

        // Vérifier que le SIRET contient exactement 14 chiffres
        if (numericSiret.length !== 14) {
          throw new Error(
            'Le numéro SIRET doit contenir exactement 14 chiffres'
          );
        }

        formattedData.siretNumber = numericSiret;
      }

      // console.log('Données formatées pour mise à jour:', formattedData);

      // Récupérer l'ID de l'utilisateur actuel via l'API (ne pas dépendre du localStorage)
      let currentUserId: string | number | undefined;
      let currentUserFromApi: any = null;
      try {
        currentUserFromApi = await this.getCurrentUserFromApi();
        currentUserId = currentUserFromApi?.id;
      } catch (e) {
        // Ignorer, sera géré ci-dessous
      }
      if (!currentUserId) {
        throw new Error("Impossible de récupérer l'ID de l'utilisateur");
      }

      try {
        // Utiliser l'endpoint correct avec l'ID de l'utilisateur
        const response = await axiosInstance.put(
          `/users/${currentUserId}`,
          formattedData,
          {
            headers: {
              'x-platform': 'web',
              'Content-Type': 'application/json',
            },
          }
        );

        // console.log('Réponse API brute:', response);
        // console.log('Statut HTTP:', response.status);
        // console.log('Contenu de la réponse:', response.data);

        // Préparer la réponse utilisateur mise à jour sans persistance locale
        if (response.data) {
          const updatedUser = {
            ...(currentUserFromApi || {}),
            ...formattedData,
          };
          return { user: updatedUser };
        }

        return response.data;
      } catch (apiError: any) {
        // console.error('Erreur API lors de la mise à jour:', apiError);
        // console.error("Détails de l'erreur:", apiError.response?.data);
        // console.error('Statut HTTP:', apiError.response?.status);
        throw apiError;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  // Mettre à jour le mot de passe
  async updatePassword(currentPassword: string, newPassword: string) {
    try {
      // console.log('Mise à jour du mot de passe');
      const response = await axiosInstance.post(
        '/users/update-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            'x-platform': 'web',
          },
        }
      );

      return response.data;
    } catch (error) {
      // console.error('Erreur lors de la mise à jour du mot de passe:', error);
      throw error;
    }
  },

  // Vérifier l'email avec le token
  async verifyEmail(token: string) {
    try {
      console.log("Vérification de l'email avec le token:", token);

      const response = await axiosInstance.post(
        `/users/verify-email`,
        {
          token: token
        },
        {
          headers: {
            'x-platform': 'web',
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Réponse complète:', response);
      console.log('Données de réponse:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // Renvoyer l'email de vérification
  async resendVerificationEmail() {
    try {
      // console.log("Demande de renvoi de l'email de vérification");

      // Récupérer l'utilisateur actuel
      const currentUser = this.getCurrentUser();
      if (!currentUser || !currentUser.email) {
        throw new Error("Email de l'utilisateur non disponible");
      }

      const response = await axiosInstance.post(
        '/users/resend-verification-email',
        {
          email: currentUser.email,
        },
        {
          headers: {
            'x-platform': 'web',
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log('Réponse complète:', response);
      // console.log('Données de réponse:', response.data);
      return response.data;
    } catch (error: any) {
      // console.error('Erreur détaillée:', {
      //   message: error.message,
      //   response: error.response,
      //   status: error.response?.status,
      //   data: error.response?.data,
      // });
      throw error;
    }
  },

  async updatePasswordForgot(token: string, password: string) {
    try {
      // console.log('Mise à jour du mot de passe oublié');
      const response = await axiosInstance.post(
        `/users/update-password-forgot?token=${token}`,
        {
          password,
        },
        {
          headers: {
            'x-platform': 'web',
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      // console.error('Erreur détaillée:', {
      //   message: error.message,
      //   response: error.response,
      //   status: error.response?.status,
      //   data: error.response?.data,
      // });
      throw error;
    }
  },

  // Mettre à jour les adresses
  async updateAddresses(data: { addresses: any[] }) {
    try {
      const response = await axiosInstance.put(
        '/users/addresses',
        data,
        {
          headers: {
            'x-platform': 'web',
            'Content-Type': 'application/json',
          },
        }
      );

      // Ne pas stocker de données utilisateur côté client

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async changeProfilePicture(userId: string | number, file: File) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file, file.name);

      // Récupérer le token pour l'authentification
      const token = getAccessToken();

      // Utiliser axios brut pour envoyer le FormData correctement
      const response = await axios.post(
        `${BASE_API_URL}/users/${userId}/change-picture`, 
        formData, 
        {
          headers: {
            'x-platform': 'web',
            'Authorization': token ? `Bearer ${token}` : '',
            // NE PAS définir Content-Type, axios le fait automatiquement pour FormData
          },
          withCredentials: true,
        }
      );

      // Si l’API renvoie un user mis à jour, le stocker localement
      if (response.data?.user) {
        saveAuthData({ accessToken: getAccessToken() || '', user: response.data.user, message: '', });
      }

      return response.data;
    } catch (error) {
    //  console.error('Erreur changeProfilePicture:', error);
      throw error;
    }
  },
};