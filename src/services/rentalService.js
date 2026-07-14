import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const rentalService = {
  getRentals: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.RENTALS.LIST);
    return response.data;
  },

  getRentalDetails: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.RENTALS.DETAILS(id));
    return response.data;
  },

  createRental: async (rentalData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.RENTALS.CREATE, rentalData);
    return response.data;
  },
};
