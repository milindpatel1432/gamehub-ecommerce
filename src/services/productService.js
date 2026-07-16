import api from './api';

const mapProduct = (p) => {
  if (!p) return null;
  
  // platform can be string in UI, but array in DB
  const platformStr = Array.isArray(p.platform) && p.platform.length > 0 
    ? p.platform[0] 
    : (p.platform || '');

  // rating is an object in DB { average: Number, count: Number }, but simple values in UI
  const ratingVal = p.rating?.average !== undefined ? p.rating.average : 4.8;
  const reviewsVal = p.rating?.count !== undefined ? p.rating.count : 0;

  // prices: DB has price (buyPrice) and discount.
  // If discount is set, buyPrice = price * (1 - discount/100) and originalPrice = price.
  // Else, buyPrice = price and originalPrice = null.
  const isSale = p.discount > 0;
  const buyPriceVal = isSale 
    ? Number((p.price * (1 - p.discount / 100)).toFixed(2)) 
    : p.price;
  const originalPriceVal = isSale ? p.price : null;

  // rental:
  const rentPriceVal = p.rentalAvailable ? p.rentalPricePerDay : null;

  // images:
  const imageVal = Array.isArray(p.images) && p.images.length > 0
    ? p.images[0]
    : (p.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80');

  return {
    id: p._id,
    title: p.title,
    platform: platformStr,
    rating: ratingVal,
    reviews: reviewsVal,
    buyPrice: buyPriceVal,
    originalPrice: originalPriceVal,
    rentPrice: rentPriceVal,
    image: imageVal,
    isSale: isSale,
    isRental: p.rentalAvailable,
    category: p.category,
    condition: p.condition === 'Used' ? 'Pre-owned' : 'Brand New',
    description: p.description,
    shortDescription: p.shortDescription || p.description,
    brand: p.brand,
    stock: p.stock,
    images: p.images || [],
    thumbnail: p.thumbnail,
    rentalAvailable: p.rentalAvailable,
    rentalPricePerDay: p.rentalPricePerDay,
    featured: p.featured,
    isActive: p.isActive,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  };
};

const extractProductsArray = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.data) {
    if (Array.isArray(response.data)) return response.data;
    if (response.data.data) {
      if (Array.isArray(response.data.data)) return response.data.data;
      if (Array.isArray(response.data.data.products)) return response.data.data.products;
    }
    if (Array.isArray(response.data.products)) return response.data.products;
  }
  if (Array.isArray(response.products)) return response.products;
  return [];
};

export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      const success = response.data?.success ?? false;
      const rawData = response.data?.data;
      
      let totalProducts = 0;
      let currentPage = 1;
      let totalPages = 1;

      if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
        totalProducts = rawData.totalProducts || 0;
        currentPage = rawData.currentPage || 1;
        totalPages = rawData.totalPages || 1;
      }

      const rawProducts = extractProductsArray(response);
      const products = rawProducts.map(mapProduct).filter(Boolean);

      return {
        success,
        data: products,
        totalProducts: totalProducts || products.length,
        currentPage,
        totalPages
      };
    } catch (err) {
      console.error('Error fetching products:', err);
      return {
        success: false,
        data: [],
        totalProducts: 0,
        currentPage: 1,
        totalPages: 1
      };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data?.data || response.data;
      return {
        success: true,
        data: mapProduct(product)
      };
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      return {
        success: false,
        data: null
      };
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products', { params: { limit: 100 } });
      const success = response.data?.success ?? false;
      const rawProducts = extractProductsArray(response);
      const products = rawProducts.map(mapProduct).filter(Boolean);
      const featured = products.filter(p => p.featured);

      return {
        success,
        data: featured
      };
    } catch (err) {
      console.error('Error fetching featured products:', err);
      return {
        success: false,
        data: []
      };
    }
  }
};

export { mapProduct };
