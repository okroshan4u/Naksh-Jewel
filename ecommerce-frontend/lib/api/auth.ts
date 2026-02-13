import apiClient from './client';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '@/types';

export const authApi = {
 
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

 
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', credentials);
    return response.data;
  },


  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },

 
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};