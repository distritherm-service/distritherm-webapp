import axiosInstance from './axiosConfig';

export interface PostulationPayload {
  userId: number;
  categoryName: string;
}

export interface Postulation {
  id: number;
  categoryName: string;
  status?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    [key: string]: any;
  };
}

export interface PostulationResponse {
  message: string;
  success: boolean;
  postulation: Postulation;
}

// Réponse de l’endpoint GET /pro-account/postulations/me
export interface MyPostulationsResponse {
  message: string;
  success: boolean;
  postulations: Postulation[];
  count: number;
}

export interface CancelPostulationResponse {
  message: string;
  success: boolean;
  postulationId: number;
  newStatus: string;
}

export const proAccountService = {
  async createPostulation(data: PostulationPayload): Promise<PostulationResponse> {
    const response = await axiosInstance.post<PostulationResponse>('/pro-account/postulations', data);
    return response.data;
  },

  /**
   * Récupère les postulations de l’utilisateur connecté.
   * GET /pro-account/postulations/me
   */
  async getMyPostulations(): Promise<MyPostulationsResponse> {
    const response = await axiosInstance.get<MyPostulationsResponse>('/pro-account/postulations/me');
    return response.data;
  },

  /**
   * Annule une postulation PENDING appartenant à l’utilisateur.
   */
  async cancelPostulation(id: number): Promise<CancelPostulationResponse> {
    const response = await axiosInstance.patch<CancelPostulationResponse>(`/pro-account/postulations/${id}/cancel`);
    return response.data;
  },
};
