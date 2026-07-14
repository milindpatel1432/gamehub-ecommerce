import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  login: async (email, password) => {
    // Placeholder login API call
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  register: async (userData) => {
    // Placeholder register API call
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    // Placeholder forgot password API call
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  logout: async () => {
    // Placeholder logout API call
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  getMe: async () => {
    // Placeholder check auth status
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
