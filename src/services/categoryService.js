import api from './api';

export const categoryService = {
  getAllCategories: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params });
      return {
        success: response.data?.success ?? false,
        data: response.data?.data || []
      };
    } catch (err) {
      console.error('Error fetching categories:', err);
      return {
        success: false,
        data: [],
        error: err.response?.data?.message || 'Failed to fetch categories'
      };
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return {
        success: response.data?.success ?? false,
        data: response.data?.data
      };
    } catch (err) {
      console.error('Error fetching category by ID:', err);
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || 'Failed to fetch category details'
      };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return {
        success: response.data?.success ?? false,
        data: response.data?.data
      };
    } catch (err) {
      console.error('Error creating category:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create category'
      };
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return {
        success: response.data?.success ?? false,
        data: response.data?.data
      };
    } catch (err) {
      console.error('Error updating category:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update category'
      };
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return {
        success: response.data?.success ?? false,
        message: response.data?.message
      };
    } catch (err) {
      console.error('Error deleting category:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to delete category'
      };
    }
  }
};
