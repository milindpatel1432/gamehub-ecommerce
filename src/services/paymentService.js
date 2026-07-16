import axiosInstance from '../lib/axios';

export const paymentService = {
  loadRazorpayScript: () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  createPaymentOrder: async (orderId) => {
    const response = await axiosInstance.post('/payments/create-order', { orderId });
    return response.data;
  },

  verifyPayment: async (verificationData) => {
    const response = await axiosInstance.post('/payments/verify', verificationData);
    return response.data;
  },
};
