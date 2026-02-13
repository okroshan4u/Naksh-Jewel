import apiClient from './client';
import { Cart, CartItem } from '@/types';

export const cartApi = {

  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<{ success: boolean; data: Cart }>('/cart');
    return response.data.data;
  },


  addToCart: async (productId: string, quantity = 1): Promise<Cart> => {
    const response = await apiClient.post<{ success: boolean; data: Cart }>('/cart/add', {
      productId,
      quantity,
    });
    return response.data.data;
  },

 
  updateCartItem: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<{ success: boolean; data: Cart }>('/cart/update', {
      productId,
      quantity,
    });
    return response.data.data;
  },


  removeFromCart: async (productId: string): Promise<Cart> => {
    const response = await apiClient.delete<{ success: boolean; data: Cart }>(`/cart/remove/${productId}`);
    return response.data.data;
  },


  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart/clear');
  },
};