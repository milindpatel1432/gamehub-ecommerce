import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const reviewService = {
  getProductReviews: async (productId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.GET_PRODUCT(productId));
    return response.data;
  },

  createReview: async (productId, rating, comment) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REVIEWS.CREATE, {
      productId,
      rating,
      comment
    });
    return response.data;
  },

  updateReview: async (id, rating, comment) => {
    const response = await axiosInstance.put(API_ENDPOINTS.REVIEWS.UPDATE(id), {
      rating,
      comment
    });
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.REVIEWS.REMOVE(id));
    return response.data;
  },

  getAllReviews: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.ADMIN_LIST);
    return response.data;
  }
};
