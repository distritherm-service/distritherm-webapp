import axiosInstance from './axiosConfig';

// Types pour la création de devis selon l'API
export interface CreateQuoteRequest {
  cartId: number;
  commercialId: number;
}

export interface Commercial {
  userId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    isFavorited: boolean;
    isInPromotion: boolean;
    promotionPrice?: number;
    promotionEndDate?: string;
    promotionPercentage?: number;
  };
}

export interface Cart {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  cartItems: CartItem[];
}

export interface Quote {
  id: number;
  status: 'SENDED' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
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
  status?: string;
}

export const quoteService = {
  /**
   * Créer un nouveau devis à partir d'un panier et l'associer à un commercial
   */
  async createQuote(data: CreateQuoteRequest): Promise<CreateQuoteResponse> {
    try {
      const response = await axiosInstance.post<CreateQuoteResponse>('/devis', data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du devis:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Vous ne pouvez pas créer un devis pour un autre commercial');
      } else if (error.response?.status === 404) {
        throw new Error('Commercial non trouvé');
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.error || 'Données invalides');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du devis');
    }
  },

  /**
   * Récupérer tous les devis avec pagination
   */
  async getAllQuotes(params?: GetQuotesParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      
      const url = `/devis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des devis:', error);
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
      console.error('Erreur lors de la récupération du devis:', error);
      
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
      console.error('Erreur lors de la mise à jour du devis:', error);
      
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
      console.error('Erreur lors de la suppression du devis:', error);
      
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
  async getUserQuotes(userId: number, params?: GetQuotesParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      
      const url = `/users/${userId}/devis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des devis de l\'utilisateur:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des devis');
    }
  }
}; 