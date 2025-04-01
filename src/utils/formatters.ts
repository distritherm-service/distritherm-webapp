/**
 * Formate un prix en euros avec le format français
 * @param price - Le prix à formater
 * @param options - Options de formatage
 * @returns Le prix formaté en euros
 */
export const formatPrice = (
  price: number, 
  options: { 
    currency?: string;
    locale?: string;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    showCurrency?: boolean;
  } = {}
): string => {
  const { 
    currency = 'EUR',
    locale = 'fr-FR',
    minFractionDigits = 2,
    maxFractionDigits = 2,
    showCurrency = true
  } = options;

  return new Intl.NumberFormat(locale, {
    style: showCurrency ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits
  }).format(price);
};

/**
 * Formate un pourcentage
 * @param value - La valeur à formater en pourcentage
 * @param options - Options de formatage
 * @returns La valeur formatée en pourcentage
 */
export const formatPercentage = (
  value: number,
  options: {
    locale?: string;
    minFractionDigits?: number;
    maxFractionDigits?: number;
  } = {}
): string => {
  const {
    locale = 'fr-FR',
    minFractionDigits = 0,
    maxFractionDigits = 0
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits
  }).format(value / 100);
};

/**
 * Tronque un texte s'il dépasse une certaine longueur
 * @param text - Le texte à tronquer
 * @param maxLength - Longueur maximale avant troncature
 * @param suffix - Suffixe à ajouter en cas de troncature
 * @returns Le texte tronqué
 */
export const truncateText = (
  text: string,
  maxLength: number = 100,
  suffix: string = '...'
): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Formate une date au format français
 * @param date - La date à formater
 * @param options - Options de formatage
 * @returns La date formatée
 */
export const formatDate = (
  date: Date | string,
  options: {
    locale?: string;
    format?: 'short' | 'medium' | 'long' | 'full';
  } = {}
): string => {
  const { 
    locale = 'fr-FR',
    format = 'medium'
  } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : format === 'medium' ? 'short' : 'long',
    day: '2-digit'
  };

  return new Intl.DateTimeFormat(locale, dateFormatOptions).format(dateObj);
};

/**
 * Génère un ID unique
 * @returns Un ID unique
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Calcule le prix après remise
 * @param originalPrice - Le prix original
 * @param discountPercentage - Le pourcentage de remise
 * @returns Le prix après remise
 */
export const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercentage: number
): number => {
  return originalPrice * (1 - discountPercentage / 100);
}; 