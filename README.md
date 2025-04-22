# Distritherm Web App

Application web pour Distritherm, développée avec React, TypeScript et TailwindCSS.

## Fonctionnalités

- Catalogue de produits avec recherche et filtres
- Gestion des favoris
- Panier d'achats
- Pages détaillées des produits
- Promotions spéciales
- Authentification utilisateur
- Design responsive adapté à tous les appareils

## Technologies utilisées

- **Frontend**: React, TypeScript, TailwindCSS, Framer Motion
- **State Management**: Context API
- **Routing**: React Router
- **API**: Axios pour les appels HTTP
- **Build Tool**: Vite

## Structure du projet

Le projet utilise une architecture modulaire et évolutive :

```
src/
├── assets/          # Images, fonts et autres fichiers statiques
├── components/      # Composants React
│   ├── common/      # Composants communs réutilisables
│   ├── layout/      # Composants de mise en page
│   ├── products/    # Composants spécifiques aux produits
│   ├── promotions/  # Composants spécifiques aux promotions
│   ├── sections/    # Sections réutilisables de page
│   └── ui/          # Composants d'interface génériques
├── contexts/        # Contexts React (panier, favoris, auth...)
├── data/            # Données statiques
├── hooks/           # Custom hooks
├── pages/           # Composants de page
├── services/        # Services et configuration API
├── store/           # State management
├── types/           # TypeScript types et interfaces
└── utils/           # Fonctions utilitaires
```

## Démarrage rapide

### Prérequis

- Node.js (v16.0.0 ou supérieur)
- npm ou yarn

### Installation

1. Cloner le dépôt
```bash
git clone https://github.com/votre-organisation/distritherm-webapp.git
cd distritherm-webapp
```

2. Installer les dépendances
```bash
npm install
# ou
yarn
```

3. Démarrer l'application en mode développement
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173).

## Scripts disponibles

- `npm run dev` : Lance l'application en mode développement
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint

## Normes de code

Ce projet suit des normes de code strictes pour maintenir la qualité et la cohérence. Consultez le fichier [CODE_STANDARDS.md](src/docs/CODE_STANDARDS.md) pour plus de détails.

## Optimisation des performances

L'application utilise plusieurs techniques pour optimiser les performances :

- **Lazy loading** des composants et des pages
- **Code splitting** pour réduire la taille des bundles
- **Préchargement** des ressources critiques
- **Mise en cache** des données
- **Optimisation des images**
- **Minimisation des rendus** avec React.memo et useMemo

## Responsive Design

L'application est conçue pour s'adapter à tous les types d'écrans, des smartphones aux grands écrans :

- Design mobile-first
- Utilisation des classes responsives de TailwindCSS
- Tests sur différentes tailles d'écran
- Adaptation du contenu selon le dispositif

## Accessibilité

Le projet respecte les normes d'accessibilité :

- Attributs ARIA pour les éléments interactifs
- Structure sémantique HTML5
- Navigation au clavier
- Contraste de couleurs suffisant

## Licence

Ce projet est sous licence [Distritherm Services](LICENSE).

## Contact

Pour toute question ou suggestion, veuillez nous contacter à [contact@distritherm.fr](mailto:info@distritherm.fr).
