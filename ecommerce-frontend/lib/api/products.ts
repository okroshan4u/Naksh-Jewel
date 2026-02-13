import apiClient from './client';
import { Product, ApiResponse, PaginatedResponse } from '@/types';

export const productsApi = {
  
  getAllProducts: async (page = 1, limit = 20): Promise<Product[]> => {
    const response = await apiClient.get<PaginatedResponse<Product> | { success: boolean; data: Product[] }>(
      `/products?page=${page}&limit=${limit}`
    );
    

    if ('data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  },


  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data.data;
  },

  createProduct: async (formData: FormData): Promise<Product> => {
    const response = await apiClient.post<{ success: boolean; data: Product }>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },


  updateProduct: async (id: string, formData: FormData): Promise<Product> => {
    const response = await apiClient.put<{ success: boolean; data: Product }>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },


  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};