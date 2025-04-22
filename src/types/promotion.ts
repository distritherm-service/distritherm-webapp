export interface Promotion {
  id: string;
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  discount: number;
  products: string[];
  isActive: boolean;
} 