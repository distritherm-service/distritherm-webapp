export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductDocument {
  id: string;
  name: string;
  type: string; // 'fiche_technique' | 'manuel' | 'certification'
  url: string;
}

export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  inStock: boolean;
  model?: string;
  reference?: string;
  features: string[];
  specifications: Array<{
    key: string;
    value: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
    logo: string;
  };
  warranty?: string;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
    weight: number;
  };
  energyClass?: string;
  installationRequirements?: string;
  relatedProducts?: string[];
}

// Interface du produit correspondant à l'API
export interface Product {
  id: number;
  name: string;
  description: string;
  priceHt: number;
  priceTtc: number;
  quantity: number;
  imagesUrl: string[];
  categoryId: number;
  markId: number;
  unity?: string; // Unité de mesure (m², kg, etc.)
  itemCode?: string;
  active?: boolean;
  directorWord1?: string;
  directorWord2?: string;
  directorWord3?: string;
  directorWord4?: string;
  directorWord5?: string;
  directorWordLink1?: string;
  directorWordLink2?: string;
  directorWordLink3?: string;
  directorWordLink4?: string;
  directorWordLink5?: string;
  brandLogo?: string;
  weight?: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
  mark?: {
    id: number;
    name: string;
  };
  isInPromotion?: boolean;
  promotionPrice?: number;
  promotionEndDate?: string;
  promotionPercentage?: number;
  isFavorited?: boolean;
  proInfo?: {
    isPro: boolean;
    categoryIdPro: number;
    percentage: number;
    categoryProName: string;
    proPriceHt: number;
    proPriceTtc: number;
  };
  productDetail?: {
    id: number;
    productId: number;
    itemCode: string;
    directorWord1?: string;
    directorWord2?: string;
    designation1?: string;
    designation2?: string;
    complementDesignation?: string;
    packaging?: string;
    packagingType?: string;
    submissionFgaz?: string;
    active: boolean;
    label?: string;
    unity?: string;
    weight?: number;
    familyCode?: string;
    ecoContributionPercentage?: number;
    ecoContributionApplication?: boolean;
  };
} 