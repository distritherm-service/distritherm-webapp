# Distritherm Web App - Normes de Code

Ce document définit les normes de code et les meilleures pratiques pour le projet Distritherm Web App.

## Structure des dossiers

```
src/
├── assets/          # Images, fonts et autres fichiers statiques
├── components/      # Composants React
│   ├── common/      # Composants communs réutilisables (boutons, formulaires...)
│   ├── layout/      # Composants de mise en page (navbar, footer, sidebar...)
│   ├── products/    # Composants spécifiques aux produits
│   ├── promotions/  # Composants spécifiques aux promotions
│   ├── sections/    # Sections réutilisables de page
│   └── ui/          # Composants d'interface génériques
├── contexts/        # Contexts React (panier, favoris, authentification...)
├── data/            # Données statiques (si nécessaire avant intégration API)
├── hooks/           # Custom hooks
├── pages/           # Composants de page
├── services/        # Services et configuration API
├── store/           # State management (Redux...)
├── types/           # TypeScript types et interfaces
└── utils/           # Fonctions utilitaires

```

## Conventions de nommage

- **Fichiers et dossiers**: PascalCase pour les composants React, camelCase pour les autres fichiers
- **Composants React**: Toujours utiliser PascalCase (ex: `ProductCard.tsx`)
- **Hooks**: Préfixer par `use` (ex: `useCart.ts`)
- **Contextes**: Suffixer par `Context` (ex: `CartContext.tsx`)
- **Types/Interfaces**: PascalCase, descriptif (ex: `ProductDetails`, `CartItem`)
- **Fonctions**: camelCase, verbe d'action (ex: `formatPrice`, `handleSubmit`)

## Bonnes Pratiques

### Performance

- Utiliser `React.memo` pour éviter les rendus inutiles des composants
- Implémenter le lazy loading pour les composants lourds ou rarement utilisés
- Optimiser les images (utiliser des formats comme WebP, attributs loading="lazy")
- Limiter l'utilisation des effets et des états au minimum nécessaire

### Responsivité

- Utilisation de classes Tailwind responsives (sm:, md:, lg:, xl:)
- Design mobile-first dans tous les composants
- Tester les composants sur différentes tailles d'écran
- Utiliser des unités de mesure relatives (rem, em, %) plutôt que des pixels fixes

### Accessibilité

- Ajouter des attributs `aria-*` aux éléments interactifs
- Utiliser des balises sémantiques correctes (button pour les boutons, a pour les liens...)
- S'assurer que tous les éléments interactifs sont utilisables au clavier
- Maintenir un contraste suffisant pour le texte

### Code

- Utiliser des fonctions pures quand c'est possible
- Éviter les effets secondaires inutiles
- Commenter le code complexe ou non évident
- Éviter la duplication de code en créant des composants et fonctions réutilisables

## Standard de Composant

```tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Types et interfaces
interface MyComponentProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

/**
 * MyComponent - Exemple de composant standard
 */
const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  description = 'Description par défaut',
  onClick 
}) => {
  // État local
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // Effets
  useEffect(() => {
    // Logique d'effet...
    return () => {
      // Nettoyage si nécessaire
    };
  }, []);

  // Gestionnaires d'événements
  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) onClick();
  };

  // Rendu conditionnel
  if (!title) {
    return null;
  }

  // Rendu du composant
  return (
    <motion.div 
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
      <button
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        aria-label="Activer/désactiver"
      >
        {isActive ? 'Actif' : 'Inactif'}
      </button>
    </motion.div>
  );
};

export default MyComponent;
```

## Hooks personnalisés

Les hooks personnalisés doivent être utilisés pour extraire la logique réutilisable :

```tsx
import { useState, useEffect } from 'react';

interface UseLocalStorageOptions {
  defaultValue?: any;
}

export const useLocalStorage = <T>(key: string, options: UseLocalStorageOptions = {}) => {
  const { defaultValue } = options;
  
  // Récupérer la valeur depuis localStorage
  const getStoredValue = (): T | undefined => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error);
      return defaultValue;
    }
  };

  const [value, setValue] = useState<T | undefined>(getStoredValue);

  // Mettre à jour localStorage quand la valeur change
  useEffect(() => {
    try {
      if (value !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key} dans localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};
```

## Gestion des imports

Organisez vos imports dans cet ordre :
1. Imports React et bibliothèques externes
2. Imports de composants
3. Imports de hooks
4. Imports d'utilitaires et types
5. Imports CSS/assets

Exemple :
```tsx
// 1. React et bibliothèques externes
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 2. Composants
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';

// 3. Hooks
import { useCart } from '../hooks/useCart';

// 4. Utilitaires et types
import { formatPrice } from '../utils/formatters';
import type { Product } from '../types/product';

// 5. CSS/assets
import '../styles/ProductList.css';
``` 