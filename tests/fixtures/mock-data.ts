export const TEST_USERS = {
  admin: {
    email: 'admin@gamehub.com',
    password: 'milind@2803',
    fullName: 'Milind Patel',
    username: 'milindadmin',
  },
  regularUser: {
    email: 'testuser@gamehub.com',
    password: 'Password123!',
    fullName: 'Test Gamer',
    username: 'testgamer',
    phone: '9876543210',
    address: '123 Cyberpunk St, Gaming City 400001',
  },
  newRegistration: {
    fullName: 'New Hero User',
    username: `user_${Date.now()}`,
    email: `newhero_${Date.now()}@example.com`,
    password: 'StrongPassword123!',
  },
};

export const MOCK_SHIPPING_ADDRESS = {
  fullName: 'Test Gamer',
  phone: '9876543210',
  street: '77 Neon Boulevard',
  city: 'Mumbai',
  state: 'Maharashtra',
  zipCode: '400001',
};

export const MOCK_SEARCH_QUERIES = {
  validProduct: 'Cyber',
  category: 'PS5',
  nonExistent: 'nonexistentproductxyz123',
};

export const MOCK_COUPONS = {
  valid: 'GAMEHUB10',
  invalid: 'INVALIDCOUPON99',
};
