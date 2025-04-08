import axiosInstance from './axiosConfig';
import { ProductDetails } from '../types/product';

export const getProductById = async (id: string): Promise<ProductDetails> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
}; 