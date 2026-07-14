import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const productService = {
  getProducts: async (filters = {}) => {
    // Placeholder get products with query parameters
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.LIST, { params: filters });
    return response.data;
  },

  getProductDetails: async (id) => {
    // Placeholder get product details
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.DETAILS(id));
    return response.data;
  },

  getRelatedProducts: async (id) => {
    // Placeholder get related items
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.RELATED(id));
    return response.data;
  },
};
