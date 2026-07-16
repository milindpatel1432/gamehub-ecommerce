import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from '../config/constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to automatically inject auth token headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors cleanly (e.g. redirect on 401/403/500)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return structured custom error messages
    const message = error.response?.data?.message || 'Server connection failed';
    return Promise.reject({
      status: error.response?.status,
      message,
      originalError: error,
    });
  }
);

export default axiosInstance;
