import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.WISHLIST.GET);
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await axiosInstance.post(API_ENDPOINTS.WISHLIST.ADD, { productId });
    return response.data;
  },

  removeFromWishlist: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.WISHLIST.REMOVE(id));
    return response.data;
  },
};
