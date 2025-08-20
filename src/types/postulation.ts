export interface PostulationUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

export interface Postulation {
  id: number;
  categoryName: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: PostulationUser;
}

export interface PostulationResponse {
  message: string;
  success: boolean;
  postulation: Postulation;
}
