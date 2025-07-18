import axiosInstance from './axiosConfig';
import { Mark } from '../types/mark';

export const getAllMarks = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get('/marks');
    // L'API retourne { message: string, marks: Mark[] }
    const marks: Mark[] = response.data.marks || [];
    return marks.map(mark => mark.name);
  } catch {
    return [];
  }
}; 