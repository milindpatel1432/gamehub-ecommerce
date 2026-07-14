import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const cartService = {
  getCart: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  addToCart: async (productId, quantity, isRental, rentDuration) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, {
      productId,
      quantity,
      isRental,
      rentDuration,
    });
    return response.data;
  },

  updateQuantity: async (id, quantity) => {
    const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE(id), { quantity });
    return response.data;
  },

  removeFromCart: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(id));
    return response.data;
  },

  clearCart: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.CLEAR);
    return response.data;
  },
};
