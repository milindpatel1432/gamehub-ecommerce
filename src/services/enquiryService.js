import api from './api';

export const enquiryService = {
  /**
   * Submit any form (Contact, Career, Newsletter, Product Inquiry, Feedback)
   * @param {Object} data - { formName, name, email, phone, subject, message, pageUrl }
   */
  submitEnquiry: async (data) => {
    try {
      const response = await api.post('/enquiry', data);
      return response.data;
    } catch (error) {
      console.error('[enquiryService] submitEnquiry error:', error);
      throw error.response?.data?.message || 'Failed to send message. Please try again.';
    }
  },

  /**
   * Fetch all enquiries (Admin only)
   */
  getAllEnquiries: async (params = {}) => {
    try {
      const response = await api.get('/enquiry', { params });
      return response.data;
    } catch (error) {
      console.error('[enquiryService] getAllEnquiries error:', error);
      throw error.response?.data?.message || 'Failed to fetch enquiries.';
    }
  },
};

export default enquiryService;
