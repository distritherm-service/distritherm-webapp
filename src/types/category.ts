export interface Category {
    id: number;
    name: string;
    level: number;
    haveParent: boolean;
    haveChildren: boolean;
    description: string;
    imageUrl: string;
    parentCategoryId: number | null;
    agenceId: number;
    createdAt: string;
    updatedAt: string;
    products?: any[];
    childCategories?: Category[];
  }