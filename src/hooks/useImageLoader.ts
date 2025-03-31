import { useState, useEffect } from 'react';

interface UseImageLoaderOptions {
  placeholder?: string;
  errorFallback?: string;
}

/**
 * Hook pour gérer le chargement d'images avec gestion d'erreur et placeholder
 * @param src - URL de l'image à charger
 * @param options - Options du chargeur d'image
 * @returns Objet contenant l'URL de l'image à afficher, l'état de chargement et d'erreur
 */
export const useImageLoader = (
  src: string | undefined,
  options: UseImageLoaderOptions = {}
) => {
  const {
    placeholder = '/src/assets/image-placeholder.svg', // Placeholder par défaut
    errorFallback = '/src/assets/image-error.svg' // Image en cas d'erreur
  } = options;

  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(placeholder);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const image = new Image();
    image.src = src;

    image.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    image.onerror = () => {
      setImageSrc(errorFallback);
      setIsLoading(false);
      setIsError(true);
    };

    return () => {
      // Annuler le chargement de l'image si le composant est démonté
      image.onload = null;
      image.onerror = null;
    };
  }, [src, placeholder, errorFallback]);

  return { imageSrc, isLoading, isError };
};

/**
 * Précharge une liste d'images
 * @param imageUrls - Liste d'URLs d'images à précharger
 * @returns Objet indiquant l'état du chargement
 */
export const useImagePreloader = (imageUrls: string[]) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!imageUrls.length) {
      setIsComplete(true);
      return;
    }

    let mounted = true;

    const preloadImages = async () => {
      const loadPromises = imageUrls.map(url => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      });

      for (let i = 0; i < loadPromises.length; i++) {
        try {
          await loadPromises[i];
          if (mounted) setLoadedCount(prev => prev + 1);
        } catch (error) {
          if (mounted) setFailedCount(prev => prev + 1);
        }
      }

      if (mounted) setIsComplete(true);
    };

    preloadImages();

    return () => {
      mounted = false;
    };
  }, [imageUrls]);

  const progress = imageUrls.length ? (loadedCount + failedCount) / imageUrls.length : 1;

  return {
    loadedCount,
    failedCount,
    isComplete,
    progress
  };
}; 