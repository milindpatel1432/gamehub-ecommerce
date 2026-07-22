import { createContext, useContext, useState, useEffect } from 'react';
import { successToast, infoToast, errorToast } from '../utils/toast';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const LOCAL_CART_KEY = 'gamehub_cart_items';

const mapBackendCartItem = (item) => {
  const prod = item.product || {};
  return {
    id: item._id || item.id,
    productId: prod._id || prod.id || item.productId,
    title: prod.title || item.title || 'Unknown Product',
    platform: Array.isArray(prod.platform) ? prod.platform.join(', ') : (prod.platform || item.platform || ''),
    mode: item.mode || 'buy',
    price: item.price || prod.price || 0,
    originalPrice: prod.discount > 0 ? prod.price : null,
    image: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : (prod.thumbnail || item.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80'),
    quantity: item.quantity || 1,
    duration: item.duration || '7 Days',
    dates: item.dates || 'Oct 25 - Nov 1',
    deposit: item.deposit || 0,
    inStock: (prod.stock !== undefined ? prod.stock > 0 : true),
    expressDelivery: false
  };
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('[CartContext] Error parsing local cart cache:', e);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync cartItems state to localStorage whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
      console.log(`[CartContext] Persisted ${cartItems.length} item(s) to localStorage cache.`);
    } catch (e) {
      console.error('[CartContext] LocalStorage save error:', e);
    }
  }, [cartItems]);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log('[CartContext] Fetching cart from server API...');
      const res = await cartService.getCart();
      if (res.success && res.data) {
        const mapped = (res.data.items || []).map(mapBackendCartItem);
        console.log(`[CartContext] Server returned ${mapped.length} item(s).`);
        if (mapped.length > 0) {
          setCartItems(mapped);
        } else if (cartItems.length > 0) {
          console.log('[CartContext] Server cart empty; keeping local fallback items:', cartItems.length);
        } else {
          setCartItems([]);
        }
      } else {
        setError('Failed to fetch cart from server.');
      }
    } catch (err) {
      console.error('[CartContext] Error loading cart from API:', err);
      setError(err.message || 'Error loading cart.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const addToCart = async (product) => {
    const targetProductId = product?.productId || product?._id || product?.id;
    console.log('[CartContext] addToCart triggered for product:', { targetProductId, title: product?.title });

    if (!product || !targetProductId) {
      console.warn('[CartContext] Unable to add product: ID missing.', product);
      return;
    }
    
    if (!isAuthenticated) {
      errorToast('Please sign in to add items to your cart.');
      return;
    }

    const isRental = product.mode === 'rent';
    const duration = product.duration || '7 Days';

    try {
      const res = await cartService.addToCart(targetProductId, 1, isRental, duration);
      if (res.success && res.data) {
        const mapped = (res.data.items || []).map(mapBackendCartItem);
        setCartItems(mapped);
        console.log(`[CartContext] Successfully added ${product.title} to cart. Total items: ${mapped.length}`);
        successToast(`${product.title} added to cart!`);
      } else {
        errorToast('Failed to add item to cart.');
      }
    } catch (err) {
      console.error('[CartContext] API addToCart error:', err);
      errorToast(err.message || 'Error adding item to cart.');
    }
  };

  const removeFromCart = async (id) => {
    if (!isAuthenticated) return;
    console.log(`[CartContext] Removing item ${id} from cart...`);
    try {
      const res = await cartService.removeFromCart(id);
      if (res.success && res.data) {
        const mapped = (res.data.items || []).map(mapBackendCartItem);
        setCartItems(mapped);
        infoToast('Item removed from cart.');
      } else {
        errorToast('Failed to remove item.');
      }
    } catch (err) {
      console.error('[CartContext] removeFromCart error:', err);
      errorToast(err.message || 'Error removing item.');
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!isAuthenticated) return;
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    console.log(`[CartContext] Updating item ${id} quantity to ${quantity}...`);
    try {
      const res = await cartService.updateQuantity(id, quantity);
      if (res.success && res.data) {
        const mapped = (res.data.items || []).map(mapBackendCartItem);
        setCartItems(mapped);
        infoToast('Cart quantity updated.');
      } else {
        errorToast('Failed to update quantity.');
      }
    } catch (err) {
      console.error('[CartContext] updateQuantity error:', err);
      errorToast(err.message || 'Error updating quantity.');
    }
  };

  const clearCart = async (silent = false) => {
    console.log(`[CartContext] clearCart called (silent = ${silent})...`);
    try {
      if (isAuthenticated) {
        await cartService.clearCart();
      }
      setCartItems([]);
      localStorage.removeItem(LOCAL_CART_KEY);
      console.log('[CartContext] Cart state & localStorage cleared.');
      if (!silent) {
        infoToast('Shopping cart cleared.');
      }
    } catch (err) {
      console.error('[CartContext] clearCart error:', err);
      setCartItems([]);
      localStorage.removeItem(LOCAL_CART_KEY);
      if (!silent) {
        errorToast(err.message || 'Error clearing cart.');
      }
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
