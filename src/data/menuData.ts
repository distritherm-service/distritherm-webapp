export interface MenuItem {
  title: string;
  slug: string;
  icon?: string;
  subItems: SubItem[];
}

export interface SubItem {
  title: string;
  slug: string;
  level3Items?: Level3Item[];
}

export interface Level3Item {
  title: string;
  slug: string;
  level4Items?: Level4Item[];
}

export interface Level4Item {
  title: string;
  slug: string;
}

export const menuItems: MenuItem[] = [
  {
    title: 'Platerie',
    slug: 'platerie',
    icon: '🧱',
    subItems: [
      {
        title: 'Plaque standard',
        slug: 'plaque-standard',
        level3Items: [
          { title: 'BA13', slug: 'ba13' },
          { title: 'BA18', slug: 'ba18' },
          { title: 'BA25', slug: 'ba25' }
        ]
      },
      {
        title: 'Plaque hydro',
        slug: 'plaque-hydro',
        level3Items: [
          { title: 'BA13', slug: 'ba13-hydro' },
          { title: 'BA18', slug: 'ba18-hydro' },
          { title: 'BA25', slug: 'ba25-hydro' }
        ]
      },
      {
        title: 'Plaque technique',
        slug: 'plaque-technique',
        level3Items: [
          { title: 'Feu', slug: 'feu' },
          { title: 'HD', slug: 'hd' },
          { title: 'Phonique', slug: 'phonique' },
          { title: 'Multifonctions', slug: 'multifonctions' },
          { title: 'Fermacell', slug: 'fermacell' }
        ]
      },
      {
        title: 'Carreau de platre',
        slug: 'carreau-de-platre',
        level3Items: [
          { title: 'Standard', slug: 'standard' },
          { title: 'Hydro', slug: 'hydro' },
          { title: 'Alvéolaire', slug: 'alveolaire' }
        ]
      },
      {
        title: 'Faux plafonds',
        slug: 'faux-plafonds',
        level3Items: [
          { title: 'Standard', slug: 'standard-plafond' },
          { title: 'Hydro', slug: 'hydro-plafond' }
        ]
      },
      {
        title: 'Colle',
        slug: 'colle'
      },
      {
        title: 'Enduit',
        slug: 'enduit',
        level3Items: [
          { 
            title: 'En sac', 
            slug: 'en-sac',
            level4Items: [
              { title: 'Fin', slug: 'fin-sac' },
              { title: 'Gros', slug: 'gros-sac' },
              { title: 'Rapide', slug: 'rapide-sac' },
              { title: 'Universel', slug: 'universel-sac' },
              { title: '2en1', slug: '2en1-sac' }
            ]
          },
          { 
            title: 'En seau', 
            slug: 'en-seau',
            level4Items: [
              { title: 'Fin', slug: 'fin-seau' },
              { title: 'Gros', slug: 'gros-seau' },
              { title: 'Rapide', slug: 'rapide-seau' },
              { title: 'Universel', slug: 'universel-seau' },
              { title: '2en1', slug: '2en1-seau' }
            ]
          }
        ]
      },
      {
        title: 'Mortier',
        slug: 'mortier'
      },
      {
        title: 'Peinture',
        slug: 'peinture',
        level3Items: [
          { title: 'Impression', slug: 'impression' },
          { title: 'Finition', slug: 'finition' }
        ]
      },
      {
        title: 'Ossature',
        slug: 'ossature',
        level3Items: [
          { title: 'Rails', slug: 'rails' },
          { title: 'Montants', slug: 'montants' },
          { title: 'Fourrures', slug: 'fourrures' },
          { title: 'Cornières', slug: 'cornieres' },
          { title: 'Entretoise', slug: 'entretoise' },
          { title: 'Porteur', slug: 'porteur' },
          { title: 'Profilés', slug: 'profiles' },
          { title: 'Coulisseau', slug: 'coulisseau' }
        ]
      },
      {
        title: 'Outil et accessoires du plaquiste',
        slug: 'outil-accessoires',
        level3Items: [
          { title: 'Vis', slug: 'vis' },
          { title: 'Suspentes', slug: 'suspentes' },
          { 
            title: 'Bandes', 
            slug: 'bandes',
            level4Items: [
              { title: 'Papier', slug: 'papier' },
              { title: 'Armée', slug: 'armee' },
              { title: 'Fermacell', slug: 'fermacell' }
            ]
          },
          { title: 'Chevilles', slug: 'chevilles' },
          { 
            title: 'Adhésif', 
            slug: 'adhesif',
            level4Items: [
              { title: 'Pare-vapeur', slug: 'pare-vapeur' },
              { title: 'Aluminium', slug: 'aluminium' },
              { title: 'Papier', slug: 'papier' },
              { title: 'Double face', slug: 'double-face' }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Isolation',
    slug: 'isolation',
    icon: '🔥',
    subItems: [
      { 
        title: 'Isolation intérieure', 
        slug: 'isolation-interieure',
        level3Items: [
          { title: 'Bio sourcé', slug: 'bio-source' },
          { title: 'À projeter', slug: 'a-projeter' },
          { title: 'Rouleau', slug: 'rouleau' },
          { title: 'Panneau', slug: 'panneau' },
          { title: 'Minérale', slug: 'minerale' },
          { title: 'Polystyrène', slug: 'polystyrene' },
          { title: 'Pare-vapeur', slug: 'pare-vapeur' },
          { title: 'Calorifuge', slug: 'calorifuge' },
          { title: 'Manchon isolant', slug: 'manchon-isolant' },
          { title: 'Coquille', slug: 'coquille' },
          { title: 'Matelas isolant', slug: 'matelas-isolant' },
          { title: 'Accessoires', slug: 'accessoires-isolation-interieure' }
        ]
      },
      { 
        title: 'Isolation extérieure', 
        slug: 'isolation-exterieure',
        level3Items: [
          { title: 'Polystyrène', slug: 'polystyrene-ext' },
          { title: 'Panneaux', slug: 'panneaux-ext' },
          { title: 'Laine de roche', slug: 'laine-de-roche' },
          { title: 'Rouleaux', slug: 'rouleaux-ext' },
          { title: 'Laine de bois', slug: 'laine-de-bois' },
          { title: 'Enduit', slug: 'enduit-ext' },
          { title: 'En sac', slug: 'en-sac-ext' },
          { title: 'En seau', slug: 'en-seau-ext' },
          { title: 'Pare-pluie', slug: 'pare-pluie' },
          { title: 'Accessoires', slug: 'accessoires-isolation-exterieure' },
          { title: 'Fixations', slug: 'fixations' },
          { title: 'Colle', slug: 'colle-ext' },
          { title: 'Mousse PU', slug: 'mousse-pu' }
        ]
      }
    ]
  },
  {
    title: 'Chauffage',
    slug: 'chauffage',
    icon: '♨️',
    subItems: [
      { 
        title: 'Pompe à chaleur AIR/EAU', 
        slug: 'pompe-a-chaleur-air-eau',
        level3Items: [
          { 
            title: 'Bi-split', 
            slug: 'bi-split',
            level4Items: [
              { title: 'Monophasé', slug: 'monophase' },
              { title: 'Triphasé', slug: 'triphase' }
            ]
          },
          { 
            title: 'Monobloc', 
            slug: 'monobloc',
            level4Items: [
              { title: 'Monophasé', slug: 'monophase' },
              { title: 'Triphasé', slug: 'triphase' }
            ]
          }
        ]
      },
      { 
        title: 'Chaudières', 
        slug: 'chaudieres',
        level3Items: [
          { title: 'Gaz', slug: 'gaz' },
          { title: 'Électrique', slug: 'electrique-chaudiere' }
        ]
      },
      { 
        title: 'Radiateurs', 
        slug: 'radiateurs',
        level3Items: [
          { title: 'Électrique', slug: 'electrique-radiateur' },
          { title: 'À eau', slug: 'a-eau' }
        ]
      },
      { 
        title: 'Plancher chauffant', 
        slug: 'plancher-chauffant' 
      },
      { 
        title: 'Poêles', 
        slug: 'poeles',
        level3Items: [
          { title: 'À granulés', slug: 'a-granules' },
          { title: 'À bois', slug: 'a-bois' }
        ]
      },
      { 
        title: 'Accessoires', 
        slug: 'accessoires-chauffage',
        level3Items: [
          { title: 'Vase expansion', slug: 'vase-expansion' },
          { title: 'Module hydraulique', slug: 'module-hydraulique' },
          { title: 'Collecteurs', slug: 'collecteurs' },
          { title: 'Tube multicouches', slug: 'tube-multicouches' }
        ]
      }
    ]
  },
  {
    title: 'Climatisation',
    slug: 'climatisation',
    icon: '❄️',
    subItems: [
      { 
        title: 'Pompe à chaleur AIR/AIR', 
        slug: 'pompe-a-chaleur-air-air',
        level3Items: [
          { title: 'Monobloc', slug: 'monobloc-air-air' },
          { title: 'Monosplit', slug: 'monosplit' },
          { title: 'Multisplit', slug: 'multisplit' }
        ]
      },
      { 
        title: 'Climatiseur', 
        slug: 'climatiseur',
        level3Items: [
          { title: 'Gainable', slug: 'gainable' },
          { title: 'Zoning', slug: 'zoning' },
          { title: 'Mobile', slug: 'mobile' }
        ]
      },
      { 
        title: 'VRV VRF', 
        slug: 'vrv-vrf' 
      },
      { 
        title: 'Ventilation', 
        slug: 'ventilation',
        level3Items: [
          { title: 'Système VMC', slug: 'systeme-vmc' },
          { title: 'Aérateur', slug: 'aerateur' },
          { title: 'Extracteur', slug: 'extracteur' },
          { title: 'Grilles', slug: 'grilles' }
        ]
      },
      { 
        title: 'Accessoires', 
        slug: 'accessoires-clim',
        level3Items: [
          { title: 'Cuivre frigorifique', slug: 'cuivre-frigorifique' },
          { title: 'Supports et chaises', slug: 'supports-chaises' },
          { title: 'Rubber foot', slug: 'rubber-foot' },
          { title: 'Tube à condensats', slug: 'tube-condensats' },
          { title: 'Pompes à condensats', slug: 'pompes-condenssats' },
          { title: 'Goulotte', slug: 'goulotte' }
        ]
      }
    ]
  },
  {
    title: 'Sanitaire',
    slug: 'sanitaire',
    icon: '🚿',
    subItems: [
      { 
        title: 'Chauffe-eaux et ballons', 
        slug: 'chauffe-eaux-ballons',
        level3Items: [
          { title: 'Ballon thermodynamique', slug: 'ballon-thermodynamique' },
          { title: 'Ballon électrique', slug: 'ballon-electrique' },
          { title: 'Ballon ECS', slug: 'ballon-ecs' },
          { title: 'Chauffe-eau thermodynamique', slug: 'chauffe-eau-thermodynamique' },
          { title: 'Chauffe-eau électrique', slug: 'chauffe-eau-electrique' },
          { title: 'Chauffe-eau solaire', slug: 'chauffe-eau-solaire' },
          { title: 'Système solaire combiné', slug: 'systeme-solaire-combine' }
        ]
      },
      { 
        title: 'Mobilier', 
        slug: 'mobilier',
        level3Items: [
          { title: 'Meuble casque', slug: 'meuble-casque' },
          { title: 'Lave-mains', slug: 'lave-mains' }
        ]
      },
      { 
        title: 'Robinetterie', 
        slug: 'robinetterie',
        level3Items: [
          { title: 'Colonne de douche', slug: 'colonne-douche' },
          { title: 'Robinet', slug: 'robinet' },
          { title: 'Mitigeur', slug: 'mitigeur' }
        ]
      },
      { 
        title: 'Sèche serviette', 
        slug: 'seche-serviette',
        level3Items: [
          { title: 'Électrique', slug: 'electrique-seche-serviette' },
          { title: 'À eau', slug: 'a-eau-seche-serviette' }
        ]
      },
      { 
        title: 'Espace douche', 
        slug: 'espace-douche',
        level3Items: [
          { title: 'Receveurs', slug: 'receveurs' },
          { title: 'Parois', slug: 'parois' }
        ]
      },
      { 
        title: 'Espace WC', 
        slug: 'espace-wc',
        level3Items: [
          { title: 'Bati-support', slug: 'bati-support' },
          { title: 'Pack WC', slug: 'pack-wc' }
        ]
      },
      { 
        title: 'Traitement de l\'eau', 
        slug: 'traitement-eau' 
      }
    ]
  },
  {
    title: 'Plomberie',
    slug: 'plomberie',
    icon: '🔧',
    subItems: [
      { 
        title: 'Alimentation', 
        slug: 'alimentation',
        level3Items: [
          { title: 'Cuivre à sertir', slug: 'cuivre-a-sertir' },
          { title: 'Multicouche', slug: 'multicouche' },
          { title: 'PER', slug: 'per' },
          { title: 'Laiton', slug: 'laiton' }
        ]
      },
      { 
        title: 'Fixations', 
        slug: 'fixations',
        level3Items: [
          { title: 'Tubes', slug: 'tubes' },
          { title: 'Flexibles', slug: 'flexibles' },
          { title: 'Vannes', slug: 'vannes' },
          { title: 'Raccords', slug: 'raccords' }
        ]
      },
      { 
        title: 'Évacuation', 
        slug: 'evacuation',
        level3Items: [
          { title: 'Tuyaux PVC', slug: 'tuyaux-pvc' }
        ]
      },
      { 
        title: 'Accessoires', 
        slug: 'accessoires-plomberie',
        level3Items: [
          { title: 'Pince à sertir', slug: 'pince-a-sertir' },
          { title: 'Cintreuse', slug: 'cintreuse' },
          { title: 'Ébavurer', slug: 'ebavurer' },
          { title: 'Coupe-tube', slug: 'coupe-tube' }
        ]
      },
      { 
        title: 'Raccords', 
        slug: 'raccords',
        level3Items: [
          { title: 'Té', slug: 'te' },
          { title: 'Bouchons', slug: 'bouchons' },
          { title: 'Manchons', slug: 'manchons' },
          { title: 'Réductions', slug: 'reductions' },
          { title: 'Coudes', slug: 'coudes' }
        ]
      }
    ]
  },
  {
    title: 'Électricité',
    slug: 'electricite',
    icon: '⚡',
    subItems: [
      { title: 'Thermostats', slug: 'thermostats' },
      { title: 'Câbles', slug: 'cables' },
      { title: 'Gaines', slug: 'gaines' },
      { title: 'Disjoncteurs', slug: 'disjoncteurs' },
      { 
        title: 'Panneaux solaires', 
        slug: 'panneaux-solaires',
        level3Items: [
          { title: '3 kW', slug: '3kw' },
          { title: '6 kW', slug: '6kw' },
          { title: '9 kW', slug: '9kw' }
        ]
      }
    ]
  },
  {
    title: 'Outillage',
    slug: 'outillage',
    icon: '🔨',
    subItems: [
      { 
        title: 'Électroportatif', 
        slug: 'electroportatif',
        level3Items: [
          { title: 'Marteau-piqueur', slug: 'marteau-piqueur' },
          { title: 'Visseuse', slug: 'visseuse' },
          { title: 'Perceuse', slug: 'perceuse' },
          { title: 'Perforateur', slug: 'perforateur' },
          { title: 'Cloueur', slug: 'cloueur' },
          { title: 'Scie circulaire', slug: 'scie-circulaire' }
        ]
      },
      { 
        title: 'À main', 
        slug: 'a-main',
        level3Items: [
          { title: 'Scies', slug: 'scies' },
          { title: 'Niveaux', slug: 'niveaux' },
          { title: 'Pinceaux', slug: 'pinceaux' },
          { title: 'Balai', slug: 'balai' },
          { title: 'Mélangeurs', slug: 'melangeurs' }
        ]
      },
      { 
        title: 'Accessoires', 
        slug: 'accessoires-outillage',
        level3Items: [
          { title: 'Forêt', slug: 'foret' },
          { title: 'Trépan', slug: 'trepan' },
          { title: 'Disques', slug: 'disques' },
          { title: 'Lame', slug: 'lame' },
          { title: 'Batterie', slug: 'batterie' },
          { title: 'Lampe', slug: 'lampe' },
          { title: 'Niveau laser', slug: 'niveau-laser' },
          { title: 'Aspirateur', slug: 'aspirateur' }
        ]
      }
    ]
  },
  {
    title: 'EPI',
    slug: 'epi',
    icon: '⛑️',
    subItems: [
      { title: 'Casques et protections auditives', slug: 'casques-protections-auditives' },
      { title: 'Lunettes et masques de protection', slug: 'lunettes-masques' },
      { title: 'Gants', slug: 'gants' },
      { 
        title: 'Chaussures et vêtements', 
        slug: 'chaussures-vetements',
        level3Items: [
          { title: 'T-shirts', slug: 't-shirts' },
          { title: 'Sweat', slug: 'sweat' },
          { title: 'Pantalons', slug: 'pantalons' },
          { title: 'Doudounes', slug: 'doudounes' },
          { title: 'Combinaisons jetables', slug: 'combinaisons-jetables' }
        ]
      }
    ]
  }
]; 