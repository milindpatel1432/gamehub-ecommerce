import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

export const uploadService = {
  uploadImage: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axiosInstance.post(API_ENDPOINTS.UPLOAD.IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  deleteImage: async (publicId) => {
    // Encodes public ID to protect folders slashes in url path
    const encodedPublicId = encodeURIComponent(publicId);
    const response = await axiosInstance.delete(API_ENDPOINTS.UPLOAD.DELETE(encodedPublicId));
    return response.data;
  },
};
