import { createContext, useContext, useState, useEffect } from 'react';
import { successToast, infoToast, errorToast } from '../utils/toast';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const mapBackendCartItem = (item) => {
  const prod = item.product || {};
  return {
    id: item._id,
    productId: prod._id,
    title: prod.title || 'Unknown Product',
    platform: Array.isArray(prod.platform) ? prod.platform.join(', ') : (prod.platform || ''),
    mode: item.mode || 'buy',
    price: item.price || prod.price || 0,
    originalPrice: prod.discount > 0 ? prod.price : null,
    image: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : (prod.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80'),
    quantity: item.quantity,
    duration: item.duration || '7 Days',
    dates: item.dates || 'Oct 25 - Nov 1',
    deposit: item.deposit || 0,
    inStock: (prod.stock !== undefined ? prod.stock > 0 : true),
    expressDelivery: false
  };
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await cartService.getCart();
      if (res.success && res.data) {
        const mapped = (res.data.items || []).map(mapBackendCartItem);
        setCartItems(mapped);
      } else {
        setError('Failed to fetch cart from server.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading cart.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (product) => {
    if (!product || !product.id) return;
    
    if (!isAuthenticated) {
      errorToast('Please sign in to add items to your cart.');
      return;
    }

    const isRental = product.mode === 'rent';
    const duration = product.duration || '7 Days';

    try {
      const res = await cartService.addToCart(product.id, 1, isRental, duration);
      if (res.success && res.data) {
        const mapped = (res.data.items || []).map(mapBackendCartItem);
        setCartItems(mapped);
        successToast(`${product.title} added to cart!`);
      } else {
        errorToast('Failed to add item to cart.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.message || 'Error adding item to cart.');
    }
  };

  const removeFromCart = async (id) => {
    if (!isAuthenticated) return;
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
      console.error(err);
      errorToast(err.message || 'Error removing item.');
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!isAuthenticated) return;
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
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
      console.error(err);
      errorToast(err.message || 'Error updating quantity.');
    }
  };

  const clearCart = async (silent = false) => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      const res = await cartService.clearCart();
      if (res.success) {
        setCartItems([]);
        if (!silent) {
          infoToast('Shopping cart cleared.');
        }
      }
    } catch (err) {
      console.error(err);
      if (!silent) {
        errorToast(err.message || 'Error clearing cart.');
      }
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
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
