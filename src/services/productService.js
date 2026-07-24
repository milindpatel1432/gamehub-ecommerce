import api from './api';
import { adminService } from './adminService';
import { shopProducts } from '../data/games';

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

      if (products.length > 0) {
        return {
          success: true,
          data: products,
          totalProducts: totalProducts || products.length,
          currentPage,
          totalPages
        };
      }
    } catch (err) {
      console.warn('[productService] Backend API offline or error. Using local fallback products:', err.message);
    }

    return {
      success: true,
      data: shopProducts,
      totalProducts: shopProducts.length,
      currentPage: 1,
      totalPages: 1
    };
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data?.data || response.data;
      if (product) {
        return {
          success: true,
          data: mapProduct(product)
        };
      }
    } catch (err) {
      console.warn('[productService] Product ID fetch error:', err.message);
    }

    const fallbackProduct = shopProducts.find(p => String(p.id) === String(id));
    return {
      success: !!fallbackProduct,
      data: fallbackProduct || shopProducts[0]
    };
  },

  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products', { params: { limit: 100 } });
      const rawProducts = extractProductsArray(response);
      const products = rawProducts.map(mapProduct).filter(Boolean);
      const featured = products.filter(p => p.featured);

      if (featured.length > 0) {
        return {
          success: true,
          data: featured
        };
      }
    } catch (err) {
      console.warn('[productService] Featured products API error:', err.message);
    }

    return {
      success: true,
      data: shopProducts.slice(0, 4)
    };
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return {
        success: response.data?.success ?? false,
        data: response.data?.data
      };
    } catch (err) {
      console.error('Error creating product:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create product'
      };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return {
        success: response.data?.success ?? false,
        data: response.data?.data
      };
    } catch (err) {
      console.error('Error updating product:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update product'
      };
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return {
        success: response.data?.success ?? false,
        message: response.data?.message
      };
    } catch (err) {
      console.error('Error deleting product:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to delete product'
      };
    }
  },

  getAllProductsAdmin: async () => {
    try {
      const [gamesRes, consolesRes] = await Promise.all([
        adminService.getGames(),
        adminService.getConsoles()
      ]);
      const games = gamesRes.data || [];
      const consoles = consolesRes.data || [];
      const allRaw = [...games, ...consoles];
      const mapped = allRaw.map(mapProduct).filter(Boolean);
      return {
        success: true,
        data: mapped
      };
    } catch (err) {
      console.error('Error fetching admin products:', err);
      return {
        success: false,
        data: []
      };
    }
  }
};

export { mapProduct };
