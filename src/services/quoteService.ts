import axiosInstance from './axiosConfig';

// Types pour la création de devis selon l'API
export interface CreateQuoteRequest {
  cartId: number;
  commercialId?: number; // Optionnel - sera assigné automatiquement côté serveur si non fourni
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Commercial {
  userId: number;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  isFavorited: boolean;
  isInPromotion: boolean;
  promotionPrice?: number;
  promotionEndDate?: string;
  promotionPercentage?: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  user: User;
  cartItems: CartItem[];
}

export interface Quote {
  id: number;
  status: 'SENDED' | 'CONSULTED' | 'PROGRESS' | 'EXPIRED' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  totalHt?: number;
  totalTtc?: number;
  fileUrl: string;
  endDate: string;
  cartId: number;
  commercialId: number;
  createdAt: string;
  updatedAt: string;
  commercial: Commercial;
  cart: Cart;
}

export interface CreateQuoteResponse {
  message: string;
  devis: Quote;
}

// Types pour récupérer les devis
export interface GetQuotesParams {
  page?: number;
  limit?: number;
  status?: 'SENDED' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface GetQuotesResponse {
  devis: Quote[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetQuotesByClientParams {
  page?: number;
  limit?: number;
  status?: 'SENDED' | 'CONSULTED' | 'PROGRESS' | 'EXPIRED';
  s?: string; // recherche par nom commercial
}

export interface GetQuotesByClientResponse {
  message: string;
  devis: Quote[];
  count: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export const quoteService = {
  /**
   * Créer un nouveau devis à partir d'un panier
   * Note: Le commercialId est optionnel - si non fourni, un commercial sera assigné automatiquement
   */
  async createQuote(data: CreateQuoteRequest): Promise<CreateQuoteResponse> {
    try {
      const response = await axiosInstance.post<CreateQuoteResponse>('/devis', data);
      return response.data;
    } catch (error: any) {
    //  console.error('Erreur lors de la création du devis:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Vous ne pouvez pas créer un devis pour un autre commercial');
      } else if (error.response?.status === 404) {
        throw new Error('Commercial avec l\'ID ' + data.commercialId + ' non trouvé');
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.error || 'Données invalides');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du devis');
    }
  },

  /**
   * Récupérer tous les devis avec pagination et filtres
   */
  async getAllQuotes(params?: GetQuotesParams): Promise<GetQuotesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      
      const url = `/devis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get<GetQuotesResponse>(url);
      return response.data;
    } catch (error: any) {
  //     console.error('Erreur lors de la récupération des devis:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des devis');
    }
  },

  /**
   * Récupérer les devis de l'utilisateur connecté
   */
  async getMyQuotes(params?: GetQuotesParams): Promise<GetQuotesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      
      const url = `/devis/mes-devis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get<GetQuotesResponse>(url);
      return response.data;
    } catch (error: any) {
    //    console.error('Erreur lors de la récupération des devis:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des devis');
    }
  },
  /**
   * Récupérer un devis spécifique par son ID
   */
  async getQuoteById(quoteId: number): Promise<Quote> {
    try {
      const response = await axiosInstance.get<Quote>(`/devis/${quoteId}`);
      return response.data;
    } catch (error: any) {
    //  console.error('Erreur lors de la récupération du devis:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Devis non trouvé');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du devis');
    }
  },

  /**
   * Mettre à jour le statut d'un devis
   */
  async updateQuoteStatus(quoteId: number, status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): Promise<Quote> {
    try {
      const response = await axiosInstance.patch<Quote>(`/devis/${quoteId}/status`, { status });
      return response.data;
    } catch (error: any) {
    //  console.error('Erreur lors de la mise à jour du devis:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Devis non trouvé');
      } else if (error.response?.status === 403) {
        throw new Error('Vous n\'êtes pas autorisé à modifier ce devis');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du devis');
    }
  },

  /**
   * Supprimer un devis
   */
  async deleteQuote(quoteId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/devis/${quoteId}`);
    } catch (error: any) {
    //  console.error('Erreur lors de la suppression du devis:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Devis non trouvé');
      } else if (error.response?.status === 403) {
        throw new Error('Vous n\'êtes pas autorisé à supprimer ce devis');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du devis');
    }
  },

  /**
   * Récupérer les devis d'un utilisateur spécifique
   */
  async getUserQuotes(userId: number, params?: GetQuotesParams): Promise<GetQuotesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      
      const url = `/users/${userId}/devis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get<GetQuotesResponse>(url);
      return response.data;
    } catch (error: any) {
    //  console.error('Erreur lors de la récupération des devis de l\'utilisateur:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des devis');
    }
  },

  /**
   * Récupérer la liste des commerciaux disponibles
   */
  async getCommercials(): Promise<Commercial[]> {
    try {
      const response = await axiosInstance.get<Commercial[]>('/users/commercials');
      return response.data;
    } catch (error: any) {
    //  console.error('Erreur lors de la récupération des commerciaux:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des commerciaux');
    }
  },

  /**
   * Télécharger un devis PDF
   */
  async downloadQuotePDF(quoteId: number): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`/devis/${quoteId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
    //  console.error('Erreur lors du téléchargement du devis:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement du devis');
    }
  },

  /**
   * Récupérer les devis d'un client spécifique
   */
  async getQuotesByClient(clientId: number, params?: GetQuotesByClientParams): Promise<GetQuotesByClientResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.s) queryParams.append('s', params.s);
      
      const url = `/devis/by-client/${clientId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get<GetQuotesByClientResponse>(url);
      return response.data;
    } catch (error: any) {
    //  console.error('Erreur lors de la récupération des devis du client:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Utilisateur non authentifié');
      } else if (error.response?.status === 403) {
        throw new Error('Vous n\'êtes pas autorisé à accéder aux devis de ce client');
      } else if (error.response?.status === 404) {
        throw new Error('Client non trouvé');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des devis');
    }
  }
};