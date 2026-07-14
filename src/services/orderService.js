import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const orderService = {
  getOrders: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.LIST);
    return response.data;
  },

  getOrderDetails: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAILS(id));
    return response.data;
  },

  createOrder: async (checkoutData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, checkoutData);
    return response.data;
  },
};
