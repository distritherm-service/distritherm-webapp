import axios from 'axios';
import { BASE_API_URL } from './axiosConfig';

// Instance dédiée à l’API publique (pas de token, mais x-platform requis)
const publicApi = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-platform': 'web'
  },
  withCredentials: false
});
// TypeScript interface représentant une bannière de promotion renvoyée par l'API
export interface PromotionBanner {
  id: number;
  imageUrl: string;
  promotionId?: number; // Id de la promotion associée (facultatif)
  createdAt?: string;
  updatedAt?: string;
}

// Récupère toutes les bannières de promotion (endpoint public)
export const getPromotionBanners = async (): Promise<PromotionBanner[]> => {
  try {
    const response = await publicApi.get<{ banners: PromotionBanner[] }>('/promotion-banners');

    if (response?.data?.banners && Array.isArray(response.data.banners)) {
      return response.data.banners;
    }

    //  console.warn('Réponse inattendue pour /promotion-banners', response?.data);
    return [];
  } catch (error) {
    //console.error('Erreur lors de la récupération des bannières de promotion:', error);
    return [];
  }
};
