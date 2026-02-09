import apiClient from './client';
import { Product, ApiResponse, PaginatedResponse } from '@/types';

export const productsApi = {
  // Get all products
  getAllProducts: async (page = 1, limit = 20): Promise<Product[]> => {
    const response = await apiClient.get<PaginatedResponse<Product> | { success: boolean; data: Product[] }>(
      `/products?page=${page}&limit=${limit}`
    );
    
    // Handle both paginated and non-paginated responses
    if ('data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data.data;
  },

  // Create product (admin)
  createProduct: async (formData: FormData): Promise<Product> => {
    const response = await apiClient.post<{ success: boolean; data: Product }>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update product (admin)
  updateProduct: async (id: string, formData: FormData): Promise<Product> => {
    const response = await apiClient.put<{ success: boolean; data: Product }>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete product (admin)
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};