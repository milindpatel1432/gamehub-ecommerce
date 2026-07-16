import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const adminService = {
  getStats: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.STATS);
    return response.data;
  },

  getGames: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.GAMES);
    return response.data;
  },

  addGame: async (gameData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.GAMES, gameData);
    return response.data;
  },

  updateGame: async (id, gameData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.GAMES}/${id}`, gameData);
    return response.data;
  },

  deleteGame: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.GAMES}/${id}`);
    return response.data;
  },

  getConsoles: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.CONSOLES);
    return response.data;
  },

  addConsole: async (consoleData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.CONSOLES, consoleData);
    return response.data;
  },

  updateConsole: async (id, consoleData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.CONSOLES}/${id}`, consoleData);
    return response.data;
  },

  deleteConsole: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.CONSOLES}/${id}`);
    return response.data;
  },

  getOrders: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.ORDERS);
    return response.data;
  },

  getRentals: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.RENTALS);
    return response.data;
  },

  getUsers: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS);
    return response.data;
  },

  toggleBlockUser: async (id) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.USERS}/${id}/block`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.ANALYTICS);
    return response.data;
  },
};
