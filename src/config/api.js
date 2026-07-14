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
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAILS: (id) => `/orders/${id}`,
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
};
