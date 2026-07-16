import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

const mapOrderItem = (item) => {
  const prod = item.product || {};
  const imageVal = Array.isArray(prod.images) && prod.images.length > 0
    ? prod.images[0]
    : (prod.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80');

  return {
    id: item._id || prod._id,
    productId: prod._id,
    title: prod.title || 'Unknown Product',
    platform: Array.isArray(prod.platform) ? prod.platform[0] || '' : (prod.platform || ''),
    mode: item.mode || 'buy',
    price: item.price || prod.price || 0,
    image: imageVal,
    quantity: item.quantity,
    duration: item.duration || '7 Days',
    deposit: item.deposit || 0,
  };
};

const mapOrder = (order) => {
  if (!order) return null;
  return {
    id: order._id,
    items: (order.items || []).map(mapOrderItem),
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    deliveryMethod: order.deliveryMethod,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

export const orderService = {
  getOrders: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.LIST);
    const orders = response.data?.data || [];
    return {
      ...response.data,
      data: orders.map(mapOrder),
    };
  },

  getOrderDetails: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAILS(id));
    return {
      ...response.data,
      data: mapOrder(response.data?.data),
    };
  },

  createOrder: async (checkoutData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, checkoutData);
    return {
      ...response.data,
      data: mapOrder(response.data?.data),
    };
  },

  cancelOrder: async (id) => {
    const response = await axiosInstance.put(API_ENDPOINTS.ORDERS.CANCEL(id));
    return {
      ...response.data,
      data: mapOrder(response.data?.data),
    };
  },

  updateOrderStatus: async (id, status) => {
    const response = await axiosInstance.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status });
    return {
      ...response.data,
      data: mapOrder(response.data?.data),
    };
  },

  getAdminOrders: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.ADMIN_LIST);
    const orders = response.data?.data || [];
    return {
      ...response.data,
      data: orders.map(mapOrder),
    };
  },
};
