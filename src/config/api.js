export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id) => `/products/${id}`,
    RELATED: (id) => `/products/${id}/related`,
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    REMOVE: (id) => `/cart/remove/${id}`,
    UPDATE: (id) => `/cart/update/${id}`,
    CLEAR: '/cart/clear',
  },
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (id) => `/wishlist/remove/${id}`,
    MOVE_TO_CART: (id) => `/wishlist/move-to-cart/${id}`,
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAILS: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
    ADMIN_LIST: '/orders/admin/all',
  },
  RENTALS: {
    LIST: '/rentals',
    CREATE: '/rentals',
    DETAILS: (id) => `/rentals/${id}`,
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
  },
  ADMIN: {
    STATS: '/admin/stats',
    GAMES: '/admin/games',
    CONSOLES: '/admin/consoles',
    ORDERS: '/admin/orders',
    RENTALS: '/admin/rentals',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
  },
  REVIEWS: {
    GET_PRODUCT: (productId) => `/reviews/product/${productId}`,
    CREATE: '/reviews',
    UPDATE: (id) => `/reviews/${id}`,
    REMOVE: (id) => `/reviews/${id}`,
    ADMIN_LIST: '/reviews'
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    DELETE: (publicId) => `/upload/image/${publicId}`
  }
};
