import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';

const mapOrderItem = (item) => {
  const prod = item?.product && typeof item.product === 'object' ? item.product : {};
  const imageVal = Array.isArray(prod.images) && prod.images.length > 0
    ? prod.images[0]
    : (prod.thumbnail || item.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80');

  return {
    id: item._id || prod._id || item.id,
    productId: prod._id || item.product,
    title: prod.title || item.title || 'Gaming Item',
    platform: Array.isArray(prod.platform) ? prod.platform[0] || '' : (prod.platform || item.platform || ''),
    mode: item.mode || 'buy',
    price: item.price || prod.price || 0,
    image: imageVal,
    quantity: item.quantity || 1,
    duration: item.duration || '7 Days',
    deposit: item.deposit || 0,
  };
};

const mapOrder = (order) => {
  if (!order) return null;
  return {
    id: order._id || order.id,
    items: (order.items || []).map(mapOrderItem),
    shippingAddress: order.shippingAddress || {},
    paymentMethod: order.paymentMethod || 'card',
    paymentStatus: order.paymentStatus || 'pending',
    deliveryMethod: order.deliveryMethod || { name: 'Standard Shipping', price: 0 },
    subtotal: order.subtotal || 0,
    tax: order.tax || 0,
    total: order.total || 0,
    status: order.status || 'Processing',
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

export const orderService = {
  getOrders: async () => {
    console.log('[orderService] Fetching customer order history...');
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.LIST);
    const rawOrders = response.data?.data || [];
    console.log(`[orderService] Retrieved ${rawOrders.length} raw order document(s) from API.`);
    return {
      ...response.data,
      data: rawOrders.map(mapOrder),
    };
  },

  getOrderDetails: async (id) => {
    console.log(`[orderService] Fetching order invoice details for ID: ${id}...`);
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAILS(id));
    return {
      ...response.data,
      data: mapOrder(response.data?.data),
    };
  },

  createOrder: async (checkoutData) => {
    console.log('[orderService] Creating new order with payload:', checkoutData);
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, checkoutData);
    console.log('[orderService] Order creation API response:', response.data);
    return {
      ...response.data,
      data: mapOrder(response.data?.data),
    };
  },

  cancelOrder: async (id) => {
    console.log(`[orderService] Cancelling order ID: ${id}...`);
    const response = await axiosInstance.put(API_ENDPOINTS.ORDERS.CANCEL(id));
    return {
      ...response.data,
      data: mapOrder(response.data?.data),
    };
  },

  updateOrderStatus: async (id, status) => {
    console.log(`[orderService] Admin updating order #${id} status to: ${status}...`);
    const response = await axiosInstance.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status });
    return {
      ...response.data,
      data: mapOrder(response.data?.data),
    };
  },

  getAdminOrders: async () => {
    console.log('[orderService] Admin fetching all system orders...');
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.ADMIN_LIST);
    const orders = response.data?.data || [];
    return {
      ...response.data,
      data: orders.map(mapOrder),
    };
  },
};
