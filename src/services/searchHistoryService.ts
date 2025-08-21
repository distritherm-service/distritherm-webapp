import axiosInstance from './axiosConfig';

/**
 * Interface représentant une entrée d'historique de recherche.
 */
export interface SearchHistoryEntry {
  id: number;
  value: string;
  userId: number;
  createdAt: string;
}

/**
 * Corps attendu pour la requête POST /search-history.
 */
export interface AddSearchHistoryRequest {
  /** Terme recherché (max 255 caractères) */
  value: string;
  /** Identifiant de l'utilisateur (obligatoire côté API) */
  userId: number;
}

/**
 * Réponse renvoyée par l'API lors de l'ajout.
 */
export interface AddSearchHistoryResponse {
  message: string;
  searchhistory: SearchHistoryEntry;
}

/**
 * Interface pour la réponse de la liste des historiques de recherche par utilisateur.
 */
export interface SearchHistoryListResponse {
  message: string;
  searchhistory: SearchHistoryEntry[];
}

/**
 * Classe d'erreur dédiée à l'historique de recherche.
 */
export class SearchHistoryError extends Error {
  constructor(
    public status: number,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'SearchHistoryError';
  }
}

/**
 * Gestion centralisée des erreurs pour le service.
 */
const handleSearchHistoryError = (error: any): never => {
  //    console.error('[SearchHistoryService] Erreur API:', error);

  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || data?.error || `Erreur ${status}`;
    throw new SearchHistoryError(status, message, error);
  }

  throw new SearchHistoryError(0, 'Erreur de connexion au service historique de recherche', error);
};

// Utilitaires de normalisation pour supporter plusieurs formats de réponses backend
const normalizeEntry = (raw: any): SearchHistoryEntry | null => {
  if (!raw) return null;
  return {
    id: Number(raw.id ?? raw.ID ?? Date.now()),
    value: String(raw.value ?? raw.term ?? raw.query ?? ''),
    userId: Number(raw.userId ?? raw.user_id ?? raw.user ?? 0),
    createdAt: String(raw.createdAt ?? raw.created_at ?? raw.date ?? new Date().toISOString()),
  };
};

const extractEntries = (data: any): SearchHistoryEntry[] => {
  const list =
    data?.searchhistory ||
    data?.searchHistory ||
    data?.history ||
    data?.items ||
    data?.results ||
    data?.data ||
    [];
  if (Array.isArray(list)) {
    return list.map(normalizeEntry).filter(Boolean) as SearchHistoryEntry[];
  }
  return [];
};

/**
 * Ajoute un terme de recherche à l'historique de l'utilisateur connecté.
 * POST /search-history
 * @param value  Terme recherché (sera tronqué à 255 caractères)
 * @param userId Identifiant de l'utilisateur (obligatoire selon Swagger)
 */
export const addSearchHistory = async (
  value: string,
  userId: number
): Promise<AddSearchHistoryResponse> => {
  try {
    // Conformité aux contraintes backend : trim + limite 255 caractères.
    const sanitizedValue = value.trim().slice(0, 255);

    const body: AddSearchHistoryRequest = {
      value: sanitizedValue,
      userId,
    };

    const response = await axiosInstance.post('/search-history', body);
    const data: any = response?.data ?? {};
    const entryRaw = data.searchhistory || data.entry || data.data || data.result;
    const normalized = normalizeEntry(entryRaw) || {
      id: Date.now(),
      value: sanitizedValue,
      userId,
      createdAt: new Date().toISOString(),
    };
    return { message: data.message || 'ok', searchhistory: normalized };
  } catch (error) {
    return handleSearchHistoryError(error);
  }
};

/**
 * Récupère l'historique de recherche pour un utilisateur spécifique.
 * GET /search-history/users/{userId}
 * @param userId Identifiant de l'utilisateur.
 */
export const getSearchHistoryByUser = async (
  userId: number
): Promise<SearchHistoryListResponse> => {
  try {
    const response = await axiosInstance.get<SearchHistoryListResponse>(`/search-history/users/${userId}`);
    const data = response?.data ?? {};
    const list = extractEntries(data);
    return { message: data.message || 'ok', searchhistory: list };
  } catch (error) {
    return handleSearchHistoryError(error);
  }
};

/**
 * Export par défaut pour plus de flexibilité.
 */
export default {
  addSearchHistory,
  getSearchHistoryByUser,
};

/**
 * Supprime une entrée d'historique par son ID.
 * DELETE /search-history/{id}
 */
export const deleteSearchHistory = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/search-history/${id}`);
    const data: any = response?.data ?? {};
    return { message: data.message || 'Entrée supprimée avec succès' };
  } catch (error) {
    return handleSearchHistoryError(error);
  }
};

// Ré-export avec la nouvelle méthode incluse
export const searchHistoryApi = {
  addSearchHistory,
  getSearchHistoryByUser,
  deleteSearchHistory,
};
