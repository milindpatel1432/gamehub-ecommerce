import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const userService = {
  getUserProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  updateUserProfile: async (profileData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE, profileData);
    return response.data;
  },
};
