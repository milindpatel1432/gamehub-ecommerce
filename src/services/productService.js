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

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    const products = response.data?.data || [];
    return {
      ...response.data,
      data: products.map(mapProduct)
    };
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    const product = response.data?.data;
    return {
      ...response.data,
      data: mapProduct(product)
    };
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products');
    const products = response.data?.data || [];
    const featuredProducts = products.filter(p => p.featured);
    return {
      ...response.data,
      data: featuredProducts.map(mapProduct)
    };
  }
};
