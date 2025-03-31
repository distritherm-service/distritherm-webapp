/**
 * Vérifie si une chaîne est une adresse e-mail valide
 * @param email - L'adresse e-mail à vérifier
 * @returns true si l'adresse e-mail est valide, false sinon
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Vérifie si une chaîne est un numéro de téléphone français valide
 * @param phone - Le numéro de téléphone à vérifier
 * @returns true si le numéro de téléphone est valide, false sinon
 */
export const isValidFrenchPhone = (phone: string): boolean => {
  // Accepte les formats: 0612345678, 06 12 34 56 78, +33612345678, +33 6 12 34 56 78
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

/**
 * Vérifie si une chaîne est un code postal français valide
 * @param postalCode - Le code postal à vérifier
 * @returns true si le code postal est valide, false sinon
 */
export const isValidFrenchPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^[0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
};

/**
 * Vérifie si une chaîne est vide (après suppression des espaces)
 * @param value - La chaîne à vérifier
 * @returns true si la chaîne est vide, false sinon
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  if (value === null || value === undefined) return true;
  return value.trim() === '';
};

/**
 * Vérifie si une valeur est un nombre
 * @param value - La valeur à vérifier
 * @returns true si la valeur est un nombre, false sinon
 */
export const isNumber = (value: any): boolean => {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value !== 'string') return false;
  
  // Tente de convertir la chaîne en nombre
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

/**
 * Vérifie si une valeur est un entier positif
 * @param value - La valeur à vérifier
 * @returns true si la valeur est un entier positif, false sinon
 */
export const isPositiveInteger = (value: any): boolean => {
  if (!isNumber(value)) return false;
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

/**
 * Vérifie si une chaîne est une URL valide
 * @param url - L'URL à vérifier
 * @returns true si l'URL est valide, false sinon
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Vérifie si une date est valide
 * @param date - La date à vérifier (string au format YYYY-MM-DD ou Date)
 * @returns true si la date est valide, false sinon
 */
export const isValidDate = (date: string | Date): boolean => {
  if (date instanceof Date) return !isNaN(date.getTime());
  
  // Si c'est une chaîne, essaie de la convertir en Date
  if (typeof date !== 'string') return false;
  
  // Pour le format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const d = new Date(date);
    const isValid = !isNaN(d.getTime());
    
    // Vérifie aussi que le mois et le jour sont corrects (pour éviter 2023-02-31 par exemple)
    const [year, month, day] = date.split('-').map(Number);
    return isValid && d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day;
  }
  
  return false;
}; 