import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { axiosInstance } from '../services/axiosConfig';

interface UseApiOptions<T> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error | AxiosError) => void;
}

type ApiMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface UseApiReturn<T, P = any> {
  data: T | undefined;
  loading: boolean;
  error: Error | AxiosError | null;
  execute: (params?: P, config?: AxiosRequestConfig) => Promise<T | undefined>;
  reset: () => void;
}

/**
 * Hook personnalisé pour effectuer des requêtes API
 * @param url - L'URL de l'API à appeler
 * @param method - La méthode HTTP à utiliser
 * @param options - Options pour la requête API
 * @returns Objet contenant les données, état de chargement, erreurs et fonctions d'exécution
 */
export function useApi<T = any, P = any>(
  url: string,
  method: ApiMethod = 'get',
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const { immediate = false, initialData, onSuccess, onError } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | AxiosError | null>(null);

  const execute = useCallback(
    async (params?: P, config?: AxiosRequestConfig): Promise<T | undefined> => {
      try {
        setLoading(true);
        setError(null);

        let response: AxiosResponse<T>;

        switch (method) {
          case 'get':
            response = await axiosInstance.get<T>(url, {
              params,
              ...config
            });
            break;
          case 'post':
            response = await axiosInstance.post<T>(url, params, config);
            break;
          case 'put':
            response = await axiosInstance.put<T>(url, params, config);
            break;
          case 'delete':
            response = await axiosInstance.delete<T>(url, {
              params,
              ...config
            });
            break;
          case 'patch':
            response = await axiosInstance.patch<T>(url, params, config);
            break;
          default:
            throw new Error(`Méthode HTTP non supportée: ${method}`);
        }

        const responseData = response.data;
        setData(responseData);
        
        if (onSuccess) {
          onSuccess(responseData);
        }
        
        return responseData;
      } catch (err) {
        const error = err as Error | AxiosError;
        setError(error);
        
        if (onError) {
          onError(error);
        }
        
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [url, method, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, reset };
}

/**
 * Hook pour récupérer des données depuis l'API
 * @param url - L'URL de l'API à appeler
 * @param options - Options pour la requête GET
 * @returns Objet contenant les données, état de chargement, erreurs et fonctions
 */
export function useGet<T = any, P = any>(
  url: string,
  options: UseApiOptions<T> & { params?: P; config?: AxiosRequestConfig } = {}
): UseApiReturn<T, P> {
  const { params, config, ...restOptions } = options;
  const apiHook = useApi<T, P>(url, 'get', restOptions);

  useEffect(() => {
    if (params && restOptions.immediate !== false) {
      apiHook.execute(params, config);
    }
  }, []);

  return apiHook;
}

/**
 * Hook pour envoyer des données à l'API avec POST
 * @param url - L'URL de l'API à appeler
 * @param options - Options pour la requête POST
 * @returns Objet contenant les données, état de chargement, erreurs et fonctions
 */
export function usePost<T = any, P = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  return useApi<T, P>(url, 'post', { ...options, immediate: false });
}

/**
 * Hook pour mettre à jour des données avec PUT
 * @param url - L'URL de l'API à appeler
 * @param options - Options pour la requête PUT
 * @returns Objet contenant les données, état de chargement, erreurs et fonctions
 */
export function usePut<T = any, P = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  return useApi<T, P>(url, 'put', { ...options, immediate: false });
}

/**
 * Hook pour supprimer des données avec DELETE
 * @param url - L'URL de l'API à appeler
 * @param options - Options pour la requête DELETE
 * @returns Objet contenant les données, état de chargement, erreurs et fonctions
 */
export function useDelete<T = any, P = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  return useApi<T, P>(url, 'delete', { ...options, immediate: false });
}

/**
 * Hook pour mettre à jour partiellement des données avec PATCH
 * @param url - L'URL de l'API à appeler
 * @param options - Options pour la requête PATCH
 * @returns Objet contenant les données, état de chargement, erreurs et fonctions
 */
export function usePatch<T = any, P = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  return useApi<T, P>(url, 'patch', { ...options, immediate: false });
} 